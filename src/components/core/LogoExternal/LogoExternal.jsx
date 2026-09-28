import React from 'react';
import { Ta11yImage } from '@core/index';

export const LogoExternal = ({ externalLink, imageContent, height = '83px' }) => {
  return (
    <>
      <a href={externalLink} target="_blank" rel="noopener noreferrer" className="d-inline-block">
        <Ta11yImage imageContent={imageContent} style={{ height: height }} />
      </a>
    </>
  );
};

export default LogoExternal;
