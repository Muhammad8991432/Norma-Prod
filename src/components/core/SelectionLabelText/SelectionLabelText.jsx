/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { appAlert, appLinkStyle } from '@utils/globalConstant';
import { InfoNotification, Link, Ta11yText } from '@core/index';
import './SelectionLabelText.scss';
import { tA11y } from '@utils/a11y/a11yHelpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStaticContent } from '@context/StaticContent';
import { sanitizeRichText } from '@utils/sanitizeHtml';

// Reference in Figma components: footnote-txt or selection-txt

export const SelectionLabelText = ({
  id = '',
  invalid = false,
  invalidMessage = '',
  links = [],
  labelVariant,
  labelBold,
  labelNormal,
  isCmsLink = false,
  ariaDescribedby = ''
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getStaticContentValue } = useStaticContent();
  // "nc-realtextpro-footnote" for footnote-txt and "nc-realtextpro-copy" and "nc-realtextpro-copy-bold" for selection-txt (Figma
  const labelClass = labelVariant === 'sm' ? 'nc-realtextpro-footnote' : 'nc-realtextpro-copy';
  const boldLabelClass = 'nc-realtextpro-copy-bold';

  return (
    <div className="ps-3">
      <div className={`d-flex flex-column gap-1 ${labelVariant === 'sm' ? 'pt-1' : ''}`}>
        {labelBold && (
          <label className={`custom-form-label ${boldLabelClass}`} htmlFor={id}>
            <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(labelBold) }} />
          </label>
        )}
        {labelNormal && (
          <label className={`custom-form-label ${labelClass}`} htmlFor={id}>
            <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(labelNormal) }} />
          </label>
        )}
      </div>

      {links.length > 0 && !isCmsLink && (
        <ul className="list-unstyled mb-0 d-flex flex-column gap-2 pt-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link>
                <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(link) }} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {links.length > 1 && isCmsLink && (
        <ul className="list-unstyled mb-0 d-flex flex-column pt-2 gap-0">
          {links.map((link, index) => (
            <li key={index}>
              {tA11y(link)?.type === 'link' ? (
                <Link
                  linkStyle={`${appLinkStyle.PRIMARY} mb-3`}
                  href={tA11y(link).url}
                  target="_blank"
                  // linkRef={cmsLink}
                >
                  <Ta11yText textContent={tA11y(link)} tag="span" />
                </Link>
              ) : (
                <Link
                  linkStyle={`${appLinkStyle.PRIMARY} mb-3`}
                  onClick={() => navigate(
                    getStaticContentValue(`${link}_target`)?.content,
                    { state: { from: location.pathname } }
                  )}>
                  <Ta11yText textContent={tA11y(link)} tag="span" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
      
      {links.length == 1 && isCmsLink && (
        <div className="list-unstyled mb-0 d-flex flex-column pt-2 gap-0">
            {tA11y(links[0])?.type === 'link' ? (
              <Link
                linkStyle={`${appLinkStyle.PRIMARY} mb-3`}
                href={tA11y(links[0]).url}
                target="_blank"
                // linkRef={cmsLink}
              >
                <Ta11yText textContent={tA11y(links[0])} tag="span" />
              </Link>
            ) : (
              <Link
                linkStyle={`${appLinkStyle.PRIMARY} mb-3`}
                onClick={() => navigate(getStaticContentValue(`${links[0]}_target`)?.content)}>
                <Ta11yText textContent={tA11y(links[0])} tag="span" />
              </Link>
            )}
          </div>
      )}

      {invalid && invalidMessage && (
        <div className="form-text mt-0 pt-2" id={ariaDescribedby}>
          <InfoNotification type={appAlert.ERROR} message={invalidMessage} />
        </div>
      )}
    </div>
  );
};

SelectionLabelText.propTypes = {
  id: PropTypes.string,
  invalid: PropTypes.bool,
  invalidMessage: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.string),
  labelVariant: PropTypes.oneOf(['sm', 'lg'])
};

export default SelectionLabelText;
