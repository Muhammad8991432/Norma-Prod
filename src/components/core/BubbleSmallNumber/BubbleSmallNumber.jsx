import React from 'react';
import { appIcons } from '@utils/globalConstant';

export const BubbleSmallNumber = ({ text = '' }) => {
  return (
    <div className="position-relative">
      <div
        className="pt-1 pb-2"
        style={{
          backgroundImage: `url(${appIcons.bubbletabaccent})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain'
        }}
      >
        <div className="text-center">
          <p className="nc-doomsday-copy text-white m-0 p-0 text-center">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default BubbleSmallNumber;
