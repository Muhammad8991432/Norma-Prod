import { tA11y } from '@utils/a11y/a11yHelpers';
import './CardMain.scss';
import useCmsImage from '@utils/useCmsImage';
import { Badge, Ta11yText, Ta11yImage, Link, ButtonPrimary } from '@core/index';
import { appButtonTypes, appLinkStyle } from '@utils/globalConstant';

export function CardMain({
  cardId = '',
  selected = false,
  isRecomended = false,
  chip = '',
  headline = '',
  imageSource = '',
  description = '',
  linkProps = [],
  buttonProps = [],
  description2 = '',
  secondaryButtonProps = []
}) {
  return (
    <div
      className={`card-main-container shadow-xs p-5 animate__animated animate__flipInY h-100 ${
        isRecomended ? 'bg-primary card-dark text-white' : 'card-light text-primary'
      }`}>
      {isRecomended && (
        <div className="pb-4">
          <Badge title={chip} colorVariant="mint" />
        </div>
      )}
      {headline && (
        <Ta11yText textContent={headline} tag="h3" className="nc-doomsday-h3 pb-4 m-0" />
      )}
      <div className={`text-image-content ${isRecomended ? 'recommanded-image' : ''}`}>
        {imageSource && (
          <div className="image-content text-md-start text-center">
            <Ta11yImage imageContent={useCmsImage(imageSource)} className="img-fluid pb-4" />
          </div>
        )}
        {description && (
          <div className="text-content">
            <Ta11yText textContent={description} tag="p" className="nc-realtextpro-copy pb-4" />
          </div>
        )}
      </div>
      {linkProps.length
        ? linkProps.map((link, linkIndex) => (
            <Link
              key={`linkKey${linkIndex}`}
              linkStyle={`${isRecomended ? appLinkStyle.WHITE : appLinkStyle.PRIMARY} w-100 mb-4`}
              href="/">
              {tA11y(link.label).content}
            </Link>
          ))
        : ''}
      {buttonProps.length
        ? buttonProps.map((button, buttonIndex) => (
            <div className="mb-4" key={`buttonKey${buttonIndex}`}>
              <ButtonPrimary
                buttonType={
                  isRecomended ? appButtonTypes.PRIMARY.LIGHT : appButtonTypes.PRIMARY.DEFAULT
                }
                buttonContent={tA11y(button.title)}
                onClick={() => {
                  button.onPress(cardId);
                }}
              />
            </div>
          ))
        : ''}
      {description2 && (
        <Ta11yText textContent={description2} tag="p" className="nc-realtextpro-copy pb-3" />
      )}
      {secondaryButtonProps.length
        ? secondaryButtonProps.map((button, secondaryButtonIndex) => (
            <Link
              key={`secondaryButtonKey${secondaryButtonIndex}`}
              linkStyle={`${
                isRecomended ? appLinkStyle.WHITE : appLinkStyle.PRIMARY
              } w-100 card-link my-3`}
              href={tA11y(button.title).url}
              iconRight={
                isRecomended
                  ? 'forward'
                  : 'forwarddark'
              }
              iconColorType={isRecomended ? 'light' : 'dark'}
              >
              {tA11y(button.title).content}
            </Link>
          ))
        : ''}
    </div>
  );
}

export default CardMain;
