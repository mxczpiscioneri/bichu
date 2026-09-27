import { StyleSheet, TextInput, View } from 'react-native';

import { colors, fonts, radius, shadows, spacing } from '@/theme';

import { Icon } from './Icon';

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.field}>
      <Icon name="search" size={24} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.inkSoft}
        style={styles.input}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 50,
    ...shadows.card,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 17, color: colors.ink, paddingVertical: spacing.sm },
});
