import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Switch, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Screen, Text} from '../components/ui';
import {ShiftList, ShiftMap} from '../components/shifts';
import {
  useFilterStore,
  useLocationStore,
  useShiftStore,
} from '../stores';
import {theme} from '../theme';
import type {RootStackParamList} from '../navigation/AppNavigator';

export const ShiftListScreen: React.FC = observer(() => {
  const shiftStore = useShiftStore();
  const filterStore = useFilterStore();
  const locationStore = useLocationStore();
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList>
  >();
  const [scrollToTopToken, setScrollToTopToken] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    if (shiftStore.status === 'idle') {
      shiftStore.loadShifts();
    }

    return () => {
      shiftStore.cancelOngoingRequest();
    };
  }, [shiftStore]);

  const isRefreshing = shiftStore.status === 'loading' && shiftStore.hasShifts;

  const handleRefresh = useCallback(() => {
    shiftStore.loadShifts();
  }, [shiftStore]);

  const handleToggleIncludeFilled = useCallback(
    (value: boolean) => {
      filterStore.setIncludeFilled(value);
      setScrollToTopToken(token => token + 1);
    },
    [filterStore],
  );

  const handleChangeView = useCallback(
    (mode: 'list' | 'map') => {
      setViewMode(mode);
      if (mode === 'map') {
        locationStore.ensureCoordinates().catch(() => undefined);
      }
    },
    [locationStore],
  );

  const handleLoadMore = useCallback(() => {
    shiftStore.loadMoreShifts();
  }, [shiftStore]);

  const handleSelectShift = useCallback(
    (shiftId: string) => {
      shiftStore.selectShift(shiftId);
      navigation.navigate('ShiftDetails', {shiftId});
    },
    [navigation, shiftStore],
  );

  return (
    <Screen contentStyle={styles.screenContent}>
      <View style={styles.headerRow}>
        <View>
          <Text variant="title" style={styles.title}>
            Доступные смены
          </Text>
          <Text variant="caption" color="textSecondary">
            {shiftStore.isOffline
              ? 'Данные из кеша (нет сети)'
              : `Обновлено: ${formatUpdatedAt(shiftStore.lastUpdatedAt)}`}
          </Text>
        </View>
        <View style={styles.controlsColumn}>
          <View style={styles.switchRow}>
            <Text
              variant="caption"
              color="textSecondary"
              style={styles.switchLabel}>
              Заполненные
            </Text>
            <Switch
              value={shiftStore.includeFilled}
              onValueChange={handleToggleIncludeFilled}
            />
          </View>
          <View style={styles.viewToggle}>
            <ToggleButton
              label="Список"
              active={viewMode === 'list'}
              onPress={() => handleChangeView('list')}
            />
            <ToggleButton
              label="Карта"
              active={viewMode === 'map'}
              onPress={() => handleChangeView('map')}
            />
          </View>
        </View>
      </View>

      {viewMode === 'list' ? (
        <ShiftList
          shifts={shiftStore.visibleShifts}
          status={shiftStore.status}
          error={shiftStore.error}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onRetry={handleRefresh}
          onSelectShift={handleSelectShift}
          onEndReached={handleLoadMore}
          loadingMore={shiftStore.isLoadingMore}
          hasMore={shiftStore.hasMore}
          scrollToTopToken={scrollToTopToken}
        />
      ) : (
        <ShiftMap
          shifts={shiftStore.visibleShifts}
          center={locationStore.coordinates}
          onSelectShift={handleSelectShift}
        />
      )}
    </Screen>
  );
});

type ToggleButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({label, active, onPress}) => (
  <Pressable
    onPress={onPress}
    style={[styles.toggleButton, active ? styles.toggleButtonActive : null]}>
    <Text
      variant="caption"
      weight={active ? 'bold' : 'regular'}
      color={active ? 'surface' : 'textSecondary'}>
      {label}
    </Text>
  </Pressable>
);

const formatUpdatedAt = (timestamp: number | null): string => {
  if (!timestamp) {
    return '—';
  }

  const date = new Date(timestamp);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  controlsColumn: {
    alignItems: 'flex-end',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: theme.spacing.xs,
  },
  viewToggle: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
});
