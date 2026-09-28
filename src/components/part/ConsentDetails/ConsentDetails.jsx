import { tA11y } from '@utils/a11y/a11yHelpers';
import { AppPageContentWrapper } from '@part/AppPageContentWrapper';
import { NavigationPageTitle, Ta11yText, ScrollToTop } from '@core/index';
import { useLocation, useNavigate } from 'react-router-dom';

export function ConsentDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const previousUrl = location.state?.from || '/';

  return (
    <section className="Legal-container">
      <ScrollToTop>
        <AppPageContentWrapper>
          <NavigationPageTitle
            title={tA11y('nc_reg_legal_hdl1')}
            variant="flex-xs"
            isBackButton
            onButtonClick={() => navigate(previousUrl, { state: { key: 1 } })}
            headingTag="h1"
          />
          <Ta11yText
            textContent={tA11y('nc_reg_legal_hdl2')}
            tag="h2"
            className="pt-12 nc-doomsday-h3 mb-0"
          />
          <Ta11yText
            textContent={tA11y('nc_reg_legal_txt1')}
            tag="p"
            className="pt-4 nc-realtextpro-copy"
          />

          <Ta11yText
            textContent={tA11y('nc_reg_legal_hdl3')}
            tag="h2"
            className="pt-12 nc-doomsday-h3 mb-0"
          />
          <Ta11yText
            textContent={tA11y('nc_reg_legal_txt2')}
            tag="p"
            className="pt-4 nc-realtextpro-copy"
          />

          <Ta11yText
            textContent={tA11y('nc_reg_legal_hdl4')}
            tag="h2"
            className="pt-12 nc-doomsday-h3 mb-0"
          />
          <Ta11yText
            textContent={tA11y('nc_reg_legal_txt3')}
            tag="p"
            className="pt-4 nc-realtextpro-copy"
          />
        </AppPageContentWrapper>
      </ScrollToTop>
    </section>
  );
}

export default ConsentDetails;
