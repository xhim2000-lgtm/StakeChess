import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useLayout() {
  const [dims, setDims] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setDims(window);
    });
    return () => sub.remove();
  }, []);

  return {
    width: dims.width,
    height: dims.height,
    isLandscape: dims.width > dims.height,
  };
}
