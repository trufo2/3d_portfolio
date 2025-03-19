import React from 'react';
import Navbar from '../components/Navbar';
import HomeCanvas from './Home-canvas';

const HomeLayout = ({ children }) => {
  return (
    <>
      <HomeCanvas />
      <div className="relative z-50">
        <Navbar />
      </div>
      <div className="relative z-30 w-full" style={{pointerEvents: 'none'}}>
        {children}
      </div>
    </>
  );
};

export default HomeLayout;
