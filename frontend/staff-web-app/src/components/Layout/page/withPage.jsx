import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const withPage = (Component, pageTitle) => {
  return class extends React.Component {
    render() {
      return (
        <Container>
          <Row>
            <Col md={12}>
              <h3 style={{ marginBottom: "15px" }} className="page-title">
                {pageTitle}
              </h3>
              {/*<h3 className="page-subhead subhead">Manage your stores below.</h3>*/}
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={12}>
              <Card>
                <CardBody>
                  <Component {...this.props} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
  };
};

export default withPage;
