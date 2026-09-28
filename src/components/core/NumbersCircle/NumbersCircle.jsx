import React from 'react';
import { useA11y } from '@context/Utils';
import { Icons } from '@core/Utils/Icons/Icons';
import './NumbersCircle.scss';

export function NumbersCircle({ step, currentStep, onClick, isActive, isCompleted, variant }) {
  const { tA11yTranslate } = useA11y();
  return (
    <div className="stepper-item">
      <div
        aria-label={`${step} ${tA11yTranslate('nc_reg_btn_step').content}`}
        aria-current={isActive ? 'step' : undefined}
        tabIndex={isActive ? 0 : -1}
        className={`stepper-item-content nc-doomsday-copy stepper-bg ${isActive ? 'active' : ''} ${
          isCompleted ? 'completed' : ''
        } ${isCompleted && currentStep - 1 === step - 1 ? 'animate__animated animate__flip' : ''} ${
          variant === 'outline' ? 'outline' : ''
        }`}>
        {isCompleted ? (
          variant === 'outline' ? (
            <Icons
              name="checkdarkgreen"
              colorType="dark"
              width={20}
              height={20}
              className="p-1"
              alt={tA11yTranslate('nc_reg_nav_steps_compl').content}
            />
          ) : (
            <Icons
              name="checked"
              width={20}
              height={20}
              className="p-1"
              alt={tA11yTranslate('nc_reg_nav_steps_compl').content}
            />
          )
        ) : (
          step
        )}
      </div>
    </div>
  );
}

export default NumbersCircle;
