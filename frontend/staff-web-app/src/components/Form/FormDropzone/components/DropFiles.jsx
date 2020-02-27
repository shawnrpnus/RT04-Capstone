import React from "react";
import { Card, CardBody, Col, Button, ButtonToolbar } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import * as PropTypes from "prop-types";
import renderDropZoneMultipleField from "../../../../shared/components/Form/DropZoneMultiple";

const DropFiles = ({ onDrop }) => (
  <Col md={12} lg={12}>
    <CardBody></CardBody>
  </Col>
);

DropFiles.propTypes = {
  // handleSubmit: PropTypes.func.isRequired,
  // reset: PropTypes.func.isRequired
  // t: PropTypes.func.isRequired
};

export default reduxForm({
  form: "drop_files_form" // a unique identifier for this form
})(DropFiles);
