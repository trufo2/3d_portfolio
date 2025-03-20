import React from 'react';
import { Suspense, useEffect } from 'react';
import { UseCanvas } from '@14islands/r3f-scroll-rig';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import CanvasLoader from '../components/CanvasLoader';
import { 
  SpotLightWithHelper, 
  PointLightWithHelper, 
  BlackFog, 
  LevaControlsToggle, 
  HelpersVisibilityProvider,
  useHelpersVisibility
} from '../components/LightsNhelpers';
import { Leva } from 'leva';

const Model = () => {
  const { scene } = useGLTF('models/deskNpc.glb');
  useEffect(() => {
    const castShadowElements = ['chair', 'desk', 'keyb', 'lamp', 'mouse', 'pc', 'screen'];
    const receiveShadowElements = ['floor', 'desk', 'chair'];
    scene.traverse((child) => {
      if (child.isMesh) {
        if (castShadowElements.some(name => child.name.toLowerCase().includes(name))) {
          child.castShadow = true;
        }
        if (receiveShadowElements.some(name => child.name.toLowerCase().includes(name))) {
          child.receiveShadow = true;
        }
      }
    });
  }, [scene]);
  return (
    <group scale={.065}>
      <primitive object={scene} />
    </group>
  );
};

const HomeCanvas = () => {
  const { helpersVisible } = useHelpersVisibility();
  const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  return (
    <UseCanvas>
      <HelpersVisibilityProvider>
        <LevaControlsToggle />
          <Suspense fallback={<CanvasLoader />}>
            <PerspectiveCamera makeDefault position={[-5, 10, 15]} />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <ambientLight intensity={isMobile ? 0.2 : 0.05} color="#ffffff" />
            <SpotLightWithHelper />
            <PointLightWithHelper />
            <BlackFog />
            <Model />
          </Suspense>
      </HelpersVisibilityProvider>
    </UseCanvas>
  );
};

export default HomeCanvas;
