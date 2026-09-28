import React, { useEffect } from 'react';
import { InfoBoxSupport, InfoSnackbar } from '@core/index';

export function ErrorSupportBox({
  isGenericApiError = true,
  message,
  handleAPIErrorLink,
  id = '',
}) {

  useEffect(() => {
    if (!isGenericApiError) {
      document.getElementById('apiErrorLink')?.focus();
    } else {
      document.getElementById('infoBoxSupport')?.focus();
    }
  }, [])
  
  return (
    <div className='w-100' id={id}>
      <div className="">
        <InfoSnackbar isGenericApiError={isGenericApiError} message={message} handleAPIErrorLink={handleAPIErrorLink}/>
      </div>
      <div className="pt-8" id='infobox-error'>
        <InfoBoxSupport />
      </div>
    </div>
  );
}

export default ErrorSupportBox;
