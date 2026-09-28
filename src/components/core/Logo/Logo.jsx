import React from 'react';
import PropTypes from 'prop-types';
// import { appImages } from '@utils/globalConstant';
import useCmsImage from '@utils/useCmsImage';
import { Ta11yImage } from '@core/index';

// BFSG: add cms logos

/**
 * @param {Object} props
 * @param {'yellow' | 'mint' | 'mintWhite'} [props.variant='yellow']
 * @param {string} [props.height='56px']
 * @returns {JSX.Element}
 */

export const Logo = ({ variant = 'yellow', height = '56px', width }) => {
  const imageContentLogoYellow = useCmsImage('nc_start_logo_content-1');
  // const imageContentLogoMint = useCmsImage(''); // BFSG: add to cms
  // const imageContentLogoMintWhite = useCmsImage(''); // BFSG: add to cms

  const imgContentMap = {
    yellow: imageContentLogoYellow
    // mint: imageContentLogoMint, // BFSG: UNCOMMENT when ready
    // mintWhite: imageContentLogoMintWhite // BFSG: UNCOMMENT when ready
  };

  // const imgSrcMap = {
  //   yellow: appImages.logoYellow,
  //   mint: appImages.logoMint,
  //   mintWhite: appImages.logoMintWhite
  // };

  return (
    <>
      <Ta11yImage
        imageContent={imgContentMap[variant] || imageContentLogoYellow}
        style={{ height: height, width: width }}
      />
    </>
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['yellow', 'mint', 'mintWhite']),
  height: PropTypes.string
};

export default Logo;
