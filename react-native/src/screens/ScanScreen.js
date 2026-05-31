import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { useStore, BUSINESSES } from '../store/loyaltyStore';

export default function ScanScreen() {
  const { state, dispatch } = useStore();
  const [scannedBiz, setScannedBiz] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const simulateScan = () => {
    // Pick a random business that isn't full yet
    const notFull = BUSINESSES.filter(b => (state.stamps[b.id] || 0) < b.stampsNeeded);
    const biz = notFull[Math.floor(Math.random() * notFull.length)] || BUSINESSES[0];
    setScannedBiz(biz);

    Animated.spring(successScale, { toValue: 1, useNativeDriver: true, friction: 6 }).start();

    setTimeout(() => {
      dispatch({ type: 'SCAN_SUCCESS', bizId: biz.id });
    }, 1800);
  };

  if (state.scanSuccess) {
    const biz = BUSINESSES.find(b => b.id === state.selectedBusiness) || scannedBiz || BUSINESSES[0];
    return (
      <SafeAreaView style={s.root}>
        <View style={s.successContainer}>
          <Animated.View style={[s.successCircle, { transform: [{ scale: successScale }], backgroundColor: biz?.color || '#7C3AED' }]}>
            <Text style={s.successEmoji}>{biz?.stampEmoji || '⭐'}</Text>
          </Animated.View>
          <Text style={s.successTitle}>Stamp Added!</Text>
          <Text style={s.successSub}>{biz?.name}</Text>
          <Text style={s.successCount}>{state.stamps[biz?.id] || 0} / {biz?.stampsNeeded} stamps</Text>
          <TouchableOpacity style={s.doneBtn} onPress={() => dispatch({ type: 'BACK' })}>
            <Text style={s.doneBtnText}>Done →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => dispatch({ type: 'BACK' })}>
          <Text style={s.back}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={s.scanArea}>
        {/* Simulated camera viewfinder */}
        <Animated.View style={[s.viewfinder, { transform: [{ scale: pulseAnim }] }]}>
          <View style={[s.corner, s.topLeft]} />
          <View style={[s.corner, s.topRight]} />
          <View style={[s.corner, s.bottomLeft]} />
          <View style={[s.corner, s.bottomRight]} />
          <Text style={s.qrEmoji}>📱</Text>
          <Text style={s.qrLabel}>Point at business QR code</Text>
        </Animated.View>

        <Text style={s.scanInstructions}>
          Ask the cashier to show you their loyalty QR code, then tap below to scan
        </Text>

        <TouchableOpacity style={s.simulateBtn} onPress={simulateScan} activeOpacity={0.88}>
          <Text style={s.simulateBtnText}>📷 Simulate Scan</Text>
        </TouchableOpacity>

        <Text style={s.demoNote}>Demo: tap above to simulate scanning a real QR code</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  back: { color: '#A78BFA', fontSize: 15, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  scanArea: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  viewfinder: {
    width: 240, height: 240, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 32,
  },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: '#7C3AED', borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },
  qrEmoji: { fontSize: 64 },
  qrLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 8 },
  scanInstructions: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  simulateBtn: { backgroundColor: '#7C3AED', borderRadius: 14, paddingHorizontal: 32, paddingVertical: 16 },
  simulateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  demoNote: { color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 16, textAlign: 'center' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  successCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  successEmoji: { fontSize: 56 },
  successTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
  successSub: { fontSize: 16, color: 'rgba(255,255,255,0.7)' },
  successCount: { fontSize: 14, color: '#A78BFA', fontWeight: '700' },
  doneBtn: { backgroundColor: '#7C3AED', borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14, marginTop: 8 },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
