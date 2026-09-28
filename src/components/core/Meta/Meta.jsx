/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
// ...existing code...
import { Helmet } from 'react-helmet';
import { useA11y } from '@context/Utils/A11y';
// import { useLocation } from 'react-router-dom';

// export function Meta({ title = 'NORMA connect', description }) {
//   const [liveTitle, setLiveTitle] = useState('');
//   const { tA11yTranslate } = useA11y();
//   const location = useLocation();

//   useEffect(() => {
//     // setLiveTitle('');
//     // const timeout = setTimeout(() => {
//     setLiveTitle(title);
//     // }, 1000);

//     // const timeOutPageRead = setTimeout(() => {
//     //   const mainElementActivation = document.getElementById('activation-layout-main');
//     //   const mainElementExistingCustomer = document.getElementById('existing-customer-layout-main');
//     //   if (mainElementActivation) {
//     //     mainElementActivation.focus({ preventScroll: true, focusVisible: false });
//     //   }
//     //   else if (mainElementExistingCustomer) {
//     //     mainElementExistingCustomer.focus({ preventScroll: true, focusVisible: false });
//     //   }
//     // }, 1050);

//     return () => {
//       // clearTimeout(timeout);
//       // clearTimeout(timeOutPageRead);
//     };
//   }, [location.pathname]);

export function Meta({ title = 'NORMA connect', description }) {
  // const [liveTitle, setLiveTitle] = useState('');
  const { tA11yTranslate } = useA11y();
  // const location = useLocation();

  // useEffect(() => {
  //   // setLiveTitle('');
  //   // setLiveTitle(title);

  //   const timeout = setTimeout(() => {
  //     setLiveTitle(title);
  //     // }, 1000);
  //   }, 150);

  //   const timeOutPageRead = setTimeout(() => {
  //     const firstHeading = document.querySelector('h1');
  //     if (firstHeading) {
  //       firstHeading.setAttribute('tabIndex', '-1');
  //       firstHeading.focus({ preventScroll: true, focusVisible: false });
  //     }
  
  //   }, 250);



  //   return () => {
  //     clearTimeout(timeout);
  //     clearTimeout(timeOutPageRead);
  //   };

  // }, [location.pathname]);

  return (
    <>
      <Helmet>
        {/* ...existing meta tags... */}
        <meta name="description" content={tA11yTranslate("nc_global_meta_description").content} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Removed duplicate title and description tags */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#33b6ae" />
        <meta name="msapplication-TileColor" content="#33b6ae" />
        <meta name="theme-color" content="#ffffff" />
        {/* ...existing meta tags... */}
      </Helmet>

      {/* Hidden live region for screen readers */}
      {/* <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          height: '1px',
          overflow: 'hidden'
        }}>
        {liveTitle}
      </div> */}
    </>
  );
}

export default Meta;
