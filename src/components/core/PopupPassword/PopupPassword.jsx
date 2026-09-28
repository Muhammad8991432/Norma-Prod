import React from 'react';
import { Form, Formik } from 'formik';

import { useAccount } from '@context/MobileOne';
import { appButtonTypes } from '@utils/globalConstant';
import { FormInput } from '@core/FormInput';
// eslint-disable-next-line import/no-cycle
import { FormDatePicker } from '@core/FormDatePicker';
import { Modal } from '../Utils/Modal/Modal';
import { ButtonPrimary } from '../ButtonPrimary';
import Ta11yText from '@core/Ta11yText';
import { tA11y } from '@utils/a11y/a11yHelpers';

export function PopupPassword({ isOpen, title, bodyText, buttonLabel, onButtonClick, onClose }) {
  // Contexts
  const { forgotPasswordInitialValue, forgotPasswordValidation, onForgotPasswordSubmit } =
    useAccount();

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="popup-support">
      <div className="container-md text-start">
        <div className="row">
          <div className="mx-auto col-lg-8 col-md-8 col-sm-7 col-xs-12 px-6 px-sm-0 px-md-2">
            <div className="modal-main-content mx-auto">
              <div className="modal-header border-0 pt-8">
                <Ta11yText
                  tag={'h3'}
                  textContent={title}
                  className='modal-title'
                />
              </div>
              {bodyText && (
                <div className="modal-body pt-4">
                  <Ta11yText
                    tag={'p'}
                    textContent={bodyText}
                    className='modal-title'
                  />
                </div>
              )}
              <Formik
                initialValues={forgotPasswordInitialValue}
                validationSchema={forgotPasswordValidation}
                onSubmit={onForgotPasswordSubmit}>
                {({
                  values: { number, birthDate },
                  handleBlur,
                  handleChange,
                  errors,
                  touched,
                  handleSubmit
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="row form-fields pt-4 mt-4">
                      <div className="pb-6 text-left">
                        <FormInput
                          placeholder={tA11y('nc_global_phone_numbr_plc').content}
                          autoComplete="off"
                          startIcon="phonecolor"
                          id="number"
                          name="number"
                          value={number}
                          label={tA11y('nc_global_phone_numbr_lbl').content}
                          valid={touched.number && !errors.number}
                          invalid={!!touched.number && !!errors.number}
                          invalidMessage={touched.number && errors.number ? errors.number : null}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                id: 'number',
                                name: 'number',
                                value: e.target.value
                              }
                            });
                          }}
                          customClass="gray-border"
                        />
                      </div>
                      <div className="">
                        <FormDatePicker
                          // date={testDate}
                          // onDateChange={setTestDate}
                          // label="TITLE"
                          popUpPicker
                          label={tA11y('nc_global_birthday_lbl').content}
                          id="birthDate"
                          customClass="gray-border"
                          startIcon="dateGreen"
                          placeholder={tA11y('nc_global_birthday_plc').content}
                          value={birthDate}
                          onChange={(date) => {
                            handleChange({
                              target: {
                                name: 'birthDate',
                                value: date
                              }
                            });
                            // setTestDate(date);
                          }}
                          onBlur={handleBlur}
                          // autoComplete="off"
                          // valid={touched.birthDate && !errors.birthDate}
                          invalid={!!touched.birthDate && !!errors.birthDate}
                          invalidMessage={
                            touched.birthDate && errors.birthDate ? errors.birthDate : null
                          }
                        />
                      </div>
                    </div>
                    <div className="modal-button pt-6">
                      <div className="col-11 col-sm-9 col-md-9 col-lg-6 mx-auto pb-0">
                        <ButtonPrimary
                          type="submit"
                          buttonType={appButtonTypes.PRIMARY.DEFAULT}
                          buttonContent={tA11y('nc_login_forgot_pw_pop_up_btn1')}
                          onClick={onButtonClick}
                        />
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PopupPassword;
