// app/(tabs)/index.tsx
import { Text, View, StyleSheet } from 'react-native';
import { useTextTheme } from '@/context';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant/layout';


export default function Index() {
  const { ThemeTextStyles } = useTextTheme();

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={[ThemeTextStyles.appTitle]}>Ai Music</Text>
      </View>

      <View style={styles.body}>
        <Text style={[ThemeTextStyles.tagline]}>Home screen</Text>
      </View>

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
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end', 
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});