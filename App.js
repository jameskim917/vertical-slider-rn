import React, {useMemo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const Slider = () => {
  const sliderContainerHeight = 200;
  const sliderToggleHeight = 40;

  const sliderSteps = useMemo(() => {
    return {
      0: 0,
      // 1: sliderContainerHeight * 0.125,
      1: (sliderContainerHeight - sliderToggleHeight) * 0.25, // 40
      // 3: sliderContainerHeight * 0.375,
      2: sliderContainerHeight * 0.5 - sliderToggleHeight / 2, // 80
      // 5: sliderContainerHeight * 0.625,
      3: (sliderContainerHeight - sliderToggleHeight) * 0.75, // 120
      // 7: sliderContainerHeight * 0.875,
      4: sliderContainerHeight - sliderToggleHeight, // 160
    };
  }, [sliderContainerHeight]);
  // sliderSteps key
  // 0 -  1  - 2 -  3  - 4 -  5  - 6 -  7  - 8
  // sliderSteps limits
  // 0 - 0.5 - 1 - 1.5 - 2 - 2.5 - 3 - 3.5 - 4
  // sliderContainerHeight
  // 0 - 25 - 50 - 75 - 100 - 125 - 150 - 175 - 200
  // 200 / 8 = 25
  // stepVal = 25
  // ex) offset = 12, 12 <= 25 ? use that key val for

  // const gestureEndOffsetY = useSharedValue(0);

  // const calcSliderStep = offsetY => {
  //   // compare offset to sliderSteps values
  //   for (const [k, v] of Object.entries(sliderSteps)) {
  //     if (offsetY <= v) {
  //       console.log('This is the step', k, v);
  //       gestureEndOffsetY.value = v;
  //     }
  //   }
  //   return;
  // };

  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {
          translateY: withTiming(offset.value.y, {
            duration: 0,
            easing: Easing.inOut,
          }),
        },
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
      console.log(e.translationY + start.value.y);

      const toggleOffsetY = e.translationY + start.value.y;
      const maxLimit = (sliderContainerHeight - sliderToggleHeight) * -1;

      if (toggleOffsetY > 0) {
        offset.value = {
          x: 0,
          y: 0,
        };
      } else if (toggleOffsetY < maxLimit) {
        offset.value = {
          x: 0,
          y: maxLimit,
        };
      } else {
        offset.value = {
          x: 0,
          y: toggleOffsetY,
        };
      }
    })
    .onEnd(e => {})
    .onFinalize(e => {
      const finalOffsetY = (e.translationY + start.value.y) * -1; // convert to positive number
      console.log(finalOffsetY);
      // calculate which sliderStep to move to
      // compare offset to sliderSteps values
      let gestureEndOffsetY;
      if (finalOffsetY > sliderContainerHeight - sliderToggleHeight) {
        gestureEndOffsetY = sliderContainerHeight - sliderToggleHeight;
      }
      for (const [k, v] of Object.entries(sliderSteps)) {
        if (finalOffsetY < v) {
          console.log('This is the step', k, v);
          // compare current to next, if next exists
          const lowDiff = finalOffsetY - sliderSteps[k - 1];
          const highDiff = v - finalOffsetY;

          const stepToGoTo = lowDiff <= highDiff ? sliderSteps[k - 1] : v;

          gestureEndOffsetY = stepToGoTo;
          break;
        } else if (finalOffsetY === v) {
          gestureEndOffsetY = v;
          break;
        }
      }
      offset.value = {
        x: 0,
        y: gestureEndOffsetY * -1,
      };
      start.value = {
        x: 0,
        y: offset.value.y,
      };
      isPressed.value = false;
    });

  return (
    <Animated.View
      style={[styles.sliderContainer, {height: sliderContainerHeight}]}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.sliderToggle,
            {height: sliderToggleHeight},
            animatedStyles,
          ]}
        />
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
    width: 50,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
  sliderToggle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    width: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
});

export default App;
