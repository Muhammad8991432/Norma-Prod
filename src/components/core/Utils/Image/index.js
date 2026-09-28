/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { findBreakPoint } from '@utils/globalConstant';
import { useLayout } from '@context/Utils/Layout';
import { useStaticContent } from '@context/StaticContent';

export function Image({
  refs,
  resRefs,
  alt,
  className,
  defaultStyle,
  mobileStyle,
  ipadStyle,
  sectionStyle,
  sectionWithImage,
  children,
  ...props
}) {
  // Constant

  // Context
  const { mediaImage } = useStaticContent();
  const { screenSize } = useLayout();

  // State
  const [imgSrc, setImgSrc] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [imgData, setImgData] = useState({});
  const [imgWidth, setImgWidth] = useState('');
  const [imgHeight, setImgHeight] = useState('');

  // Hooks

  // NOTE: added optional chaining to ipadStyle and mobileStyle because of TypeError: cannot read property 'height' of undefined
  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let screenResolution = findBreakPoint(screenSize);
    let getImage = '';
    if (mediaImage && mediaImage.length > 0) {
      // if (screenResolution === 'lg' && (ipadStyle.height || ipadStyle.width)) {
      if (screenResolution === 'lg' && (ipadStyle?.height || ipadStyle?.width)) {
        getImage = mediaImage.find((item) => item.image_ref === refs);
        setImgWidth(`${ipadStyle?.width}px`);
        setImgHeight(`${ipadStyle?.height}px`);
      } else if (
        screenResolution === 'xxl' ||
        screenResolution === 'xl' ||
        screenResolution === 'lg'
      ) {
        getImage = mediaImage.find((item) => item.image_ref === refs);
        defaultStyle?.width
          ? setImgWidth(`${defaultStyle?.width}px`)
          : setImgWidth(`${getImage?.responsive_image?.basic_width}px`);
        defaultStyle?.height
          ? setImgHeight(`${defaultStyle?.height}px`)
          : setImgHeight(`${getImage?.responsive_image?.basic_height}px`);
      } else {
        getImage = mediaImage.find((item) => item.image_ref === resRefs);
        mobileStyle?.width
          ? setImgWidth(`${mobileStyle?.width}px`)
          : setImgWidth(`${getImage?.responsive_image?.basic_width}px`);
        mobileStyle?.height
          ? setImgHeight(`${mobileStyle?.height}px`)
          : setImgHeight(`${getImage?.responsive_image?.basic_height}px`);
      }
      setImgSrc(getImage?.media_url_display);
      setImgData(getImage);
    }

    return () => {
      setImgSrc('');
      setImgWidth('');
      setImgHeight('');
    };
  }, [mediaImage, screenSize]);

  return sectionWithImage ? (
    <section
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={className}
      style={{
        ...sectionStyle,
        background: `url(${imgSrc}) no-repeat`
      }}>
      {children}
    </section>
  ) : imgSrc ? (
    <img
      className={className}
      src={imgSrc}
      alt={alt}
      style={{ height: imgHeight, width: imgWidth }}
      loading="lazy"
    />
  ) : (
    <div
      className={className}
      data-image-refs={refs}
      data-image-src={imgSrc}
      data-image-status="not-found"
    />
  );
}

Image.propTypes = {
  refs: PropTypes.string,
  resRefs: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  sectionWithImage: PropTypes.bool,
  defaultStyle: PropTypes.shape({}),
  mobileStyle: PropTypes.shape({}),
  ipadStyle: PropTypes.shape({}),
  sectionStyle: PropTypes.shape({}),
  children: PropTypes.node
};

// Image.defaultProps = {
//   refs: '',
//   resRefs: '',
//   alt: '',
//   className: '',
//   sectionWithImage: false,
//   defaultStyle: {},
//   mobileStyle: {},
//   ipadStyle: {},
//   sectionStyle: {},
//   children: <></>
// };

export default Image;
