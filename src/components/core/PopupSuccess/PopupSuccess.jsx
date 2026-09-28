import React from 'react';
import Icons from '@core/Utils/Icons/Icons';
import { appButtonTypes } from '@utils/globalConstant';
import { sanitizeRichText } from '@utils/sanitizeHtml';
import { Modal } from '../Utils/Modal/Modal';
import { ButtonPrimary } from '../ButtonPrimary';

export function PopupSuccess({
  isOpen,
  icon,
  title,
  children,
  onClose,
  onButtonClick,
  buttonLabel
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="popup-success">
      <div className="container-md">
        <div className="row">
          <div className="mx-auto col-lg-8 col-md-8 col-sm-7 col-xs-12 px-6 px-sm-0 px-md-3">
            <div className="modal-main-content mx-auto">
              {icon && (
                <div className="modal-icon pt-8">
                  {/* NOTE: pass Icons colorType prop if light icons are also needed (used for high contrast mode) */}
                  <Icons className="modal-close-icon" name={icon} height={64} width={64} colorType="dark" />
                </div>
              )}
              <div className="modal-header border-0 pt-8">
                <h3 className="modal-title" dangerouslySetInnerHTML={{ __html: sanitizeRichText(title) }} />
              </div>
              <div className="modal-body pt-8">{children}</div>
              {buttonLabel &&
                <div className="modal-button pt-8">
                  <ButtonPrimary
                    buttonType={appButtonTypes.PRIMARY.DEFAULT}
                    label={buttonLabel || 'Button'}
                    onClick={onButtonClick}
                  />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PopupSuccess;
