import React from "react";
import * as PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";

const _ = require("lodash");

//fieldName MUST correspond to entity's attribute name AND state attribute name
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
        className="material-form__field"
        name={fieldName}
        value={_.get(state, fieldName, "")}
        error={!!errors[fieldName]}
        helperText={errors[fieldName]}
        onChange={onChange}
        variant={variant}
        type={type}
        disabled={disabled}
        autoFocus={autoFocus}
        InputProps={InputProps}
        inputProps={{ min: "0", step: "1" }}
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
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  InputProps: PropTypes.object
};

MaterialTextField.defaultProps = {
  type: "text",
  variant: "standard"
};

export default MaterialTextField;
