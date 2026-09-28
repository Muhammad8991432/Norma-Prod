// This file contains helper functions related to accessibility.

import React from 'react';
import ReactDOM from 'react-dom';
import axe from '@axe-core/react';
import axeCore from 'axe-core';
import { useStaticContent } from '@context/StaticContent';
import { sanitizeRichText } from '@utils/sanitizeHtml';
import a11yText from '@utils/a11y/a11yText.json';

// BFSG: tA11y() should be later replaced with tA11yTranslate()
// `tA11y()` retrieves CMS static content based on a given language key
// and returns an object containing the original content along with additional properties.
export const tA11y = (key) => {
  const { getStaticContentValue } = useStaticContent();
  const content = getStaticContentValue(key);

  if (content.content === "") {
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

// dynamic content in CMS values
// takes an object created by tA11y() function above and
// returns the object with dynamic content replaced
export const replaceDynamicCmsContent = (tA11yObject, pattern, replacement) => {
  let updatedA11yObject = {
    ...tA11yObject,
    content: tA11yObject.content.replace(pattern, replacement)
  };
  // dynamic content in aria label
  if (tA11yObject.hasAriaLabel) {
    updatedA11yObject = {
      ...updatedA11yObject,
      ariaLabel: tA11yObject.ariaLabel.replace(pattern, replacement)
    };
  }
  // dynamic content in aria description

  if (tA11yObject.hasAriaDescription) {
    updatedA11yObject = {
      ...updatedA11yObject,
      ariaDescription: tA11yObject.ariaDescription.replace(pattern, replacement)
    };
  }
  return updatedA11yObject;
};

// `getA11yText()` retrieves the accessibility text for a given element from a11yText.json
// not used for images/icons defined in the CMS
// see usage in: src/components/core/ExampleAccessibilityText/ExampleAccessibilityText.jsx
export const getA11yText = (id) => a11yText.elements[id] || {};

// `checkA11y()` initializes the axe-core tool for a specific component in development environment
// and logs any accessibility violations to the console
// see usage in: src/components/core/ExampleAccessibilityIssues/ExampleAccessibilityIssues.jsx
export const checkA11y = (componentName) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`✅ Axe is initialized for ${componentName}`);
    axe(React, ReactDOM, 1000);
    axeCore.run(document, (err, results) => {
      if (err) throw err;
      if (results.violations.length > 0) {
        results.violations.forEach((violation) => {
          console.log(`🔴 Violation in ${componentName}: ${violation.description}`);
          violation.nodes.forEach((node) => {
            console.log('Element causing issue:', node.target);
            console.log('HTML:', node.html);
            console.log('Failure Summary:', node.failureSummary);
            console.log('');
          });
        });
      } else {
        console.log(`🟢 No accessibility violations found in ${componentName}`);
      }
    });
  }
};
