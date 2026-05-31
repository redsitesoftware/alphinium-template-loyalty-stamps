import React, { useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { useStore, BUSINESSES } from '../store/loyaltyStore';

export default function CardScreen() {
  const { state, dispatch } = useStore();
  const biz = BUSINESSES.find(b => b.id === state.selectedBusiness);
  const stamps = state.stamps[biz?.id] || 0;
  const ready = stamps >= (biz?.stampsNeeded || 10);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  if (!biz) return null;

  const handleRedeem = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => dispatch({ type: 'REDEEM', bizId: biz.id }));
  };

  return (
    <SafeAreaView style={[s.root, { backgroundColor: biz.color + '12' }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => dispatch({ type: 'BACK' })}>
          <Text style={s.back}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.scanBtn} onPress={() => dispatch({ type: 'GO_SCAN' })}>
          <Text style={s.scanText}>📷 Scan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Business header */}
        <View style={[s.bizHeader, { backgroundColor: biz.color }]}>
          <Text style={s.bizEmoji}>{biz.emoji}</Text>
          <Text style={s.bizName}>{biz.name}</Text>
          <Text style={s.bizCat}>{biz.category}</Text>
          <View style={s.bizStats}>
            <Text style={s.bizStatText}>{biz.totalCustomers.toLocaleString()} members</Text>
            <Text style={s.bizStatDot}>·</Text>
            <Text style={s.bizStatText}>{biz.redemptions.toLocaleString()} rewards given</Text>
          </View>
        </View>

        {/* Stamp card grid */}
        <View style={[s.stampCard, ready && { borderColor: biz.accent, borderWidth: 3 }]}>
          <Text style={s.stampCardTitle}>
            {ready ? '🎉 Reward ready to claim!' : `${biz.stampsNeeded - stamps} more stamps to go!`}
          </Text>
          <View style={s.grid}>
            {Array.from({ length: biz.stampsNeeded }).map((_, i) => {
              const filled = i < stamps;
              return (
                <View key={i} style={[s.stamp, filled && { backgroundColor: biz.color }, ready && filled && { backgroundColor: biz.accent }]}>
                  <Text style={{ fontSize: filled ? 18 : 14, opacity: filled ? 1 : 0.3 }}>
                    {filled ? biz.stampEmoji : '○'}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={[s.stampProgress, { color: biz.accent }]}>{stamps} of {biz.stampsNeeded} stamps collected</Text>
        </View>

        {/* Reward info */}
        <View style={s.rewardBox}>
          <Text style={s.rewardLabel}>🏆 Your Reward</Text>
          <Text style={s.rewardValue}>{biz.reward}</Text>
        </View>

        {/* Redeem button */}
        {ready && (
          <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
            <TouchableOpacity style={[s.redeemBtn, { backgroundColor: biz.accent }]} onPress={handleRedeem} activeOpacity={0.88}>
              <Text style={s.redeemBtnText}>🎉 Claim Reward at {biz.name}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {!ready && (
          <TouchableOpacity style={s.earnBtn} onPress={() => dispatch({ type: 'GO_SCAN' })}>
            <Text style={s.earnBtnText}>📷 Scan to Earn Stamp</Text>
          </TouchableOpacity>
        )}

        {/* How it works */}
        <View style={s.howBox}>
          <Text style={s.howTitle}>How it works</Text>
          {[
            `Visit ${biz.name} and make a purchase`,
            'Ask staff to scan your loyalty QR code',
            `Collect ${biz.stampsNeeded} stamps`,
            `Claim: ${biz.reward}`,
          ].map((step, i) => (
            <View key={i} style={s.howRow}>
              <View style={[s.howNum, { backgroundColor: biz.color }]}><Text style={s.howNumText}>{i + 1}</Text></View>
              <Text style={s.howText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'rgba(255,255,255,0.9)' },
  back: { fontSize: 15, color: '#7C3AED', fontWeight: '600' },
  scanBtn: { backgroundColor: '#111827', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  scanText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  bizHeader: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  bizEmoji: { fontSize: 56, marginBottom: 8 },
  bizName: { fontSize: 22, fontWeight: '900', color: '#fff', textAlign: 'center' },
  bizCat: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  bizStats: { flexDirection: 'row', gap: 8, marginTop: 10 },
  bizStatText: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  bizStatDot: { color: 'rgba(255,255,255,0.5)' },
  stampCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  stampCardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 14 },
  stamp: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  stampProgress: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  rewardBox: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  rewardLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  rewardValue: { fontSize: 16, fontWeight: '800', color: '#111827' },
  redeemBtn: { borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 12 },
  redeemBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  earnBtn: { backgroundColor: '#111827', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 12 },
  earnBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  howBox: { backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  howTitle: { fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 12 },
  howRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  howNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  howNumText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  howText: { fontSize: 14, color: '#374151', flex: 1 },
});
