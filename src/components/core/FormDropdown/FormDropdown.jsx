import React, { useEffect, useRef, useState } from 'react';
import { appAlert, appKeyCode } from '@utils/globalConstant';
import { InfoNotification } from '../InfoNotification';
import { Icons } from '../Utils/Icons/Icons';
import './FormDropdown.scss';

export function FormDropdown({
  id,
  name = 'label',
  type,
  label,
  startIcon,
  hint,
  invalid,
  invalidMessage,
  value: valueProp,
  validMessage,
  valid,
  placeholder,
  // MPS: default options props are temporary
  options = [
    // {
    //   id: 2026,
    //   label: '2026'
    // },
    // {
    //   id: 2025,
    //   label: '2025'
    // },
    // {
    //   id: 2024,
    //   label: '2024'
    // },
    // {
    //   id: 2023,
    //   label: '2023'
    // },
    // {
    //   id: 2022,
    //   label: '2022'
    // },
    // {
    //   id: 2021,
    //   label: '2021'
    // },
    // {
    //   id: 2020,
    //   label: '2020'
    // },
  ],
  onChange,
  onBlur = () => {},
  ...restProps
}) {
  // State & Refs
  const dropdownRef = useRef(null);
  const itemsRef = useRef([]);
  const listRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(valueProp);
  const [selectedVal, setSelectedVal] = useState(null);
  const [lastKeyPressed, setLastKeyPressed] = useState(null); // Track the last pressed key
  const [searchIndex, setSearchIndex] = useState(-1); // To track the index within the matched options
  const [searchLetter, setSearchLetter] = useState(''); // To store the typed letter
  // const [isTouched, setIsTouched] = useState(false);

  // Functions
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    if (!highlightedIndex) setHighlightedIndex(0);
  };

  // Function to find the next item that matches the letter
  const findNextMatch = (startIndex, letter) => {
    for (let i = startIndex; i < options.length; i += 1) {
      // Replaced ++ with i += 1
      if (options[i][name].toLowerCase().startsWith(letter)) {
        return i;
      }
    }
    return -1;
  };

  const handleKeyDown = (event) => {
    const { key, keyCode } = event;
    const items = itemsRef.current.filter(Boolean); // Remove undefined refs
    if (!items.length) return;
    if (/^[a-zA-Z]$/.test(key)) {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      if (key === lastKeyPressed) {
        // If the same letter is pressed consecutively, find the next matching option

        setSearchIndex((prev) => {
          const nextIndex = findNextMatch(prev + 1, key.toLowerCase()); // Find next match
          const updatedIndex = nextIndex !== -1 ? nextIndex : findNextMatch(0, key.toLowerCase());

          // You can use the updatedIndex value here as needed
          setHighlightedIndex(updatedIndex); // Highlight the matched option
          return updatedIndex; // This is the value that will be stored in the state
        });
      } else {
        // Reset searchIndex and set the new letter
        setSearchLetter(key.toLowerCase());
        setLastKeyPressed(key.toLowerCase());
        const newHiglightedIndex = findNextMatch(0, key.toLowerCase());
        setSearchIndex(newHiglightedIndex);
        setHighlightedIndex(newHiglightedIndex);
      }
    } else {
      switch (keyCode) {
        case appKeyCode.ESCAPE:
          closeDropdown();
          break;

        case appKeyCode.ENTER:
        case appKeyCode.SPACE: {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (highlightedIndex !== -1) {
            const selectedOption = options[highlightedIndex];
            setSelectedId(selectedOption.id);
            setSelectedVal(selectedOption.label);
            onChange(selectedOption.id);
            closeDropdown();
          }
          break;
        }

        case appKeyCode.ARROW_DOWN:
        case appKeyCode.ARROW_UP: {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (keyCode === appKeyCode.ARROW_DOWN) {
            setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
          } else {
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          }
          break;
        }

        case appKeyCode.HOME:
        case appKeyCode.END: {
          event.preventDefault();
          const selectedOption = keyCode === appKeyCode.HOME ? 0 : options.length - 1;
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(selectedOption);
          } else if (highlightedIndex !== -1) {
            setHighlightedIndex(selectedOption);
          }
          break;
        }

        case appKeyCode.TAB:
          if (isOpen && highlightedIndex !== -1) {
            const selectedOption = options[highlightedIndex];
            setSelectedId(selectedOption.id);
            setSelectedVal(selectedOption.label);
            onChange(selectedOption.id);
            closeDropdown();
            setHighlightedIndex(0);
          }
          break;

        default:
          break;
      }
    }
  };

  // Hooks
  useEffect(() => {
    if (isOpen && highlightedIndex !== -1 && itemsRef.current[highlightedIndex]) {
      const item = itemsRef.current[highlightedIndex];
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest' // scroll the item into view if it's not fully visible
      });
    }
  }, [highlightedIndex, isOpen]);

  // useEffect(() => {
  //   if (valueProp) {
  //     options.find((option) => {
  //       if (option.id === valueProp) {
  //         setSelectedVal(option.label);
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const initialId = valueProp;
    if (initialId) {
      options.find((option) => {
        if (option.id === initialId) {
          setSelectedVal(option.label);
          return true;
        }
        return false;
      });
    }
  }, [valueProp, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      {label && (
        <label id={`${id}-label`} htmlFor={id} className="form-label ps-4 ms-1">
          {label}
        </label>
      )}
      <div
        id={`${id}-combobox`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="dropdown-list"
        aria-labelledby={`${id}-label`}
        name={name}
        aria-activedescendant={isOpen ? `option-${highlightedIndex}` : undefined}
        className={`
        input-group input-group-dropdown 
        ${valid ? 'valid' : ''} 
        ${invalid ? 'invalid animate__animated animate__shakeX' : ''} 
      `}
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {startIcon && (
          <span className="input-group-text ps-6 pe-0">
            <Icons name={startIcon} colorType="dark" />
          </span>
        )}
        <div
          className="form-control form-control-placeholder custom-placehoder-pl d-flex align-items-center"
          style={{
            color: selectedVal ? '#074D52' : '#83A6A8'
          }}>
          {selectedVal ? <span>{selectedVal}</span> : <span>{placeholder}</span>}
        </div>

        <span className="input-group-text ps-0 px-6">
          <Icons name={isOpen ? 'arrowupdarkgreen' : 'arrowdowndarkgreen'} colorType="dark" />
        </span>
      </div>

      
      <ul
        role="listbox"
        id="dropdown-list"
        aria-activedescendant={isOpen ? `option-${highlightedIndex}` : undefined}
        className={`input-group-dropdown-list list-unstyled dropdown-menu w-100 bg-white px-5 pt-3 pb-2 rounded-4 my-1 ${
          isOpen ? 'show' : ''
        } ${options.length > 5 ? 'scrollable' : ''}`}
        // 1 * 32px (item height) + 8px bottom margin + 20px top/bottom padding of unordered list + 18px top/bottom margin of unordered list
        style={{ height: options.length > 5 ? '264px' : `${options.length * 32 + 8 + 20 + options.length *18}px` }}
        ref={listRef}
      >
        {options.map((option, index) => (
          <li
            key={index}
            role="option"
            id={`option-${index}`}
            aria-selected={selectedVal === option.label} // Ensure correct value
            ref={(el) => (itemsRef.current[index] = el)}
            type="button"
            onClick={() => {
              onChange(option.id);
              setSelectedId(option.id);
              setSelectedVal(option.label);
              closeDropdown();
            }}
            className={`dropdown-item input-group-dropdown-item py-2 px-4 my-2 me-5 
            ${
              index === highlightedIndex
                ? 'border border-darkgreen rounded-pill custom-dropdown-item'
                : 'border border-white'
            }
            ${
              option.id === selectedId
                ? 'bg-darkgreen rounded-pill text-white'
                : 'bg-transparent text-darkgreen'
            }
          `}
            onMouseOver={() => setHighlightedIndex(index)}
            onFocus={() => setHighlightedIndex(index)}
            style={{
              whiteSpace: 'normal',
              overflow: 'visible',
              wordWrap: 'break-word'
            }}>
            {option.label}
          </li>
        ))}
      </ul>
      {hint && !valid && !invalid && (
        <div className="form-text mt-6px ps-4">
          <InfoNotification message={hint} />
        </div>
      )}
      {invalid && invalidMessage && (
        <div className="form-text mt-6px  ps-4" id={restProps['aria-describedby']}>
          <InfoNotification type={appAlert.ERROR} message={invalidMessage} />
        </div>
      )}
      {valid && validMessage && (
        <div className="form-text mt-6px ps-4">
          <InfoNotification type={appAlert.SUCCESS} message={validMessage} />
        </div>
      )}
    </div>
  );
}

export default FormDropdown;
