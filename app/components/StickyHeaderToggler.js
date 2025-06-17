import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';

import Octicons from "react-native-vector-icons/Octicons";

import { NonThemedStyles, ThemedStyles } from '@/app/css/styles';
import { consoleLog, getStickyHeader, setStickyHeader } from '@/app/util/SectionHolder';

export default StickyHeaderToggler = ({ colorTheme }) => {
  const [stickyHeaderFlag, setStickyHeaderFlag] = useState(getStickyHeader());
  const handleChange = () => {
    const newStickyHeaderFlag = !stickyHeaderFlag
    consoleLog('setStickyHeader', setStickyHeaderFlag, setStickyHeader)
    setStickyHeaderFlag(newStickyHeaderFlag);
    setStickyHeader(newStickyHeaderFlag);
  }


  return (
    <View style={NonThemedStyles.toggler}>

      <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>

        <Octicons name="pin" size={NonThemedStyles.togglerIconSize.size} style={{ ...ThemedStyles['dark'].text, marginRight: 30 }} />
        <Text style={{ ...ThemedStyles['dark'].text }}>{'Sticky Headers'}</Text>

      </View>


      <View style={{ flex: 0, flexDirection: 'row', alignItems: "flex-end" }}>
        <Switch
          value={stickyHeaderFlag}
          onValueChange={handleChange}
        />
      </View>
    </View>
  );
};