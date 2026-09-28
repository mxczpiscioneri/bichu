import { useState, type ReactNode } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import type { IconName } from '@/content/icons';

import { Icon } from '../ui/Icon';
import { LineIcon } from '../ui/LineIcon';
import { PressableScale } from '../ui/PressableScale';

interface RowProps {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  /** Boolean setting rendered as a switch. */
  toggle?: { value: boolean; onChange: (value: boolean) => void };
  /** Expandable detail text. */
  details?: ReactNode;
}

export function SettingsRow({ icon, label, value, onPress, toggle, details }: RowProps) {
  const [open, setOpen] = useState(false);
  const pressable = !!onPress || !!details;
  const body = (
    <View style={styles.row}>
      <Icon name={icon} size={28} />
      <AppText variant="bodyStrong" style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </AppText>
      {value ? <AppText variant="caption">{value}</AppText> : null}
      {toggle ? (
        // Fixed-height slot: the iOS 26 switch draws taller than Yoga measures it.
        <View style={styles.switchSlot}>
          <Switch
            value={toggle.value}
            onValueChange={toggle.onChange}
            trackColor={{ true: colors.leaf, false: colors.line }}
            thumbColor={colors.white}
            accessibilityLabel={label}
          />
        </View>
      ) : null}
      {pressable ? <LineIcon name={details && open ? 'back' : 'forward'} size={18} color={colors.inkSoft} /> : null}
    </View>
  );
  return (
    <View style={styles.wrap}>
      {pressable ? (
        <PressableScale
          onPress={details ? () => setOpen((o) => !o) : onPress}
          accessibilityLabel={label}
          pressedScale={0.99}
          haptic={false}>
          {body}
        </PressableScale>
      ) : (
        body
      )}
      {details && open ? <View style={styles.details}>{details}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: 1, borderBottomColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 60, paddingHorizontal: spacing.xs },
  label: { flex: 1 },
  switchSlot: { height: 40, justifyContent: 'center' },
  details: { paddingBottom: spacing.md, paddingLeft: 38, gap: spacing.sm },
});
