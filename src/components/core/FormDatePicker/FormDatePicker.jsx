/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-undef */
/* eslint-disable max-classes-per-file */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { format, getDaysInMonth } from 'date-fns';
import { de } from 'date-fns/locale';
import { appKeyCode } from '@utils/globalConstant';
// eslint-disable-next-line import/no-cycle
import { ButtonPrimary, FormInput } from '../index';
import './FormDatePicker.scss';
import { tA11y } from '@utils/a11y/a11yHelpers';

export function FormDatePicker({
  id,
  label,
  startIcon,
  hint,
  invalid,
  invalidMessage,
  value: valueProp,
  validMessage,
  valid,
  placeholder,
  disabled = false,
  isNextYears = false,
  popUpPicker = false,
  transparentDropDown = false,
  customClass = '',
  onChange,
  name,
  ariaDescribedby,
  onBlur = () => {}
  //   ...restProps
}) {
  const [focusDIndex, setFocusDIndex] = useState(0);
  const [focusMIndex, setFocusMIndex] = useState(0);
  const [focusYIndex, setFocusYIndex] = useState(0);
  const [isFocusOn, setIsFocusOn] = useState(null); // D: Day, M: Month, Y: Year

  // Generate arrays for days, months, and years
  const dropMenu = useRef(null);
  const dateRefs = useRef([]);
  const monthRefs = useRef([]);
  const yearRefs = useRef([]);
  const confirmButtonRef = useRef(null);
  const datePickerRef = useRef(null);

  const [days, setDays] = useState(Array.from({ length: 31 }, (_, i) => i + 1));
  const [value, setValue] = useState(valueProp);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  // const [isOutsideClick, setIsOutsideClick] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(0, i), 'LLLL', { locale: de })
  );
  const prevYears = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const nextYears = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() + i);

  // State for the selected day, month, and year
  const [selectedDay, setSelectedDay] = useState(1); // new Date().getDate()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Functions
  const toggleOpen = () => {
    if (!disabled) {
      if (isOpen) {
        setIsTouched(true);
      } else {
        setIsFocusOn(null);
      }
      setIsOpen(!isOpen);
      setIsFocus(!isFocus);
      setIsBlur(!isBlur);
    }
  };

  // Function to scroll smoothly
  const scrollSmoothly = (ref, nextIndex) => {
    ref.current[nextIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  // Handlers for selection
  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  // Update the days array based on the selected month and year
  const updateDays = (monthIndex, year) => {
    const newDaysInMonth = getDaysInMonth(new Date(year, monthIndex));
    setDays(Array.from({ length: newDaysInMonth }, (_, i) => i + 1));

    const isFocusAtLastIndex = focusDIndex >= newDaysInMonth;
    if (isFocusAtLastIndex) {
      const dNextIndex = newDaysInMonth - 1;
      setFocusDIndex(dNextIndex);
      handleDayChange(days[dNextIndex]);
      scrollSmoothly(dateRefs, dNextIndex);
      setIsFocusOn('D');
    }
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    // setSelectedDay(null); // Reset day selection
    if (month && selectedYear) {
      updateDays(month, selectedYear);
    }
  };
  const handleYearChange = (year) => {
    setSelectedYear(year);
    // setSelectedDay(null); // Reset day selection
    if (selectedMonth && year) {
      updateDays(selectedMonth, year);
    }
  };

  const placeholderText = () => {
    if (value !== '' && value !== null && value !== undefined) {
      return moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY');
    }
    return placeholder;
  };

  const onSelectDate = (event) => {
    const { keyCode } = event;
    event.preventDefault();
    if (keyCode === appKeyCode.ENTER || keyCode === appKeyCode.SPACE || event.type === 'click') {
      const date = new Date(selectedYear, selectedMonth, selectedDay);
      setValue(date);
      setIsOpen(false);
      setIsFocus(false);
      setIsTouched(true);
      setIsBlur(true);
      onChange(date);
      datePickerRef.current?.focus();
    } else if (
      (event.shiftKey && keyCode === appKeyCode.TAB) ||
      keyCode === appKeyCode.ARROW_LEFT
    ) {
      datePickerRef.current?.focus();
      setIsFocusOn('Y');
    } else if (keyCode === appKeyCode.TAB || keyCode === appKeyCode.ARROW_RIGHT) {
      datePickerRef.current?.focus();
      setIsFocusOn('D');
    } else if (keyCode === appKeyCode.ESCAPE) {
      setIsOpen(false);
      setIsFocus(false);
      setIsBlur(true);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setIsFocusOn(null);
  };

  let keyPressTimeout = null; // Global variable to store timeout

  const handleKeyDown = (event) => {
    const { keyCode } = event;
    // Prevent page scrolling, page bouncing and stop event propagation
    if (!isOpen && keyCode === appKeyCode.SPACE) {
      event.preventDefault();
    }
    if (
      isOpen &&
      [
        appKeyCode.ESCAPE,
        appKeyCode.SPACE,
        appKeyCode.ENTER,
        appKeyCode.ARROW_UP,
        appKeyCode.ARROW_DOWN,
        appKeyCode.ARROW_LEFT,
        appKeyCode.ARROW_RIGHT,
        appKeyCode.HOME,
        appKeyCode.END,
        appKeyCode.TAB,
        appKeyCode.PAGE_UP,
        appKeyCode.PAGE_DOWN
      ].includes(keyCode)
    ) {
      event.preventDefault();
    }

    // Throttle repeated key events
    if (keyPressTimeout) {
      clearTimeout(keyPressTimeout);
    }

    const yearsArr = isNextYears ? nextYears : prevYears;
    keyPressTimeout = setTimeout(() => {
      switch (keyCode) {
        case appKeyCode.ESCAPE:
          closeDropdown();
          break;

        case appKeyCode.ENTER:
        case appKeyCode.SPACE: {
          if (!isOpen) {
            setIsOpen(true);
          } else if (isOpen) {
            if (isFocusOn === 'D') {
              handleDayChange(days[focusDIndex]);
            } else if (isFocusOn === 'M') {
              handleMonthChange(focusMIndex);
            } else if (isFocusOn === 'Y') {
              handleYearChange(yearsArr[focusYIndex]);
            }
          }
          break;
        }

        case appKeyCode.HOME:
        case appKeyCode.END: {
          if (isOpen) {
            let dNextIndex;
            if (keyCode === appKeyCode.HOME) {
              dNextIndex = 0;
            } else if (keyCode === appKeyCode.END) {
              dNextIndex = days.length - 1;
            }
            setFocusDIndex(dNextIndex);
            handleDayChange(days[dNextIndex]);
            scrollSmoothly(dateRefs, dNextIndex);
          }
          break;
        }

        case appKeyCode.PAGE_UP:
        case appKeyCode.PAGE_DOWN: {
          if (isOpen) {
            if (event.shiftKey) {
              let yNextIndex;
              if (keyCode === appKeyCode.PAGE_UP) {
                if (focusYIndex === 0) {
                  yNextIndex = yearsArr.length - 1;
                } else {
                  yNextIndex = focusYIndex - 1;
                }
              } else if (keyCode === appKeyCode.PAGE_DOWN) {
                if (focusYIndex === yearsArr.length - 1) {
                  yNextIndex = 0;
                } else {
                  yNextIndex = focusYIndex + 1;
                }
              }
              setFocusYIndex(yNextIndex);
              handleYearChange(yearsArr[yNextIndex]);
              scrollSmoothly(yearRefs, yNextIndex);
            } else if (!event.shiftKey) {
              let mNextIndex;
              if (keyCode === appKeyCode.PAGE_UP) {
                if (focusMIndex === 0) {
                  mNextIndex = months.length - 1;
                } else {
                  mNextIndex = focusMIndex - 1;
                }
              } else if (keyCode === appKeyCode.PAGE_DOWN) {
                if (focusMIndex === months.length - 1) {
                  mNextIndex = 0;
                } else {
                  mNextIndex = focusMIndex + 1;
                }
              }
              setFocusMIndex(mNextIndex);
              handleMonthChange(mNextIndex);
              scrollSmoothly(monthRefs, mNextIndex);
            }
          }
          break;
        }

        case appKeyCode.ARROW_DOWN:
        case appKeyCode.ARROW_UP: {
          if (isOpen) {
            if (keyCode === appKeyCode.ARROW_DOWN) {
              if (isFocusOn === 'D') {
                setFocusDIndex((prev) => {
                  const nextIndex = Math.min(prev + 1, days.length - 1);
                  handleDayChange(days[nextIndex]);
                  scrollSmoothly(dateRefs, nextIndex);
                  return nextIndex;
                });
              } else if (isFocusOn === 'M') {
                setFocusMIndex((prev) => {
                  const nextIndex = Math.min(prev + 1, months.length - 1);
                  handleMonthChange(nextIndex);
                  scrollSmoothly(monthRefs, nextIndex);
                  return nextIndex;
                });
              } else if (isFocusOn === 'Y') {
                setFocusYIndex((prev) => {
                  const nextIndex = Math.min(prev + 1, yearsArr.length - 1);
                  handleYearChange(yearsArr[nextIndex]);
                  scrollSmoothly(yearRefs, nextIndex);
                  return nextIndex;
                });
              } else {
                setIsFocusOn('D');
              }
            } else if (keyCode === appKeyCode.ARROW_UP) {
              if (isFocusOn === 'D') {
                setFocusDIndex((prev) => {
                  const nextIndex = Math.max(prev - 1, 0);
                  handleDayChange(days[nextIndex]);
                  scrollSmoothly(dateRefs, nextIndex);
                  return nextIndex;
                });
              } else if (isFocusOn === 'M') {
                setFocusMIndex((prev) => {
                  const nextIndex = Math.max(prev - 1, 0);
                  handleMonthChange(nextIndex);
                  scrollSmoothly(monthRefs, nextIndex);
                  return nextIndex;
                });
              } else if (isFocusOn === 'Y') {
                setFocusYIndex((prev) => {
                  const nextIndex = Math.max(prev - 1, 0);
                  handleYearChange(yearsArr[nextIndex]);
                  scrollSmoothly(yearRefs, nextIndex);
                  return nextIndex;
                });
              } else {
                setIsFocusOn('D');
              }
            }
          }
          break;
        }

        case appKeyCode.ARROW_LEFT:
        case appKeyCode.ARROW_RIGHT: {
          if (isOpen) {
            if (keyCode === appKeyCode.ARROW_RIGHT) {
              if (!isFocusOn) {
                setIsFocusOn('D');
              } else if (isFocusOn === 'D') {
                setIsFocusOn('M');
              } else if (isFocusOn === 'M') {
                setIsFocusOn('Y');
              } else if (isFocusOn === 'Y') {
                setIsFocusOn(null);
                confirmButtonRef.current?.focus();
              }
            } else if (appKeyCode.ARROW_LEFT) {
              if (isFocusOn === 'Y') {
                setIsFocusOn('M');
              } else if (isFocusOn === 'M') {
                setIsFocusOn('D');
              }
            }
          }
          break;
        }

        case appKeyCode.TAB:
          if (isOpen) {
            if (event.shiftKey) {
              // Handle Shift + Tab (Move Backward)
              if (document.activeElement === confirmButtonRef.current) {
                setIsFocusOn('Y'); // Move focus back to Year when Shift+Tab is pressed from button
              } else if (isFocusOn === 'Y') {
                setIsFocusOn('M');
              } else if (isFocusOn === 'M') {
                setIsFocusOn('D');
              } else if (isFocusOn === 'D') {
                setIsFocusOn(null); // Move focus out of date picker
                closeDropdown();
              }
              break;
            }
            // Handle Normal Tab (Move Forward)
            if (isFocusOn === null) {
              setIsFocusOn('D'); // Set initial focus to Day
            } else if (isFocusOn === 'D') {
              setIsFocusOn('M');
            } else if (isFocusOn === 'M') {
              setIsFocusOn('Y');
            } else if (isFocusOn === 'Y') {
              setIsFocusOn(null);
              confirmButtonRef.current?.focus();
            }
          }
          break;

        default:
          break;
      }
    }, 100);
  };

  // Function to center selection on open
  const centerDateSelection = () => {
    if (isOpen) {
      const yearsArr = isNextYears ? nextYears : prevYears;

      const verifyIndex = (index, length) => Math.max(0, Math.min(index, length - 1));

      const dayIndex = verifyIndex(selectedDay - 1, days.length);
      const monthIndex = verifyIndex(selectedMonth, months.length);
      const yearIndex = verifyIndex(
        yearsArr.findIndex((year) => year === selectedYear),
        yearsArr.length
      );

      setFocusDIndex(dayIndex);
      setFocusMIndex(monthIndex);
      setFocusYIndex(yearIndex);

      requestAnimationFrame(() => {
        dateRefs.current[dayIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        monthRefs.current[monthIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        yearRefs.current[yearIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  };

  useEffect(() => {
    centerDateSelection();
  }, [isFocusOn, isOpen]);

  //  Hooks
  useEffect(() => {
    // Function to handle click events
    const handleClickOutside = (event) => {
      if (dropMenu.current && !dropMenu.current.contains(event.target)) {
        if (isOpen) toggleOpen();
      } else {
        // Do nothing
      }
    };

    // Add event listener to the document
    document.addEventListener('click', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      setIsFocus(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (isBlur) {
      onBlur({
        type: 'blur',
        target: {
          id,
          name: id,
          value: isBlur
        }
      });
    }
  }, [isBlur]);

  const handleInputChange = (e) => {
    const { value: inputValue } = e.target;
    if (!inputValue || inputValue === '') {
      setValue(null);
      setSelectedDay(1);
      setSelectedMonth(new Date().getMonth());
      setSelectedYear(new Date().getFullYear());
      setIsTouched(true);
      setIsOpen(false);
      setIsFocus(!isFocus);
      setIsBlur(!isBlur);
      onChange(null);
    }
  }

  const onInputBlur = (e) => {
    const { value: inputValue } = e.target;
    if (inputValue || inputValue !== '') {
      const replacedValue = inputValue.replaceAll('.', '/');
      const day = Number(replacedValue.split('/')[0]);
      const month = Number(replacedValue.split('/')[1]);
      const year = Number(replacedValue.split('/')[2]);
      if (!(isNaN(day) || isNaN(month) || isNaN(year))) {
        setSelectedDay(day);
        setSelectedMonth(month - 1); // month is zero-based in JavaScript Date
        setSelectedYear(year);
        const inputDate =  new Date(`${month}/${day}/${year}`);
        setIsTouched(true);
        setIsOpen(false);
        setIsFocus(!isFocus);
        setIsBlur(!isBlur);
        setValue(inputDate);
        onChange(inputDate);
      }
    }
    onBlur(e);
  }
  // Render the component
  return (
    <div ref={dropMenu}>
      <div
        ref={datePickerRef}
        onKeyDown={handleKeyDown}
      >
        <FormInput
          type="text"
          id={id}
          name={name}
          value={placeholderText() !== placeholder ? placeholderText() : ''}
          label={label}
          placeholder={placeholder}
          onChange={handleInputChange}
          onBlur={onInputBlur}
          valid={valid}
          invalid={invalid}
          invalidMessage={invalidMessage}
          isDatePicker
          handleCalendar={toggleOpen}
          aria-describedby={ariaDescribedby}
        />
      </div>
      {isOpen && !popUpPicker && (
        <div className={`${transparentDropDown ? '' : ' bg-white'} px-4 pt-4 rounded-4 `}>
          <div className="input-group-datepicker-list date-picker">
            <div className="row date-picker-row h-100">
              <div className="col-4 text-center date-picker-day">
                <div className="p-1">
                  {days.map((day, index) => (
                    <button
                      key={day}
                      tabIndex={-1}
                      ref={(el) => (dateRefs.current[index] = el)}
                      className={`dropdown-item py-1 ${
                        day === selectedDay && 'bg-darkgreen rounded-pill text-white'
                      } ${focusDIndex === index && isFocusOn === 'D' ? 'focus-cell' : ''}`}
                      type="button"
                      onClick={(e) => {
                        handleDayChange(day);
                        e.currentTarget.blur();
                      }}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-4 text-center date-picker-month">
                <div className="p-1">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      tabIndex={-1}
                      ref={(el) => (monthRefs.current[index] = el)}
                      className={`dropdown-item py-1 ${
                        index === selectedMonth && 'bg-darkgreen rounded-pill text-white'
                      } ${focusMIndex === index && isFocusOn === 'M' ? 'focus-cell' : ''}`}
                      type="button"
                      onClick={(e) => {
                        handleMonthChange(index)
                        e.currentTarget.blur();
                      }}>
                      {month}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-4 text-center date-picker-year">
                <div className="p-1">
                  {isNextYears
                    ? nextYears.map((year, index) => (
                        <button
                          key={year}
                          tabIndex={-1}
                          ref={(el) => (yearRefs.current[index] = el)}
                          className={`dropdown-item py-1 ${
                            year === selectedYear && 'bg-darkgreen rounded-pill text-white'
                          } ${focusYIndex === index && isFocusOn === 'Y' ? 'focus-cell' : ''}`}
                          type="button"
                          onClick={(e) => {
                            handleYearChange(year)
                            e.currentTarget.blur();
                          }}>
                          {year}
                        </button>
                      ))
                    : prevYears.map((year, index) => (
                        <button
                          key={year}
                          tabIndex={-1}
                          ref={(el) => (yearRefs.current[index] = el)}
                          className={`dropdown-item py-1 ${
                            year === selectedYear && 'bg-darkgreen rounded-pill text-white'
                          } ${focusYIndex === index && isFocusOn === 'Y' ? 'focus-cell' : ''}`}
                          type="button"
                          onClick={(e) => {
                            handleYearChange(year)
                            e.currentTarget.blur();
                          }}>
                          {year}
                        </button>
                      ))}
                </div>
              </div>
              <div className="col-12 contrast-color d-flex align-items-center justify-content-center">
                <ButtonPrimary
                  tabIndex={0}
                  onClick={onSelectDate}
                  onKeyDown={onSelectDate}
                  type="button"
                  buttonContent={tA11y("nc_datepicker_confirm_btn")}
                  btnRef={confirmButtonRef}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {isOpen && popUpPicker && (
        <div className="popup-date-picker d-flex justify-content-center align-items-start pt-4">
          <div className="bg-white p-4 rounded-4 position-relative">
            <div className="input-group-datepicker-list date-picker">
              <div className="row date-picker-row h-100">
                <div className="col-4 text-center date-picker-day">
                  <div className="p-1">
                    {days.map((day, index) => (
                      <button
                        key={day}
                        tabIndex={-1}
                        ref={(el) => (dateRefs.current[index] = el)}
                        className={`dropdown-item py-1 ${
                          day === selectedDay && 'bg-mint-100 rounded-pill text-white'
                        } ${focusDIndex === index && isFocusOn === 'D' ? 'focus-cell' : ''}`}
                        type="button"
                        onClick={() => handleDayChange(day)}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-4 text-center date-picker-month">
                  <div className="p-1">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        tabIndex={-1}
                        ref={(el) => (monthRefs.current[index] = el)}
                        className={`dropdown-item py-1 ${
                          index === selectedMonth && 'bg-mint-100 rounded-pill text-white'
                        } ${focusMIndex === index && isFocusOn === 'M' ? 'focus-cell' : ''}`}
                        type="button"
                        onClick={() => handleMonthChange(index)}>
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-4 text-center date-picker-year">
                  <div className="p-1">
                    {isNextYears
                      ? nextYears.map((year, index) => (
                          <button
                            key={year}
                            tabIndex={-1}
                            ref={(el) => (yearRefs.current[index] = el)}
                            className={`dropdown-item py-1 ${
                              year === selectedYear && 'bg-mint-100 rounded-pill text-white'
                            } ${focusYIndex === index && isFocusOn === 'Y' ? 'focus-cell' : ''}`}
                            type="button"
                            onClick={() => handleYearChange(year)}>
                            {year}
                          </button>
                        ))
                      : prevYears.map((year, index) => (
                          <button
                            key={year}
                            tabIndex={-1}
                            ref={(el) => (yearRefs.current[index] = el)}
                            className={`dropdown-item py-1 ${
                              year === selectedYear && 'bg-mint-100 rounded-pill text-white'
                            } ${focusYIndex === index && isFocusOn === 'Y' ? 'focus-cell' : ''}`}
                            type="button"
                            onClick={() => handleYearChange(year)}>
                            {year}
                          </button>
                        ))}
                  </div>
                </div>
                <div className="col-12 d-flex align-items-center justify-content-center">
                  <ButtonPrimary
                    shadow={false}
                    tabIndex={0}
                    onClick={onSelectDate}
                    onKeyDown={onSelectDate}
                    type="button"
                    buttonContent={tA11y("nc_datepicker_confirm_btn")}
                    btnRef={confirmButtonRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {hint && !valid && !invalid && (
        <div className="form-text mt-6px ps-5">
          <InfoNotification message={hint} />
        </div>
      )}
      {invalid && (!isOpen ? !isOpen : isTouched) && invalidMessage && (
        <div className="form-text mt-6px ps-5" id={ariaDescribedby}>
          <InfoNotification type={appAlert.ERROR} message={invalidMessage} />
        </div>
      )}
      {valid && validMessage && (
        <div className="form-text mt-6px ps-5">
          <InfoNotification type={appAlert.SUCCESS} message={validMessage} />
        </div>
      )} */}
    </div>
  );
}

export default FormDatePicker;
