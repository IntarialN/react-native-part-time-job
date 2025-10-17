import React, {useCallback, useMemo, useRef, useEffect} from 'react';
import {
  ActivityIndicator,
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
  onEndReached: () => void;
  loadingMore: boolean;
  hasMore: boolean;
  scrollToTopToken?: number;
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
  onEndReached,
  loadingMore,
  hasMore,
  scrollToTopToken,
  contentContainerStyle,
}) => {
  const listRef = useRef<FlatList<Shift>>(null);
  useEffect(() => {
    if (typeof scrollToTopToken === 'number') {
      listRef.current?.scrollToOffset({offset: 0, animated: true});
    }
  }, [scrollToTopToken]);

  const renderItem = useCallback<ListRenderItem<Shift>>(
    ({item}) => (
      <ShiftListItem shift={item} onPress={() => onSelectShift(item.id)} />
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
      ref={listRef}
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
      onEndReached={() => {
        if (!loadingMore && hasMore) {
          onEndReached();
        }
      }}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            style={styles.footerSpinner}
            color={theme.colors.primary}
          />
        ) : null
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
  footerSpinner: {
    marginVertical: theme.spacing.lg,
  },
});
