import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

export function useOrientation(){
  const {width, height} = Dimensions.get('window');

  const [orientation, setOrientation] = useState(
    width < height ? 'PORTRAIT' : 'LANDSCAPE',
  );


//   useEffect(() => {
//     Dimensions.addEventListener('change', ({window:{width,height}})=>{
//       if (width<height) {
//         setOrientation("PORTRAIT")
//       } else {
//         setOrientation("LANDSCAPE")
//       }
//     })
//   }, []);

  // https://stackoverflow.com/questions/62472029/react-native-detect-screen-rotation-change-using-portrait-mode
  useEffect(() => {
    // console.log('onChange');
    const onChange = ({ window: { width, height } }) => {
    //   consoleLog('onChange')
      if (width < height) {
        setOrientation('PORTRAIT');
      } else {
        setOrientation('LANDSCAPE');
      }
    };

    //https://stackoverflow.com/questions/71589970/i-am-working-with-react-native-i-want-to-remove-the-event-listener-inside-the-us
    const dimensionsHandler  = Dimensions.addEventListener('change', onChange);

    return () => {
      // Dimensions.removeEventListener('change', onChange);
      dimensionsHandler.remove(); 
    };
  }, []);

  return orientation;
}