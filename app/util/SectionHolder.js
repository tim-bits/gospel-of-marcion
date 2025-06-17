import { Appearance, Dimensions, PixelRatio, Text, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { MMKV } from 'react-native-mmkv';

import * as Clipboard from 'expo-clipboard';

export const storage = new MMKV();

export const ZAHN = "zahn";
export const THEME = "theme";
export const STICKY_HEADER = "SH";
export const USER_SELECTED_SECTION_ID = 'FTI';
export const SCROLL_POSITION = 'SCROLL_POSITION';
export const allSectionScrollPosition = "allSectionScrollPosition";
export const SWITCH_TO_SEARCH_COMPONENT = 'STSC';

export const SCREEN_HEIGHT = 1333 //tab s6 | zte k81 = 1280
export const SCREEN_WIDTH = 752 //tab s6 | zte k81 = 800


export const getSection = (id) => {
    if (Number.isInteger(id) || Number.isInteger(Number(id))) {
        // consoleLog('json.length', json.length)
        if (json.length > 0 || Object.isFrozen(json)) {
            const { data } = json[id];
            return data;
        }
        SectionHolder();
        return getSection(id);
    } else {
        throw Error("Invalid Section id [" + id + "]");
    }
}

export const getSectionCount = () => {
    consoleLog('\ngetSectionCount in SectionHolder', Date.now())
    if (json.length == 0) {
        SectionHolder();
    }
    return 6;
    // return Math.max(...newJson.map(item => item.sectionId))+1;
}



export const getSections = () => {
    if (json.length > 0 || Object.isFrozen(json)) {
        return json;
    }
    return SectionHolder();
}

const json = [];
export const newJson = []


export default SectionHolder = () => {
    consoleLog("===SectionHolder===");
    const fileIterator = require.context('../../json', false, /Section_[1-6].json$/);
    fileIterator.keys().map((item, index) => json[index] = fileIterator(item));

    Object.freeze(json);

    Object.freeze(newJson);
    consoleLog(`json: ${json}`);
    // consoleLog(json);

    return json;
}

export const getZahn = () => {
    return storage.getBoolean(ZAHN);
}

export const setZahn = (zahnValue) => {
    storage.set(ZAHN, zahnValue);
    fireEvent(ZAHN, zahnValue);
}


export const getStickyHeader = () => {
    return storage.getBoolean(STICKY_HEADER);
}
export const setStickyHeader = (stickyHeaderValue) => {
    storage.set(STICKY_HEADER, stickyHeaderValue);
    fireEvent(STICKY_HEADER, stickyHeaderValue);
}


export const getSavedTheme = () => {
    return storage.getString(THEME);
}
export const saveTheme = (theme) => {
    storage.set(THEME, theme);
    fireEvent(THEME, theme);
}

export const invertTheme = (theme) => {
    return theme === 'light' ? "dark" : "light";
}

export const setInvertedTheme = (theme) => {
    const newTheme = invertTheme(theme);
    saveTheme(newTheme);
}

export const getThemeWithFallback = () => {
    return getSavedTheme() ?? Appearance.getColorScheme();
}

export const fireEvent = (eventType, data) => {
    consoleLog("firing: ", eventType, data)
    EventRegister.emitEvent(eventType, data);
}

export const getUserSelectedSectionId = () => {
    consoleLog('1. getFirstTimeAccess():', Date.now())
    const ret = storage.getNumber(USER_SELECTED_SECTION_ID);
    consoleLog('2. getFirstTimeAccess():', ret, Date.now())
    return ret
}

export const setUserSelectedSectionId = (sectionId) => {
    consoleLog('setFirstTimeAccess!!', sectionId, Date.now())
    storage.set(USER_SELECTED_SECTION_ID, sectionId);
    consoleLog('setFirstTimeAccess!!!', sectionId, Date.now())

    fireEvent(USER_SELECTED_SECTION_ID, sectionId)
}

export const setYScrollPosition = (sectionIdVsScrollPosition) => {


    consoleLog('setYScrollPosition!!1', sectionIdVsScrollPosition /*, sectionIdVsScrollPositionsString*/)
    if (sectionIdVsScrollPosition) {
        let sectionIdVsScrollPositions;
        const sectionIdVsScrollPositionsString = storage.getString(SCROLL_POSITION);

        if (!sectionIdVsScrollPositionsString) {
            sectionIdVsScrollPositions = [0, 0, 0, 0, 0, 0]
        } else {
            sectionIdVsScrollPositions = JSON.parse(sectionIdVsScrollPositionsString);
        }
        sectionIdVsScrollPositions[sectionIdVsScrollPosition[0]] = sectionIdVsScrollPosition[1];
        consoleLog('setYScrollPosition!!2', sectionIdVsScrollPosition, sectionIdVsScrollPositionsString, sectionIdVsScrollPositions)

        storageSet(SCROLL_POSITION, JSON.stringify(sectionIdVsScrollPositions));

        storageSet(USER_SELECTED_SECTION_ID, sectionIdVsScrollPosition[0]);
    }

}

export const getYScrollPosition = (sectionId) => {
    const scrollPosition = storage.getString(SCROLL_POSITION)
    if (scrollPosition) {
        try {
            const sectionIdVsScrollPositions = JSON.parse(scrollPosition);
            consoleLog("=====getYScrollPosition===", sectionIdVsScrollPositions);
            return sectionIdVsScrollPositions[sectionId];
        } catch (e) {
            consoleLog("=====getYScrollPosition===  Can't parse ", scrollPosition);
            (async () => storage.delete(SCROLL_POSITION))()
        }
    }
    return 0;
}


export const setYScrollPositionByVerse = (verse) => {
    consoleLog('verse', verse)
    if (verse && verse.id && typeof verse.sectionId === 'number') {
        const section = getSection(verse.sectionId);
        const scrollPosition = section.indexOf(verse);

        consoleLog('setYScrollPositionByVerse.scrollPosition!!', verse.sectionId, scrollPosition)
        setYScrollPosition([verse.sectionId, scrollPosition]);
    }
}

export const getRomanNumber = (digit) => {
    switch (digit) {
        case 1: return 'I';
        case 2: return 'II';
        case 3: return 'III';
        case 4: return 'IV';
        case 5: return 'V';
        case 6: return 'VI';
            throw Error('Wrong number: ', digit);
    }
}

const storageSet = (key, value) => {
    (async () => storage.set(key, value))();
    // (() => storage.set(key, value))();
}

const storageSetSync = (key, value) => {
    // (async () => storage.set(key, value))();
    storage.set(key, value);
}


export const getAllSectionScrollPosition = () => {
    const num = storage.getNumber(allSectionScrollPosition) ?? 0;
    consoleLog("=====getAllSectionScrollPosition===");
    consoleLog(num);
    return num;
}
export const setAllSectionScrollPosition = (scrollPosition) => {
    consoleLog("scrollPosition ", scrollPosition);
    if (Number(scrollPosition) < getSectionCount()) {
        return storage.set(allSectionScrollPosition, scrollPosition);
    }
    consoleLog("scrollPosition exceeds upper bound: ", scrollPosition, "defaulting to 0");
    return storage.set(allSectionScrollPosition, 0);
}


export const getMatchingVerses = (searchWords) => {
    consoleLog('searchWords', searchWords)
    if (searchWords) {
        getSections();
        const matchingVerses = json.map((section, index) => {

            return section.data.filter(item => typeof item !== 'string' && findRegexIndices(item, searchWords, false).length > 0
                // && searchWords.some(word => item.text.toUpperCase().includes(word.toUpperCase()))
            ).map(item => {
                item.sectionId = index
                return item
            }
            )
        });

        const flattened = matchingVerses.reduce((acc, val) => acc.concat(val, []));

        //  consoleLog(flattened)
        return flattened;
    }
}

export const clearSelectedVerses = async () => {
    consoleLog('clearSelectedVerses')
    const versesToCopyArray = getAllSelectedVersesArray();
    versesToCopyArray.forEach(item => {
        delete item.selected; delete item.indices
    });
}

export const getAllSelectedVersesArray = () => {
    // consoleLog('1 getAllSelectedVersesArray')
    const versesToCopyArray = json.map((section, index) => {
        return section.data.filter(item => item.selected || item.indices)
    }).flat();
    // consoleLog('versesToCopyArray', versesToCopyArray)
    // console.trace();
    consoleLog('2 getAllSelectedVersesArray', versesToCopyArray)
    return versesToCopyArray;
}

export const getAllSelectedVerses = (copy) => {
    const versesToCopyArray = getAllSelectedVersesArray();
    const versesToCopy = versesToCopyArray.map(item => item.text).join("\n\n").trim();
    consoleLog('versesToCopyArray', versesToCopyArray)
    versesToCopyArray.forEach(item => {
        delete item.selected
    });

    consoleLog('versesToCopy', versesToCopy)

    copy ? Clipboard.setStringAsync(versesToCopy) : Clipboard.setStringAsync('');

    return versesToCopy.length > 0 ? versesToCopy : undefined
}


export const isNewArchEnabled = () => {

    let conf
    const fileIterator = require.context('../../', false, /app.json$/);
    fileIterator.keys().map((item, index) => conf = fileIterator(item));
    consoleLog('conf', conf);
    const { expo: { newArchEnabled } } = conf
    consoleLog('newArchEnabled', newArchEnabled);

    if (newArchEnabled) {
        consoleLog('New architecture is enabled.');
        return true;
    }

    consoleLog('New architecture is not enabled.');
    return false;
}

export const isPortrait = () => {
    const isPortrait = Dimensions.get('window').width < Dimensions.get('window').height
    return isPortrait
}

export const getDimensionsProportion = () => {
    if (isPortrait()) {
        return Dimensions.get('window').width / SCREEN_WIDTH;
    }
    consoleLog('getDimensionsProprtion', Dimensions.get('window').height / SCREEN_WIDTH)
    return Dimensions.get('window').height / SCREEN_WIDTH;
}

export const getDimensionsProportionText = () => {
    return isBigScreen() ? 1 : 0.82;
}


export const isBigScreen = () => {
    return getDimensionsProportion() > 0.5 ? true : false;
}

export const isTablet = () => {

    //https://stackoverflow.com/questions/44562769/react-native-check-if-tablet-or-screen-in-inches/51888343#51888343
    // const {height, width} = Dimensions.get('window');

    // let pixelDensity = PixelRatio.get();
    // const adjustedWidth = height * pixelDensity;
    // const adjustedHeight = width * pixelDensity;
    // if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    //   return true;
    // } else
    //   return (
    //     pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
    //   );


    // return DeviceInfo.isTablet();

    // function isTabletBasedOnRatio(ratio){
    let ratio = PixelRatio.get();
    if (ratio > 1.6) {
        return false;
    } else {
        return true;
    }
}

export const isDev = () => {
    if (__DEV__) {
        return true;
    }
    return false;
}


function findRegexIndices(item, searchTerms, caseSensitive) {

    const text = item.text
    const indices = [];

    for (let searchTerm of searchTerms) {
        const searchTermLen = searchTerm.length,
            reg = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi')
        let result;

        while ((result = reg.exec(text))) {
            indices.push([result.index, result.index + searchTermLen]);
        }
    }

    if (indices.length > 0) {
        indices.sort((arr1, arr2) => arr1[0] - arr2[0]);
        for (let i = 1; i < indices.length; i++) {
            if (arraysOverlap(indices[i - 1], indices[i])) {
                indices[i] = indices[i].concat(indices[i - 1].filter((item) => indices[i].indexOf(item) < 0)).sort(function (a, b) {
                    return a - b;
                });
                indices[i].splice(1, indices[i].length - 2);
                indices[i - 1] = null;
            }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
            if (indices[i] === null) {
                indices.splice(i, 1);
            }
        }
    }
    if (indices.length > 0) {
        item.indices = indices
    }
    return indices
}

function arraysOverlap(arr1, arr2) {
    return arr1.some(value => arr2.includes(value))
}

export const consoleLogEnabled = isDev();
export function consoleLog() {
    if (consoleLogEnabled) {
        console.log(...arguments, Date.now())
    }
}

