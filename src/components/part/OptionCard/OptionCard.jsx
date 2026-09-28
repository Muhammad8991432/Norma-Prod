import { Ta11yText } from '@core/index';

// previously called DayFlatBox - renamed since it's used for Dayflat, Speedon and additional options

export function OptionCard({ name = '', description = '', durationUnit, price }) {
  return (
    <div className="option-card card rounded-3 hc-border border-gray-10 bg-white text-white mb-0 animate__animated animate__flipInY">
      <div className="card-top-section p-3">
        <Ta11yText
          textContent={name}
          className="nc-doomsday-h2 text-gray-100 text-center my-4"
          tag="h3"
        />
        {description ? (
          <>
            {Array.isArray(description) ? (
              <>
                {description.map((desc, index) => (
                  <Ta11yText
                    key={`description-${index}`}
                    textContent={desc}
                    className="nc-realtextpro-copy text-gray-100 text-center mb-4"
                    tag="p"
                  />
                ))}
              </>
            ) : (
              <Ta11yText
                textContent={description}
                className="nc-realtextpro-copy text-gray-100 text-center mb-4"
                tag="p"
              />
            )}
          </>
        ) : null}
        {durationUnit ? (
          <Ta11yText
            textContent={durationUnit}
            className="nc-realtextpro-copy text-gray-100 text-center mb-4"
            tag="p"
          />
        ) : null}
      </div>
      {price ? (
        <div
          className="card-bottom-section p-3 rounded-bottom-3 text-center"
          style={{ backgroundColor: '#F7A32B' }}>
          {Array.isArray(price) ? (
            <>
              {price.map((p, index) => (
                <Ta11yText
                  key={`price-${index}`}
                  textContent={p}
                  className={`text-gray-100 text-center mx-1 ${
                    index === 0 || index === 2 ? 'nc-doomsday-h6' : 'nc-doomsday-h3 '
                  }`}
                  tag="span"
                />
              ))}
            </>
          ) : (
            <Ta11yText
              textContent={price}
              className="nc-doomsday-h3 text-gray-100 text-center m-0"
              tag="h3"
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default OptionCard;
