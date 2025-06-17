import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import Octicons from "react-native-vector-icons/Octicons";

import Tooltip from 'rn-tooltip';

import { NonThemedStyles, ThemedStyles } from '@/app/css/styles';
import { consoleLog, getZahn, isBigScreen, isPortrait, isTablet, setZahn } from '@/app/util/SectionHolder';

export default ZahnToggler = ({ colorTheme, orientation }) => {


  useEffect(() => {
    setToolTipVisible(false);

    return () => {
      setTimeout(() => { setToolTipVisible(true), consoleLog("ZahnToggler tol", toolTipVisible) }, 500);
      consoleLog('useEffect in ZahnToggler', orientation, toolTipVisible)
    };

  }, [orientation]
  );


  const [zahnValue, setZahnValue] = useState(getZahn());

  const [toolTipVisible, setToolTipVisible] = useState(true);

  setTimeout(() => setToolTipVisible(true), 500);

  consoleLog('ZahnToggler colorTheme', colorTheme, orientation, toolTipVisible)

  const handleChange = () => {
    const newZahnValue = !zahnValue
    setZahnValue(newZahnValue);
    setZahn(newZahnValue);
  }

  const getMarginLeft = () => {
    let ret;
    if (isPortrait()) {
      return 2
    }
    ret = isBigScreen() ? '15%' : '27%'
    consoleLog('ret', ret)
    return ret
  }


  return (
    <View style={NonThemedStyles.toggler}>

      <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>

        {toolTipVisible && <Tooltip popover={
          <Text>1823 reconstruction by A. Hahn was revised by T. Zahn, who doubted some of the material Hahn allowed into his version. {'\n'}
            <Text style={{
              ...ThemedStyles[colorTheme].textZahnSearchPnl,
              fontSize: 14
            }}>When turned on, the text omitted by Zahn is shown in italic and has different color than the rest of the text.</Text>
          </Text>
        }
          containerStyle={{
            left: 0,
            alignItems: 'flex-start',
            marginLeft: 5,
            marginBottom: 0,
          }}
          width={isPortrait() ?
            isBigScreen() ? '70%' : '98%'
            : '70%'}
          height={isTablet() ? isPortrait() ? '12%' : '15%' : '25%'}
          onClose={(e) => {
            consoleLog('e', e)
            setToolTipVisible(true)
          }}
          overlayColor={'transparent'}
        >

          <Octicons name="info" size={NonThemedStyles.togglerIconSize.size} style={{ ...ThemedStyles['dark'].text, marginRight: 28 }} />

        </Tooltip>}

        {!toolTipVisible && <Octicons name="info" size={NonThemedStyles.togglerIconSize.size} style={{ ...ThemedStyles['dark'].text, marginRight: 28 }} />}

        <Text style={{ ...ThemedStyles['dark'].text }}>{'Show verses omitted by Zahn'}</Text>

      </View>


      <View style={{ flex: 0, flexDirection: 'row', alignItems: "flex-end" }}>
        <Switch
          style={{ size: 10 }}
          value={zahnValue}
          onValueChange={handleChange}
        />

      </View>


    </View>
  );
};