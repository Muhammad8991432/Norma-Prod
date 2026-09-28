import React from 'react';
import './ProcessBarTopup.scss';
import { Icons, NumbersCircle, Ta11yText } from '@core/index';
import { useA11y } from '@context/Utils';

const DEFAULT_STEPS = ['RUFNUMMER', 'AUFLADEBETRAG', 'ZAHLUNG'];

export function ProcessBarTopup({
  steps = DEFAULT_STEPS,
  currentStep = 1,
  showBackButton = true,
  onBackClick,
  className = ''
}) {
  const { tA11yTranslate } = useA11y();
  const currentLabel = steps[currentStep - 1] || steps[0];

  return (
    <div className={`bg-mint-60 d-block activation-navbar process-bar-topup position-relative z-index-1 ${className}`}>
      {/* 
        These three divs were used in the iframe implementation to have full width for the process bar,
        but they are not needed anymore. We can remove them when we are sure that the iframe implementation
        is not needed anymore.
      */}
      {/* <div className="overflow-visible">
        <div className="m-0">
          <div className="col-lg-12"> */}
      <div className="container-sm">
        <div className="row">
          <div className="col-lg-8 mx-auto px-3 px-sm-0 px-md-3">
            <div className="main-content pt-14 border-bottom border-white">
              <div className="upper-div d-flex justify-content-between">
                <div>
                  {showBackButton && (currentStep === 1 || currentStep === 2 || currentStep === 3) && (
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0"
                      onClick={onBackClick}
                      // style={currentStep === 1 ? { height: '42px' } : {}}
                      aria-label={tA11yTranslate('nc_global_icn-back_aria').ariaLabel}
                    >
                      <Icons name="backcolor" width={24} height={24} colorType="dark" alt="" />
                    </button>
                  )}
                  <div className="title align-items-center">
                    <Ta11yText textContent={tA11yTranslate(currentLabel)} tag="h1" className="mb-0 mt-4 nc-buttontxt" />
                  </div>
                </div>
              </div>

              <div className="down-div position-relative">
                <div className="stepper-progress position-relative">
                  <ul
                    aria-label={tA11yTranslate("nc_reg_btn_steps").content}
                    className="d-flex justify-content-between m-0 p-0 list-unstyled"
                  >
                    {steps.map((_, index) => {
                      const step = index + 1;
                      const isActive = step === currentStep;
                      const isCompleted = step < currentStep;
                      return (
                        <li key={step}>
                          <NumbersCircle
                            step={step}
                            currentStep={currentStep}
                            isActive={isActive}
                            isCompleted={isCompleted}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default ProcessBarTopup;
