import React from 'react';
import { appButtonTypes } from '@utils/globalConstant';
import { FormInput } from '@core/FormInput';
import { Modal } from '../Utils/Modal/Modal';
import { ButtonPrimary } from '../ButtonPrimary';
import Ta11yText from '@core/Ta11yText';
import { tA11y } from '@utils/a11y/a11yHelpers';
import Icons from '@core/Utils/Icons/Icons';

export function PopupOTP({ isOpen, title, bodyText, onButtonClick, onClose, icon }) {
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="popup-support">
      <div className="container-md">
        <div className="row">
          <div className="mx-auto col-lg-8 col-md-8 col-sm-7 col-xs-12 px-6 px-sm-0 px-md-2">
            <div className="modal-main-content mx-auto">
              {icon && (
                <div className="modal-icon pt-8">
                  <Icons className="modal-close-icon" name={icon} height={64} width={64} />
                </div>
              )}
              <div className="modal-header border-0 pt-8">
                <Ta11yText
                  tag={'h3'}
                  textContent={title}
                  className='modal-title'
                />
              </div>
              {bodyText && (
                <div className="modal-body pt-4">
                  <Ta11yText
                    tag={'p'}
                    textContent={bodyText}
                    className='modal-title'
                  />
                </div>
              )}
              <div className="modal-button pt-8">
                <div className="col-11 col-sm-9 col-md-9 col-lg-6 mx-auto pb-0">
                  <ButtonPrimary
                    buttonType={appButtonTypes.PRIMARY.DEFAULT}
                    buttonContent={tA11y('nc_login_otp_modal_btn1')}
                    onClick={onButtonClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PopupOTP;
