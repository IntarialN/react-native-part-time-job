import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import type {Shift} from '../../../types';
import {theme} from '../../../theme';
import {Card, Text} from '../../ui';
import {ShiftDetailsSection} from './ShiftDetailsSection';

const formatWorkTypes = (workTypes: Shift['workTypes']): string[] => {
  if (!workTypes) {
    return [];
  }

  if (Array.isArray(workTypes)) {
    return workTypes
      .map(item => {
        if (!item) {
          return null;
        }
        if (typeof item === 'string') {
          return item;
        }
        if (typeof item === 'object' && 'name' in item && item.name) {
          return String(item.name);
        }
        return null;
      })
      .filter(Boolean) as string[];
  }

  if (typeof workTypes === 'string') {
    return [workTypes];
  }

  return [];
};

const formatWorkers = (current: number, plan: number) =>
  `${current.toString()} из ${plan.toString()} набраны`;

type ShiftDetailsContentProps = {
  shift: Shift;
};

export const ShiftDetailsContent: React.FC<ShiftDetailsContentProps> = ({
  shift,
}) => {
  const workTypeChips = useMemo(
    () => formatWorkTypes(shift.workTypes),
    [shift.workTypes],
  );

  return (
    <View style={styles.container}>
      <ShiftDetailsSection title="Вознаграждение">
        <Card style={styles.card}>
          <Text variant="title" weight="bold" color="primary">
            {shift.priceWorker.toLocaleString('ru-RU')} ₽
          </Text>
          {shift.bonusPriceWorker ? (
            <Text color="textSecondary" style={styles.secondaryText}>
              Дополнительный бонус {shift.bonusPriceWorker.toLocaleString('ru-RU')} ₽
            </Text>
          ) : null}
        </Card>
      </ShiftDetailsSection>

      <ShiftDetailsSection title="Время смены">
        <Card style={styles.card}>
          <Text weight="medium">
            {shift.dateStartByCity}
          </Text>
          <Text color="textSecondary" style={styles.secondaryText}>
            {shift.timeStartByCity} – {shift.timeEndByCity}
          </Text>
        </Card>
      </ShiftDetailsSection>

      <ShiftDetailsSection title="Состав бригады">
        <Card style={styles.card}>
          <Text weight="medium">
            {formatWorkers(shift.currentWorkers, shift.planWorkers)}
          </Text>
        </Card>
      </ShiftDetailsSection>

      <ShiftDetailsSection title="Тип работ">
        <Card style={styles.card}>
          <View style={styles.chipsContainer}>
            {workTypeChips.length === 0 ? (
              <Text color="textSecondary">Тип не указан</Text>
            ) : (
              workTypeChips.map(type => (
                <View key={type} style={styles.chip}>
                  <Text variant="caption" weight="medium" color="surface">
                    {type}
                  </Text>
                </View>
              ))
            )}
          </View>
        </Card>
      </ShiftDetailsSection>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  card: {
    padding: theme.spacing.lg,
  },
  secondaryText: {
    marginTop: theme.spacing.xs,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -theme.spacing.xs,
    marginRight: -theme.spacing.xs,
  },
  chip: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
});
