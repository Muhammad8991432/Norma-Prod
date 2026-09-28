import React from 'react';
import { CmsLink } from '@core/index';

export function FooterLinks() {
  return (
    <ul className="list-unstyled m-0 gap-6 d-flex flex-row flex-wrap">
      <li>
        <CmsLink linkKey="nc_ftr_lnk1" />
      </li>
      <li>
        <CmsLink linkKey="nc_ftr_lnk2" />
      </li>
      <li>
        <CmsLink linkKey="nc_ftr_lnk3" />
      </li>
      <li>
        <CmsLink linkKey="nc_ftr_lnk4" />
      </li>
      <li>
        <CmsLink linkKey="nc_ftr_lnk5" />
      </li>
    </ul>
  );
}

export default FooterLinks;
