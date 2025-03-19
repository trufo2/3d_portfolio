import React, { useRef } from 'react';

const SitesHtmlComponent = ({ title, description, url, isFirst, isLast }) => {
  const articleRef = useRef(null);
  
  return (
    <article 
      ref={articleRef} 
      className={`html-text ${isFirst ? 'html-text-first' : ''}`}
    >
      <h3 className="html-title">
        <span className="html-txtSpanTop">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </span>
      </h3>
      <h4 className="html-description">
        <span className="html-txtSpanBtm">
          {description}
        </span>
      </h4>
    </article>
  );
};

export default SitesHtmlComponent;
