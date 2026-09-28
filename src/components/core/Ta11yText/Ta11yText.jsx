/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { sanitizeRichText } from '@utils/sanitizeHtml';

export const Ta11yText = forwardRef(({
  textContent,
  className,
  tag: Tag,
  replaceText,
  replaceTextBy,
  id = '',
  ...props
}, ref) => {
  // check that headingContent is not null/undefined and that headingContent.content is not undefined/empty string
  if (!textContent || !textContent.content) {
    return null;
  }

  return textContent.isHtml ? (
    <Tag
      {...(textContent.hasAriaLabel && { 'aria-label': textContent.ariaLabel })}
      {...(textContent.hasAriaDescription && {
        'aria-description': textContent.ariaDescription
      })}
      className={className}
      dangerouslySetInnerHTML={{
        __html: sanitizeRichText(textContent.content.replace(replaceText, replaceTextBy))
      }}
      id={id || undefined}
      ref={ref}
      {...props}
    />
  ) : (
    <Tag
      {...(textContent.hasAriaLabel && { 'aria-label': textContent.ariaLabel })}
      {...(textContent.hasAriaDescription && {
        'aria-description': textContent.ariaDescription
      })}
      className={className}
      id={id || undefined}
      ref={ref}
      {...props}
    >
      {textContent.content.replace(replaceText, replaceTextBy)}
    </Tag>
  );
});

Ta11yText.propTypes = {
  textContent: PropTypes.shape({
    content: PropTypes.string,
    isHtml: PropTypes.bool
  }).isRequired,
  className: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]).isRequired
};

export default Ta11yText;
Ta11yText.displayName = 'Ta11yText';
