import React from 'react';
import './BackgroundBlur.scss';

export function BackgroundBlur({ children }) {
  return <div className="background-blur">{children}</div>;
}

export default BackgroundBlur;
