import { useRef, useEffect, createContext, useContext, useState } from 'react';
import { useHelper } from '@react-three/drei';
import { useControls } from 'leva';
import { SpotLightHelper, PointLightHelper, Fog } from 'three';
import { useThree } from '@react-three/fiber';

const HelpersVisibilityContext = createContext({
  helpersVisible: false,
  toggleHelpers: () => {}
});
export const useHelpersVisibility = () => useContext(HelpersVisibilityContext);

function HelpersVisibilityProvider({ children }) {
  const [helpersVisible, setHelpersVisible] = useState(false);
  const toggleHelpers = () => {
    setHelpersVisible(prev => !prev);
  };
  return (
    <HelpersVisibilityContext.Provider value={{ helpersVisible, toggleHelpers }}>
      {children}
    </HelpersVisibilityContext.Provider>
  );
}

function LevaControlsToggle() {
  const { helpersVisible, toggleHelpers } = useHelpersVisibility();

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.id = 'leva-toggle-style';
    document.head.appendChild(styleElement);

    updateControlsVisibility(helpersVisible);

    function updateControlsVisibility(isVisible) {
      styleElement.innerHTML = isVisible 
        ? '' 
        : `
          div[class*="leva"],
          div[style*="position: fixed"][style*="z-index: 1000"]
          { 
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
          }
        `;
    }

    const toggleControls = () => {
      toggleHelpers();
    };

    const indicator = document.createElement('button');
    indicator.textContent = 'c';
    indicator.className = 'LevaButton';
    document.body.appendChild(indicator);

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'c') {
        toggleControls();
      }
    };

    indicator.addEventListener('click', toggleControls);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      indicator.removeEventListener('click', toggleControls);
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [helpersVisible, toggleHelpers]);

  return null;
}

function SpotLightWithHelper() {
  const light = useRef();
  const targetRef = useRef();
  const { helpersVisible } = useHelpersVisibility();
  useHelper(helpersVisible ? light : null, SpotLightHelper, 'orange');

  const { lightColor, intensity, distance, angle, penumbra, decay } = useControls('Spot Light', {
    lightColor: '#ffffff',
    intensity: { value: 12, min: 0.0, max: 20, step: 0.1 },
    distance: { value: 20.0, min: 0.0, max: 30.0, step: 0.1 },
    angle: { value: .5, min: .1, max: 1, step: 0.01 },
    penumbra: { value: 0.5, min: 0.0, max: 1.0, step: 0.1 },
    decay: { value: 1, min: 0.0, max: 10.0, step: 0.1 },
  });

  const { spotShadowBias, spotShadowRadius, spotShadowMapSize } = useControls('Spot Light Shadows', {
    spotShadowBias: { value: 0, min: -0.01, max: 0.01, step: 0.0001 },
    spotShadowRadius: { value: 15, min: 0, max: 25, step: 0.1 },
    spotShadowMapSize: { value: 1792, min: 256, max: 4096, step: 256 },
  }, {
    collapsed: true
  });

  const safeIntensity = isNaN(intensity) ? 1 : intensity;
  const safeDistance = isNaN(distance) ? 10 : distance;
  const safeAngle = isNaN(angle) ? 0.1 : angle;
  const safePenumbra = isNaN(penumbra) ? 0 : penumbra;
  const safeDecay = isNaN(decay) ? 0.1 : decay;
  const lightPosition = [-3.2, 2, .2];
  const targetPosition = [0, 0, 1.5];
  const safeLightPosition = lightPosition.map(coord => isNaN(coord) ? 0 : coord);

  useEffect(() => {
    if (light.current && targetRef.current) {
      light.current.target = targetRef.current;
      light.current.shadow.bias = spotShadowBias;
      light.current.shadow.radius = spotShadowRadius;
      light.current.shadow.mapSize.width = spotShadowMapSize;
      light.current.shadow.mapSize.height = spotShadowMapSize;
      light.current.shadow.camera.near = 0.5;
      light.current.shadow.camera.far = 30;
      light.current.shadow.camera.fov = 30;
    }
  }, [spotShadowBias, spotShadowRadius, spotShadowMapSize]);

  return (
    <>
      <spotLight
        ref={light}
        color={lightColor}
        intensity={safeIntensity}
        distance={safeDistance}
        angle={safeAngle}
        penumbra={safePenumbra}
        decay={safeDecay}
        position={safeLightPosition}
        castShadow
        shadow-normalBias={0.05}
      />
      <object3D 
        ref={targetRef} 
        position={targetPosition}
      />
    </>
  );
}

function PointLightWithHelper() {
  const light = useRef();
  const { helpersVisible } = useHelpersVisibility();
  const helperRef = useRef(null);

  useEffect(() => {
    if (helperRef.current && light.current) {
      light.current.remove(helperRef.current);
      helperRef.current = null;
    }
    if (light.current && helpersVisible) {
      helperRef.current = new PointLightHelper(light.current);
      light.current.add(helperRef.current);
    }
    return () => {
      if (helperRef.current && light.current) {
        light.current.remove(helperRef.current);
        helperRef.current = null;
      }
    };
  }, [helpersVisible]);

  const { lightColor, intensity, distance, decay } = useControls('Point Light', {
    lightColor: '#ffffff',
    intensity: { value: 1, min: 0.0, max: 8.0, step: 0.1 },
    distance: { value: 20.0, min: 0.0, max: 40.0, step: 0.1 },
    decay: { value: 0.5, min: 0.0, max: 10.0, step: 0.1 },
  });

  const safeIntensity = isNaN(intensity) ? 1 : intensity;
  const safeDistance = isNaN(distance) ? 10 : distance;
  const safeDecay = isNaN(decay) ? 0.1 : decay;
  const lightPosition = [0, 6, 1];
  const safeLightPosition = lightPosition.map(coord => isNaN(coord) ? 0 : coord);

  const { shadowBias, shadowRadius, shadowMapSize } = useControls('Point Light Shadows', {
    shadowBias: { value: 0, min: -0.01, max: 0.01, step: 0.0001 },
    shadowRadius: { value: 3, min: 0, max: 25, step: 0.1 },
    shadowMapSize: { value: 1024, min: 256, max: 4096, step: 256 },
  }, {
    collapsed: true
  });

  useEffect(() => {
    if (light.current) {
      light.current.shadow.bias = shadowBias;
      light.current.shadow.radius = shadowRadius;
      light.current.shadow.mapSize.width = shadowMapSize;
      light.current.shadow.mapSize.height = shadowMapSize;
      light.current.shadow.camera.near = 0.1;
      light.current.shadow.camera.far = 50;
    }
  }, [shadowBias, shadowRadius, shadowMapSize]);

  return (
    <pointLight
      ref={light}
      color={lightColor}
      intensity={safeIntensity}
      distance={safeDistance}
      decay={safeDecay}
      position={safeLightPosition}
      castShadow
      shadow-normalBias={0.05}
    />
  );
}

function BlackFog() {
  const { scene } = useThree();
  const { fogNear, fogFar } = useControls('Black Fog', {
    fogNear: { value: 25, min: 0, max: 50, step: 0.1 },
    fogFar: { value: 60, min: 0, max: 120, step: 0.1 },
  }, {
    collapsed: true
  });

  useEffect(() => {
    if (scene) {
      scene.fog = new Fog('#000000', fogNear, fogFar);
      return () => {
        scene.fog = null;
      };
    }
  }, [scene, fogNear, fogFar]);

  return null;
}

export { 
  LevaControlsToggle, 
  SpotLightWithHelper, 
  PointLightWithHelper, 
  BlackFog, 
  HelpersVisibilityProvider 
};
