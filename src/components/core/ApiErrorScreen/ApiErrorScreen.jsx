import React from 'react';
import { appButtonTypes } from '@utils/globalConstant';
import Icons from '@core/Utils/Icons/Icons';
import { ButtonPrimary } from '@core/ButtonPrimary';

// This screen is shown when static content fails to load
// That's why text, image and alt/aria attributes are hardcoded

export const ApiErrorScreen = () => (
  <div
    className="d-flex flex-column justify-content-center align-items-center vh-100 bg-mint-40">
    <Icons
      name="sad"
      height={65}
      colorType="dark"
      alt="Fehler beim Laden der Seite"
    />

    <h1 className="nc-doomsday-h3 mt-8">Hoppala, leider ist etwas schief gelaufen!</h1>
    <p className="nc-realtextpro-copy mt-6">
      Hier geht’s derzeit nicht weiter. Versuche es bitte erneut.
    </p>
    <div className="text-center mt-8">
      <ButtonPrimary
        label="SEITE NEU LADEN"
        buttonType={appButtonTypes.PRIMARY.DEFAULT}
        onClick={() => window.location.reload()}
      />
    </div>
  </div>
);

export default ApiErrorScreen;
