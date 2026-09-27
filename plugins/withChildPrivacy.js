/**
 * Removes iOS usage descriptions that ViroReact adds by default but Bichu never
 * uses (microphone, photo library, location). Only the camera string is kept,
 * because AR renders the camera feed. Must be listed AFTER the Viro plugin.
 */
const UNUSED_IOS_USAGE_KEYS = [
  'NSMicrophoneUsageDescription',
  'NSPhotoLibraryUsageDescription',
  'NSPhotoLibraryAddUsageDescription',
  'NSLocationWhenInUseUsageDescription',
  'NSLocationAlwaysAndWhenInUseUsageDescription',
];

module.exports = function withChildPrivacy(config) {
  const infoPlist = { ...(config.ios?.infoPlist ?? {}) };
  for (const key of UNUSED_IOS_USAGE_KEYS) delete infoPlist[key];
  return { ...config, ios: { ...config.ios, infoPlist } };
};
