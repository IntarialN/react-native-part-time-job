import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Screen, Text} from '../components/ui';
import {ShiftList} from '../components/shifts';
import {useShiftStore, useFilterStore} from '../stores';
import {theme} from '../theme';
import type {RootStackParamList} from '../navigation/AppNavigator';

export const ShiftListScreen: React.FC = observer(() => {
  const store = useShiftStore();
  const filterStore = useFilterStore();
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList>
  >();
  const [scrollToTopToken, setScrollToTopToken] = useState(0);

  useEffect(() => {
    if (store.status === 'idle') {
      store.loadShifts();
    }

    return () => {
      store.cancelOngoingRequest();
    };
  }, [store]);

  const isRefreshing = store.status === 'loading' && store.hasShifts;

  const handleRefresh = useCallback(() => {
    store.loadShifts();
  }, [store]);

  const handleToggleIncludeFilled = useCallback(
    (value: boolean) => {
      filterStore.setIncludeFilled(value);
      setScrollToTopToken(token => token + 1);
    },
    [filterStore],
  );

  const handleLoadMore = useCallback(() => {
    store.loadMoreShifts();
  }, [store]);

  const handleSelectShift = useCallback(
    (shiftId: string) => {
      store.selectShift(shiftId);
      navigation.navigate('ShiftDetails', {shiftId});
    },
    [navigation, store],
  );

  return (
    <Screen contentStyle={styles.screenContent}>
      <View style={styles.headerRow}>
        <Text variant="title" style={styles.title}>
          Доступные смены
        </Text>
        <View style={styles.switchRow}>
          <Text variant="caption" color="textSecondary" style={styles.switchLabel}>
            Заполненные
          </Text>
          <Switch
            value={store.includeFilled}
            onValueChange={handleToggleIncludeFilled}
          />
        </View>
      </View>
      <ShiftList
        shifts={store.visibleShifts}
        status={store.status}
        error={store.error}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        onRetry={handleRefresh}
        onSelectShift={handleSelectShift}
        onEndReached={handleLoadMore}
        loadingMore={store.isLoadingMore}
        hasMore={store.hasMore}
        scrollToTopToken={scrollToTopToken}
      />
    </Screen>
  );
});

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: 0,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: theme.spacing.xs,
  },
});
