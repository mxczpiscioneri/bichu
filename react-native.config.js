/**
 * ViroReact is only autolinked into native builds when BICHU_AR=1.
 * Default builds (and Expo Go) never contain the AR native code.
 */
const AR_ENABLED = process.env.BICHU_AR === '1';

module.exports = {
  dependencies: AR_ENABLED
    ? {}
    : { '@reactvision/react-viro': { platforms: { android: null, ios: null } } },
};
