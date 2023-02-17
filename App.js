import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import SliderOriginal from './src/components/SliderOriginal';
import SliderOne from './src/components/SliderOne';
import SliderTwo from './src/components/SliderTwo';
import SliderThree from './src/components/SliderThree';
import SliderFour from './src/components/SliderFour';

function App() {
  return (
    <GestureHandlerRootView style={styles.bg}>
      <View style={styles.container}>
        <SliderOriginal
          scentName={'Vetiver'}
          scentColor={'brown'}
          initialFanPower={0}
          sliderContainerHeight={100}
          sliderToggleHeight={16}
          sliderBorderRadius={4}
        />
      </View>
      <View style={styles.container}>
        <SliderOne
          scentName={'Vetiver'}
          scentColor={'brown'}
          initialFanPower={0}
          sliderContainerHeight={100}
          sliderToggleHeight={16}
          sliderBorderRadius={4}
        />
        <SliderTwo
          scentName={'Musk'}
          scentColor={'pink'}
          initialFanPower={0}
          sliderContainerHeight={100}
          sliderToggleHeight={25}
          sliderBorderRadius={4}
        />
        <SliderThree
          scentName={'Lilac'}
          scentColor={'purple'}
          initialFanPower={0}
          sliderContainerHeight={100}
          sliderToggleHeight={16}
          sliderBorderRadius={4}
        />
        {/* <SliderFour
          scentName={'Neroli'}
          scentColor={'red'}
          initialFanPower={0}
          sliderContainerHeight={100}
          sliderToggleHeight={16}
          sliderBorderRadius={4}
        /> */}
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

export default App;
