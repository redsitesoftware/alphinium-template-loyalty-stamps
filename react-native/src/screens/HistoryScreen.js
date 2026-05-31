import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useStore, BUSINESSES } from '../store/loyaltyStore';

export default function HistoryScreen() {
  const { state, dispatch } = useStore();
  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => dispatch({ type: 'BACK' })}><Text style={s.back}>← Back</Text></TouchableOpacity>
        <Text style={s.title}>Stamp History</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {state.history.map(h => {
          const biz = BUSINESSES.find(b => b.id === h.bizId);
          return (
            <View key={h.id} style={s.row}>
              <View style={[s.dot, { backgroundColor: h.type === 'redeem' ? '#F59E0B' : '#7C3AED' }]}>
                <Text style={{ fontSize: 14 }}>{h.type === 'redeem' ? '🏆' : biz?.stampEmoji || '⭐'}</Text>
              </View>
              <View style={s.info}>
                <Text style={s.name}>{biz?.name || 'Unknown'}</Text>
                <Text style={s.note}>{h.note}</Text>
              </View>
              <Text style={s.date}>{h.date}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  back: { fontSize: 15, color: '#7C3AED', fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '800', color: '#111827' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#F3F4F6' },
  dot: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: '#111827' },
  note: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  date: { fontSize: 11, color: '#9CA3AF' },
});
