import React, {useCallback, useMemo} from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import type {AsyncState, Shift} from '../../../types';
import {theme} from '../../../theme';
import {ShiftListItem} from '../item/ShiftListItem';
import {ShiftListEmptyState} from './ShiftListEmptyState';

type ShiftListProps = {
  shifts: Shift[];
  status: AsyncState;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  onRetry: () => void;
  onSelectShift: (shiftId: string) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const ShiftList: React.FC<ShiftListProps> = ({
  shifts,
  status,
  error,
  refreshing,
  onRefresh,
  onRetry,
  onSelectShift,
  contentContainerStyle,
}) => {
  const renderItem = useCallback<ListRenderItem<Shift>>(
    ({item}) => (
      <ShiftListItem
        shift={item}
        onPress={() => onSelectShift(item.id)}
      />
    ),
    [onSelectShift],
  );

  const keyExtractor = useCallback((item: Shift) => item.id, []);

  const combinedContentStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.content,
      shifts.length === 0 ? styles.emptyContent : null,
      contentContainerStyle,
    ],
    [contentContainerStyle, shifts.length],
  );

  return (
    <FlatList
      data={shifts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListEmptyComponent={
        <ShiftListEmptyState status={status} error={error} onRetry={onRetry} />
      }
      contentContainerStyle={combinedContentStyle}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
