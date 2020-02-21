import React from "react";
import * as PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";

const MaterialTextField = props => {
  const {
    fieldLabel,
    fieldName,
    type,
    state,
    errors,
    onChange,
    variant,
    disabled,
    autoFocus,
    InputProps
  } = props;
  //!!.obj.property returns true if property is there, false otherwise
  return (
    <div>
      <span className="material-form__label">{fieldLabel}</span>
      <TextField
        name={fieldName}
        className="material-form__field"
        value={state[fieldName]}
        onChange={onChange}
        variant={variant}
        error={!!errors[fieldName]}
        helperText={errors[fieldName]}
        type={type}
        disabled={disabled}
        autoFocus={autoFocus}
        InputProps={InputProps}
      />
    </div>
  );
};

MaterialTextField.propTypes = {
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  fieldLabel: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  type: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool
};

MaterialTextField.defaultProps = {
  type: "text",
  variant: "standard"
};

export default MaterialTextField;
