import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useStore, BUSINESSES } from '../store/loyaltyStore';

const P = '#7C3AED';

export default function HomeScreen() {
  const { state, dispatch } = useStore();
  const totalStamps = Object.values(state.stamps).reduce((a, b) => a + b, 0);
  const readyToRedeem = BUSINESSES.filter(b => state.stamps[b.id] >= b.stampsNeeded);

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <View>
          <Text style={s.logo}>🎫 Loyalty</Text>
          <Text style={s.sub}>Your digital stamp cards</Text>
        </View>
        <TouchableOpacity style={s.histBtn} onPress={() => dispatch({ type: 'GO_HISTORY' })}>
          <Text style={s.histText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Stats bar */}
        <View style={s.statsRow}>
          {[
            { label: 'Cards', value: BUSINESSES.length },
            { label: 'Stamps', value: totalStamps },
            { label: 'Ready', value: readyToRedeem.length, highlight: true },
          ].map(stat => (
            <View key={stat.label} style={[s.statCard, stat.highlight && { backgroundColor: P }]}>
              <Text style={[s.statVal, stat.highlight && { color: '#fff' }]}>{stat.value}</Text>
              <Text style={[s.statLabel, stat.highlight && { color: 'rgba(255,255,255,0.8)' }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Ready to redeem banner */}
        {readyToRedeem.length > 0 && (
          <TouchableOpacity style={s.redeemBanner} onPress={() => dispatch({ type: 'VIEW_CARD', bizId: readyToRedeem[0].id })}>
            <Text style={s.redeemBannerEmoji}>🎉</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.redeemBannerTitle}>Reward ready at {readyToRedeem[0].name}!</Text>
              <Text style={s.redeemBannerSub}>Tap to claim: {readyToRedeem[0].reward}</Text>
            </View>
            <Text style={s.redeemBannerArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Scan button */}
        <TouchableOpacity style={s.scanBtn} onPress={() => dispatch({ type: 'GO_SCAN' })} activeOpacity={0.88}>
          <Text style={s.scanIcon}>📷</Text>
          <Text style={s.scanText}>Scan QR to Earn a Stamp</Text>
        </TouchableOpacity>

        {/* Card list */}
        <Text style={s.sectionTitle}>Your Cards</Text>
        {BUSINESSES.map(biz => {
          const stamps = state.stamps[biz.id] || 0;
          const pct = stamps / biz.stampsNeeded;
          const ready = stamps >= biz.stampsNeeded;
          return (
            <TouchableOpacity key={biz.id} style={[s.card, ready && { borderColor: biz.accent }]}
              onPress={() => dispatch({ type: 'VIEW_CARD', bizId: biz.id })} activeOpacity={0.88}>
              <View style={[s.cardLeft, { backgroundColor: biz.color }]}>
                <Text style={{ fontSize: 32 }}>{biz.emoji}</Text>
              </View>
              <View style={s.cardInfo}>
                <View style={s.cardTitleRow}>
                  <Text style={s.cardName}>{biz.name}</Text>
                  {ready && <View style={[s.readyBadge, { backgroundColor: biz.accent }]}><Text style={s.readyText}>READY</Text></View>}
                </View>
                <Text style={s.cardCat}>{biz.category}</Text>
                {/* Progress bar */}
                <View style={s.progressBg}>
                  <View style={[s.progressFill, { width: `${pct * 100}%`, backgroundColor: biz.accent }]} />
                </View>
                <Text style={[s.stampCount, { color: biz.accent }]}>{stamps}/{biz.stampsNeeded} stamps</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* alphinium-loyalty callout */}
        <View style={s.addonCard}>
          <Text style={s.addonTitle}>⚡ alphinium-loyalty addon</Text>
          <Text style={s.addonText}>Add digital stamp cards to any alphinium app. Businesses manage their card config in the admin dashboard. Zero code needed.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  logo: { fontSize: 22, fontWeight: '900', color: P },
  sub: { fontSize: 12, color: '#9CA3AF' },
  histBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  histText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  statVal: { fontSize: 26, fontWeight: '900', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  redeemBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#7C3AED', borderRadius: 14, padding: 16 },
  redeemBannerEmoji: { fontSize: 28 },
  redeemBannerTitle: { color: '#fff', fontWeight: '700', fontSize: 14 },
  redeemBannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  redeemBannerArrow: { color: '#fff', fontSize: 20, fontWeight: '700' },
  scanBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#111827', borderRadius: 14, padding: 18 },
  scanIcon: { fontSize: 22 },
  scanText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', borderWidth: 2, borderColor: '#F3F4F6' },
  cardLeft: { width: 72, alignItems: 'center', justifyContent: 'center', padding: 12 },
  cardInfo: { flex: 1, padding: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardName: { fontSize: 15, fontWeight: '800', color: '#111827', flex: 1 },
  readyBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  readyText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  cardCat: { fontSize: 12, color: '#9CA3AF', marginBottom: 10 },
  progressBg: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: 6, borderRadius: 3 },
  stampCount: { fontSize: 12, fontWeight: '700' },
  addonCard: { backgroundColor: '#EDE9FE', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#C4B5FD' },
  addonTitle: { fontSize: 14, fontWeight: '800', color: P, marginBottom: 6 },
  addonText: { fontSize: 13, color: '#5B21B6', lineHeight: 20 },
});
