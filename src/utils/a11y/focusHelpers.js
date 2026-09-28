export const handleModalFocusTrap = (e, modalRef) => {
  const focusableModalElements = modalRef.current.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableModalElements[0];
  const lastElement = focusableModalElements[focusableModalElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
};

export const handleModalFocusTrapPopupSlider = (e, sliderRef) => {
  const focusableModalElements = sliderRef.current.querySelectorAll(
    '.custom-arrow, .active a[href], .active button, .active textarea, .active input, .active select, .active [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableModalElements[0];
  const lastElement = focusableModalElements[focusableModalElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  }
  if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
  }
};

export default handleModalFocusTrap;
