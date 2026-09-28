import React, { useEffect, useRef } from 'react';
import { ButtonPrimary, CmsLink, ErrorSupportBox, ScrollToTop } from '@core/index';
import { Icons } from '@core/Utils';
import { appButtonTypes } from '@utils/globalConstant';
import { sanitizeRichText } from '@utils/sanitizeHtml';

export function Feedback({
  icon,
  headingContent = {},
  copyTextContent = {},
  buttonContent,
  buttonLabel,
  onButtonClick = () => { },
  buttonIcon,
  apiError = false,
  largerButton = false
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Move screen reader focus to the success container once it is rendered.
    setTimeout(() => containerRef.current?.focus(), 100);
  }, []);

  return (
    <ScrollToTop>
      <div className="row animate__animated animate__fadeIn" ref={containerRef} tabIndex={-1}>
        <div className="text-center" aria-live="polite">
          {/* NOTE: pass colorType prop (used for high contrast mode) if light icons are needed */}
          {icon && <Icons className="pb-8" name={icon} colorType="dark" />}
          {headingContent.content !== '' &&
            headingContent.content !== undefined &&
            (headingContent.isHtml ? (
              <h1
                className="nc-doomsday-h3 p-0 m-0"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(headingContent.content) }}
              />
            ) : (
              <h1 className="nc-doomsday-h3 p-0 m-0">{headingContent.content}</h1>
            ))}
          {copyTextContent.content !== '' &&
            copyTextContent.content !== undefined &&
            (copyTextContent.isHtml ? (
              <div className="pt-8" dangerouslySetInnerHTML={{ __html: sanitizeRichText(copyTextContent.content) }} />
            ) : (
              <div className="pt-8">{copyTextContent.content}</div>
            ))}

          {apiError && (
            <div className="pt-8">
              <ErrorSupportBox />
            </div>
          )}

          <div className="row button-div pt-12 pb-0">
            <div
              className={`col-11 col-sm-8 col-md-9 col-lg-8 ${largerButton ? 'col-xl-8' : 'col-xl-6'
                } mx-auto`}>
              <ButtonPrimary
                icon={buttonIcon}
                type="button"
                buttonType={appButtonTypes.PRIMARY.DEFAULT}
                buttonContent={buttonContent}
                label={buttonLabel || 'Button'}
                onClick={onButtonClick}
              />
            </div>
          </div>
          {/* Link component skipped because not used in layouts so far */}
        </div>
      </div>
    </ScrollToTop>
  );
}

export default Feedback;
