/**
 * ViroReact's iOS binary references microphone, photo library and location APIs, so
 * App Store Connect rejects the upload (ITMS-90683) unless each has a purpose string,
 * even though Bichu never calls them. Instead of Viro's generic strings, state plainly
 * that the app does not use them; the system prompt is never triggered. Only the camera
 * is actually requested (for AR). Must be listed AFTER the Viro plugin.
 */
const UNUSED_IOS_PURPOSES = {
  NSMicrophoneUsageDescription:
    'O Bichu não usa o microfone e nunca pede esse acesso. A permissão existe apenas porque a biblioteca de realidade aumentada a declara.',
  NSPhotoLibraryUsageDescription:
    'O Bichu não acessa suas fotos e nunca pede esse acesso. A permissão existe apenas porque a biblioteca de realidade aumentada a declara.',
  NSPhotoLibraryAddUsageDescription:
    'O Bichu não salva nada nas suas fotos e nunca pede esse acesso. A permissão existe apenas porque a biblioteca de realidade aumentada a declara.',
  NSLocationWhenInUseUsageDescription:
    'O Bichu não usa sua localização e nunca pede esse acesso. A permissão existe apenas porque a biblioteca de realidade aumentada a declara.',
};

const REMOVED_IOS_KEYS = ['NSLocationAlwaysAndWhenInUseUsageDescription'];

module.exports = function withChildPrivacy(config) {
  const infoPlist = { ...(config.ios?.infoPlist ?? {}), ...UNUSED_IOS_PURPOSES };
  for (const key of REMOVED_IOS_KEYS) delete infoPlist[key];
  return { ...config, ios: { ...config.ios, infoPlist } };
};
