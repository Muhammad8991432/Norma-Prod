import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {string} props.bgColor
 * @param {'default' | 'samePadding' | 'bottomImage' | 'activationBar' | 'noPadding' | 'paddingTop' | 'paddingTopFull' | 'paddingBottom'} [props.containerType='default']
 * @param {React.ReactNode} props.children
 * @param {boolean} props.isCenterPageContent
 */

export function AppPageContentWrapper({
  bgColor = '',
  containerType = 'default',
  children,
  isCenterPageContent = false
}) {
  const paddingYStyles = {
    default: { paddingTop: '48px', paddingBottom: '80px' },
    samePadding: { paddingTop: '80px', paddingBottom: '80px' },
    bottomImage: { paddingTop: '68px', paddingBottom: '0' },
    activationBar: { paddingTop: '58px', paddingBottom: '80px' },
    noPadding: {},
    paddingTop: { paddingTop: '48px', paddingBottom: '0' },
    paddingTopFull: { paddingTop: '80px', paddingBottom: '0' },
    paddingBottom: { paddingTop: '0px', paddingBottom: '80px' }
  };

  return (
    <section className={bgColor}>
      <div className="container-md w-100">
        <div
          className={`row px-3 px-md-0 ${isCenterPageContent && 'd-flex vh-100 align-content-center'
            }`}>
          <div className="col-12 col-md-8 offset-md-2">
            <div style={paddingYStyles[containerType]}>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

AppPageContentWrapper.propTypes = {
  bgColor: PropTypes.string,
  containerType: PropTypes.oneOf([
    'default',
    'samePadding',
    'bottomImage',
    'activationBar',
    'noPadding',
    'paddingTop',
    'paddingTopFull',
    'paddingBottom'
  ]),
  children: PropTypes.node.isRequired
};

export default AppPageContentWrapper;
