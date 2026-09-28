import React from 'react';

import { TariffContextProvider } from './Tariff';
import { SpeedOnContextProvider } from './SpeedOn';
import { RoamingContextProvider } from './Roaming';
import { OptionContextProvider } from './Option';
import { DataPassContextProvider } from './DataPass';
import { PassOfferContextProvider } from './PassOffer';
import { SpecialOptionContextProvider } from './SpecialOption';

export function TariffOptionProvider({ children }) {
  return (
    <>
      <TariffContextProvider>
        <OptionContextProvider>
          <SpeedOnContextProvider>
            <SpecialOptionContextProvider>
              <DataPassContextProvider>
                <RoamingContextProvider>
                  <PassOfferContextProvider>{children}</PassOfferContextProvider>
                </RoamingContextProvider>
              </DataPassContextProvider>
            </SpecialOptionContextProvider>
          </SpeedOnContextProvider>
        </OptionContextProvider>
      </TariffContextProvider>
    </>
  );
}

export default TariffOptionProvider;

export * from './Tariff';
export * from './SpeedOn';
export * from './Roaming';
export * from './Option';
export * from './DataPass';
export * from './PassOffer';
export * from './SpecialOption';
