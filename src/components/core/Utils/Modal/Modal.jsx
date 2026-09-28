import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Icons from '@core/Utils/Icons/Icons';
import { handleModalFocusTrap } from '@utils/a11y/focusHelpers';

export function Modal({
  isOpen,
  isCloseButton = true,
  onClose: onCloseHandler,
  children,
  modalClass = '',
  ariaLabelButton
}) {
  const modalRef = useRef(null);

  const onClose = () => {
    if (modalRef) {
      modalRef.current.classList.add('animate__animated', 'animate__fadeOutDown', 'animate__fast');
    }
    setTimeout(() => {
      onCloseHandler();
    }, 250);
  };

  // NEW: Handle modal focus trap
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      handleModalFocusTrap(e, modalRef);
    }
  };

  // Hooks
  useEffect(() => {
    if (isOpen) {
      if (modalRef) {
        modalRef.current.classList.add('animate__animated', 'animate__fadeInUp', 'animate__fast');
        modalRef.current.focus(); // NEW
      }
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown); // NEW
    } else {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown); // NEW
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown); // NEW
    };
  }, [isOpen]);

  return isOpen ? (
    <div className={`modal d-block ${modalClass} z-3`}>
      <div
        className="modal-dialog modal-dialog-scrollable modal-fullscreen"
        ref={modalRef}
        tabIndex="-1">
        <div className="modal-content rounded-top position-fixed bottom-0 pt-4 pb-10">
          <div className="modal-line mx-auto" />
          {isCloseButton && (
            <button
              type="button"
              className="btn close mb-2 p-0 position-absolute border-0"
              aria-label={ariaLabelButton}
              onClick={onClose}>
              <Icons className="modal-close-icon" name="closecolor" height={24} width={24} colorType="dark" />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  modalClass: PropTypes.string,
  onClose: PropTypes.func
};

// Modal.defaultProps = {
//   isOpen: false,
//   modalClass: '',
//   onClose: () => { }
// };

export default Modal;
