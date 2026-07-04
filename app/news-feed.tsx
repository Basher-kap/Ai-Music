// app/news-feed.tsx
import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image, RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import Ionicons from '@expo/vector-icons/Ionicons';
import { XMLParser } from 'fast-xml-parser'; // Native parser dependency
import { useTextTheme } from '@/context';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant';
import { supabase } from '@/utils/supabase';
import { useCallback, memo } from 'react';
import type { NewsItem, NewsSource } from '@/types/news';

export default function NewsFeed() {
  const { ThemeTextStyles } = useTextTheme();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<NewsSource[]>([]);

  const fetchSources = async (): Promise<NewsSource[]> => {
    const { data, error } = await supabase
      .from('news_sources')
      .select('name, url')
      .eq('is_active', true);

    if (error) {
      console.error('[News] Failed to fetch sources:', error.message);
      return [];
    }

    console.log('[News] ✓ Loaded', data.length, 'sources from Supabase');
    return data;
  };

  const fetchNews = async () => {
    setError(null);
    try {
      const loadedSources = await fetchSources();
      setSources(loadedSources);

      if (loadedSources.length === 0) {
        setError('No news sources available.');
        return;
      }

      console.log('[News] Fetching feeds via proxy from', loadedSources.length, 'sources...');

      const { data: proxyData, error: proxyError } = await supabase.functions.invoke('fetch-rss', {
        body: { urls: loadedSources.map(s => s.url) },
      });

      if (proxyError) {
        throw new Error(proxyError.message ?? 'Failed to reach the news feed proxy.');
      }

      const proxyResults: { url: string; xmlData: string; error: string | null }[] = proxyData?.results ?? [];

      const responses = loadedSources.map((source, i) => {
        const result = proxyResults[i];
        if (!result?.xmlData) {
          console.warn(`[NEWS] Failed to fetch ${source.name}:`, result?.error ?? 'no data returned');
        }
        return { xmlData: result?.xmlData ?? '', sourceName: source.name };
      });

      const extractImageFromText = (text: string): string => {
        if (!text) return '';
        const imgMatch = text.match(/<img[^>]+src="([^">]+)"/);
        return imgMatch ? imgMatch[1] : '';
      };

      // Instantiate native parser engine
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

      const allItems = responses.flatMap(({ xmlData, sourceName }) => {
        if (!xmlData) return [];

        try {
          const jsonObj = parser.parse(xmlData);
          let rawItems = jsonObj?.rss?.channel?.item || jsonObj?.feed?.entry || [];
          
          if (!Array.isArray(rawItems)) {
            rawItems = [rawItems];
          }

          return rawItems.map((item: any) => {
            // Target the raw text description blocks
            const rawDescription = item.description || item.summary || '';
            const rawContent = item['content:encoded'] || item.content || '';
            
            // Clean up text preview summaries
            const cleanDescription = typeof rawDescription === 'string' 
              ? rawDescription.replace(/<[^>]*>/g, '').trim()
              : '';

            const finalLink = typeof item.link === 'string' 
              ? item.link 
              : item.link?.href || '';

            let finalThumbnail = '';

            // 1. Check for standard structural media parameters
            if (item['media:content']) {
              finalThumbnail = Array.isArray(item['media:content'])
                ? item['media:content'][0]?.url
                : item['media:content']?.url;
            } else if (item['media:thumbnail']) {
              finalThumbnail = item['media:thumbnail']?.url;
            }

            // 2. Look for featured attachment items inside WordPress extensions
            if (!finalThumbnail && item['wp:attachment_url']) {
              finalThumbnail = item['wp:attachment_url'];
            }

            // 3. Fallback: Parse raw HTML text tags inside the rich main body text
            if (!finalThumbnail && typeof rawContent === 'string') {
              finalThumbnail = extractImageFromText(rawContent);
            }
            if (!finalThumbnail && typeof rawDescription === 'string') {
              finalThumbnail = extractImageFromText(rawDescription);
            }

            return {
              title: item.title || 'No Title',
              link: finalLink,
              pubDate: item.pubDate || item.published || item.updated || new Date().toISOString(),
              author: sourceName,
              thumbnail: finalThumbnail || '', // Passes the active asset image right to your image container
              description: cleanDescription.length > 120 
                ? cleanDescription.slice(0, 120) + '...' 
                : cleanDescription || 'View full industry coverage...',
            };
          });
        } catch (parseErr) {
          console.warn(`[News] XML parsing error on source ${sourceName}`);
          return [];
        }
      });

      // Filter empty objects & sort chronologically
      const validItems = allItems.filter(item => item.link !== '');
      validItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      setNews(validItems);
      console.log('[News] ✓ Successfully fetched', validItems.length, 'total articles!');

    } catch (err: any) {
      console.error('[News] Global Error:', err.message);
      setError('Failed to load news feeds.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const handleOpenArticle = async (url: string) => {
    if (!url) return;
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    });
  };

    // Extract card as a memoized component
    const NewsCard = memo(({ item, onPress }: { item: NewsItem; onPress: () => void }) => (
    <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={onPress}
    >
        {item.thumbnail ? (
        <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
        />
        ) : (
        <View style={styles.thumbnailFallback}>
            <Ionicons name="newspaper-outline" size={28} color="rgba(255,255,255,0.2)" />
        </View>
        )}

        <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>

        <View style={styles.cardMeta}>
            <Text style={styles.cardSource}>{item.author}</Text>
            <Text style={styles.cardDate}>{formatDate(item.pubDate)}</Text>
        </View>
        </View>
    </TouchableOpacity>
    ));

    // Move formatDate outside the component — because it's a pure function
    const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Recent';
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    };

  const renderItem = useCallback(({ item }: { item: NewsItem }) => (
    <NewsCard
        item={item}
        onPress={() => handleOpenArticle(item.link)}
    />
    ), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={ThemeTextStyles.appTitle} adjustsFontSizeToFit numberOfLines={1}>
            News Feed
          </Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={handleRefresh}>
          <Ionicons name="refresh-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {sources.length > 0 && (
        <View style={styles.sourceBar}>
          <Ionicons name="globe-outline" size={12} color="rgba(255,255,255,0.4)" />
          <Text style={styles.sourceLabel}>
            {sources.map(s => s.name).join('  •  ')}
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading news...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={40} color="rgba(255,255,255,0.3)" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, index) => item.link + index}
          renderItem={renderItem}
          getItemLayout={(_, index) => ({
            length: 114,      
            offset: 114 * index,
            index,
        })}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    height: HEADER_HEIGHT,
    paddingTop: HEADER_PADDING_TOP,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 10,
    backgroundColor: 'rgba(15, 15, 15, 0.26)',
  },
  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  headerBtn: { padding: 6 },
  sourceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  sourceLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 8 },
  errorText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', paddingHorizontal: 40 },
  retryButton: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24, marginTop: 4 },
  retryText: { color: '#000000', fontSize: 14, fontWeight: '700' },
  listContent: { padding: 16, gap: 12, paddingBottom: 40 },
  card: { backgroundColor: 'rgba(15, 15, 15, 0.53)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', flexDirection: 'row' },
  thumbnail: { width: 90, height: 90 },
  thumbnailFallback: { width: 90, height: 90, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, padding: 12, gap: 4, justifyContent: 'space-between' },
  cardTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', lineHeight: 18 },
  cardDescription: { color: 'rgba(255,255,255,0.45)', fontSize: 11, lineHeight: 16 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  cardSource: { color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: '600' },
  cardDate: { color: 'rgba(255,255,255,0.3)', fontSize: 10 },
});