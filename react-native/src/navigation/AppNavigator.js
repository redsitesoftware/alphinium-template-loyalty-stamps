import React from 'react';
import { useStore } from '../store/loyaltyStore';
import HomeScreen from '../screens/HomeScreen';
import CardScreen from '../screens/CardScreen';
import ScanScreen from '../screens/ScanScreen';
import HistoryScreen from '../screens/HistoryScreen';

export default function AppNavigator() {
  const { state } = useStore();
  switch (state.phase) {
    case 'card':    return <CardScreen />;
    case 'scan':    return <ScanScreen />;
    case 'history': return <HistoryScreen />;
    default:        return <HomeScreen />;
  }
}
