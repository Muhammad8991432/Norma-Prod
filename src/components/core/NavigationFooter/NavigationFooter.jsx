import React from 'react';
import { NavLink } from 'react-router-dom';

import { useStaticContent } from '@context/StaticContent';
// import { useDocument } from '@context/MobileOne';
import './NavigationFooter.scss';
import { useLayout } from '@context/Utils';

export function NavigationFooter() {
  const { t } = useStaticContent();
  const { showFooter } = useLayout();

  return (
    <div className="animate__animated animate__flipInX">
      {showFooter && (
        <footer
          className="footer-custom bg-mint-100 d-flex align-items-center"
          style={{ minHeight: '86px' }}>
          <div className="container-sm">
            <div className="row">
              <div className="col-lg-8 mx-auto px-6 px-sm-0 px-md-3 py-2">
                <ul className="nav d-flex flex-wrap justify-content-center justify-content-md-between">
                  {/* Datenschutz */}
                  <li className="nav-item">
                    <NavLink
                      to={t('nc_ftr_link1_url')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link nc-doomsday-footnote-link text-white">
                      {t('nc_ftr_link1')}
                    </NavLink>
                  </li>
                  {/* Impressum */}
                  <li className="nav-item">
                    <NavLink
                      to={t('nc_ftr_link2_url')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link nc-doomsday-footnote-link text-white">
                      {t('nc_ftr_link2')}
                    </NavLink>
                  </li>
                  {/* Rechtstexte */}
                  <li className="nav-item">
                    <NavLink
                      to={t('nc_ftr_link4_url')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link nc-doomsday-footnote-link text-white">
                      {t('nc_ftr_link3')}
                    </NavLink>
                  </li>
                  {/* Produktinformationen */}
                  <li className="nav-item">
                    <NavLink
                      to={t('nc_ftr_link4_url')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link nc-doomsday-footnote-link text-white">
                      {t('nc_ftr_link4')}
                    </NavLink>
                  </li>
                  {/* Verbraucherinformationen */}
                  <li className="nav-item">
                    <NavLink
                      to={t('nc_ftr_link5_url')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link nc-doomsday-footnote-link text-white">
                      {t('nc_ftr_link5')}
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default NavigationFooter;
