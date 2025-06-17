import { FlashList, ViewToken } from "@shopify/flash-list";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Animated,
  Button,
  Dimensions,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


import {
  clearSelectedVerses,
  consoleLog,
  consoleLogEnabled,
  fireEvent,
  getDimensionsProportion,
  getRomanNumber,
  getSection, getSectionCount,
  getStickyHeader,
  getUserSelectedSectionId,
  getYScrollPosition,
  getZahn,
  isBigScreen,
  isDev,
  isNewArchEnabled,
  isPortrait,
  isTablet,
  setUserSelectedSectionId,
  setYScrollPosition,
  STICKY_HEADER,
  storage,
  SWITCH_TO_SEARCH_COMPONENT,
  ZAHN
} from "@/app/util/SectionHolder";


import SettingsButton from '@/app/components/SettingsButton';

import { useFocusEffect, useTheme } from '@react-navigation/native';

import { EventRegister } from 'react-native-event-listeners';

import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import Ionicons from "react-native-vector-icons/Ionicons";

import VerseInterface from '@/app/components/VerseInterface';

import BottomSheetPnl from '@/app/components/BottomSheetPnl';

import { NonThemedStyles, ThemedStyles } from '../css/styles';


const FlashListSection = ({ route: { params } }) => {

  const { dark } = useTheme();

  const [colorTheme, setColorTheme] = useState<string>(dark ? 'dark' : 'light');

  const backgroundColorRef = useRef(new Animated.Value(0)).current;


  const [iniitialColor, setInitialColor] = useState<string>('transparent');
  const backgroundColorStyle = backgroundColorRef.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colorTheme === 'light' ? '#90EE90' : "#840700",
      ThemedStyles[colorTheme].view.backgroundColor],
  });



  const [extraData, setExtraData] = useState<string>(null);
  const searchVerseRef = useRef(params)
  let searchVerse1 = params ? true : false

  const [searchVerse, setSearchVerse] = useState<VerseInterface>(params);
  const [sections, setSections] = useState<(string | VerseInterface)[]>([]);

  const [sectionId, setSectionId] = useState<Number>(getUserSelectedSectionId() ?? 0);

  consoleLog('route scroll to', params, searchVerse1, searchVerse, searchVerseRef, params?.sectionId, sectionId, extraData)

  if (!params && searchVerseRef?.current ||
    params && !searchVerseRef?.current
    || params?.sectionId !== searchVerseRef?.current?.sectionId) {
    consoleLog('ref vs params:', params?.sectionId, searchVerseRef?.current?.sectionId)
    searchVerseRef.current = params;
    if (params) {
      setSectionId(params?.sectionId)
    }
  }



  const [zahnChecked, setZahnChecked] = useState<boolean>(getZahn());

  const [elapsedTimeInMs, setElapsedTimeInMs] = useState<number>();
  const [flashListVisible, setFlashListVisible] = useState<boolean>(true);
  const [sectionViaButtonNav, setSectionViaButtonNav] = useState<boolean>(false);

  // const [sections, setSections] = useState<(string | VerseInterface)[]>([]);
  const [stickyHeaderFlag, setStickyHeaderFlag] = useState<boolean>(false);


  const flatListRef = useRef(null);
  const scrollYPositionRef = useRef<ViewToken>();

  const panRef = useRef();
  const [active, setActive] = useState(false);

  const layoutRef = useRef(Dimensions.get('window'));


  consoleLog('FlashListSection:dark!!', dark, colorTheme, new Date())

  if (colorTheme !== (dark ? 'dark' : 'light')) {
    setStickyHeaderFlag(false)

    const r = async () => {
      consoleLog('r()')
      setColorTheme(dark ? 'dark' : 'light')
      if (getStickyHeader()) {
        setTimeout(() => setStickyHeaderFlag(true), 100)
      }
      setExtraData({})
    };
    r();
    setTimeout(() => hideShow(-1));
  }




  useEffect(() => {
    consoleLog("useEffect in FlashListSection: sectionId", sectionId, zahnChecked)

    hideShow(-1)

    let json: (string | VerseInterface)[] = getSection(sectionId);

    setSections(json);

    consoleLog('sectionId', sectionId)

    setStickyHeaderFlag(false)

    return () => {
      clearSelectedVerses();

    };
  }, [sectionId]
  );

  useEffect(() => {
    consoleLog("useEffect in FlashListSection: sections, initialScroll", /*getShouldScroll(),*/ sections.length)
    if (getStickyHeader()) {
      setStickyHeaderFlag(true)
    }
  }, [sections]
  );



  useEffect(() => {
    consoleLog("useEffect in FlashListSection: setExtraData", setExtraData, new Date())
    setFlatList(setExtraData)
    return () => {
      () => consoleLog('FL Unmount')
    };

  }, []
  );

  useEffect(() => {
    consoleLog("useEffect in FlashListSection 222222: elapsedTimeInMs, initialScroll", elapsedTimeInMs, /*getShouldScroll(), */ new Date())
    setTimeout(initialScroll, 200);
    return () => { };
  }, [elapsedTimeInMs]
  );


  useFocusEffect(
    useCallback(
      () => {

        const secId = getUserSelectedSectionId()

        consoleLog('useFocusEffect in FlashListSection: SectionId:', secId, sectionId, searchVerseRef.current, params)

        if (secId !== undefined /**<--- must use underfined since 0 is perceived as false */ && secId !== sectionId) {

          hideShow(-1)

          setSectionId(secId)
          consoleLog('scroll to item?', searchVerse1, searchVerse, searchVerseRef.current)
        }
        if (searchVerseRef.current) {
          consoleLog('scroll to item', searchVerse1, searchVerseRef.current)
          setTimeout(initialScroll, 100);
          searchVerseRef.current = null;
        }

      }
      , []),
  )


  useEffect(
    () => {
      consoleLog("useEffect in FL[] start")
      zahnListener.current = EventRegister.addEventListener(ZAHN, handleEvent);
      stickyHeaderFlagListener.current = EventRegister.addEventListener(STICKY_HEADER, stickyHeaderFlagEvent);

      return () => {
        if (!isDev()) {
          EventRegister.removeAllListeners()
        }
        consoleLog('useEffect in FL[] end', searchVerse, searchVerse1)
      }

    }, []
  )

  const zahnListener = useRef();
  const handleEvent = (themeOrZahnOrSectionId) => {
    consoleLog(`Received event! in CFL: ${themeOrZahnOrSectionId}`, /*themeListener,*/ zahnListener);

    setZahnChecked(themeOrZahnOrSectionId);
    setExtraData({})
  };

  const stickyHeaderFlagListener = useRef<boolean>(null);
  const stickyHeaderFlagEvent = (stickyHeaderFlag: boolean) => {
    consoleLog(`stickyHeaderFlagEvent event! in CFL: ${stickyHeaderFlag}`, /*themeListener,*/ stickyHeaderFlagListener);
    setStickyHeaderFlag(stickyHeaderFlag);
  };


  const initialScroll = async () => {

    const data = flatListRef.current?.state?.data;

    consoleLog('FlashListSection: [==============initialScroll=============]',
      flatListRef.current?.state?.data, flatListRef.current?.state?.data[0],
      flatListRef.current?.state?.data[1].sectionId);
    if (data?.length > 0) {

      const secId = getUserSelectedSectionId();
      const index: number = getYScrollPosition(secId);
      consoleLog('FlashListSection: [==============initialScroll=============]', secId, index);

      const indexVal = data.length > index ? index : data.length;
      flatListRef?.current?.scrollToIndex({
        index: indexVal,
        viewPosition: 1,
        animated: true,
        viewOffset: indexVal > 8 ? -400 * getDimensionsProportion() : 0
      })
    }
  }

  const { setFlatList, hideShow, RenderBottomSheet, FlashMessage } = BottomSheetPnl(colorTheme);

  const stickyHeaderIndices = stickyHeaderFlag ? sections
    .map((item, index) => {
      if (typeof item === "string") {
        return index;
      } else {
        return null;
      }
    })
    .filter((item) => item !== null) as number[]
    :
    undefined
    ;


  const onHandlerStateChange = (event) => {
    const { velocityX, velocityY, translationX, state } = event.nativeEvent;

    consoleLog('onHandlerStateChange', event.nativeEvent, new Date());
    consoleLog(velocityX, velocityY, translationX, state)
    if (Math.abs(velocityY) < Math.abs(velocityX)) {
      if (event.nativeEvent.state === 5) { // 2 indicates the gesture is ended
        if (Math.abs(velocityX) > 1000) {
          if (translationX > 0) {
            consoleLog('Swiped right');
            loadPreviousSection()
          } else if (translationX < 0) {
            consoleLog('Swiped left');
            loadNextSection()
          }
        }
      }
    }
  };


  const Verse =
    ({ item }: { item: VerseInterface }) => {

      const [animated, setAnimated] = useState<boolean>(false);

      useFocusEffect(() => {
        consoleLog('useFocusEffect in AnimatedVerse', item.id, backgroundColorRef)
        if (item.animated) {
          setAnimated(true)
          backgroundColorRef.setValue(0)
          consoleLog('useFocusEffect in AnimatedVerse 1', item.animated)
          // setInitialColor(colorTheme === 'light' ? '#90EE90' : "#840700");
          Animated.timing(backgroundColorRef, { 
            delay:1,
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
            easing: Easing.exp,
          }).start(() => {
            // setTimeout(() => {
              delete item.animated
            // }, 200);
            consoleLog('Animated fe', item)
          });
        }

        return () => {
          setAnimated(false);
        }
      }

        //, []
      );


      const [selected, setSelected] = useState(false);

      if (!item.omitedByZahn || zahnChecked) {

        return <Animated.View style={StyleSheet.flatten({
          ...ThemedStyles[colorTheme].verseToCopy,
          backgroundColor: animated ? backgroundColorStyle : ThemedStyles[colorTheme].view.backgroundColor,
          // backgroundColor: item.animated ? backgroundColorStyle : ThemedStyles[colorTheme].view.backgroundColor,
          // backgroundColor:  backgroundColorStyle,
          borderWidth: selected ? 1 : 0,
        })}>

          <TouchableOpacity onPress={() => {
            const sel = !selected;
            setSelected(sel)
            item.selected = sel;
            hideShow(sel)
          }}
            style={{ ...ThemedStyles[colorTheme].verseToCopy, width: isPortrait() ? '97%' : '99%' }}>

            <Text style={item.omitedByZahn ? ThemedStyles[colorTheme].verseNumberZahn : ThemedStyles[colorTheme].verseNumber}>{item.id}{' '}</Text>
            <Text style={item.omitedByZahn ? ThemedStyles[colorTheme].textZahnSearchPnl : ThemedStyles[colorTheme].textSearchPnl}>{item.text}</Text>

          </TouchableOpacity>
        </Animated.View>
      }
    }

  const ChapterHeader = ({ title }) => {
    return <View style={NonThemedStyles.chapter}>
      <TouchableOpacity>
        <Text style={{
          ...ThemedStyles[colorTheme].sectionTitle,
          // width: layoutRef.current.width/1.4
          width: '85%'
        }}>{title}</Text>
      </TouchableOpacity>
    </View>
  }

  const scrollToBottom = () => {
    consoleLog("scrollToEnd");
    flatListRef?.current?.scrollToEnd({
      animated: true,
    });
  }

  const scrollToTop = () => {
    consoleLog("scrollToTop");
    flatListRef?.current?.scrollToIndex({
      index: 0,
      viewPosition: 0,
      animated: true,
    });
  }


  const loadNextSection = () => {
    loadSection('forward');
  }

  const loadPreviousSection = () => {
    loadSection('backward');
  }

  const loadSection = (direction) => {
    let sectID;
    if (direction === 'forward') {
      if (sectionId < getSectionCount() - 1) {
        sectID = sectionId + 1;
      } else {
        sectID = 0;
      }

    } else {
      if (sectionId > 0) {
        sectID = sectionId - 1;
      } else {
        sectID = getSectionCount() - 1;
      }
    }
    setSectionViaButtonNav(true)
    setSectionId(sectID);
    (async () => setUserSelectedSectionId(sectID))();
  }

  const renderItem =
    ({ item }) => {
      if (typeof item === "string") {
        return <ChapterHeader title={item} />
      }

      return <Verse item={item} />;
    }

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    scrollYPositionRef.current = changed[changed.length - 1];
    consoleLog('scrollYPositionRef.current', scrollYPositionRef.current);
  }, []);

  const searchTextRef = useRef(null);
  const onChangeText = (text: string) => {
    consoleLog('onChangeText', text)
    searchTextRef?.current?.value = text;
    storage.set("drawDistance", Number(text));
    consoleLog('val:', searchTextRef?.current?.value);
  }

  return (
    sections.length > 0 &&

    <GestureHandlerRootView >
      <SafeAreaView style={{ ...NonThemedStyles.flashListSafeAreaView, ...ThemedStyles[colorTheme].view }}>
        <StatusBar barStyle={colorTheme === 'dark' ? 'light-content' : 'dark-content'} />

        <View style={{ ...NonThemedStyles.containingView, ...ThemedStyles[colorTheme].topBarview, marginBottom: 10 * getDimensionsProportion() }}>
          <SettingsButton colorTheme={colorTheme} />

          <View style={{
            flex: 1, flexDirection: 'row', alignItems: "center",
            justifyContent: 'flex-start', alignContent: 'center', ...ThemedStyles[colorTheme].view
          }}>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", ...ThemedStyles[colorTheme].topBarview }}>

              <TouchableOpacity onPress={() => {
                consoleLog('<<<<< setFirstTimeAccess')
                loadPreviousSection()
              }} style={{ maxHeight: 46 * getDimensionsProportion(), width: 100 * getDimensionsProportion(), ...ThemedStyles[colorTheme].text }}>
                <View style={{ ...ThemedStyles[colorTheme].navSectionButton, ...ThemedStyles[colorTheme].topBarview }}>
                  <Ionicons name="arrow-back-circle-outline" style={ThemedStyles[colorTheme].icon}
                  />
                </View>
              </TouchableOpacity >


              <Text style={{
                textAlign: 'center', fontSize: 30 * getDimensionsProportion(),
                fontWeight: 'bold', marginLeft: 30 * getDimensionsProportion(), marginRight: 30 * getDimensionsProportion(),
                width: 230 * getDimensionsProportion(),
                ...ThemedStyles[colorTheme].sectionHeader
              }}>Section  {getRomanNumber(sectionId + 1)}</Text>


              <TouchableOpacity onPress={() => {
                consoleLog('setFirstTimeAccess >>>>>')
                loadNextSection()
              }} style={{ width: 100 * getDimensionsProportion(), zIndex: 1, ...ThemedStyles[colorTheme].text }}>
                <View style={{ ...ThemedStyles[colorTheme].navSectionButton, ...ThemedStyles[colorTheme].topBarview }}>
                  <Ionicons name="arrow-forward-circle-outline" style={ThemedStyles[colorTheme].icon} />
                </View>
              </TouchableOpacity >

              <TouchableOpacity onPress={() => {
                consoleLog('search >>>>>')
                fireEvent(SWITCH_TO_SEARCH_COMPONENT, true);
                //send event instead
              }} style={{ ...ThemedStyles[colorTheme].text, ...ThemedStyles[colorTheme].topBarview }}>

                <View style={{ ...ThemedStyles[colorTheme].navSectionButton, ...ThemedStyles[colorTheme].topBarview }}>
                  <Ionicons name="search" style={{ ...ThemedStyles[colorTheme].icon, paddingLeft: 100 * getDimensionsProportion() }} />
                </View>
              </TouchableOpacity >

            </View>

          </View>

        </View>


        <PanGestureHandler ref={panRef} onActivated={() => {
          setActive(true);
        }}
          onEnded={() => {
            setActive(false);
          }}
          // https://stackoverflow.com/questions/71325340/react-native-reanimated-2-conflict-flatlist-and-pangesturehandler
          failOffsetY={[-5, 5]}
          activeOffsetX={[-5, 5]}

          // onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}>

          <View style={{ flex: 1 }}>


            {flashListVisible && <FlashList

              //https://github.com/software-mansion/react-native-gesture-handler/issues/2175
              overrideProps={{
                simultaneousHandlers: panRef,
              }}

              ref={flatListRef}



              data={sections}
              renderItem={renderItem}
              stickyHeaderIndices={stickyHeaderIndices}
              invertStickyHeaders={true}
              getItemType={(item, index) => {
                return typeof item === "string" ? "sectionHeader" : "row";
              }}

              estimatedItemSize={Dimensions.get('window').width < Dimensions.get('window').height ? 72 : 56}
              extraData={extraData}
              onLoad={({ elapsedTimeInMs }) => {
                consoleLog("onLoad()", elapsedTimeInMs);
              }}

              onScrollEndDrag={
                (e) => {
                  consoleLog('onScrollEndDrag', /*e.pendingProps.return.stateNode.getNativeScrollRef(),*/ e.nativeEvent, e.nativeEvent.contentOffset.y)
                  setYScrollPosition([sectionId, scrollYPositionRef.current?.index]);
                }
              }
              onViewableItemsChanged={_onViewableItemsChanged}
              bounces={false}

              onLayout={(e) => {
                consoleLog('onLayout()', e.nativeEvent.layout, layoutRef.current, Dimensions.get('window'))
                if (layoutRef.current) {
                  consoleLog('layout ref:', layoutRef.current)
                  if (layoutRef.current.width !== e.nativeEvent.layout.width && layoutRef.current.height !== e.nativeEvent.layout.height) {
                    consoleLog('onLayout(): flashListVisible = false')
                  }
                }
                layoutRef.current = e.nativeEvent.layout;
              }
              }
            />
            }

          </View>

        </PanGestureHandler>

        {isDev() &&
          <View style={{
            flexDirection: 'row', backgroundColor: active ? 'blue' : null,
            borderWidth: isNewArchEnabled() ? 0 : 1,
            borderColor: isNewArchEnabled() ? 'green' : 'red',
            width: layoutRef.current.width / 2
          }}>

            <Button onPress={scrollToTop} title="Scroll To Top"  ></Button>
            <Button onPress={scrollToBottom} title="Scroll To End"></Button>
            <Text style={ThemedStyles[colorTheme].verseNumber}>{isTablet() ? 'tablet ' : 'phone '}</Text>
            <Text style={ThemedStyles[colorTheme].verseNumber}>{isBigScreen() ? 'big ' : 'small '}</Text>
            <Text style={ThemedStyles[colorTheme].verseNumber}>{isPortrait() ? 'portrait ' : 'landscape '}</Text>
            <Text style={ThemedStyles[colorTheme].verseNumber}>{isDev() ? 'DEV ' : 'PROD '}</Text>
            <Text style={ThemedStyles[colorTheme].verseNumber}>{consoleLogEnabled ? 'consoleLogEnabled ' : 'consoleLogDisabled '}</Text>
          </View>}

        <FlashMessage />
        <RenderBottomSheet />

      </SafeAreaView>
    </GestureHandlerRootView>
  );
};


export default FlashListSection;