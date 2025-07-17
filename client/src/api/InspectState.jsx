import React, { useContext, useEffect } from 'react';
import { GlobalState } from '../GlobalState';

const InspectState = () => {
  // ① grab the whole context object
  const state = useContext(GlobalState);

  // ② dump it once, after mount (so you get the real arrays/data)
  useEffect(() => {
    console.log('Global context state:', state);
  }, [state]);

  return null;
};

export default InspectState;
