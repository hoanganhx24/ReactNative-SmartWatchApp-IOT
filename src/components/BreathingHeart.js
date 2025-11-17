// components/BreathingHeart.js
import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';

export const BreathingHeart = ({ size = 32, color = '#ef4444' }) => {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Text style={{ fontSize: size * 0.9, color }}>Heart</Text>
    </Animated.View>
  );
};