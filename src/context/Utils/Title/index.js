import React, { useState, useEffect, useRef, useContext, createContext } from 'react';

// context for global title management
const TitleContext = createContext();

// provider for title management
export const TitleProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const liveRegionRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastAnnouncementRef = useRef('');

  const announceTitle = (title, immediate = false) => {
    document.title = title;
    setPageTitle(title);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const announcementText = `Seite ${title} wurde geladen`;
    const shouldAnnounce = immediate || lastAnnouncementRef.current !== announcementText;
    
    if (shouldAnnounce) {
      setAnnouncement('');
      requestAnimationFrame(() => {
        const delay = immediate ? 200 : 300;
        timeoutRef.current = setTimeout(() => {
          setAnnouncement(announcementText);
          lastAnnouncementRef.current = announcementText;
          setTimeout(() => {
            setAnnouncement('');
          }, 2000);
        }, delay);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TitleContext.Provider value={{ pageTitle, announceTitle }}>
      <div
        ref={liveRegionRef}
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
    </TitleContext.Provider>
  );
};

// hook for simple title management
export const useTitle = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error('useTitle must be used within a TitleProvider');
  }
  return context;
};