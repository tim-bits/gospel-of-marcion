import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";


import { getThemeWithFallback, invertTheme, saveTheme } from '@/app/util/SectionHolder';
import { NonThemedStyles, ThemedStyles } from '../css/styles';


export default ThemeToggler = ({ colorScheme }) => {
  const [colorTheme, setColorTheme] = useState(getThemeWithFallback());

  const handleChange = () => {

    const invertedTheme = invertTheme(colorTheme);
    saveTheme(invertedTheme)
    setColorTheme(invertedTheme);
  }


  return (
    <View style={NonThemedStyles.toggler}>

      <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
        <Ionicons name="moon-outline" size={NonThemedStyles.togglerIconSize.size} style={{ ...ThemedStyles['dark'].text, marginRight: 30 }} />
        <Text style={{ ...ThemedStyles['dark'].text }}>{'Night Mode'}</Text>
      </View>


      <View style={{ flex: 0, flexDirection: 'row', alignItems: "flex-end" }}>
        <Switch
          value={colorTheme === 'dark' ? true : false}
          onValueChange={handleChange}
        />
      </View>
    </View>
  );
};
