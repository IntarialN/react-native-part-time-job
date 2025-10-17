import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import type {Shift} from '../../../types';
import {theme} from '../../../theme';
import {Card, Text} from '../../ui';

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');

type ShiftDetailsHeaderProps = {
  shift: Shift;
};

export const ShiftDetailsHeader: React.FC<ShiftDetailsHeaderProps> = ({
  shift,
}) => {
  const ratingLabel =
    typeof shift.customerRating === 'number'
      ? shift.customerRating.toFixed(1)
      : null;

  return (
    <Card elevated style={styles.card}>
      <View style={styles.row}>
        <View style={styles.logoWrapper}>
          {shift.logo ? (
            <Image source={{uri: shift.logo}} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text variant="subtitle" weight="bold" color="surface">
                {getInitials(shift.companyName)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text variant="title" weight="bold" numberOfLines={2}>
            {shift.companyName}
          </Text>
          <Text color="textSecondary" style={styles.address} numberOfLines={2}>
            {shift.address}
          </Text>
          <View style={styles.metaRow}>
            {ratingLabel ? (
              <View style={styles.ratingBadge}>
                <Text variant="caption" weight="medium" color="surface">
                  ★ {ratingLabel}
                </Text>
              </View>
            ) : null}
            {shift.customerFeedbacksCount ? (
              <Text variant="caption" color="textSecondary">
                {shift.customerFeedbacksCount}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
  },
  logoWrapper: {
    marginRight: theme.spacing.md,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.md,
  },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  address: {
    marginTop: theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  ratingBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.sm,
  },
});
