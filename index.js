import React, { Component } from 'react';
import { Text, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { svgPathProperties } from 'svg-path-properties';
import { Ripple } from './src/rn-components/container';

const easing = Easing.inOut(Easing.circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const _boxBorder = `
  M4 4
  L146 4
  L146 146
  L4 146
  L4 0
`;

const boxBorder = `
  M4 4
  L146 4
  L146 146
  L4 146
  L4 0
`;

const border = `
  M30 80
  L45 60
  L65 80
  L102.5 30
  L122.5 50
  L67 120
  L27 77
`;

const fill = `
  M37.5 67
  L77.5 110
  L67.5 100
  L112.5 40
`;

const boxBorderLength = Math.ceil(svgPathProperties(boxBorder).getTotalLength());
const borderLength = Math.ceil(svgPathProperties(border).getTotalLength());
const fillLength = Math.ceil(svgPathProperties(fill).getTotalLength());

export default class extends Component {
  constructor(props) {
    super(props);

    this.boxBorderAnim = new Animated.Value(props.value === true ? 0 : boxBorderLength);
    this.borderAnim = new Animated.Value(props.value === true ? 0 : borderLength);
    this.fillAnim = new Animated.Value(props.value === true ? 0 : fillLength);
  }

  render() {
    const { size = 30, label, style, color = '#414141' } = this.props;

    return (
      <Ripple
        divider
        onPressIn={this.onPressIn}
        onPress={this.onPress}
        onPressOut={this.onPressOut}
        style={[style, styles.container]}
      >
        <Svg height={size} width={size} viewBox='0 0 150 150' >
          <Path
            ref={ref => this.ref = ref}
            d={_boxBorder}
            stroke='#CECECE'
            strokeWidth={8}
            fill='none'
          />
          <AnimatedPath
            ref={ref => this.ref = ref}
            d={boxBorder}
            stroke={color}
            strokeWidth={8}
            strokeDasharray={[boxBorderLength, boxBorderLength]}
            strokeDashoffset={this.boxBorderAnim}
            fill='none'
          />
          <AnimatedPath
            ref={ref => this.ref = ref}
            d={border}
            stroke={color}
            strokeWidth={8}
            strokeDasharray={[borderLength, borderLength]}
            strokeDashoffset={this.borderAnim}
            fill='none'
          />
          <AnimatedPath
            ref={ref => this.ref2 = ref}
            d={fill}
            stroke={color}
            strokeWidth={25}
            strokeDasharray={[fillLength, fillLength]}
            strokeDashoffset={this.fillAnim}
            fill='none'
          />
        </Svg>
        {label
          ? <Text style={styles.text}>{label}</Text>
          : null}
      </Ripple>
    );
  }

  onPressIn = () => {
    if (this.props.value) {
      Animated.timing(this.fillAnim, {
        toValue: fillLength,
        useNativeDriver: true,
        easing
      }).start();
    }
    else {
      Animated.parallel([
        Animated.timing(this.boxBorderAnim, {
          toValue: 0,
          useNativeDriver: true,
          easing
        }),
        Animated.timing(this.borderAnim, {
          toValue: 0,
          useNativeDriver: true,
          easing
        })
      ]).start();
    }
  }

  onPress = () => {
    this.props.onValueChange && this.props.onValueChange(!this.props.value);
  }

  onPressOut = () => {
    if (this.props.value) {
      Animated.timing(this.fillAnim, {
        toValue: 0,
        useNativeDriver: true,
        easing
      }).start();
    }
    else {
      Animated.parallel([
        Animated.timing(this.boxBorderAnim, {
          toValue: boxBorderLength,
          useNativeDriver: true,
          easing
        }),
        Animated.timing(this.borderAnim, {
          toValue: borderLength,
          useNativeDriver: true,
          easing
        })
      ]).start();
    }
  }

  componentWillUpdate(nextProps) {
    Animated.parallel([
      Animated.timing(this.boxBorderAnim, {
        toValue: nextProps.value ? 0 : boxBorderLength,
        useNativeDriver: true,
        easing
      }),
      Animated.timing(this.borderAnim, {
        toValue: nextProps.value ? 0 : borderLength,
        useNativeDriver: true,
        easing
      }),
      Animated.timing(this.fillAnim, {
        toValue: nextProps.value ? 0 : fillLength,
        useNativeDriver: true,
        easing
      })
    ]).start();
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginLeft: 8,
    marginRight: 8
  }
});
