import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {ShiftDetailsScreen} from '../screens/ShiftDetailsScreen';
import {ShiftListScreen} from '../screens/ShiftListScreen';

export type RootStackParamList = {
  ShiftList: undefined;
  ShiftDetails: {shiftId: string} | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

enableScreens();

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="ShiftList"
        component={ShiftListScreen}
        options={{title: 'Смены рядом'}}
      />
      <Stack.Screen
        name="ShiftDetails"
        component={ShiftDetailsScreen}
        options={{title: 'Детали смены'}}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
