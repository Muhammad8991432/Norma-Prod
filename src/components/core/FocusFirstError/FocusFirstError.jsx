import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { isOnlySpecificKeyInObjTrue } from '@utils/globalConstant';

export const FocusFirstError = ({ fromPassword }) => {
  const { submitCount, errors } = useFormikContext();
  const [submit, setSubmit] = useState(0);

  useEffect(() => {
    if (fromPassword && submitCount > 0 && submitCount !== submit) {
      const inputs = document.querySelectorAll('input');
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (input.value === '') {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          input.focus({ preventScroll: true });
          break;
        }
      }
      setSubmit(submitCount);

      // Handle immediate submit button case for oldPassword field (/account/new-password page)
      const oldPasswordElement = document.querySelector(`[name="oldPassword"]`);
      if (oldPasswordElement && submitCount === 1) {
        oldPasswordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        oldPasswordElement.focus({ preventScroll: true });
        return; // Prevent focusing on other fields
      }

      // Handle specific newPassword field case (/account/new-password page)
      const specificKey = 'match';
      const isSpecificKeyValid = isOnlySpecificKeyInObjTrue(errors.otherErrors, specificKey);

      if (!isSpecificKeyValid) {
        const newPasswordElement = document.querySelector(`[name="newPassword"]`);
        if (newPasswordElement) {
          newPasswordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          newPasswordElement.focus({ preventScroll: true });
          return;
        }
      }

      // Focus on confirmPassword field if oldPassword and newPassword are valid (/account/new-password page)
      const oldPasswordValid = !errors.oldPassword;
      const newPasswordValid = !errors.newPassword;

      if (oldPasswordValid && newPasswordValid) {
        const confirmPasswordElement = document.querySelector(`[name="confirmPassword"]`);
        if (confirmPasswordElement) {
          confirmPasswordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          confirmPasswordElement.focus({ preventScroll: true });
          return;
        }
      }

      return;
    }

    if (submitCount > 0 && submitCount !== submit && Object.keys(errors).length > 0) {
      setSubmit(submitCount);
      // Handle specific cscPassword field case
      const specificKey = 'match';
      const isSpecificKeyValid = isOnlySpecificKeyInObjTrue(errors.otherErrors, specificKey);

      if (!isSpecificKeyValid) {
        const cscPasswordElement = document.querySelector(`[name="cscPassword"]`);
        if (cscPasswordElement) {
          cscPasswordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          cscPasswordElement.focus({ preventScroll: true });
          return; // Prevent focusing on other fields
        }
      }

      const firstErrorField = Object.keys(errors)[0];
      let errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (firstErrorField === 'birthDate') {
        // Special case for birthDate, use a different selector
        const birthDateElement = document.querySelector('.duet-date__input');
        if (birthDateElement) {
          errorElement = birthDateElement;
        }
      }
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus({ preventScroll: true });
      }
    }
  }, [submitCount, errors]);

  return null;
};
