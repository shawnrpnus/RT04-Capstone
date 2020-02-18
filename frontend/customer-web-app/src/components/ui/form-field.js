import React from 'react';
import classnames from "classnames";
import * as PropTypes from 'prop-types'

/*
Expected props:
errors
onChange
state
 */
function FormField(props) {
    return (
        <span>
            <label htmlFor={props.fieldName}>{props.fieldLabel}</label>
            {props.errors[props.fieldName] && (
                <label htmlFor={props.fieldName}
                       style={{color: "red", float: "right"}}>
                    {props.errors[props.fieldName]}
                </label>
            )}
            <input type={props.type}
                   className={classnames("form-control", {"is-invalid": props.errors[props.fieldName]})}
                   id={props.fieldName}
                   name={props.fieldName}
                   value={props.state[props.fieldName]}
                   onChange={props.onChange}/>
        </span>
    );
}

FormField.propTypes = {
    errors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    fieldLabel: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    type: PropTypes.string
}

FormField.defaultProps = {
    type: "text"
}

export default FormField;
