import { sanitizeParams } from '../events';
import { screenNameFor } from '../screens';

const mockBackend = { logEvent: jest.fn(), logScreenView: jest.fn(), setCollectionEnabled: jest.fn() };
jest.mock('../backend', () => ({ getBackend: () => mockBackend }));

// eslint-disable-next-line import/first
import { __resetAnalyticsForTests, setAnalyticsEnabled, track, trackScreen } from '..';

beforeEach(() => {
  __resetAnalyticsForTests();
  jest.clearAllMocks();
});

describe('analytics', () => {
  it('sends typed events with non-personal parameters', () => {
    setAnalyticsEnabled(true);
    track('level_complete', {
      level_id: 'habitat',
      mode: 'explorer',
      surface: 'screen',
      rounds: 5,
      stars: 2,
      mistakes: 1,
      discovered: 0,
    });
    expect(mockBackend.logEvent).toHaveBeenCalledWith('level_complete', {
      level_id: 'habitat',
      mode: 'explorer',
      surface: 'screen',
      rounds: 5,
      stars: 2,
      mistakes: 1,
      discovered: 0,
    });
  });

  it('drops an optional parameter left undefined', () => {
    setAnalyticsEnabled(true);
    track('level_start', { level_id: 'animal', mode: 'adventurer', surface: 'ar', animal_id: 'lion', rounds: 3 });
    track('level_start', { level_id: 'food', mode: 'explorer', surface: 'screen', animal_id: undefined, rounds: 5 });
    expect(mockBackend.logEvent).toHaveBeenLastCalledWith('level_start', {
      level_id: 'food',
      mode: 'explorer',
      surface: 'screen',
      rounds: 5,
    });
  });

  it('holds events until the saved settings load and discards them when collection is off', () => {
    track('app_open');
    trackScreen('Home');
    expect(mockBackend.logEvent).not.toHaveBeenCalled();
    setAnalyticsEnabled(false);
    expect(mockBackend.setCollectionEnabled).toHaveBeenCalledWith(false);
    expect(mockBackend.logEvent).not.toHaveBeenCalled();
    expect(mockBackend.logScreenView).not.toHaveBeenCalled();
    track('button_click', { button: 'welcome_start' });
    expect(mockBackend.logEvent).not.toHaveBeenCalled();
  });

  it('flushes the queue when collection is on, and only calls the SDK switch on change', () => {
    track('app_open');
    trackScreen('Home');
    setAnalyticsEnabled(true);
    setAnalyticsEnabled(true);
    expect(mockBackend.logEvent).toHaveBeenCalledWith('app_open', {});
    expect(mockBackend.logScreenView).toHaveBeenCalledWith('Home');
    expect(mockBackend.setCollectionEnabled).toHaveBeenCalledTimes(1);
  });

  it('stops sending after the parents turn it off', () => {
    setAnalyticsEnabled(true);
    setAnalyticsEnabled(false);
    track('animal_view', { animal_id: 'cat' });
    expect(mockBackend.logEvent).not.toHaveBeenCalled();
    expect(mockBackend.setCollectionEnabled).toHaveBeenLastCalledWith(false);
  });

  it('drops free text, invalid keys and NaN, and rounds numbers', () => {
    expect(sanitizeParams({ animal_id: 'lion', name: 'Maria Silva', 'bad key': 1, stars: 2.6, x: NaN })).toEqual({
      animal_id: 'lion',
      stars: 3,
    });
  });

  it('ignores screen names that are not plain words', () => {
    setAnalyticsEnabled(true);
    trackScreen('animal/lion');
    expect(mockBackend.logScreenView).not.toHaveBeenCalled();
  });
});

describe('screen names', () => {
  it('maps route patterns to fixed names, never ids', () => {
    expect(screenNameFor(['(tabs)'])).toBe('Home');
    expect(screenNameFor(['(tabs)', 'index'])).toBe('Home');
    expect(screenNameFor(['(tabs)', 'explore'])).toBe('Explore');
    expect(screenNameFor(['animal', '[id]'])).toBe('Animal');
    expect(screenNameFor(['challenge', '[type]'])).toBe('Challenge');
    expect(screenNameFor(['ar', '[animalId]'])).toBe('Ar');
    expect(screenNameFor(['choose-level'])).toBe('ChooseLevel');
    expect(screenNameFor(['animal', 'lion'])).toBeNull();
  });
});

describe('native backend', () => {
  it('is a no-op when the Firebase native module is missing (Jest / Expo Go)', () => {
    const { getBackend } = jest.requireActual<typeof import('../backend.native')>('../backend.native');
    expect(getBackend()).toBeNull();
  });
});
