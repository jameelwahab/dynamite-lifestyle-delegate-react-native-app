import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function useBackHandler(handler) {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', handler);
      return () => subscription.remove();
    }, [handler]))

}
