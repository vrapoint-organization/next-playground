import { useEffect, useRef } from "react";

const useEffectOnce = (effect: Function, params?: any[]) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      const cleanup = effect();
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, params ?? []);
};

export default useEffectOnce;
