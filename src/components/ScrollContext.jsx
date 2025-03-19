import React, { createContext, useState, useContext, useEffect } from 'react';
import { useControls } from 'leva';

const ScrollContext = createContext({
  scrollY: 0,
  canvasScrollFactor: 0.001,
  textLeftPosition: 0,
  textRightPosition: 0,
  textVerticalSpacing: 6,
  panelVerticalSpacing: 6,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight
});

export const ScrollProvider = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  
  const { 
    textLeftPosition, 
    textRightPosition,
    textVerticalSpacing,
    panelVerticalSpacing
  } = useControls('Text Position', {
    textLeftPosition: {
      value: -.24,
      min: -.5,
      max: 0,
      step: 0.01,
      label: 'Left Text Position'
    },
    textRightPosition: {
      value: .24,
      min: 0,
      max: .5,
      step: 0.01,
      label: 'Right Text Position'
    },
    textVerticalSpacing: {
      value: 9.5,
      min: 2,
      max: 12,
      step: 0.1,
      label: 'Text Vertical Spacing'
    },
    panelVerticalSpacing: {
      value: 1.9,
      min: 1,
      max: 5,
      step: 0.1,
      label: 'Panel Vertical Spacing'
    }
  });

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      setScrollY(prev => {
        const delta = e.deltaY * 0.1;
        return Math.max(0, prev + delta);
      });
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ 
      scrollY, 
      canvasScrollFactor: 0.001,
      textLeftPosition,
      textRightPosition,
      textVerticalSpacing,
      panelVerticalSpacing,
      windowWidth: windowSize.width,
      windowHeight: windowSize.height
    }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
