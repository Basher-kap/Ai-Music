// app.config.js
module.exports = ({ config }) => {
  const profile = process.env.EAS_BUILD_PROFILE;

  const appName = 
    profile === 'development' ? 'Ai Music (Dev)' :
    profile === 'preview' ? 'Ai Music (Prev)' :
    'Ai Music';

  const androidPackage =
    profile === 'development' ? 'com.nagiiiqt.AiMusicDev' :
    profile === 'preview' ? 'com.nagiiiqt.AiMusicPrev' :
    'com.nagiiiqt.AiMusic';

  return {
    ...config,
    name: appName,
    plugins: [
      ...(config.plugins ?? []),
      'expo-web-browser',
    ],
    android: {
      ...config.android,
      package: androidPackage,
      intentFilters: [
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
        }
      ],
    },
  };
};