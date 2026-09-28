/* eslint-disable import/prefer-default-export */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useA11y } from '@context/Utils';
import { useStaticContent } from '@context/StaticContent';
import { useDashBoard } from '@context/MobileOne/DashBoard';
import { appOptionIds, appUsageType } from '@utils/globalConstant';
import { DashboardActiveOption } from '@part/index';

export function GenericBookedOptionCard({ bookedOption, index, customClass = '', active = -1, tabIndex = -1 }) {
  const { tA11yTranslate } = useA11y();
  const { staticContentData } = useStaticContent();
  const { getRemainingApiVolume, getOptionAvailableUntilDate } = useDashBoard();

  const { additionalInfo } = staticContentData?.nr_etcOptionSettings || appOptionIds;

  const amountPrefix = tA11yTranslate('nc_global_dboard_opt_prefix_initial_vol').content;

  // set option name
  const type = `${bookedOption.name || bookedOption.displayName}${
    bookedOption.unit ? ` ${bookedOption.unit}` : ''
  }`;

  // set unit for bookedOption depending on minutes or SMS
  let serviceUnit = '';
  if (bookedOption?.serviceType === appUsageType.SMS) {
    serviceUnit = bookedOption.unit;
  } else if (bookedOption?.serviceType === appUsageType.VOICE) {
    serviceUnit = tA11yTranslate('nc_global_dboard_min_tab').content;
  }

  // store volume as rudimentary ta11y objects only with content
  let volume = {
    content: `${bookedOption.amount} ${serviceUnit}`
  };
  let amount = `${amountPrefix}${bookedOption.initialValue} ${serviceUnit}`;

  let noCounterAvailable = false;

  const flatrate = additionalInfo[bookedOption.id]?.flatrate || false;

  // calculate remaining percentage for minutes and SMS
  let remainingPercentage = 0;
  const amountAsNumber = parseFloat(bookedOption?.amount, 10);
  if (
    typeof bookedOption?.amount === 'string' &&
    typeof amountAsNumber === 'number' &&
    !Number.isNaN(amountAsNumber) &&
    typeof bookedOption?.initialValue === 'number' &&
    bookedOption.initialValue !== 0
  ) {
    remainingPercentage = amountAsNumber / bookedOption.initialValue * 100;
  }

  // former implementation for calculating percentage for data options in counters
  // maintained here for ETC options possibly not listed in counters
  if (bookedOption.remainingVolume || bookedOption.initialVolume) {
    volume = getRemainingApiVolume(bookedOption);
    amount = `${amountPrefix}${bookedOption.initialVolume}`;
    remainingPercentage = parseFloat(`${bookedOption?.remainingVolumePercentage}`.replace(',', '.'), 10) * 100;
  }

  const percentage =
    remainingPercentage > 100 ? 100 : remainingPercentage < 0 ? 0 : remainingPercentage;

  if (
    !bookedOption?.remainingVolume &&
    !bookedOption?.initialVolume &&
    !bookedOption.initialValue &&
    !bookedOption.amount
  ) {
    volume = {
      content: ''
    };
    amount = '';

    noCounterAvailable = true;
  }
  if (flatrate) {
    volume = tA11yTranslate('nc_global_dboard_opt_infinite');
    amount = '';
    noCounterAvailable = false; // refs #55297 - Reset noCounterAvailable as flatrate is unlimited
  }

  return (
    <DashboardActiveOption
      key={`dashboard-active-option-no-data-card-${index}`}
      type={type}
      volume={volume}
      amount={amount}
      volumePercentage={flatrate ? 100 : percentage}
      remainingPeriod={
        getOptionAvailableUntilDate(
          bookedOption?.optionCardType === "dataCardETCOne" ? bookedOption?.expiryTime : bookedOption?.endDateTime,
          bookedOption
        )
      }
      stageType={bookedOption?.stage}
      noCounterAvailable={noCounterAvailable}
      customClass={customClass}
      active={active}
      tabIndex={tabIndex}
      bookedOption={bookedOption}
    />
  );
}

export default GenericBookedOptionCard;
