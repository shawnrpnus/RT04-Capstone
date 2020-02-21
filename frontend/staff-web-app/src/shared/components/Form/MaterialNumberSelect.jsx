import React from "react";
import * as PropTypes from "prop-types";
import {MenuItem, Select } from "@material-ui/core";

const MaterialNumberSelect = props => {
  const {
    fieldLabel,
    fieldName,
    onChange,
    optionStart,
    optionEnd,
    state,
    disabled
  } = props;

  const numberOptions = Array.from(
    { length: optionEnd - optionStart },
    (v, k) => k + optionStart
  );

  return (
    <React.Fragment>
      <div className="material-form__label">{fieldLabel}</div>
      <Select
        name={fieldName}
        className="material-form__field"
        onChange={onChange}
        value={state[fieldName]}
        disabled={disabled}
      >
        {numberOptions.map(option => (
          <MenuItem key={`${fieldName}-${option}`} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </React.Fragment>
  );
};

MaterialNumberSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  fieldLabel: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  optionStart: PropTypes.number.isRequired,
  optionEnd: PropTypes.number.isRequired
};

export default MaterialNumberSelect;
