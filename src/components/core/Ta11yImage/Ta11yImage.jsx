import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sanitizeSvg } from '../../../utils/sanitizeHtml';

// Base component for CMS images (check usage on the /test page)

export const Ta11yImage = ({
  imageContent,
  className,
  style,
  alt = '',
  noImgFluid = false,
  ...props
}) => {
  const [svgContent, setSvgContent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  // handle svg images from the CMS
  const isSvg = imageContent && imageContent.filename.endsWith('.svg');

  useEffect(() => {
    if (isSvg) {
      fetch(imageContent.media_url_display)
        .then((response) => response.text())
        .then((data) => {
          setSvgContent(data);
          setIsLoaded(true);
        })
        .catch((error) => {
          setIsLoaded(false);
        });
    } else {
      setSvgContent(null);
      setIsLoaded(false);
    }
  }, [imageContent, isSvg]);

  // if imageContent is not provided or does not have a media_url_display, return null
  if (!imageContent || !imageContent.media_url_display) {
    return null;
  }

  const { is_responsive_image, responsive_image } = imageContent;
  let srcSet = '';
  // if the image is marked as responsive and responsive_image data is available, construct the srcSet attribute
  if (!isSvg && is_responsive_image === 'True' && responsive_image) {
    srcSet = `${responsive_image['1x']} 1x, ${responsive_image['2x']} 2x, ${responsive_image['3x']} 3x, ${responsive_image['4x']} 4x`;
  }

  // prevents flickering of the image aria-label when the SVG image is not loaded yet
  if (isSvg && svgContent && !isLoaded) {
    return null;
  }

  if (isSvg && svgContent && isLoaded) {
    // Sanitising SVG from CMS
    const cleanSvg = sanitizeSvg(svgContent);
    return (
      <div
        role="img"
        dangerouslySetInnerHTML={{ __html: cleanSvg }}
        aria-label={isLoaded ? alt || imageContent.alt_text : undefined}
        className={`svg-container ${className}`}
        style={style}
        {...props}
      />
    );
  }

  return (
    <img
      src={imageContent.media_url_display} // for images that are not responsive_image + fallback for browsers that do not support srcSet
      srcSet={isSvg ? undefined : srcSet} // ignore srcSet for SVGs // the browser will choose the image that best matches the device's pixel density
      alt={alt || imageContent.alt_text || ''}
      className={`${noImgFluid ? '' : 'img-fluid '}${className}`}
      style={style}
      {...props}
    />
  );
};

Ta11yImage.propTypes = {
  imageContent: PropTypes.shape({
    media_url_display: PropTypes.string,
    filename: PropTypes.string
  }),
  className: PropTypes.string,
  style: PropTypes.object,
  alt: PropTypes.string,
  noImgFluid: PropTypes.bool
};

export default Ta11yImage;
