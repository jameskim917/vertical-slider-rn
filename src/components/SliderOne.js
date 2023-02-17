import React, {useMemo, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const SliderOne = ({
  scentName,
  scentColor,
  initialFanPower,
  sliderContainerHeight,
  sliderToggleHeight,
  sliderBorderRadius,
}) => {
  const sliderSteps = useMemo(() => {
    return {
      0: 0,
      1: (sliderContainerHeight - sliderToggleHeight) * (1 / 3),
      2: (sliderContainerHeight - sliderToggleHeight) * (2 / 3),
      3: sliderContainerHeight - sliderToggleHeight,
    };
  }, [sliderContainerHeight, sliderToggleHeight]);
  const numOfSliderSteps = 3;

  const [fanPower, setFanPower] = useState(initialFanPower);

  // const setFanPower = useMemo(
  //   val => {
  //     if (!fanPower && !val) {
  //       return 0;
  //     } else if (fanPower) {
  //       return fanPower;
  //     } else if (val) {
  //       return val;
  //     }
  //     return 0;
  //   },
  //   [fanPower],
  // );

  // animated values & styles
  const isPressed = useSharedValue(false);
  const isPressedOutside = useSharedValue(false);

  const start = useSharedValue({x: 0, y: 0});
  const offset = useSharedValue({x: 0, y: 0});

  const animatedStylesSliderToggle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {
          translateY: withTiming(offset.value.y, {
            duration: isPressed.value ? 0 : 500,
          }),
        },
      ],
      backgroundColor: isPressed.value ? '#f2f2f2' : '#fff',
    };
  });

  const animatedStylesSliderBg = useAnimatedStyle(() => {
    return {
      height: withTiming(offset.value.y * -1 + sliderBorderRadius, {
        duration: isPressed.value ? 0 : 500,
      }),
    };
  });

  const outsideGesture = Gesture.Pan()
    .onBegin(e => {
      const sliderToggleHalf = sliderToggleHeight / 2; // place to center of toggle
      isPressed.value = true;
      isPressedOutside.value = true;
      offset.value = {
        x: 0,
        y: e.y - sliderContainerHeight + sliderToggleHalf,
      };
      start.value = {
        x: 0,
        y: offset.value.y,
      };
    })
    .onUpdate(e => {
      console.log('toggleOffsetY value: ', e.translationY + start.value.y);
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
    .onFinalize(e => {
      const finalOffsetY = (e.translationY + start.value.y) * -1; // convert to positive number

      let gestureEndOffsetY;
      let fanPowerVal;
      // calculate which sliderStep value to move to

      // user drags toggle all the way beyond top
      if (finalOffsetY > sliderContainerHeight - sliderToggleHeight) {
        gestureEndOffsetY = sliderContainerHeight - sliderToggleHeight;
        fanPowerVal = numOfSliderSteps;
      }
      // compare finalOffsetY to sliderSteps values
      for (const [k, v] of Object.entries(sliderSteps)) {
        if (finalOffsetY < v) {
          console.log('This is the step', k, v);
          // compare finalOffsetY to values of low and high sliderSteps
          const lowDiff = finalOffsetY - sliderSteps[k - 1];
          const highDiff = v - finalOffsetY;

          const sliderStepOffsetY =
            lowDiff <= highDiff ? sliderSteps[k - 1] : v;

          fanPowerVal = lowDiff <= highDiff ? k - 1 : k;

          gestureEndOffsetY = sliderStepOffsetY;
          break;
        } else if (finalOffsetY === v) {
          gestureEndOffsetY = v;
          fanPowerVal = k;
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
      isPressedOutside.value = false;
    });

  // gesture config
  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
      // logic to set Pressed on & disabled pressing other fans in parent component
    })
    .onUpdate(e => {
      // if (!isPressedOutside.value) {
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
      // }
    })
    .onFinalize(e => {
      // if (!isPressedOutside.value) {
      console.log('finalized inside!!!');
      const finalOffsetY = (e.translationY + start.value.y) * -1; // convert to positive number

      let gestureEndOffsetY;
      let fanPowerVal;
      // calculate which sliderStep value to move to

      // user drags toggle all the way beyond top
      if (finalOffsetY > sliderContainerHeight - sliderToggleHeight) {
        gestureEndOffsetY = sliderContainerHeight - sliderToggleHeight;
        fanPowerVal = numOfSliderSteps;
      }
      // compare finalOffsetY to sliderSteps values
      for (const [k, v] of Object.entries(sliderSteps)) {
        if (finalOffsetY < v) {
          console.log('This is the step', k, v);
          // compare finalOffsetY to values of low and high sliderSteps
          const lowDiff = finalOffsetY - sliderSteps[k - 1];
          const highDiff = v - finalOffsetY;

          const sliderStepOffsetY =
            lowDiff <= highDiff ? sliderSteps[k - 1] : v;

          fanPowerVal = lowDiff <= highDiff ? k - 1 : k;

          gestureEndOffsetY = sliderStepOffsetY;
          break;
        } else if (finalOffsetY === v) {
          gestureEndOffsetY = v;
          fanPowerVal = k;
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
      runOnJS(setFanPower)(fanPowerVal); // setState needs to be run outside of native stack
      // }
    });

  // gesture config
  const outsideGestureB = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
      // logic to set Pressed on & disabled pressing other fans in parent component
    })
    .onUpdate(e => {
      // if (!isPressedOutside.value) {
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
      // }
    })
    .onFinalize(e => {
      // if (!isPressedOutside.value) {
      console.log('finalized outside!!!');
      const finalOffsetY = (e.translationY + start.value.y) * -1; // convert to positive number

      let gestureEndOffsetY;
      let fanPowerVal;
      // calculate which sliderStep value to move to

      // user drags toggle all the way beyond top
      if (finalOffsetY > sliderContainerHeight - sliderToggleHeight) {
        gestureEndOffsetY = sliderContainerHeight - sliderToggleHeight;
        fanPowerVal = numOfSliderSteps;
      }
      // compare finalOffsetY to sliderSteps values
      for (const [k, v] of Object.entries(sliderSteps)) {
        if (finalOffsetY < v) {
          console.log('This is the step', k, v);
          // compare finalOffsetY to values of low and high sliderSteps
          const lowDiff = finalOffsetY - sliderSteps[k - 1];
          const highDiff = v - finalOffsetY;

          const sliderStepOffsetY =
            lowDiff <= highDiff ? sliderSteps[k - 1] : v;

          fanPowerVal = lowDiff <= highDiff ? k - 1 : k;

          gestureEndOffsetY = sliderStepOffsetY;
          break;
        } else if (finalOffsetY === v) {
          gestureEndOffsetY = v;
          fanPowerVal = k;
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
      runOnJS(setFanPower)(fanPowerVal); // setState needs to be run outside of native stack
      // }
    });

  return (
    <GestureDetector gesture={outsideGestureB}>
      <Animated.View
        style={[styles.sliderContainer, {height: sliderContainerHeight}]}>
        {/* <GestureDetector gesture={gesture}> */}
        <Animated.View
          style={[
            styles.sliderToggle,
            {height: sliderToggleHeight},
            animatedStylesSliderToggle,
          ]}
        />
        {/* </GestureDetector> */}
        <Animated.View
          style={[
            styles.sliderColorBg,
            animatedStylesSliderBg,
            {backgroundColor: scentColor},
          ]}
        />
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            bottom: -38,
            width: 40,
          }}>
          <Text style={{fontFamily: 'Arial', fontSize: 10}}>{scentName}</Text>
          <Text style={{fontSize: 12}}>{fanPower}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  container: {
    height: 200,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 5,
  },
  sliderContainer: {
    // flex: 1,
    width: 40,
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
  },
  sliderToggle: {
    zIndex: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    width: 40,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  sliderColorBg: {
    zIndex: 1,
    position: 'absolute',
    width: 40,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    bottom: 0,
    left: 0,
  },
});

export default SliderOne;
