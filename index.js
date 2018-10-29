import React, { Component, PureComponent } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import invariant from 'fbjs/lib/invariant';
import Svg, { Path } from 'react-native-svg';
import Ripple from 'react-native-ripple';
// import { svgPathProperties } from 'svg-path-properties';

import { IText } from '.';

const easing = Easing.out(Easing.circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const _boxBorderPath = `
  M4 4
  L146 4
  L146 146
  L4 146
  L4 0
`;
const boxBorderPath = `
  M4 4
  L146 4
  L146 146
  L4 146
  L4 0
`;
const borderPath = `
  M30 80
  L45 60
  L65 80
  L102.5 30
  L122.5 50
  L67 120
  L27 77
`;
const fillPath = `
  M37.5 67
  L77.5 110
  L67.5 100
  L112.5 40
`;

/* const boxBorderLength = Math.ceil(svgPathProperties(boxBorderPath).getTotalLength());
const borderLength = Math.ceil(svgPathProperties(borderPath).getTotalLength());
const fillLength = Math.ceil(svgPathProperties(fillPath).getTotalLength()); */

const boxBorderLength = 572;
const borderLength = 293;
const fillLength = 148;

/* eslint-disable max-len */
/**
 *
 * @augments {Component<{value: boolean, onValueChange: Function, size: number, rippleSize: number, rippleColor: string, color: string, borderColor: string, end: boolean, border: boolean, borderAnimation: boolean, style: number, contentContainerStyle: number}>}
 *
 */
export class WithCheckbox extends Component {
  static propTypes = {
    value: PropTypes.bool,
    onValueChange: PropTypes.func,
    size: PropTypes.number,
    rippleSize: PropTypes.number,
    rippleColor: PropTypes.string,
    color: PropTypes.string,
    borderColor: PropTypes.string,
    end: PropTypes.bool,
    border: PropTypes.bool,
    borderAnimation: PropTypes.bool,
    style: PropTypes.any,
    contentContainerStyle: PropTypes.any
  };

  constructor(props) {
    super(props);

    const { input, value } = props;
    const initialValue = (input && input.value) || value;

    invariant((
      input
      && input.value !== null
      && input.value !== undefined
    ) || (
      value !== null
      && value !== undefined
    ),
    'value is a mandatory prop for ICheckbox!');

    this.anim = new Animated.Value(initialValue ? 0 : 1);
    this.fillAnim = new Animated.Value(initialValue ? 0 : 1);
  }

  render() {
    const {
      size = 30,
      rippleSize,
      rippleColor,
      color = '#414141',
      borderColor = '#CECECE',
      end,
      border = false,
      borderAnimation = true,
      style,
      contentContainerStyle,
      children
    } = this.props;

    const borderAnim = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, borderLength]
    });

    const boxBorderAnim = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, boxBorderLength]
    });

    const fillAnim = this.fillAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, fillLength]
    });

    return (
      <Ripple
        rippleSize={rippleSize}
        color={rippleColor}
        onPressIn={this.onPressIn}
        onPress={this.onPress}
        onPressOut={this.onPressOut}
        wrapperStyle={contentContainerStyle}
        style={[style, styles.container]}
      >
        {!end ? children : null}
        <Svg height={size} width={size} viewBox='0 0 150 150' >
          {border
            ?
            <Path
              d={_boxBorderPath}
              stroke={borderColor}
              strokeWidth={8}
              fill='none'
            />
            :
            null}
          {border && borderAnimation
            ?
            <AnimatedPath
              d={boxBorderPath}
              stroke={color}
              strokeWidth={8}
              strokeDasharray={[boxBorderLength, boxBorderLength]}
              strokeDashoffset={boxBorderAnim}
              fill='none'
            />
            :
            null}
          <AnimatedPath
            d={borderPath}
            stroke={color}
            strokeWidth={8}
            strokeDasharray={[borderLength, borderLength]}
            strokeDashoffset={borderAnim}
            fill='none'
          />
          <AnimatedPath
            d={fillPath}
            stroke={color}
            strokeWidth={25}
            strokeDasharray={[fillLength, fillLength]}
            strokeDashoffset={fillAnim}
            fill='none'
          />
        </Svg>
        {end ? children : null}
      </Ripple>
    );
  }

  onPressIn = () => {
    const { input, value } = this.props;

    if ((input && input.value) || value) {
      Animated.timing(this.fillAnim, {
        toValue: 1,
        useNativeDriver: true,
        easing
      }).start();
    }
    else {
      Animated.timing(this.anim, {
        toValue: 0,
        useNativeDriver: true,
        easing
      }).start();
    }
  };

  onPress = () => {
    const { input, value, onValueChange } = this.props;
 
    if (input) {
      input.onChange(!input.value);
      onValueChange && onValueChange(!input.value);
    }
    else {
      onValueChange && onValueChange(!value);
    }
  };

  onPressOut = () => {
    const { input, value } = this.props;

    if ((input && input.value) || value) {
      Animated.timing(this.fillAnim, {
        toValue: 0,
        useNativeDriver: true,
        easing
      }).start();
    }
    else {
      Animated.timing(this.anim, {
        toValue: 1,
        useNativeDriver: true,
        easing
      }).start();
    }
  };

  componentWillUpdate(nextProps) {
    const nextValue = (nextProps.input && nextProps.input.value) || nextProps.value;

    Animated.parallel([
      Animated.timing(this.anim, {
        toValue: nextValue ? 0 : 1,
        useNativeDriver: true,
        easing
      }),
      Animated.timing(this.fillAnim, {
        toValue: nextValue ? 0 : 1,
        useNativeDriver: true,
        easing
      })
    ]).start();
  }
}

/* eslint-disable max-len */
/**
 *
 * @augments {PureComponent<{label: string, labelStyle: number, value: boolean, onValueChange: Function, size: number, rippleSize: number, rippleColor: string, color: string, borderColor: string, end: boolean, border: boolean, borderAnimation: boolean, style: number, contentContainerStyle: number}>}
 *
 */
export default class extends PureComponent {
  render() {
    const { label, labelStyle, ...rest } = this.props;

    return (
      <WithCheckbox border={true} {...rest}>
        {label ? <IText divider style={[styles.label, labelStyle]}>{label}</IText> : null}
      </WithCheckbox>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  label: {
    marginLeft: 8,
    marginRight: 8
  }
});