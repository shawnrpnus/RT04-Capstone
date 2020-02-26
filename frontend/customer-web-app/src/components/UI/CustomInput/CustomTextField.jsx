import React from "react";
import * as PropTypes from "prop-types";
import styles from "assets/jss/material-kit-pro-react/components/customInputStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import classNames from "classnames";

const useStyles = makeStyles(styles);

function CustomTextField(props) {
  const classes = useStyles();

  const {
    fieldLabel,
    fieldName,
    type,
    inputState,
    errors,
    onChange,
    disabled,
    autoFocus,
    InputProps, //usually for input adornments
    InputLabelProps,
    variant,
    fullWidth,
    placeholder,
    formControlClassName //to override formControl classes (mainly margins and padding)
  } = props;

  return (
    <TextField
      classes={{
        root: formControlClassName ? formControlClassName : classes.formControl
      }}
      label={fieldLabel}
      name={fieldName}
      value={inputState[fieldName]}
      error={!!errors[fieldName]}
      helperText={errors[fieldName]}
      onChange={onChange}
      variant={variant}
      type={type}
      disabled={disabled}
      autoFocus={autoFocus}
      InputProps={{
        ...InputProps,
        classes: { input: classes.input, underline: classes.underline }
      }}
      InputLabelProps={InputLabelProps}
      fullWidth={fullWidth}
      placeholder={placeholder}
    />
  );
}

CustomTextField.defaultProps = {
  fullWidth: true
};

CustomTextField.propTypes = {
  fieldLabel: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  inputState: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  InputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  variant: PropTypes.string,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string
};

export default CustomTextField;
