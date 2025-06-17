//https://stackoverflow.com/questions/39117599/how-to-slide-view-in-and-out-from-the-bottom-in-react-native

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions
} from 'react-native';

import { useTheme } from '@react-navigation/native';

import {
  consoleLog,
  getAllSelectedVersesArray
} from "@/app/util/SectionHolder";

import { ThemedStyles } from '../css/styles';


const DEFAULT_HEIGHT = 0

function useAnimatedBottom(show: boolean, height: number = DEFAULT_HEIGHT/*, {route}*/) {
  const animatedValue = React.useRef(new Animated.Value(show ? 0 : 1))
  consoleLog('anim:init', animatedValue.current)

  const listener = useRef<string>(animatedValue.current.addListener((event) => (
    consoleLog("anim:addListeners event ", event.value, listener.current, Date.now()
    ))));

  const bottom = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, 0],
  })




  useEffect(
    () => {
      consoleLog("anim:useEffect in useAnimatedBottom", animatedValue.current, listener.current, getAllSelectedVersesArray().length)//, animatedValue1.current, animatedValue2.current)
      return () => {
        animatedValue.current.removeAllListeners()
        consoleLog('anim:componentWillUnmount');
      }
    }, []

  )

  React.useEffect(() => {
    consoleLog("anim: original useEffect in useAnimatedBottom",
      show, animatedValue.current, listener.current, getAllSelectedVersesArray().length)//, animatedValue1.current, animatedValue2.current)

    consoleLog('anim:show: >>>>>', show)
    if (typeof show === 'boolean') {


      if (show) {

        consoleLog('anim:show:true start animatedValue.current', animatedValue.current)
        animatedValue.current.setValue(0)
        Animated.timing(animatedValue.current, {
          toValue: 1,
          duration: 350,
          // Accelerate then decelerate - https://cubic-bezier.com/#.28,0,.63,1
          easing: Easing.bezier(0.28, 0, 0.63, 1),
          useNativeDriver: false, // 'bottom' is not supported by native animated module
        }).start(() => {
          consoleLog('anim:show:true end animatedValue.current', animatedValue.current)
        })
      } else {
        consoleLog('anim:show:false start animatedValue.current', animatedValue.current)
        animatedValue.current.setValue(1)
        Animated.timing(animatedValue.current, {
          toValue: 0,
          duration: 500,
          // Accelerate - https://easings.net/#easeInCubic
          // easing: Easing.cubic,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          consoleLog('anim:show:false end animatedValue.current', animatedValue.current)
        })
      }
    } else {
      animatedValue.current.stopAnimation();
    }
  }
    , [show]
  )

  return bottom
}

interface Props {
  children: React.ReactNode
  show: boolean | number
  height?: number
  onOuterClick?: () => void
}

export function BottomSheet({
  children,
  show,
  height = DEFAULT_HEIGHT,
  onOuterClick,
}: Props) {


  const { dark } = useTheme();
  const [colorTheme, setColorTheme] = useState<string>(dark ? 'dark' : 'light');

  const bottom = useAnimatedBottom(show, height)

  return (
    <>
      <Animated.View style={[styles.bottomSheet, ThemedStyles[colorTheme].topBarview, { height, bottom }]}>
        {children}
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
})