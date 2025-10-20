import React, {useMemo, useRef} from 'react';
import MapView, {Callout, Marker, Region} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import type {Shift} from '../../../types';
import {Text, Card} from '../../ui';
import {theme} from '../../../theme';

type CoordinatesLike = {
  latitude: number;
  longitude: number;
};

type ShiftMapProps = {
  shifts: Shift[];
  onSelectShift: (shiftId: string) => void;
  center?: CoordinatesLike | null;
};

const DEFAULT_REGION: Region = {
  latitude: 55.751244,
  longitude: 37.618423,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

const getInitialRegion = (
  center: CoordinatesLike | null | undefined,
  fallback: Region,
): Region => {
  if (!center) {
    return fallback;
  }

  return {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };
};

export const ShiftMap: React.FC<ShiftMapProps> = ({
  shifts,
  onSelectShift,
  center,
}) => {
  const mapRef = useRef<MapView | null>(null);

  const region = useMemo(
    () => getInitialRegion(center ?? getFirstShiftCoords(shifts), DEFAULT_REGION),
    [center, shifts],
  );

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={StyleSheet.absoluteFill} initialRegion={region}>
        {shifts
          .filter(shift => hasCoordinates(shift))
          .map(shift => {
            const coords = shift.coordinates!;
            return (
              <Marker
                key={shift.id}
                coordinate={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                }}
                pinColor={theme.colors.primary}>
                <Callout onPress={() => onSelectShift(shift.id)}>
                  <Card style={styles.markerCard}>
                    <Text variant="caption" weight="bold">
                      {shift.companyName}
                    </Text>
                    <Text variant="caption" color="textSecondary">
                      {shift.priceWorker.toLocaleString('ru-RU')} ₽
                    </Text>
                  </Card>
                </Callout>
              </Marker>
            );
          })}
      </MapView>
    </View>
  );
};

const hasCoordinates = (shift: Shift): shift is Shift & {coordinates: CoordinatesLike} =>
  !!shift.coordinates;

const getFirstShiftCoords = (shifts: Shift[]): CoordinatesLike | null => {
  for (const shift of shifts) {
    if (shift.coordinates) {
      return shift.coordinates;
    }
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  markerCard: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
});
