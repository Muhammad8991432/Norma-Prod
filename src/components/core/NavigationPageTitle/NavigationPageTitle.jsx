import React from 'react';
import PropTypes from 'prop-types';
import Icons from '@core/Utils/Icons/Icons';
import { Ta11yText } from '@core/index';
import { tA11y } from '@utils/a11y/a11yHelpers';

export function NavigationPageTitle({
  title,
  isBackButton,
  onButtonClick,
  variant = 'lg',
  headingTag = 'h1',
  ariaLabelKey = 'nc_global_icn-back_aria'
}) {
  const HeadingTag = headingTag;

  return (
    <section className="navigation-page-title text-primary">
      {variant === 'flex-lg' || variant === 'flex-sm' || variant === 'flex-xs' ? (
        <div className="d-flex align-items-center">
          {isBackButton && (
            <button
              type="button"
              className="border-0 bg-transparent p-0 me-4"
              aria-label={tA11y(ariaLabelKey).ariaLabel}
              onClick={onButtonClick}>
              <Icons className="modal-close-icon" name="backcolor" height={24} width={24} colorType="dark" />
            </button>
          )}
          <Ta11yText
            textContent={title}
            className={`m-0 text-center w-100 ${
              // eslint-disable-next-line no-nested-ternary
              variant === 'flex-lg'
                ? 'nc-doomsday-h2 lg'
                : variant === 'flex-sm'
                  ? 'nc-doomsday-h3 sm'
                  : 'nc-doomsday-h4 xs'
              }`}
            tag={HeadingTag}
          />
          {isBackButton && <div style={{ width: '48px' }} aria-hidden="true" />}
        </div>
      ) : (
        <>
          {isBackButton && (
            <div className="pb-8">
              <button
                type="button"
                className="border-0 bg-transparent p-0"
                aria-label={tA11y('nc_global_icn-back_aria').ariaLabel}
                onClick={onButtonClick}>
                <Icons className="modal-close-icon" name="backcolor" height={24} width={24} colorType="dark" />
              </button>
            </div>
          )}
          <div className="text-break">
            {variant === 'lg' && (
              <Ta11yText textContent={title} className="m-0 nc-doomsday-h2 lg" tag={HeadingTag} />
            )}
            {variant === 'sm' && (
              <Ta11yText textContent={title} className="m-0 nc-doomsday-h3 sm" tag={HeadingTag} />
            )}
            {variant === 'xs' && (
              <Ta11yText
                textContent={title}
                className="m-0 nc-realheadpro-h4 xs"
                tag={HeadingTag}
              />
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default NavigationPageTitle;

NavigationPageTitle.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isBackButton: PropTypes.bool,
  onButtonClick: PropTypes.func,
  variant: PropTypes.oneOf(['lg', 'sm', 'xs', 'flex-lg', 'flex-sm', 'flex-xs']),
  headingTag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
};
