// app/news-feed.tsx
import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image, RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTextTheme } from '@/context';
import { HEADER_HEIGHT, HEADER_PADDING_TOP, NEWS_SOURCES } from '@/constant';

const RSS_URL = 'https://jrocknews.com/feed';
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
  author: string;
};

export default function NewsFeed() {
  const { ThemeTextStyles } = useTextTheme();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setError(null);
    try {
        console.log('[News] Fetching from', NEWS_SOURCES.length, 'sources...');

        //fetch all sources 
        const responses = await Promise.all(
            NEWS_SOURCES.map(source => fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`)
            .then(res => res.json())
            .then (data => ({ data, sourceName: source.name}))
            .catch(err => {
                console.warn(`[NEWS] Failed to fetch ${source.name}:`, err.message);
                return { data: { status: 'error', items: [] }, sourceName: source.name};
            })
          )
        );

        // Helper function to extract image from HTML description
        const extractImageFromDescription = (description: string): string => {
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
            return imgMatch ? imgMatch[1] : '';
        };

        const allItems = responses.flatMap (( { data, sourceName}) => {
            if (data.status !== 'ok') return [];

            return data.items.map((item:any) => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                author: sourceName,
                thumbnail: item.thumbnail || item.enclosure?.link || extractImageFromDescription(item.description) || '',
                description: item.description
                .replace(/<[^>]*>/g, '')  // strip HTML tags
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .trim()
                .slice(0, 120) + '...',  // truncate to 120 chars
            }));
        });

        allItems.sort((a, b) => new Date(b.pubdate).getTime() - new Date(a.pubDate).getTime());

        setNews(allItems);
        console.log('[News] ✓ Fetched', allItems.length, 'total articles from', NEWS_SOURCES.length, 'sources');

    } catch (err: any) {
      console.error('[News] Error:', err.message);
      setError('Failed to load news. Please try again.');
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
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => handleOpenArticle(item.link)}
    >
      {/* Thumbnail */}
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

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>

        <View style={styles.cardMeta}>
          <Text style={styles.cardSource}>{item.author}</Text>
          <Text style={styles.cardDate}>{formatDate(item.pubDate)}</Text>
        </View>
      </View>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
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

      {/* Source label */}
      <View style={styles.sourceBar}>
        <Ionicons name="globe-outline" size={12} color="rgba(255,255,255,0.4)" />
        <Text style={styles.sourceLabel}>JROCK News</Text>
      </View>

      {/* Content */}
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
          keyExtractor={(item) => item.link}
          renderItem={renderItem}
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
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerBtn: {
    padding: 6,
  },
  sourceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  sourceLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 8,
  },
  errorText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  retryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  retryText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(15, 15, 15, 0.53)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  thumbnail: {
    width: 90,
    height: 90,
  },
  thumbnailFallback: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    gap: 4,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    lineHeight: 16,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardSource: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: '600',
  },
  cardDate: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
  },
});