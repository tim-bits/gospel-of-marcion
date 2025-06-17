import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


import {
  SWITCH_TO_SEARCH_COMPONENT,
  clearSelectedVerses,
  consoleLog,
  fireEvent,
  getDimensionsProportion,
  getMatchingVerses,
  getRomanNumber,
  getZahn,
  setYScrollPosition,
  setYScrollPositionByVerse,
  storage
} from "@/app/util/SectionHolder";


import Ionicons from "react-native-vector-icons/Ionicons";

import { useFocusEffect, useTheme } from '@react-navigation/native';

import { FlashList, useBlankAreaTracker } from "@shopify/flash-list";

import { NonThemedStyles, ThemedStyles } from '@/app/css/styles';

import VerseInterface from '@/app/components/VerseInterface';



const Search = ({ route }) => {

  const theme = useTheme();
  const { dark } = theme;

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const searchTextRef = useRef(null);
  const flatListRef = useRef(null);

  const blankAreaTrackerRef = useRef();
  const [blankAreaTrackerResult, onBlankArea] = useBlankAreaTracker(blankAreaTrackerRef)

  const [sections, setSections] = useState<(string | VerseInterface)[]>([]);
  const [extraData, setExtraData] = useState<any>();
  const [searchWords, setSearchWords] = useState<string[]>();
  const [zahnChecked, setZahnChecked] = useState<boolean>(getZahn());
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [noAphaNum, setNoAphaNum] = useState<boolean>(false);

  const [colorTheme, setColorTheme] = useState<string>(dark ? 'dark' : 'light');
  consoleLog('dark!!', dark, colorTheme, new Date())
  if (colorTheme !== (dark ? 'dark' : 'light')) {
    const r = async () => {
      consoleLog('r()')
      setColorTheme(dark ? 'dark' : 'light')
      setTimeout(() => setExtraData({}), 1)
    };
    r();
  }


  const onChangeText = (text: string) => {
    consoleLog('onChangeText', text)
    setSubmitted(false)
    searchTextRef?.current?.value = text;
    if (text && text.trim().length > 0) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
    consoleLog('val:', searchTextRef?.current?.value);
  }

  const onChange = (e) => {
    consoleLog(e)
    consoleLog('val:', e);
  }


  useEffect(() => {
    return () => {
      consoleLog('useEffect in Search: [] unmount Search []')
      consoleLog('onBlankArea', blankAreaTrackerResult)
    };

  }, []
  );

  useEffect(
    () => {
      consoleLog('useEffect in Search: loading', route, sections.length, zahnChecked)
    }, [loading]
  );



  useFocusEffect(
    useCallback(
      () => {
        consoleLog("useFocusEffect in Search []     !!!", storage.getNumber('drawDistance'))
        clearSelectedVerses()
        cleanup()

        return () => {
          consoleLog(`useFocusEffect in Search []: searchTextRef.current.value = ''`)
          cleanup()
          setSections([]);
        }

      }
      , []),

  )


  const cleanup = () => {
    consoleLog('cleanup')
    searchTextRef?.current?.value = ''
    searchTextRef?.current?.clear()
    setIsButtonDisabled(true)
    setSubmitted(false)
    setTimeout(() => searchTextRef?.current?.focus(), 10)
  }


  const Verse = useCallback(({ item }: { item: VerseInterface }) => {

    if (!item.omitedByZahn || zahnChecked) {

      const highlightStyle0 = item.omitedByZahn ? ThemedStyles[colorTheme].textZahnSearchPnl :
        ThemedStyles[colorTheme].textSearchPnl

      return <View style={NonThemedStyles.searchVerse}>

        <TouchableOpacity onPress={() => {
          consoleLog('setYScrollPositionByVerse', setYScrollPositionByVerse, setYScrollPosition)
          setYScrollPositionByVerse(item);
          item.animated = true
          fireEvent(SWITCH_TO_SEARCH_COMPONENT, item);
        }}
          style={{ ...ThemedStyles[colorTheme].verseToCopy }}>

          <View style={NonThemedStyles.sectionColumnView}>
            <Text style={item.omitedByZahn ? ThemedStyles[colorTheme].verseNumberZahn : ThemedStyles[colorTheme].verseNumber}>{getRomanNumber(item.sectionId + 1)}{''}</Text>
          </View>
          <View style={NonThemedStyles.verseColumnView}>
            <Text style={item.omitedByZahn ? ThemedStyles[colorTheme].verseNumberZahn : ThemedStyles[colorTheme].verseNumber}>{item.id}{''}</Text>
          </View>


          <Text style={highlightStyle0}>
            {verseTextRenderer(item)}
          </Text>

        </TouchableOpacity>
      </View>
    }
  })

  const verseTextRenderer = useCallback(
    (item: VerseInterface): React.JSX.Element[] => {
      const highlightStyle0 = item.omitedByZahn ? ThemedStyles[colorTheme].textZahnSearchPnl :
        ThemedStyles[colorTheme].textSearchPnl

      const jsxArr: React.JSX.Element[] = [];

      const text = item.text;

      let startingIndex = 0;
      for (let arr of item.indices) {
        if (arr[0] > startingIndex) {
          jsxArr.push(<Text key={arr[0]}>{text.substring(startingIndex, arr[0])}</Text>)
          jsxArr.push(<Text key={arr[1]} style={NonThemedStyles.highlight}>{text.substring(arr[0], arr[1])}</Text>)
        }
        else if (arr[0] === startingIndex) {
          jsxArr.push(<Text key={arr[1]} style={NonThemedStyles.highlight}>{text.substring(arr[0], arr[1])}</Text>)
        }
        startingIndex = arr[1];

      }
      if (startingIndex < text.length) {
        jsxArr.push(<Text key={'s'} style={highlightStyle0}>{text.substring(startingIndex)}</Text>)
      }

      return jsxArr;
    })


  const renderItem =
    ({ item }: { item: VerseInterface }) => {
      return <Verse item={item} />;
    }


  const TableHeader = () => (
    // <Verse item= {{id:'Sec', verse:'Verse', text:'Text'}}/>

    <View style={ThemedStyles[colorTheme].searchResultsHeader}>

      <View style={{ ...NonThemedStyles.sectionColumnView, alignItems: 'center', marginTop: 0 }}>
        <Text style={ThemedStyles[colorTheme].searchResultsText}>{' Sec'}</Text>
      </View>
      <View style={{
        ...NonThemedStyles.verseColumnView
      }}>
        <Text style={{
          ...ThemedStyles[colorTheme].searchResultsText,
          paddingLeft: 0
        }}>{'Verse'}</Text>
      </View>
      <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
        <Text style={ThemedStyles[colorTheme].searchResultsText}>{'Text'}</Text>
      </View>

    </View>
  );


  const submit = () => {
    consoleLog('submit/getMatchingVerses >>>>>', searchTextRef?.current?.value, zahnChecked)
    const string = searchTextRef.current?.value;
    // if (searchTextRef.current?.value && searchTextRef.current?.value.trim().length > 0) {
    if (string && string.trim().length > 0) {
      setZahnChecked(getZahn());

      const searchWordsPreliminary: [] = [];

      if(/[a-z0-9]/i.test(string)) {
         setNoAphaNum(false)
      // }

      string.trim().replace(/"[^"]*"|'[^']*'|[^"\s]+/g, function (match: string) {
        // searchWordsPreliminary.push(match.replace(/"/g, '').replace(/'/g, '').replace(/\\/g, ''));
        // const word =  match.replace(/[\\\/\]\[]/g, '').trim();
        const word:string =  match.replace(/[^a-zA-Z0-9]/g, '').trim();
        if (word.length > 0) {
          searchWordsPreliminary.push(word);
        }
        // str.replace(/[\\\/]/g, '');

      });
      consoleLog('searchWordsPreliminary', searchWordsPreliminary);

      removeDuplicates(searchWordsPreliminary)
      setSearchWords(searchWordsPreliminary);
    } else {
      setNoAphaNum(true)
    }

      if (searchWordsPreliminary.length > 0) {
        const matchingVerses = getMatchingVerses(searchWordsPreliminary)
        setSections(matchingVerses)
      } else {
        setSections([])
      }
    }
    setLoading(false)
  }

  function removeDuplicates(arr: []) {
    for (let i = arr.length - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (arr[i] === arr[j]) {
          arr.splice(j, 1);
        }
      }
    }
  }

  const _submit = () => {
    setSubmitted(true)
    setLoading(true);
    setTimeout(submit)
  }


  const keyExtractor = useCallback((item: any, i: number) => `${i}-${item.id}`, []);

  const getEstimatedItemSize = (): number => { return Dimensions.get('window').width < Dimensions.get('window').height ? 72 : 56 }//24//30//48

  // const notFoundText = `No verses found for your search criteria: ${searchTextRef?.current?.value}`;
  const text = noAphaNum? "Search criteria must have at least one alpha numberic character" : `No verses found for your search criteria: ${searchTextRef?.current?.value}`


  return <SafeAreaView style={{ ...NonThemedStyles.flashListSafeAreaView, ...ThemedStyles[colorTheme].view }}>
    <StatusBar barStyle={colorTheme === 'dark' ? 'light-content' : 'dark-content'} />
    <View style={{
      paddingBottom: 5 * getDimensionsProportion(), paddingTop: 5 * getDimensionsProportion(),
      ...NonThemedStyles.containingView, ...ThemedStyles[colorTheme].topBarview,
      alignItems: 'center', alignContent: 'center',
      minHeight: NonThemedStyles.searchIconSize.size + 4
    }} >
      <TouchableOpacity onPress={() => {
        consoleLog('back >>>>>')
        fireEvent(SWITCH_TO_SEARCH_COMPONENT, false);
      }

      } style={{
        marginLeft: 10 * getDimensionsProportion(),
        width: 60 * getDimensionsProportion(),
        ...ThemedStyles[colorTheme].text
      }}>

        <View style={NonThemedStyles.searchIconSize.backBtn}>
          <Ionicons name="chevron-back-outline" size={NonThemedStyles.searchIconSize.size}
            style={ThemedStyles[colorTheme].colorAndBg} />
          {/* <Ionicons name="chevron-back-outline" style={ThemedStyles[colorTheme].icon}/> */}
        </View>

      </TouchableOpacity>
      <View style={{
        ...ThemedStyles[colorTheme].view,
        marginRight: 15 * getDimensionsProportion(),
        alignSelf: "center",
        alignContent: "center",
        borderColor: colorTheme === 'light' ? 'black' : 'white', borderWidth: 1,
        flex: 1
      }}>
        <TextInput ref={searchTextRef}
          onChangeText={onChangeText}
          onChange={onChange}
          onSubmitEditing={_submit}
          returnKeyType="send"
          autoFocus={true}
          disableFullscreenUI={true}
          style={ThemedStyles[colorTheme].textInput}
        ></TextInput>
      </View>

      <TouchableOpacity onPress={() => {
        setSections([])
        cleanup()
      }} style={{ width: 60 * getDimensionsProportion(), zIndex: 1, ...ThemedStyles[colorTheme].text }} disabled={isButtonDisabled}>

        <View style={{ ...NonThemedStyles.backBtn, paddingLeft: 10 * getDimensionsProportion() }}>
          <Ionicons name="close-circle-outline" size={NonThemedStyles.searchIconSize.size} style={{ ...ThemedStyles[colorTheme].icon, opacity: isButtonDisabled ? 0.5 : 1 }} />
        </View>


      </TouchableOpacity >

      <TouchableOpacity onPress={_submit}
        style={{ width: 60 * getDimensionsProportion(), zIndex: 1, ...ThemedStyles[colorTheme].text }} disabled={isButtonDisabled}>

        <View style={{ ...NonThemedStyles.searchIconSize.backBtn, paddingLeft: 15 * getDimensionsProportion() }}>
          <Ionicons name="search-outline" size={NonThemedStyles.searchIconSize.size}
            style={{ ...ThemedStyles[colorTheme].icon, opacity: isButtonDisabled ? 0.5 : 1 }} />

        </View>

      </TouchableOpacity >

    </View>


    {!submitted && sections.length == 0 &&
      <View style={{
        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
        alignSelf: 'center',
        ...ThemedStyles[colorTheme].view
      }}>
        <Text style={{
          flex: 1, textAlign: 'center', alignSelf: 'center',
          ...ThemedStyles[colorTheme].text
        }}>
          Use quotes to search for exact phrase e.g. "Son of man", 'Kingdom of God' etc
        </Text>
      </View>
    }

    {submitted && sections.length == 0 &&
      searchTextRef?.current?.value?.trim().length > 0 &&

      <View style={{
        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
        alignSelf: 'center',
        ...ThemedStyles[colorTheme].view
      }}>
        <Text style={{
          flex: 1, alignItems: 'flex-start', textAlign: 'center',
          ...ThemedStyles[colorTheme].text
        }}>
         {/* noAphaNum? Search criteria must contain alpha numberic characters : No verses found for your search criteria: {searchTextRef?.current?.value} */}
         {text}
        </Text>
      </View>
    }


    {submitted && sections.length > 0 &&
      <TableHeader />
    }


    {sections.length > 0 && <FlashList
      ref={flatListRef}
      keyExtractor={keyExtractor}
      data={sections}
      renderItem={renderItem}
      getItemType={(item, index) => {
        return 'row'
      }}
      estimatedItemSize={getEstimatedItemSize()}
      extraData={extraData}
      bounces={true}
      drawDistance={1800}
      onLoad={({ elapsedTimeInMs }) => {
        consoleLog("onLoad", elapsedTimeInMs);
      }}

      estimatedListSize={{ height: Dimensions.get('window').height / 1.1, width: Dimensions.get('window').width / 1.1 }}
      onBlankArea={onBlankArea}
    />
    }

    {loading &&
      <View style={{ ...NonThemedStyles.loading, backgroundColor: colorTheme === 'light' ? '#F5FCFF88' : '#1f202298', }}>
        <ActivityIndicator size='large' />
      </View>
    }


  </SafeAreaView>

}


export default Search;