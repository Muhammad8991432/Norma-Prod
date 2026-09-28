import { createContext, useMemo, useContext, useState, useRef, useEffect } from 'react';
import { useStaticContent } from '@context/StaticContent';
import { sanitizeRichText } from '@utils/sanitizeHtml';
import PropTypes from 'prop-types';
import { stripHtml } from 'string-strip-html';

// A context to load accessibility functionality
const A11yContext = createContext();

// The top level component that will wrap our app's core features
export function A11yProvider({ children }) {
  // Hooks
  const { getStaticContentValue } = useStaticContent();

  // States
  const [isGenericApiError, setIsGenericApiError] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Refs for announcement management
  const timeoutRef = useRef(null);
  const lastAnnouncementRef = useRef('');

  // Functions
  const tA11yTranslate = (key) => {
    const content = getStaticContentValue(key);

    if (content.content === '') {
      content.content = key;
    }

    return {
      ...content,
      content: sanitizeRichText(content.content), // sanitize the content to prevent XSS attacks
      hasAriaLabel: !!content.ariaLabel, // !! converts the value to a boolean
      hasAriaDescription: !!content.ariaDescription,
      isHtml: content.type === 'html' // checks if the content type is 'html'
    };
  };

  // currently only used for creating an text for hotline password
  // in src/pages/Account/PrivateData/PrivateDataOverview/PrivateDataOverview.jsx
  function generateTextWithCharacterTypes(text) {
    const digitWordsInGerman = [
      `${tA11yTranslate('nc_global_de_zero').content}` || '0',
      `${tA11yTranslate('nc_global_de_one').content}` || '1',
      `${tA11yTranslate('nc_global_de_two').content}` || '2',
      `${tA11yTranslate('nc_global_de_three').content}` || '3',
      `${tA11yTranslate('nc_global_de_four').content}` || '4',
      `${tA11yTranslate('nc_global_de_five').content}` || '5',
      `${tA11yTranslate('nc_global_de_six').content}` || '6',
      `${tA11yTranslate('nc_global_de_seven').content}` || '7',
      `${tA11yTranslate('nc_global_de_eight').content}` || '8',
      `${tA11yTranslate('nc_global_de_nine').content}` || '9'
    ];

    return text
      .split('')
      .map((char) => {
        if (/[A-Z]/.test(char)) {
          return `${tA11yTranslate('nc_global_de_uppercase').content} ${char}`;
        }
        if (/[a-z]/.test(char)) {
          return `${tA11yTranslate('nc_global_de_lowercase').content} ${char}`;
        }
        if (/[0-9]/.test(char)) {
          // Convert digits to words
          return digitWordsInGerman[parseInt(char, 10)];
        }
        return `${tA11yTranslate('nc_global_de_symbol').content} ${char}`;
      })
      .join(', ');
  }

  // META: global page titles
  const getGlobalMetaTitles = () => ({
    globalPageTitle: tA11yTranslate('nc_global_meta_title').content,
    globalSuccessPageTitle: tA11yTranslate('nc_global_meta_title_success').content,
    globalErrorPageTitle: tA11yTranslate('nc_global_meta_title_error').content
  });

  const getStripeHTMLText = (input) => {
    const { result } = stripHtml(input);
    return result;
  }

  // Screen reader announcement function for general purposes
  // Use this for action confirmations, success messages, errors, etc.
  const announce = (message, immediate = false) => {
    if (!message) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const shouldAnnounce = immediate || lastAnnouncementRef.current !== message;

    if (shouldAnnounce) {
      setAnnouncement('');
      requestAnimationFrame(() => {
        const delay = immediate ? 200 : 300;
        timeoutRef.current = setTimeout(() => {
          setAnnouncement(message);
          lastAnnouncementRef.current = message;
          setTimeout(() => {
            setAnnouncement('');
          }, 2000);
        }, delay);
      });
    }
  };

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  // We wrap it in a useMemo for performance reasons.
  const contextPayload = useMemo(
    () => ({
      // States
      isGenericApiError,
      setIsGenericApiError,

      // Functions
      tA11yTranslate,
      generateTextWithCharacterTypes,
      getGlobalMetaTitles,
      getStripeHTMLText,
      announce
    }),
    [
      // States
      isGenericApiError,
      setIsGenericApiError,

      // Functions
      tA11yTranslate,
      generateTextWithCharacterTypes,
      getGlobalMetaTitles,
      getStripeHTMLText
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return (
    <A11yContext.Provider value={contextPayload}>
      {/* Hidden live region for screen reader announcements */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions text"
        className="sr-only"
        role="status"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap'
        }}
      >
        {announcement}
      </div>
      {children}
    </A11yContext.Provider>
  );
}

A11yProvider.propTypes = {
  children: PropTypes.node
};

// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useA11y = () => useContext(A11yContext);

export default A11yContext;
