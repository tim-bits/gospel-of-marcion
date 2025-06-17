import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { ThemedStyles } from '../css/styles';

import { getDimensionsProportion, isTablet } from "@/app/util/SectionHolder";


// https://stackoverflow.com/questions/76794028/bottom-tab-navigatior-with-drawer-navigation-expo-router
export default function SettingsButton({ colorTheme }) {

  const navigation = useNavigation();

  return (
    <View style={{ ...ThemedStyles[colorTheme].topBarview, paddingLeft: 10 * getDimensionsProportion() }}>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        <Ionicons name="menu" size={
          isTablet() ? 32 : 26
        }
          style={ThemedStyles[colorTheme].colorAndBg} />

      </Pressable>
    </View>
  )
}