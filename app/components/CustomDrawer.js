import {
  DrawerContentScrollView,
  DrawerItem
} from "@react-navigation/drawer";
import {
  Text,
  View,
} from "react-native";

import Octicons from "react-native-vector-icons/Octicons";

import StickyHeaderToggler from './StickyHeaderToggler';
import ThemeToggler from './ThemeToggler';
import ZahnToggler from './ZahnToggler';

import { useEffect, useState } from "react";
import { NonThemedStyles, ThemedStyles } from "../css/styles";

import { consoleLog, getDimensionsProportion, getThemeWithFallback, isBigScreen, isPortrait } from '@/app/util/SectionHolder';

import { useOrientation } from "./useOrientation";

const CustomDrawer = (props) => {
  const { state, navigation, descriptors } = props;

  const [colorTheme, setColorTheme] = useState(getThemeWithFallback());
  const orientation = useOrientation();

  useEffect(() => {
    consoleLog('useEffect in CustomDrawer, isPortrait:', isPortrait())
    setColorTheme(getThemeWithFallback())
  })

  return (
    <View style={{ flex: 1 }} onLayout={(e) => consoleLog('nativeEvent.layout', e.nativeEvent.layout)}>
      <DrawerContentScrollView>
        <View style={{ flex: 1, backgroundColor: NonThemedStyles.drawerBg.backgroundColor }}>

          {state.routes
            .filter(route => !route.name.includes('Search'))
            .map((route) => {
              return (
                <DrawerItem
                  key={route.key}
                  style={{ marginTop: isBigScreen() ? 0 : -30 * getDimensionsProportion(), marginBottom: isBigScreen() ? 0 : 10 * getDimensionsProportion() }}
                  icon={({ focused }) => (
                    <Octicons name={route.name.includes('Table') ? "list-unordered" : "book"} size={NonThemedStyles.drawerIconSize.size}
                      color={focused ? ThemedStyles['dark'].drawerItem.activeColor : ThemedStyles['dark'].text.color} />
                  )}
                  label={({ color, focused }) => {
                    return <View style={{ flex: 0, flexDirection: 'row', alignItems: "flex-end"/*, borderWidth:3*/ }}>
                      <Text style={{
                        color: focused ? ThemedStyles['dark'].drawerItem.activeColor
                          : ThemedStyles['dark'].text.color,
                        fontSize: ThemedStyles['dark'].drawerItem.fontSize
                      }}>
                        {descriptors[route.key].options.drawerLabel}</Text>
                    </View>
                  }
                  }

                  focused={state.routes.findIndex((e) => e.name === route.name) === state.index}
                  onPress={(props) => navigation.navigate(route.name)}
                  //https://stackoverflow.com/questions/68730926/how-to-make-activetintcolor-and-activebackgroundcolor-of-draweritem-work-in-reac
                  pressColor={ThemedStyles['dark'].drawerItem.pressColor}
                  activeBackgroundColor={NonThemedStyles.drawerBg.backgroundColor}
                  inactiveBackgroundColor={NonThemedStyles.drawerBg.backgroundColor}
                />
              );
            })}


        </View>
      </DrawerContentScrollView>

      <View style={{ paddingLeft: 20, paddingRight: 20, borderTopWidth: 1, borderTopColor: "#ccc", paddingVertical: 10 }}>

        <ThemeToggler />
        <StickyHeaderToggler />

        <ZahnToggler colorTheme={colorTheme} orientation={orientation} />

      </View>
    </View>
  );
};

export default CustomDrawer;
