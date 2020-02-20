import React from 'react';
import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField";

const resolvePath = require('object-resolve-path');

const MaterialTextField = ({fieldLabel, fieldName, type, state, errors, onChange, variant}) => {
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
    variant: PropTypes.string
};

MaterialTextField.defaultProps = {
    type: "text",
    variant: "outlined"
}

export default MaterialTextField;
