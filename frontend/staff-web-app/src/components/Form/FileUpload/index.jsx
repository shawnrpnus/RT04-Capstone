import React from "react";
import { Col, Container, Row } from "reactstrap";
import * as PropTypes from "prop-types";
import FileUploadDefault from "./components/FileUploadDefault";
import FileUploadCustomHeight from "./components/FileUploadCustomHeight";

const FileUpload = ({ t }) => (
  <Container>
    <Row>
      <Col md={12}>
        <h3 className="page-title">{t("forms.file_upload.title")}</h3>
        <h3 className="page-subhead subhead">
          Use this elements, if you want to show some hints or additional
          information
        </h3>
      </Col>
    </Row>
    <Row>
      <FileUploadDefault onSubmit={() => null} />
      <FileUploadCustomHeight onSubmit={() => null} />
    </Row>
  </Container>
);

FileUpload.propTypes = {
  t: PropTypes.func.isRequired
};

export default FileUpload;
