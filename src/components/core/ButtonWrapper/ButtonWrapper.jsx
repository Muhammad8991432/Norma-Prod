// A wrapper component mostly used for primary buttons
export const ButtonWrapper = ({ children, className = '', ...props }) => (
    <div className={`col-11 col-sm-9 col-md-9 col-lg-6 mx-auto ${className}`} {...props}>
      {children}
    </div>
  );

export default ButtonWrapper;
