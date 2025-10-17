import React, {useMemo} from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import type {Shift} from '../../../types';
import {Card, Text} from '../../ui';
import {theme} from '../../../theme';

type ShiftListItemProps = {
  shift: Shift;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const getWorkTypeLabel = (workTypes: Shift['workTypes']): string | null => {
  if (!workTypes) {
    return null;
  }

  if (Array.isArray(workTypes)) {
    const first = workTypes[0];
    if (!first) {
      return null;
    }
    if (typeof first === 'string') {
      return first;
    }
    if (typeof first === 'object' && 'name' in first && first.name) {
      return String(first.name);
    }
  }

  if (typeof workTypes === 'string') {
    return workTypes;
  }

  return null;
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('');

export const ShiftListItem: React.FC<ShiftListItemProps> = ({
  shift,
  onPress,
  style,
}) => {
  const workTypeLabel = useMemo(
    () => getWorkTypeLabel(shift.workTypes),
    [shift.workTypes],
  );

  const workersProgress = `${shift.currentWorkers}/${shift.planWorkers}`;
  const ratingLabel =
    typeof shift.customerRating === 'number'
      ? shift.customerRating.toFixed(1)
      : null;

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[styles.touchable, style]}>
      <Card elevated>
        <View style={styles.row}>
          <View style={styles.logoWrapper}>
            {shift.logo ? (
              <Image
                accessibilityIgnoresInvertColors
                source={{uri: shift.logo}}
                style={styles.logo}
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text variant="subtitle" weight="bold" color="surface">
                  {getInitials(shift.companyName)}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.content}>
            <Text variant="subtitle" weight="bold" numberOfLines={1}>
              {shift.companyName}
            </Text>
            {workTypeLabel ? (
              <Text color="textSecondary" style={styles.meta} numberOfLines={1}>
                {workTypeLabel}
              </Text>
            ) : null}
            <Text color="textSecondary" style={styles.meta} numberOfLines={2}>
              {shift.address}
            </Text>
            <View style={styles.tagsRow}>
              <View style={styles.tagPrimary}>
                <Text variant="caption" weight="medium" color="surface">
                  {shift.dateStartByCity} · {shift.timeStartByCity} –{' '}
                  {shift.timeEndByCity}
                </Text>
              </View>
              <View style={styles.tagSecondary}>
                <Text variant="caption" weight="medium" color="surface">
                  {workersProgress} чел.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.side}>
            <Text variant="subtitle" weight="bold" style={styles.price}>
              {shift.priceWorker.toLocaleString('ru-RU')} ₽
            </Text>
            {!!ratingLabel && (
              <View style={styles.rating}>
                <Text variant="caption" weight="medium" color="surface">
                  ★ {ratingLabel}
                </Text>
              </View>
            )}
            {shift.customerFeedbacksCount ? (
              <Text variant="caption" color="textSecondary" numberOfLines={1}>
                {shift.customerFeedbacksCount}
              </Text>
            ) : null}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginBottom: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
  },
  logoWrapper: {
    marginRight: theme.spacing.md,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.sm,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  meta: {
    marginTop: theme.spacing.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  tagPrimary: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  tagSecondary: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  side: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: theme.spacing.sm,
  },
  price: {
    color: theme.colors.primary,
  },
  rating: {
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
});
