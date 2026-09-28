import React, { useEffect, useState } from 'react';
import { ButtonToggle } from '@core/ButtonToggle';
import { appGenericSwipType, appGrenericSwipBg } from '@utils/globalConstant';

export function GenericSwipe({
  type,
  label,
  bgColor: _bgColor,
  activeTextColor = 'text-white',
  onSwip,
  value = false,
  customCss = ''
}) {
  // States
  const [bgColor, setBgColor] = useState('');
  const [switchValue, setSwitchValue] = useState(value);

  // Functions
  const onChange = (e) => {
    setSwitchValue(e);
    if (onSwip) {
      onSwip(e);
    }
  };

  // Hooks
  useEffect(() => {
    setSwitchValue(value);
  }, [value]);

  useEffect(() => {
    if (type === appGenericSwipType.ORANGE && !!switchValue) {
      setBgColor(appGrenericSwipBg.ORANGE);
    } else if (type === appGenericSwipType.RED && !!switchValue) {
      setBgColor(appGrenericSwipBg.RED);
    } else if (type === appGenericSwipType.BLUE && !!switchValue) {
      setBgColor(appGrenericSwipBg.BLUE);
    } else if (type === appGenericSwipType.GREEN && !!switchValue) {
      setBgColor(appGrenericSwipBg.GREEN);
    } else {
      setBgColor('');
    }
  }, [type, switchValue]);

  return (
    <div
      className={`${customCss} bg-mint-20 p-4 w-100 rounded-3 shadow-xs`}
      style={{ background: bgColor ?? '' }}>
      <div className="d-flex justify-content-between">
        <h4
          className={`nc-doomsday-h4 nc-doomsday-bold mb-0 pt-1 ${
            switchValue && activeTextColor ? activeTextColor : 'text-darkgreen-75'
          }`}>
          {label}
        </h4>
        <div>
          <ButtonToggle value={switchValue} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}

export default GenericSwipe;
