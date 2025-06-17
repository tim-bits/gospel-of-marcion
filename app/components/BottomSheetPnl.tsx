import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


import {
  consoleLog, getAllSelectedVerses,
  getAllSelectedVersesArray
} from "@/app/util/SectionHolder";

import Ionicons from "react-native-vector-icons/Ionicons";

import { NonThemedStyles, ThemedStyles } from '@/app/css/styles';

import { Alert, Share } from 'react-native';

import { BottomSheet } from '@/app/components/BottomSheet';



const BottomSheetPnl = (colorTheme: string) => {
  consoleLog('!!  BottomSheetPnl.colorTheme: ', colorTheme, NonThemedStyles.bottomSheetTouchable
  )

  const [isMessageVisible, setIsMessageVisible] = useState(false);


  const [showBottomSheet, setShowBottomSheet] = useState<boolean | number>(999)


  const fadeAnim = useRef(new Animated.Value(0));


  const listener = useRef<string>(fadeAnim.current.addListener((event) => (
    consoleLog("fadeAnim:addListeners event ", event.value, listener.current, Date.now()
    ))));

  const flatListRef = useRef<any>(null);

  useEffect(
    () => {
      consoleLog("useEffect in BottomSheetPnl")
    }, []

  )

  useEffect(
    () => {
      consoleLog("useEffect in BottomSheetPnl ||")
    }
  )


  const setFlatList = (flatListRefExt: any) => {
    consoleLog('flatListRefExt', flatListRefExt)
    flatListRef.current = flatListRefExt;
  }

  const hideShow = (status: number | boolean) => {
    consoleLog('anim:hideShow >>>>', getAllSelectedVersesArray().length, showBottomSheet, status)
    if (typeof status === 'boolean') {
      if (getAllSelectedVersesArray().length > 0) {
        setShowBottomSheet(true)
      } else {
        setShowBottomSheet(false)
      }
    } else {
      consoleLog('anim:hideShow: ', status)
      setShowBottomSheet(status)
    }
  }

  const RenderBottomSheet = () => (<BottomSheet show={showBottomSheet} height={NonThemedStyles.bottomSheet.height} colorTheme={colorTheme}>
    <View style={styles.bottomSheetContent}>

      <TouchableOpacity onPress={() => {
        consoleLog('onPress copy')
        if (getAllSelectedVerses(true)) {
          setShowBottomSheet(false)

          flatListRef.current({});

          setIsMessageVisible(true);

          fadeAnim.current.setValue(0.9)
          Animated.timing(fadeAnim.current, {
            delay: 1000,
            toValue: 0, 
            duration: 1500, 
            useNativeDriver: true,
          }).start(() => {
            setIsMessageVisible(false); 
            fadeAnim.current.setValue(0)
            consoleLog("setIsMessageVisible(false)")
            hideShow(-1)
          });
        }
      }} style={{ ...NonThemedStyles.bottomSheetTouchable, ...ThemedStyles[colorTheme].topBarview }}>
        <View style={ThemedStyles[colorTheme].topBarview}>
          <Ionicons name="copy-outline" style={{ ...ThemedStyles[colorTheme].icon, ...ThemedStyles[colorTheme].topBarview }} />
        </View>

      </TouchableOpacity >

      <TouchableOpacity onPress={() => {
        const allSelectedVerses: string = getAllSelectedVerses(false);
        if (allSelectedVerses) {
          const onShare = async () => {
            try {
              const result = await Share.share({
                message:
                  allSelectedVerses,
              });
              if (result.action === Share.sharedAction) {
                if (result.activityType) {
                  consoleLog("share:result.activityType");
                } else {
                  consoleLog("share:shared");
                }
              } else if (result.action === Share.dismissedAction) {
                consoleLog("share:dismissed");
              }
            } catch (error: any) {
              Alert.alert(error.message);
            }

            setTimeout(() => { hideShow(-1); flatListRef.current({}); });
          }
          setTimeout(onShare);
        }
      }} style={{ ...NonThemedStyles.bottomSheetTouchable, ...ThemedStyles[colorTheme].topBarview }}>
        <View style={ThemedStyles[colorTheme].topBarview}>
          <Ionicons name="share-social-outline" style={{ ...ThemedStyles[colorTheme].icon, ...ThemedStyles[colorTheme].topBarview }} />
        </View>

      </TouchableOpacity >

    </View>
  </BottomSheet>)


  const FlashMessage = () => {
    return isMessageVisible && (
      <Animated.View style={{ opacity: fadeAnim.current, ...ThemedStyles[colorTheme].flashMessage }}>
        <Text style={{ ...ThemedStyles[colorTheme].text, paddingRight: 0 }}>Copied</Text>
      </Animated.View>
    )
  }

  return { setFlatList, hideShow, RenderBottomSheet, FlashMessage }
}

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
})


export default BottomSheetPnl