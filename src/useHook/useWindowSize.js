import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onsizeChange = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }

      onsizeChange();

      window.addEventListener("resize", onsizeChange);

      return () => {
        window.removeEventListener("resize", onsizeChange)
      }

    }
  }, []);
  
  return windowSize;
};

export default useWindowSize;