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
    fieldLabel, // whats displayed as label
    fieldName, // this must match inputState.fieldName and follow entity attributes naming
    type, //default is "text", set to "password" for pw fields
    inputState, // inputState follows {fieldName: value} format
    errors, //errors should be passed from redux store (is the errorMap sent by backend)
    onChange, // onChange function defined in component
    disabled, //whether input field is disabled
    autoFocus, //focuses the field on first mount
    InputProps, //usually for input adornments (icons in the field)
    InputLabelProps, //props for input label, usually can ignore
    variant, //variant of input field e.g. standard/outlined/filled, usually ignore
    fullWidth, //text field takes up full width of parent container
    placeholder, //initial placeholder when text field is empty
    formControlClassName, //to override formControl classes (mainly margins and padding)
    ...rest //other props e.g. inputRef
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
      {...rest}
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
