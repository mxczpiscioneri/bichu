import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { ChallengeTemplate } from '@/challenges/types';
import { getCollection } from '@/content/collections';
import { useLayout } from '@/hooks/useLayout';
import { colors, fonts, radius, shadows, spacing, tones } from '@/theme';

import { TONE_BY_TEMPLATE } from '../challenge/templateTone';
import { AppText } from '../ui/AppText';
import { HabitatScene, type SceneName } from '../ui/HabitatScene';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';
import { HomeRow } from './HomeRow';

const GAP = spacing.sm + 6;

/** Width of one item when `count` items share a tablet row, or a fixed phone width. */
function useItemWidth(count: number, phoneWidth: number): number {
  const { isTablet, contentWidth } = useLayout();
  return isTablet ? Math.floor((contentWidth - GAP * (count - 1)) / count) : phoneWidth;
}

/** "Vamos brincar": one big card per game, straight into a round. */
export function PlayShortcuts({ templates }: { templates: readonly ChallengeTemplate[] }) {
  const games = templates.slice(0, 4);
  const width = useItemWidth(games.length, 148);
  const { scale } = useLayout();
  return (
    <HomeRow title="Vamos brincar" gap={GAP}>
      {games.map((template) => {
        const tone = tones[TONE_BY_TEMPLATE[template.id]];
        return (
          <PressableScale
            key={template.id}
            onPress={() => router.push({ pathname: '/challenge/[type]', params: { type: template.id } })}
            accessibilityLabel={template.title}
            accessibilityHint={template.subtitle}
            style={[styles.game, { width, backgroundColor: tone.background }]}
            pressedScale={0.96}>
            <View style={[styles.gameIcon, { width: 64 * scale, height: 64 * scale, borderRadius: 32 * scale }]}>
              <Icon name={template.icon} size={Math.round(44 * scale)} />
            </View>
            <AppText style={styles.gameTitle} align="center" numberOfLines={2}>
              {template.title}
            </AppText>
          </PressableScale>
        );
      })}
    </HomeRow>
  );
}

const PLACES: { collection: string; scene: SceneName }[] = [
  { collection: 'farm', scene: 'farm' },
  { collection: 'savanna', scene: 'savanna' },
  { collection: 'forest', scene: 'forest' },
  { collection: 'ocean', scene: 'ocean' },
  { collection: 'home', scene: 'home' },
];

/** "Onde eles vivem": habitat scenes that open Explorar filtered to that place. */
export function PlaceShortcuts() {
  const width = useItemWidth(PLACES.length, 168);
  return (
    <HomeRow title="Onde eles vivem" gap={GAP}>
      {PLACES.map(({ collection, scene }) => {
        const label = getCollection(collection).label;
        return (
          <PressableScale
            key={collection}
            onPress={() => router.push({ pathname: '/explore', params: { filter: collection } })}
            accessibilityLabel={`Ver animais: ${label}`}
            style={[styles.place, { width }]}
            pressedScale={0.96}>
            <HabitatScene scene={scene} />
            <View style={styles.placeLabel}>
              <AppText style={styles.placeText} numberOfLines={1}>
                {label}
              </AppText>
            </View>
          </PressableScale>
        );
      })}
    </HomeRow>
  );
}

const styles = StyleSheet.create({
  game: {
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...shadows.card,
  },
  gameIcon: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.85)' },
  gameTitle: { fontFamily: fonts.display, fontSize: 18, lineHeight: 22, color: colors.ink },
  place: {
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    ...shadows.card,
  },
  placeLabel: {
    margin: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 4,
  },
  placeText: { fontFamily: fonts.displayBold, fontSize: 17, color: colors.forest },
});
