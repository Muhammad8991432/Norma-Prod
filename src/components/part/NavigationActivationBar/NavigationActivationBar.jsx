import React from 'react';
import './NavigationActivationBar.scss';
import { Icons, NumbersCircle, TariffBadge } from '@core/index';
import { useActivation } from '@context/MobileOne';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { useA11y } from '@context/Utils';
import { appTariffs } from '@utils/globalConstant';

export function NavigationActivationBar() {
  // Context
  const {
    currentStep,
    step2SubStep,
    setStep2SubStep,
    step3SubStep,
    setStep3SubStep,
    step7SubStep,
    setStep7SubStep,
    step8SubStep,
    setStep8SubStep,
    step9SubStep,
    setStep9SubStep,
    selectedTariffId,
    tariffActivationForm
  } = useActivation();

  const { tA11yTranslate } = useA11y();

  // Functions
  const shouldShowBackButton = () => {
    // Define when to show the back button
    if (
      (currentStep === 2 && step2SubStep === 1) ||
      (currentStep === 3 && step3SubStep === 1) ||
      (currentStep === 7 && step7SubStep === 1) ||
      (currentStep === 8 && step8SubStep === 1) ||
      (currentStep === 8 && step8SubStep === 2) ||
      (currentStep === 8 && step8SubStep === 3) ||
      (currentStep === 9 && step9SubStep === 2) ||
      (currentStep === 9 && step9SubStep === 3)
    ) {
      return true;
    }
    return false;
  };

  const onBackClick = () => {
    if (currentStep === 2 && step2SubStep === 1) {
      setStep2SubStep(0);
    } else if (currentStep === 3 && step3SubStep === 1) {
      setStep3SubStep(0);
    } else if (currentStep === 7 && step7SubStep === 1) {
      setStep7SubStep(0);
    } else if (currentStep === 8 && step8SubStep === 1) {
      setStep8SubStep(0);
    } else if (currentStep === 8 && step8SubStep === 2) {
      setStep8SubStep(0);
    } else if (currentStep === 8 && step8SubStep === 3) {
      if (
        tariffActivationForm.chosenTariffId === appTariffs.START_LTE ||
        tariffActivationForm.chosenTariffId === 0
      ) {
        // go back to activation amount page for START tariff
        setStep8SubStep(2);
      } else {
        // go directly back to activation auto-topup overview page for all other tariffs
        setStep8SubStep(0);
      }
    } else if (currentStep === 9 && step9SubStep === 2) {
      setStep9SubStep(0);
    } else if (currentStep === 9 && step9SubStep === 3) {
      setStep9SubStep(2);
    }
  };

  return (
    <div className="bg-mint-60 d-block activation-navbar">
      <div className="container-sm">
        <div className="row">
          <div className="col-lg-8 mx-auto px-3 px-sm-0 px-md-3">
            <div className="main-content pt-14 border-bottom border-white">
              <div className="upper-div d-flex justify-content-between">
                <div>
                  {shouldShowBackButton() && (
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0"
                      onClick={onBackClick}
                      aria-label={tA11y('nc_global_icn-back_aria').ariaLabel}>
                      <Icons name="backcolor" width={24} height={24} colorType="dark" />
                    </button>
                  )}
                  <div className="title align-items-center">
                    {currentStep === 1 && (
                      <h1 className="mb-0 mt-4 nc-buttontxt">
                        {tA11y('nc_reg_sim-data_page_title').content}
                      </h1>
                    )}
                    {currentStep === 2 && (
                      <h1 className="mb-0 mt-4 nc-buttontxt">
                        {tA11y('nc_reg_tariff_page_title').content}
                      </h1>
                    )}
                    {currentStep === 3 && (
                      <h1 className="mb-0 mt-4 nc-buttontxt">
                        {tA11y('nc_reg_mnp_page_title').content}
                      </h1>
                    )}
                    {currentStep === 4 && (
                      <h1 className="mb-0 mt-4 nc-buttontxt">
                        {tA11y('nc_reg_voucher_page-title').content}
                      </h1>
                    )}
                    {currentStep === 5 && (
                      <h1 className="mb-0 mt-4 nc-buttontxt">
                        {tA11y('nc_reg_page-title').content}
                      </h1>
                    )}
                    {currentStep === 6 && (
                      <h1 className="mb-0 mt-4 nc-buttontxt">
                        {tA11y('nc_reg_legi_page_title').content}
                      </h1>
                    )}
                    {currentStep === 7 && (
                      <h1 className="mb-0 mt-4 nc-buttontxt">
                        {tA11y('nc_reg_prsnl_page_title').content}
                      </h1>
                    )}
                    {currentStep === 8 && (
                      <h1 className="mb-0 mt-4 nc-buttontxt">
                        {tA11y('nc_reg_autotopup_page_title').content}
                      </h1>
                    )}
                    {currentStep === 9 && (
                      <h1 className="mb-0 mt-4 nc-buttontxt">
                        {tA11y('nc_reg_summary_page_title').content}
                      </h1>
                    )}
                  </div>
                </div>
                {selectedTariffId > 0 && tariffActivationForm.chosenTariffId !== 0 && (
                  <div>
                    <TariffBadge
                      bgColor={tariffActivationForm.tariffColor}
                      tariffName={tariffActivationForm?.chosenTariffName}
                      tariffSpeed={tariffActivationForm?.chosenTariffSpeed}
                    />
                  </div>
                )}
              </div>
              <div className="down-div position-relative">
                <div className="stepper-progress position-relative">
                  <ul
                    aria-label={tA11yTranslate("nc_reg_btn_steps").content}
                    className="d-flex justify-content-between m-0 p-0 list-unstyled">
                    {new Array(9).fill(0).map((_, index) => {
                      const step = index + 1;
                      // const isActive = step === currentStep + 1;
                      // const isCompleted = step < currentStep + 1;
                      const isActive = step === currentStep;
                      const isCompleted = step < currentStep;
                      return (
                        <li key={index}>
                          <NumbersCircle
                            step={step}
                            currentStep={currentStep}
                            // onClick={() => isLocalHost() && setCurrentStep(index + 1)}
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
    </div>
  );
}

export default NavigationActivationBar;
