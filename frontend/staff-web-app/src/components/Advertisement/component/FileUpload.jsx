import React from "react";
import { Card, CardBody, Col, Button, ButtonToolbar } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import * as PropTypes from "prop-types";
import renderDropZoneField from "./DropZone";

const FileUpload = ({ handleOnDrop, reset, t }) => (
  <Col md={12}>
    <Card className="card--not-full-height">
      <CardBody>
        <div className="card__title">
          <h5 className="bold-text">Upload advertisement image here</h5>
          <h5 className="subhead">Preferred dimension 1000 x 517</h5>
        </div>
        <form className="form">
          <Field
            name="files"
            component={renderDropZoneField}
            handleOnDrop={handleOnDrop}
          />
        </form>
      </CardBody>
    </Card>
  </Col>
);

FileUpload.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
};

export default reduxForm({
  form: "file_upload_default" // a unique identifier for this Form
})(FileUpload);
