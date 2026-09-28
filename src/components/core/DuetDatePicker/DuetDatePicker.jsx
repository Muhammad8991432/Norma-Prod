import React, { useEffect, useRef, useState } from "react";
import "./DuetDatePicker.scss";
import moment from "moment";
import { InfoNotification } from "@core/InfoNotification";
import { appAlert } from "@utils/globalConstant";// Import Duet Date Picker
import { defineCustomElements } from "@duetds/date-picker/dist/loader";

// Register Duet Date Picker
defineCustomElements(window);

const localization = {
  buttonLabel: "Datum auswählen",
  placeholder: "can we add here the first possible date: today -16 years",
  selectedDateMessage: "Ausgewähltes Datum",
  prevMonthLabel: "Vorheriger Monat",
  nextMonthLabel: "Nächster Monat",
  monthSelectLabel: "Monat",
  yearSelectLabel: "Jahr",
  closeLabel: "Fenster schließen",
  calendarHeading: "GEBURTSDATUM",
  dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  monthNamesShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
  locale: "de-DE",
}

function useListener(ref, eventName, handler) {
  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      element.addEventListener(eventName, handler)
      return () => element.removeEventListener(eventName, handler)
    }
  }, [eventName, handler, ref])
}

export function DuetDatePicker({
  onChange,
  onFocus,
  onBlur,
  onOpen,
  onClose,
  // dateAdapter,
  // localization,
  label,
  id = "dob",
  hint,
  invalid,
  invalidMessage,
  valid,
  validMessage,
  value = '',
  ariaDescribedby,
  ...props
}) {
  const ref = useRef(null)
  const [localizationData, setLocalizationData] = useState(localization);

  const DATE_FORMAT = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/
  const dateAdapter = {
    parse(value = "", createDate) {
      const matches = value.replaceAll('/', '.').match(DATE_FORMAT)
      if (matches) {
        return createDate(matches[3], matches[2], matches[1])
      }
    },
    format(date) {
      return date ? moment(date).format("DD.MM.YYYY") : ""
    },
  }

  const onDatePickerFocus = (e) => {
    const input = document.getElementById(props.identifier);
    const wrapper = document.getElementById('duet-date-picker-wrapper');
    input.setAttribute('aria-describedby', ariaDescribedby);
    wrapper.setAttribute('aria-describedby', '');
    onFocus && onFocus(e);
  }

  useListener(ref, "duetChange", onChange)
  useListener(ref, "duetFocus", onDatePickerFocus)
  useListener(ref, "duetBlur", onBlur)
  useListener(ref, "duetOpen", onOpen)
  useListener(ref, "duetClose", onClose)

  useEffect(() => {
    ref.current.localization = localizationData
    ref.current.dateAdapter = dateAdapter
  }, [localizationData, dateAdapter])

  useEffect(() => {
    setLocalizationData({
      ...localization,
      placeholder: props.placeholder || localization.placeholder,
    })
  }, [])

  return (
    <div className="duet-date-picker-container">
      {label && (
        <label id={`${id}-label`} htmlFor={props.identifier} className="form-label ps-4 ms-1">
          {label}
        </label>
      )}
      <div className={`focus-wrapper ${valid ? "valid" : ""} ${invalid ? "invalid " : ""}`} id="duet-date-picker-wrapper" aria-describedby={ariaDescribedby}>
        <duet-date-picker
          ref={ref}
          value={value ? moment(value).format('YYYY-MM-DD') : ""}
          id={id}
          // accessible-described-by={ariaDescribedby}
          {...props}
        ></duet-date-picker>
      </div>
      {hint && !valid && !invalid && (
        <div className="form-text mt-6px ps-4" id={ariaDescribedby}>
          <InfoNotification message={hint} />
        </div>
      )}
      {invalid && invalidMessage && (
        <div className="form-text mt-6px ps-4" id={ariaDescribedby}>
          <InfoNotification type={appAlert.ERROR} message={invalidMessage} />
        </div>
      )}
      {valid && validMessage && (
        <div className="form-text mt-6px ps-4" id={ariaDescribedby}>
          <InfoNotification type={appAlert.SUCCESS} message={validMessage} />
        </div>
      )}
    </div>
  )
}

export default DuetDatePicker;