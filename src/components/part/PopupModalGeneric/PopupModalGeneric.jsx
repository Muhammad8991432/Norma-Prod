import { PopupModal } from '@part/PopupModal';
import { PopupCampaignCard } from '@core/index';

export function PopupModalGeneric({ popupCampaignDataParam, setModalState }) {
  return (
    <PopupModal>
      <PopupCampaignCard
        data={popupCampaignDataParam}
        onCardClose={() => {
          setModalState(false);
        }}
      />
    </PopupModal>
  );
}

export default PopupModalGeneric;
