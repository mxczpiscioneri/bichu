jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// eslint-disable-next-line import/first
import AsyncStorage from '@react-native-async-storage/async-storage';
// eslint-disable-next-line import/first
import { useSettingsStore } from '../settingsStore';

describe('settings store: anonymous statistics switch', () => {
  it('is on by default', () => {
    expect(useSettingsStore.getState().analyticsEnabled).toBe(true);
  });

  it('keeps the default for saves made before the switch existed', async () => {
    await AsyncStorage.setItem(
      'bichu.settings',
      JSON.stringify({ state: { level: 'adventurer', soundEnabled: false, onboarded: true }, version: 2 }),
    );
    await useSettingsStore.persist.rehydrate();
    const state = useSettingsStore.getState();
    expect(state.level).toBe('adventurer');
    expect(state.soundEnabled).toBe(false);
    expect(state.analyticsEnabled).toBe(true);
  });

  it('restores a saved "off"', async () => {
    await AsyncStorage.setItem(
      'bichu.settings',
      JSON.stringify({
        state: { level: 'explorer', soundEnabled: true, onboarded: true, analyticsEnabled: false },
        version: 2,
      }),
    );
    await useSettingsStore.persist.rehydrate();
    expect(useSettingsStore.getState().analyticsEnabled).toBe(false);
  });
});
