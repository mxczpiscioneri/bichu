import type { ConfigContext, ExpoConfig } from 'expo/config';

import theme from './design/theme.json';

/**
 * AR is an isolated, opt-in experiment. Native builds only include ViroReact
 * (and its camera permission) when BICHU_AR=1 is set at build time.
 * See README → "Realidade aumentada (experimental)".
 */
const AR_ENABLED = process.env.BICHU_AR === '1';

/** EAS project `@mxczpiscioneri/bichu` (builds, submit and OTA updates). */
const EAS_PROJECT_ID = 'da0bf240-a0b5-4511-9e44-b5ce1f66671a';

const viroPlugins: ExpoConfig['plugins'] = AR_ENABLED
  ? [
      [
        '@reactvision/react-viro',
        {
          ios: {
            cameraUsagePermission:
              'O Bichu usa a câmera apenas para mostrar animais no seu ambiente. Nenhuma imagem é salva ou enviada.',
          },
          android: { xRMode: ['AR'] },
        },
      ],
      './plugins/withChildPrivacy',
    ]
  : [];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Bichu',
  slug: 'bichu',
  owner: 'mxczpiscioneri',
  version: '1.0.0',
  description: 'Descubra os animais brincando: sons, nomes, curiosidades e desafios para crianças.',
  primaryColor: theme.colors.leaf,
  platforms: ['ios', 'android'],
  orientation: 'portrait',
  icon: './assets/brand/icon.png',
  scheme: 'bichu',
  userInterfaceStyle: 'light',
  backgroundColor: theme.colors.cream,
  ios: {
    bundleIdentifier: 'br.com.techhands.bichu',
    appleTeamId: 'GD2JNB5JH9',
    supportsTablet: true,
    config: { usesNonExemptEncryption: false },
  },
  android: {
    package: 'br.com.techhands.bichu',
    adaptiveIcon: {
      backgroundColor: theme.colors.leaf,
      foregroundImage: './assets/brand/android-icon-foreground.png',
      backgroundImage: './assets/brand/android-icon-background.png',
      monochromeImage: './assets/brand/android-icon-monochrome.png',
    },
    // Child-privacy: never ship permissions the MVP does not need.
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_CONTACTS',
      'com.google.android.gms.permission.AD_ID',
    ],
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'single',
    favicon: './assets/brand/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: theme.colors.cream,
        image: './assets/brand/splash-icon.png',
        imageWidth: 200,
      },
    ],
    [
      'expo-audio',
      {
        // Must be a string, not false: `false` deletes NSMicrophoneUsageDescription after our
        // privacy plugin runs, and App Store Connect rejects the upload (ITMS-90683) because
        // ViroReact's binary references microphone APIs. Bichu never asks for the mic.
        microphonePermission:
          'O Bichu não usa o microfone e nunca pede esse acesso. A permissão existe apenas porque a biblioteca de realidade aumentada a declara.',
        recordAudioAndroid: false,
        enableBackgroundPlayback: false,
      },
    ],
    'expo-font',
    ...viroPlugins,
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    arEnabled: AR_ENABLED,
    router: {},
    eas: { projectId: EAS_PROJECT_ID },
  },
  runtimeVersion: { policy: 'appVersion' },
  updates: { url: `https://u.expo.dev/${EAS_PROJECT_ID}` },
});
