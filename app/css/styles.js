import {
  consoleLog, getDimensionsProportion, getDimensionsProportionText,
  isBigScreen, isPortrait, isTablet
} from '@/app/util/SectionHolder';
import { Dimensions, StyleSheet } from 'react-native';

const dimensionsProportion = getDimensionsProportion();
const dimensionsProprtionText = getDimensionsProportionText();
const bigScreen = isBigScreen();

export const NonThemedStyles =
  StyleSheet.create({
    drawerBg: {
      backgroundColor: '#36454F',
    },
    toggler: {
      flexDirection: 'row',
      alignItems: "center",
      paddingVertical: 5 * dimensionsProportion,
      backgroundColor: '#36454F'
    },
    togglerIconSize: {
      size: dimensionsProprtionText * 22
    },
    searchIconSize: {
      size: bigScreen ? 30 : 20
    },
    drawerIconSize: {
      size: dimensionsProprtionText * 20
    },
    bottomSheet: {
      height: isBigScreen() ? 60 * dimensionsProportion : 100 * dimensionsProportion,
    },
    bottomSheetTouchable: {
      width: 100,
      zIndex: 1,
      alignItems: 'center'
    },


    flashListSafeAreaView: {
      marginTop: isTablet() ? 25 : 23,
      flex: 1
    },
    containingView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: "center",
      maxHeight: 50 * dimensionsProportion,
    },
    backBtn: {
      flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      alignSelf: 'center', paddingLeft: 0, paddingRight: 0, paddingBottom: 0
    },

    chapter: { paddingBottom: 15 * dimensionsProportion },

    highlightViewStyle: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },

    sectionColumnView: {
      marginTop: 10 * dimensionsProportion, marginLeft: 5 * dimensionsProportion,
      marginRight: 20 * dimensionsProportion, justifyContent: 'center', flexDirection: 'row', minWidth: isTablet() ? 15 : 10
    },


    verseColumnView: { margin: 10 * dimensionsProportion, justifyContent: 'center', flexDirection: 'row', width: 80 * dimensionsProportion },

    searchVerse: {
      paddingBottom: 5, paddingLeft: 0,
      alignItems: "center",
      flex: 1, flexDirection: 'row', paddingRight: 35,
      width: isBigScreen() ? '88%' : isPortrait() ? '93%' : '97%'
    },
    highlight: {
      color: 'blue',
      backgroundColor: 'yellow'
    },

    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: "none",
    }
  })


const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafffe'
  },
  topBarview: {
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  icon: {
    color: '#11181C',
    fontSize: dimensionsProprtionText * 22,
  },
  sectionHeader: {
    color: '#11181C',
    fontSize: dimensionsProprtionText * 20,
  },
  view: {
    backgroundColor: '#fff',
  },
  text: {
    paddingRight: dimensionsProportion * 5,
    fontSize: dimensionsProprtionText * 18,
    color: '#11181C',
  },

  textInput: {
    fontSize: dimensionsProprtionText * 18,
    textAlign: 'left',
    marginRight: 30,
  },

  verseNumber: {
    fontWeight: "bold",
    color: 'purple',
    fontSize: dimensionsProprtionText * 12,
  },
  textZahn: {
    color: '#00008B',
    fontStyle: "italic",
    fontSize: dimensionsProprtionText * 18,
  },
  verseNumberZahn: {
    fontWeight: "bold",
    fontStyle: "italic",
    color: 'purple',
    fontSize: dimensionsProprtionText * 12
  },
  sectionTitle: {
    //to enable translucent bg in last param
    backgroundColor: 'rgba(162, 182, 182, 0.5)',
    fontSize: dimensionsProprtionText * 20,
    fontWeight: "bold",
    padding: dimensionsProportion * 10,
    margin: dimensionsProportion * 30,
    marginBottom: dimensionsProportion * 0,
    borderRadius: dimensionsProportion * 24,
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },
  drawer: {
    activeColor: 'rgba(118, 118, 118)',
    inactiveColor: 'black',
  },
  navSectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'white',
    // fontSize: 32
  },
  button: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 16,
    borderWidth: 2,
    borderColor: '#09446B',
    backgroundColor: '#09446B',

  },
  sectionButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: '#09446B',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#80F193',
    backgroundColor: '#80F193',
  },
  drawerStyle: {
    backgroundColor: '#F0F0F0',
  },
  drawerItem: {
    backgroundColor: '#F0F0F0',
    pressColor: '#bfffE0',
    activeTintColor: '#015856',
    activeColor: '#00AFB7',
    fontSize: dimensionsProprtionText * 18,
  },
  verseToCopy: {
    borderWidth: 0,
    borderColor: '#840700',
    borderRadius: 35,
    paddingBottom: dimensionsProportion * 5,
    paddingLeft: dimensionsProportion * 15,
    paddingRight: dimensionsProportion * 15,
    flexShrink: 1, flexDirection: 'row',
    borderStyle: 'dashed',
    fontSize: dimensionsProprtionText * 18,

  },
  highlight: {
    color: 'blue',
    backgroundColor: 'yellow'
  },
  colorAndBg: {
    color: 'black',
  },
  header: {
    backgroundColor: '#EDEADE',
  },
  textSearchPnl: {
    paddingRight: dimensionsProportion * 5,
    fontSize: dimensionsProprtionText * 18,
    color: '#11181C',
    paddingRight: 10

  },
  textZahnSearchPnl: {
    fontSize: dimensionsProprtionText * 18,
    color: '#00008B',
    fontStyle: "italic",
    paddingRight: 10
  },
  searchResultsHeader:
  {
    flexDirection: 'row',
    backgroundColor: '#E5E4E2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchResultsText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: isTablet() ? 14 : 10,
    color: 'black',
  },
  flashMessage: {
    backgroundColor: 'lightgrey',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
    height: dimensionsProportion * 40,
    bottom: 50,
    borderRadius: 24,
    width: dimensionsProportion * isBigScreen() ? 100 : 180,
  }
});


const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafffe'
  },
  topBarview: {
    justifyContent: 'center',
    backgroundColor: '#1C1C1C',
  },
  icon: {
    color: '#ECEDEE',
    fontSize: dimensionsProprtionText * 22,
  },
  sectionHeader: {
    color: '#ECEDEE',
    fontSize: dimensionsProprtionText * 20,
  },
  view: {
    backgroundColor: 'black',
  },
  text: {
    paddingRight: dimensionsProportion * 5,
    fontSize: dimensionsProprtionText * 18,
    color: '#ECEDEE',
  },
  textInput: {
    paddingRight: dimensionsProportion * 5,
    fontSize: dimensionsProprtionText * 18,
    alignContent: "center",
    textAlignVertical: 'center',
    color: 'white',
    backgroundColor: '#36454F',
  },
  verseNumber: {
    fontWeight: "bold",
    color: '#3CB3FF',
    fontSize: dimensionsProprtionText * 12,
  },
  textZahn: {
    fontSize: dimensionsProprtionText * 18,
    color: "#fd8",
    fontStyle: "italic",
  },
  verseNumberZahn: {
    fontWeight: "bold",
    fontStyle: "italic",
    color: '#3CB3FF',
    fontSize: dimensionsProprtionText * 12
  },
  sectionTitle: {
    color: 'moccasin',
    backgroundColor: 'rgba(0,0, 139, 0.5)',
    fontSize: dimensionsProprtionText * 20,
    fontWeight: "bold",
    padding: dimensionsProportion * 10,
    margin: dimensionsProportion * 30,
    marginBottom: dimensionsProportion * 0,
    borderRadius: 24,
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    width: dimensionsProportion * Dimensions.get('window').width / 1.5
  },

  drawer: {
    activeColor: 'rgba(118, 118, 118)',
    inactiveColor: 'white',
  },
  navSectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'black',
  },
  button: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#09446F',
    backgroundColor: '#09446B',
  },
  sectionButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: '#09446B',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#09446F',
    backgroundColor: '#09446B',
  },
  drawerStyle: {
    backgroundColor: '#111111',
  },
  drawerItem: {
    backgroundColor: '#111111',
    pressColor: '#67686F',
    activeTintColor: '#3ABFB7',
    activeColor: '#3AFFB7',
    fontSize: dimensionsProprtionText * 18,
  },
  verseToCopy: {
    borderWidth: 0, borderColor: '#90EE90', borderRadius: 35,
    paddingBottom: dimensionsProportion * 5,
    paddingLeft: dimensionsProportion * 15,
    paddingRight: dimensionsProportion * 15,
    flexShrink: 1, flexDirection: 'row',
    borderStyle: 'dashed',
    fontSize: dimensionsProprtionText * 18,
  },
  highlight: {
    color: 'blue',
    backgroundColor: 'yellow'
  },
  colorAndBg: {
    color: 'white',
  },
  header: {
    backgroundColor: '#36454F'
  },
  textSearchPnl: {
    paddingRight: 5,
    fontSize: dimensionsProprtionText * 18,
    color: '#ECEDEE',
  },
  textZahnSearchPnl: {
    fontSize: dimensionsProprtionText * 18,
    color: "#fd8",
    fontStyle: "italic",
  },
  searchResultsHeader:
  {
    flexDirection: 'row',
    backgroundColor: '#353935',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchResultsText: {
    color: 'white',
    fontSize: isTablet() ? 14 : 10,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  flashMessage: {
    backgroundColor: '#36454F',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',

    textAlign: 'center',

    position: 'absolute',
    height: dimensionsProportion * 40,
    bottom: 50,
    borderRadius: 24,
    width: dimensionsProportion * isBigScreen() ? 100 : 180,
  },
});


export const ThemedStyles =
{
  light: {
    ...lightStyles
  },
  dark: {
    ...darkStyles
  }
}
consoleLog('style darkStyles')
