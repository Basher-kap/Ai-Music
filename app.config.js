// app.config.js
module.exports = ({ config }) => {
  const profile = process.env.EAS_BUILD_PROFILE;

  const appName =
    profile === 'development' ? 'Ai Music (Dev)' :
    profile === 'preview'     ? 'Ai Music (Prev)' :
    'Ai Music';

  const androidPackage =
    profile === 'development' ? 'com.nagiiiqt.AiMusicDev' :
    profile === 'preview'     ? 'com.nagiiiqt.AiMusicPrev' :
    'com.nagiiiqt.AiMusic';

  const iosBundleIdentifier =
    profile === 'development' ? 'com.nagiiiqt.AiMusicDev' :
    profile === 'preview'     ? 'com.nagiiiqt.AiMusicPrev' :
    'com.nagiiiqt.AiMusic';

  return {
    ...config,
    name: appName,

    // Required at root level for AuthSession.makeRedirectUri({ scheme: 'aimusic' })
    scheme: 'aimusic',

    plugins: [
      ...(config.plugins ?? []),
      'expo-web-browser',
        [
          'expo-audio',
          {
            microphonePermission: false,
            recordAudioAndroid: false,
            enableBackgroundPlayback: false,
          },
        ],
      'expo-image',
      'expo-asset',
      'expo-status-bar',
    ],

    ios: {
      ...config.ios,
      bundleIdentifier: iosBundleIdentifier,
    },

    android: {
      ...config.android,
      package: androidPackage,
      intentFilters: [
        // Primary: catches aimusic://auth/callback
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'aimusic',
              host: 'auth',
              pathPrefix: '/callback',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
  };
};