jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
const mockTrack = jest.fn();
jest.mock('@/analytics', () => ({ track: (...args: unknown[]) => mockTrack(...args) }));

// eslint-disable-next-line import/first
import { useProgressStore } from '../progressStore';

describe('progress store: animal_discovered', () => {
  it('is reported once, when the animal enters the Bichupédia', () => {
    const { record } = useProgressStore.getState();
    record('cat', { type: 'heardName' });
    record('cat', { type: 'heardSound' });
    record('cat', { type: 'challengeCompleted', templateId: 'food' });
    expect(mockTrack).not.toHaveBeenCalled();
    record('cat', { type: 'challengeCompleted', templateId: 'habitat' });
    record('cat', { type: 'challengeCompleted', templateId: 'class' });
    expect(mockTrack).toHaveBeenCalledTimes(1);
    expect(mockTrack).toHaveBeenCalledWith('animal_discovered', { animal_id: 'cat', discovered_total: 1 });
  });
});
