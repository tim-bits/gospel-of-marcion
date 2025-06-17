import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useRef } from "react";
import {
  Dimensions
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';

import FlashListSection from '@/app/components/FlashListSection';
import Search from '@/app/components/Search';
import Table from "@/app/components/Table";
import CustomDrawer from "./components/CustomDrawer";

import { NonThemedStyles, ThemedStyles } from '@/app/css/styles';

import {
  clearSelectedVerses,
  consoleLog,
  getDimensionsProportion,
  getThemeWithFallback, getUserSelectedSectionId,
  isBigScreen,
  isPortrait,
  SWITCH_TO_SEARCH_COMPONENT,
  THEME,
  USER_SELECTED_SECTION_ID
} from '@/app/util/SectionHolder';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect, useState } from "react";


const { height, width } = Dimensions.get('window');

const RootLayout = () => {
  const [colorTheme, setColorTheme] = useState(getThemeWithFallback());
  const [fta, setFta] = useState(getUserSelectedSectionId());
  let navigatorRef = useRef<any>();

  let themeListener = useRef<string | boolean>(null);
  let ftaListener = useRef<string | boolean>(null);
  let switchToSearchListener = useRef<string | boolean>(null);

  useEffect(() => {
    consoleLog("useEffect in RootLayout: 1", height, width, getDimensionsProportion())

    if (getUserSelectedSectionId() === undefined) {
      consoleLog("navigating to table")
      navigatorRef.current.navigate("components/Table");
    }
  }, [fta]
  )

  useEffect(() => {
    consoleLog("useEffect in RootLayout 2")
    ftaListener.current = EventRegister.addEventListener(USER_SELECTED_SECTION_ID, handleAccessEvent);
    themeListener.current = EventRegister.addEventListener(THEME, handleEvent);
    switchToSearchListener.current = EventRegister.addEventListener(SWITCH_TO_SEARCH_COMPONENT, handleSearchSwitchEvent);
    return () => {
      consoleLog("useEffect in RootLayout 2: unmount")

      EventRegister.removeAllListeners();
    }
  }, []
  )


  const handleEvent = (theme: string) => {
    consoleLog("Received event in RootLayout:", theme, typeof theme === 'string', themeListener.current, Date.now());
    setColorTheme(theme);
    clearSelectedVerses();
  };

  const handleAccessEvent = (fta: number) => {
    consoleLog(`Received fta event in RootLayout:`, fta, ftaListener);
    setFta(fta);
    navigatorRef.current.navigate("components/FlashListSection", { sectionId: fta });
  };

  const handleSearchSwitchEvent = (searchSwitchEvent: boolean | VerseInterface) => {
    consoleLog(`Received searchSwitchEvent event in RootLayout:`, searchSwitchEvent, switchToSearchListener);
    consoleLog(navigatorRef?.current?.getState())

    if (typeof searchSwitchEvent === 'boolean') {
      searchSwitchEvent ?
        navigatorRef.current.navigate("components/Search")
        : navigatorRef.current.navigate("components/FlashListSection");
    } else {
      consoleLog('navigate to components/FlashListSection')
      navigatorRef.current.navigate("components/FlashListSection", searchSwitchEvent);
    }

  };

  const Drawer = createDrawerNavigator();
  consoleLog('colorScheme in RootLayout:', colorTheme)

  const getDrawerDimensions = () => {

    const dimensions = { height, width }

    if (isBigScreen()) {
      if (isPortrait()) {
        dimensions.height = 280
        dimensions.width = 450
      } else {
        dimensions.height = 280
        dimensions.width = 450
      }
    } else {
      if (isPortrait()) {
        dimensions.height = '33%'
        dimensions.width = '98%'
      } else {
        dimensions.height = '60%'
        dimensions.width = '60%'
      }
    }
    return dimensions;
  }


  return (
    <ThemeProvider value={colorTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator initialRouteName="components/Table"
        screenOptions={{
          //https://stackoverflow.com/questions/53940462/how-to-set-up-main-parent-width-of-react-native-navigation-drawer
          drawerStyle: {
            backgroundColor: NonThemedStyles.drawerBg.backgroundColor,
            height: getDrawerDimensions().height,
            width: getDrawerDimensions().width,
          },
          drawerItemStyle: {
            backgroundColor: ThemedStyles[colorTheme].drawerStyle.backgroundColor,
          },
          drawerLabelStyle: {
            backgroundColor: ThemedStyles[colorTheme].view.backgroundColor,
          },
        }}

        drawerContent={(props) => {
          navigatorRef.current = props.navigation;
          return <CustomDrawer {...props} />
        }}
      >

        <Drawer.Screen
          name="components/FlashListSection"
          component={FlashListSection}
          options={{
            headerShown: false,
            drawerLabel: "Gospel"
          }}
        />

        <Drawer.Screen

          name="components/Table"
          component={Table}
          options={{
            headerShown: false,
            drawerLabel: "Table of Content",
          }}
        />


        <Drawer.Screen
          name="components/Search"
          component={Search}

          options={{
            headerShown: false,
            drawerLabel: "Search"
          }}
        />


      </Drawer.Navigator>


    </ThemeProvider>
  );
};

export default RootLayout;