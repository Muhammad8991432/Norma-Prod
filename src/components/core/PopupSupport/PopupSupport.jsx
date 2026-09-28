import React from 'react';
import { tA11y } from '@utils/a11y/a11yHelpers';
import Icon from '@core/Utils/Icons/Icons';
import { appButtonTypes } from '@utils/globalConstant';
import { sanitizeRichText } from '@utils/sanitizeHtml';
import { Modal } from '../Utils/Modal/Modal';
import { ButtonPrimary } from '../ButtonPrimary';
import Image from '@core/Utils/Image';

// REFACTOR: use Ta11yText component

export function PopupSupport({
  icon,
  iconHeight = 64,
  iconWidth = 64,
  isOpen,
  title,
  leftButtonLabel,
  rightButtonLabel,
  onClose,
  bodyText,
  onRightClick,
  onLeftClick,
  isCloseButton = true,
  children,
  imgAlt,
  imgRef,
  resImgRefs
  // imgDefaultStyle,
  // imgMobileStyle,
  // imgClassName
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCloseButton={isCloseButton}
      modalClass="popup-support"
      ariaLabelCloseButton={tA11y('nc_global_icn_close_aria').ariaLabel}
    >
      <div className="container-sm">
        <div className="row">
          <div className="mx-auto col-lg-8 px-6 px-sm-3">
            <div className="modal-main-content mx-auto">
              {icon && (
                <div className="modal-icon pt-8">
                  <Icon
                    className="modal-close-icon"
                    name={icon}
                    height={iconHeight}
                    width={iconWidth}
                  />
                </div>
              )}

              {imgRef && (
                <div className="pt-8">
                  <Image
                    refs={imgRef}
                    resRefs={resImgRefs}
                    alt={imgAlt}
                    // className={imgClassName}
                    // defaultStyle={imgDefaultStyle}
                    // mobileStyle={imgMobileStyle}
                  />
                </div>
              )}

              <div className="modal-header border-0">
                {title && (
                  <h1
                    className="mt-4 pt-4 modal-title"
                    dangerouslySetInnerHTML={{ __html: sanitizeRichText(title) }}
                  />
                )}
              </div>
              <div className="modal-body pt-4">
                {bodyText && <p dangerouslySetInnerHTML={{ __html: sanitizeRichText(bodyText) }} />}
                {children}
              </div>
              {(leftButtonLabel || rightButtonLabel) && (
                <div className="d-flex justify-content-center modal-button mt-4 pt-4">
                  {leftButtonLabel && (
                    <div className="col-11 col-sm-9 col-md-9 col-lg-6 pb-12 mx-4">
                      <ButtonPrimary
                        buttonType={appButtonTypes.PRIMARY.DEFAULT}
                        label={leftButtonLabel || 'Chat'}
                        buttonContent={leftButtonLabel || 'Chat'}
                        onClick={onLeftClick}
                      />
                    </div>
                  )}
                  {rightButtonLabel && (
                    <div className="col-11 col-sm-9 col-md-9 col-lg-6 pb-12 mx-4 ">
                      <ButtonPrimary
                        buttonType={appButtonTypes.PRIMARY.MINT}
                        label={rightButtonLabel || 'Button'}
                        buttonContent={rightButtonLabel || 'Chat'}
                        onClick={onRightClick}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PopupSupport;
