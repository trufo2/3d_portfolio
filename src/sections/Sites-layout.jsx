import React from 'react';
import Navbar from '../components/Navbar';
import SitesHtmlComponent from './Sites-html';
import SitesCanvasComponent from './Sites-canvas';

const sitesData = {
  titles: [
    'fontbetou.com',
    'mussoft.ch',
    'swissart-consulting.ch'
  ],
  descriptions: [
    'Gîtes: Charentes-Maritime, France',
    'Réparations d\'ordinateurs: Jura, Suisse',
    'Galerie de peinture: Jura, Suisse'
  ],
  urls: [
    'https://fontbetou.com/',
    'https://mussoft.ch/',
    'https://swissart-consulting.ch'
  ],
  texturePaths: [
    'assets/textures/fontbetou_com.jpg',
    'assets/textures/mussoft_ch.jpg',
    'assets/textures/swissart-consulting_ch.jpg'
  ]
};

const SitesLayout = () => {
  return (
    <>
      <div className="relative z-50">
        <Navbar />
      </div>
      <div className="html-element">
        {sitesData.titles.map((title, index) => (
          <div key={index}>
            <SitesHtmlComponent 
              title={title}
              description={sitesData.descriptions[index]}
              url={sitesData.urls[index]}
              isFirst={index === 0}
              index={index}
            />
            <SitesCanvasComponent 
              texturePath={sitesData.texturePaths[index]}
              isFirst={index === 0}
              index={index}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default SitesLayout;
