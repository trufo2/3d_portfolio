import { createContext, useContext, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { SoftShadows } from '@react-three/drei'
import * as THREE from "three"
import { GlobalCanvas, SmoothScrollbar, useCanvasStore } from '@14islands/r3f-scroll-rig'
import { HashRouter, Route, Routes, useLocation } from "react-router-dom"
import HomeLayout from "./sections/Home-layout"
import SitesLayout from "./sections/Sites-layout"
import Home from "./sections/Home-html"
import Sites from "./sections/Sites-html"
import Animations from "./sections/Animations"
import Videos from "./sections/Videos"
import Art from "./sections/Art"
import './index.css'

const FovContext = createContext({
  value: 50,
  setState: () => {},
})

function FovUpdateByFovx({ fovx }){
  const fovContext = useContext(FovContext)
  const requestReflow = useCanvasStore((state) => state.requestReflow)
  useFrame((state) => {
    const fovy = Math.atan(Math.tan(fovx * THREE.MathUtils.DEG2RAD) / state.viewport.aspect) * THREE.MathUtils.RAD2DEG
    const epsilon = 0.001
    if (epsilon < Math.abs(fovContext.value - fovy)) {
      fovContext.setState(() => fovy)
      requestReflow()
    }
  })
  return null
}

function ScrollController() {
  const location = useLocation()
  
  useEffect(() => {
    if (location.pathname === '/') {
      window.scrollTo(0, 0)
      document.documentElement.style.overflow = 'hidden'
    } else {
      // Ensure scrollbar is visible and functional
      document.documentElement.style.overflow = 'auto'
      document.documentElement.style.pointerEvents = 'auto'
    }
    return () => {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <SmoothScrollbar 
      key={location.pathname}
      locked={location.pathname === '/'}
      config={{ 
        duration: 0.25,
        disablePointerOnScroll: location.pathname === '/'
      }} 
    />
  )
}

function App() {
  const [fov, setFov] = useState(20)
  
  return (
    <>
      <FovContext.Provider value={{value: fov, setState: setFov}}>
        <GlobalCanvas shadows={true} camera={{fov: fov}} scaleMultiplier={0.01}>
          <FovUpdateByFovx fovx={20}/>
          <SoftShadows focus={0.25} />
        </GlobalCanvas>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomeLayout><Home /></HomeLayout>} />
            <Route path="/sites" element={<SitesLayout><Sites /></SitesLayout>} />
            <Route path="/animations" element={<HomeLayout><Animations /></HomeLayout>} />
            <Route path="/videos" element={<HomeLayout><Videos /></HomeLayout>} />
            <Route path="/art" element={<HomeLayout><Art /></HomeLayout>} />
          </Routes>
          <ScrollController />
        </HashRouter>
      </FovContext.Provider>
    </>
  )
}

export default App
