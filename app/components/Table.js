import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import SettingsButton from '@/app/components/SettingsButton';

import { consoleLog, getDimensionsProportion, getRomanNumber, getSectionCount, isBigScreen, isPortrait, setUserSelectedSectionId } from '@/app/util/SectionHolder';
import { useState } from 'react';

import { useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { NonThemedStyles, ThemedStyles } from '../css/styles';


export default Table = () => {
    const { dark } = useTheme();
    const [colorTheme, setColorTheme] = useState(dark ? 'dark' : 'light');

    consoleLog('dark!!', dark, colorTheme)
    if (colorTheme !== (dark ? 'dark' : 'light')) {
        const r = async () => {
            setColorTheme(dark ? 'dark' : 'light')
        };
        r();
    }
    consoleLog('getSectionCount()', getSectionCount())
    const data = [...Array(getSectionCount()).keys()];

    const renderRow = (index) => {
        return (
            <View key={index} style={{
                paddingTop: 15 * getDimensionsProportion(), paddingBottom: 10 * getDimensionsProportion(), justifyContent: "center", alignItems: 'center',
                flexDirection: 'row', ...ThemedStyles[colorTheme].view
            }}>
                <TouchableOpacity onPress={() => {
                    consoleLog('setUserSelectedSectionId  Section selection btn')
                    setUserSelectedSectionId(index)
                }} style={{
                    paddingVertical: isPortrait() || isBigScreen() ? 8 * getDimensionsProportion() : 0,
                    width: 240 * getDimensionsProportion(),
                    zIndex: 1, ...ThemedStyles[colorTheme].sectionButton
                }}>
                    <View style={ThemedStyles[colorTheme].sectionButton}>
                        <Text
                            style={{
                                marginLeft: 15 * getDimensionsProportion(),
                                ...ThemedStyles[colorTheme].text
                            }}
                        >Section  {getRomanNumber(index + 1)}
                        </Text>
                    </View>
                </TouchableOpacity >
            </View>
        );
    }


    return (
        <SafeAreaView style={{
            ...NonThemedStyles.flashListSafeAreaView,
            ...ThemedStyles[colorTheme].view, flexDirection: 'column'
        }}>

            <StatusBar barStyle={colorTheme === 'dark' ? 'light-content' : 'dark-content'} />


            <View style={{
                ...ThemedStyles[colorTheme].topBarview, flex: 1, flexDirection: 'row', alignItems: "center",
                alignContent: 'left', justifyContent: 'flex-start',
                maxHeight: 45 * getDimensionsProportion()
            }}>
                <SettingsButton colorTheme={colorTheme} />

            </View>
            <ScrollView style={{
                contentContainerStyle: {
                    paddingTop: 80 * getDimensionsProportion(),
                    paddingBottom: 20 * getDimensionsProportion(),
                    alignItems: 'center',
                    justifyContent: 'center', ...ThemedStyles[colorTheme].view
                }
            }}>
                {
                    data.map((index) => { 
                        return renderRow(index);
                    })
                }
            </ScrollView>
        </SafeAreaView>
    );
}
