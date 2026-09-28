import React from 'react';
import PropTypes from 'prop-types';
import { AccountContextProvider } from './Account';
import { ActivationContextProvider } from './Activation';
import { CustomerContextProvider } from './Customer';
import { DocumentContextProvider } from './Document';
import { LookUpContextProvider } from './LookUp';
import { NewsContextProvider } from './News';
import { TariffOptionProvider } from './TariffOption';
import { VoucherContextProvider } from './Voucher';
import { DashBoardContextProvider } from './DashBoard';

export function MobileOneProvider({ children, config, env }) {
  return (
    <>
      {/* Customer Context Provider */}
      <CustomerContextProvider {...{ config: { ...config, env } }}>
        {/* Tariff & Option Context Provider */}
        <TariffOptionProvider {...{ config: { ...config, env } }}>
          {/* Sim Activation Context Provider */}
          <ActivationContextProvider {...{ config: { ...config, env } }}>
            {/* User Account Context Provider */}
            <AccountContextProvider {...{ config: { ...config, env } }}>
              {/* Voucher Context Provider */}
              <VoucherContextProvider {...{ config: { ...config, env } }}>
                {/* Lookup Context Provider */}
                <LookUpContextProvider {...{ config: { ...config, env } }}>
                  {/* Document Context Provider */}
                  <DocumentContextProvider {...{ config: { ...config, env } }}>
                    {/* News Context Provider */}
                    <NewsContextProvider {...{ config: { ...config, env } }}>
                      {/* DashBoard Context Provider */}
                      <DashBoardContextProvider {...{ config: { ...config, env } }}>
                        {children}
                      </DashBoardContextProvider>
                    </NewsContextProvider>
                  </DocumentContextProvider>
                </LookUpContextProvider>
              </VoucherContextProvider>
            </AccountContextProvider>
          </ActivationContextProvider>
        </TariffOptionProvider>
      </CustomerContextProvider>
    </>
  );
}

MobileOneProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default MobileOneProvider;
