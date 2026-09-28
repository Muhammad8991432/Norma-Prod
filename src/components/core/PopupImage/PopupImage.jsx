import React from 'react';
// import Icon from '@core/Utils/Icons';
import { appButtonTypes } from '@utils/globalConstant';
import { sanitizeRichText } from '@utils/sanitizeHtml';
import { ButtonPrimary } from '../ButtonPrimary';
import { Modal } from '../Utils/Modal/Modal';
import './PopupImage.scss';

export function PopupImage({ isOpen, title, buttonLabel, onClose, image, onButtonClick }) {
  // const imgPath = appImages[image];

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="popup-image">
      <div className="container-md">
        <div className="row">
          <div className="mx-auto col-lg-8 col-md-8 col-sm-7 col-xs-12 px-6 px-sm-0 px-md-3">
            <div className="modal-main-content mx-auto">
              <div className="modal-header border-0 mt-4 pt-4">
                <h3 className="modal-title mx-auto" dangerouslySetInnerHTML={{ __html: sanitizeRichText(title) }} />
              </div>
              <div className="modal-button mt-4 pt-4">
                <ButtonPrimary
                  buttonType={appButtonTypes.PRIMARY.DARK}
                  label={buttonLabel || 'Button'}
                  onClick={onButtonClick}
                />
              </div>
              <img className="modal-image mt-4" src={image} alt="modal-img" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PopupImage;
