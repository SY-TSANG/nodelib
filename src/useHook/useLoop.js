import { useEffect, useRef } from "react";

export const useLoop = (callBack, interval) => {
  const ref = useRef()

  useEffect(() => {
    ref.current = setInterval(
      function(){ callBack () }, interval);

    return () => {
      clearInterval(ref.current);
    }
  }, []);  
};
