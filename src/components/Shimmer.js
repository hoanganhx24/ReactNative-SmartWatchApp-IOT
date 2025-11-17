// components/Shimmer.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export const Shimmer = ({ width = 100, height = 20 }) => {
  const translateX = useRef(new Animated.Value(-width)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, { toValue: width, duration: 1200, useNativeDriver: true })
    ).start();
  }, []);
  return (
    <View style={[styles.shimmer, { width, height }]}>
      <Animated.View style={[styles.shine, { transform: [{ translateX }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  shimmer: { backgroundColor: '#e2e8f0', overflow: 'hidden', borderRadius: 8 },
  shine: { width: '50%', height: '100%', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 8 },
});