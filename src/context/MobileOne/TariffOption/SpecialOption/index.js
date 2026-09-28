import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useStaticContent } from '@context/StaticContent';
import { useSpeedOn } from '../SpeedOn';

// Special Option Context for filtering special option (=Datenpolster) from all passOffers
export const SpecialOptionContext = createContext({});

export function SpecialOptionContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [specialOptions, setSpecialOptions] = useState([]);
  const [hasError, setHasError] = useState(false);

  // Context
  const { staticContentData } = useStaticContent();
  const { passOffers } = useSpeedOn(); // Get all passOffers from SpeedOn context

  // Functions
  const filterSpecialOptions = () => {
    const specialOptionPassCodes = staticContentData?.nc_passCodesSettings?.specialOption || [];

    if (!specialOptionPassCodes.length || !passOffers.length) {
      setSpecialOptions([]);
      return;
    }

    const filtered = passOffers.filter((offer) => specialOptionPassCodes.includes(offer.passCode));

    setSpecialOptions(filtered);
    setIsLoading(false);
  };

  // Hooks
  useEffect(() => {
    // If dependencies aren't ready yet, keep loading
    if (!staticContentData || !passOffers) {
      setIsLoading(true);
      return;
    }

    // UNCOMMENT TO SIMULATE API ERROR
    // setHasError(true);
    // setSpecialOptions([]);
    // // TODO real error handling

    // Reset error state on successful data load
    setHasError(false);

    if (passOffers.length > 0 && staticContentData) {
      filterSpecialOptions();
    }
  }, [passOffers, staticContentData]);

  // Context payload
  const contextPayload = useMemo(
    () => ({
      specialOptions,
      hasError
    }),
    [specialOptions, hasError]
  );

  return (
    <SpecialOptionContext.Provider value={contextPayload}>{children}</SpecialOptionContext.Provider>
  );
}

SpecialOptionContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useSpecialOption = () => useContext(SpecialOptionContext);

export default SpecialOptionContext;
