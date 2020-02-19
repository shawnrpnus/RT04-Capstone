import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import * as PropTypes from 'prop-types';
import DropFiles from './components/DropFiles';

const FormDropzone = ({ t }) => (
  <Container>
    <Row>
      <Col md={12}>
        <h3 className="page-title">{t('forms.form_dropzone.title')}</h3>
        <h3 className="page-subhead subhead">Use this elements, if you want to show some hints or additional
              information
        </h3>
      </Col>
    </Row>
    <Row>
      <DropFiles onSubmit={() => null} />
    </Row>
  </Container>
);

FormDropzone.propTypes = {
  t: PropTypes.func.isRequired,
};

export default FormDropzone;
