import React from 'react';
import moment from 'moment';

import { Icons } from '@core/Utils/Icons/Icons';

export function TopupHistory({ dateTime, amount }) {
  // Functions
  const getDate = () => {
    // const formatedDate = moment(dateTime, 'dd.MM.yyyy').format('DD.MM.YYYY');
    const parsedDate = moment(dateTime, 'DD.MM.YYYY HH:mm');
    const formatedDate = parsedDate.format('DD.MM.YYYY');
    return formatedDate;
  };

  const getTime = () => {
    const time = moment(dateTime, 'dd.MM.yyyy HH:mm').format('HH:mm');
    return time;
  };
  return (
    <div className="d-flex flex-row align-items-center justify-content-start">
      <div className="pb-1">
        <Icons name="datemint" width={24} />
      </div>
      <div className="ps-3">
        <h4 style={{ width: '110px' }} className="nc-doomsday-h4 lh-1 m-0 ">
          {getDate()},
        </h4>
      </div>

      <div className="">
        <h4 style={{ width: '55px' }} className="nc-doomsday-h4 lh-1 m-0 ">
          {getTime()}
        </h4>
      </div>

      <div className="pb-1 ps-4">
        <Icons name="coinsmint" width={24} />
      </div>
      <h4 className="nc-doomsday-h4 lh-1 m-0 ps-3">{amount}&nbsp;€</h4>
    </div>
  );
}

export default TopupHistory;
