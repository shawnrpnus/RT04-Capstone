import React from "react";
import * as PropTypes from "prop-types";
import { MenuItem, Select } from "@material-ui/core";

//fieldName MUST correspond to entity's attribute name AND state attribute name
const MaterialNumberSelect = props => {
  const {
    fieldLabel,
    fieldName,
    onChange,
    state,
    disabled,
    objects,
    objectFieldForValue,
    objectFieldForKey,
    objectFieldToDisplay
  } = props;

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
        {objects.map(object => (
          <MenuItem
            key={`${fieldName}-${object[objectFieldForKey]}`}
            value={object[objectFieldForValue]}
          >
            {object[objectFieldToDisplay]}
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
  objects: PropTypes.arrayOf(PropTypes.object),
  objectsFieldForValue: PropTypes.string,
  objectFieldForKey: PropTypes.string,
  objectFieldToDisplay: PropTypes.string
};

export default MaterialNumberSelect;
