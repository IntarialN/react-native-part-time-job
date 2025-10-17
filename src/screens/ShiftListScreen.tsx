import React, {useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Screen, Text} from '../components/ui';
import {ShiftList} from '../components/shifts';
import {useShiftStore} from '../stores';
import {theme} from '../theme';
import type {RootStackParamList} from '../navigation/AppNavigator';

export const ShiftListScreen: React.FC = observer(() => {
  const store = useShiftStore();
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList>
  >();

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

  const handleSelectShift = useCallback(
    (shiftId: string) => {
      store.selectShift(shiftId);
      navigation.navigate('ShiftDetails', {shiftId});
    },
    [navigation, store],
  );

  return (
    <Screen contentStyle={styles.screenContent}>
      <Text variant="title" style={styles.title}>
        Доступные смены
      </Text>
      <ShiftList
        shifts={store.shifts.slice()}
        status={store.status}
        error={store.error}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        onRetry={handleRefresh}
        onSelectShift={handleSelectShift}
      />
    </Screen>
  );
});

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.lg,
  },
});
