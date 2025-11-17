// components/RippleButton.js
import React, { useRef } from 'react';
import { TouchableWithoutFeedback, View, Animated, StyleSheet } from 'react-native';

export const RippleButton = ({ children, onPress, style }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    scale.setValue(0); opacity.setValue(1);
    Animated.parallel([
      Animated.timing(scale, { toValue: 4, duration: 600, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
    onPress?.();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, style]}>
        {children}
        <Animated.View style={[styles.ripple, { transform: [{ scale }], opacity }]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden', position: 'relative' },
  ripple: {
    position: 'absolute', width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(14, 165, 233, 0.3)', left: '50%', top: '50%',
    marginLeft: -25, marginTop: -25,
  },
});