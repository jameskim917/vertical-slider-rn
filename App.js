import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const Slider = () => {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {translateY: withSpring(offset.value.y)},
      ],
      backgroundColor: isPressed.value ? '#f2f2f2' : '#fff',
    };
  });

  const start = useSharedValue({x: 0, y: 0});

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(e => {
      offset.value = {
        x: 0,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: 0,
        y: offset.value.y,
      };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return (
    <Animated.View style={styles.sliderContainer}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.sliderToggle, animatedStyles]} />
      </GestureDetector>
    </Animated.View>
  );
};

function App() {
  return (
    <GestureHandlerRootView style={styles.bg}>
      <View style={styles.container}>
        <Slider />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  container: {
    height: 300,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 25,
  },
  sliderContainer: {
    // flex: 1,
    height: 200,
    width: 50,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
  sliderToggle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    height: 20,
    width: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
});

export default App;
