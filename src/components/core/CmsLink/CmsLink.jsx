import { Link, Ta11yText } from '@core/index';
import { useA11y } from '@context/Utils/A11y';
import { appLinkStyle } from '@utils/globalConstant';
import React from 'react';

export const CmsLink = ({ className, linkKey, customStyle, ...rest }) => {
  const { tA11yTranslate } = useA11y();

  const linkContent = tA11yTranslate(linkKey);

  if (!linkContent || !linkContent.content) {
    return null;
  }

  return linkContent?.type === 'link' ? (
    <Link
      label={linkContent.content}
      linkStyle={`${appLinkStyle.PRIMARY} ${className}`}
      href={linkContent.url}
      customStyle={customStyle}
      {...rest}
    />
  ) : (
    <Ta11yText tag="p" textContent={linkContent} className="" />
  );
};

export default CmsLink;
