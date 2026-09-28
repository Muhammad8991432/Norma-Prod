import React, { useEffect, useRef } from 'react';
import './PopupModal.scss';

export function PopupModal({ children }) {
  const popupModalRef = useRef(null);

  // Prevent losing focus when clicking outside the popup element
  const handleBackgroundClick = (e) => {
    if (popupModalRef.current && !popupModalRef.current.contains(e.target)) {
      e.stopPropagation();
      e.preventDefault();
      popupModalRef.current.focus();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleBackgroundClick);
    return () => {
      document.removeEventListener('mousedown', handleBackgroundClick);
    };
  }, []);

  return (
    <div className="popup-modal">
      <div
        className="popup-modal-content rounded-24 text-primary"
        ref={popupModalRef}
        // Important attributes to trap focus within the modal
        tabIndex={-1} // Programmatically focusable so the modal can receive initial focus
        role="dialog" // Moves the screen reader "reading model" context into the modal
        aria-modal="true" // Tells the screen readers to ignore all background content
      >
        {children}
      </div>
    </div>
  );
}

export default PopupModal;
