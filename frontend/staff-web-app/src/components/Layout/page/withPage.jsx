import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/core";

const override = css`
  display: block;
  margin: 0 auto;
`;

const withPage = (Component, pageTitle) => {
  return class extends React.Component {
    render() {
      const renderLoader = () => (
        <ClipLoader
          css={override}
          size={100}
          color={"#36D7B7"}
          loading={true}
        />
      );
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
                  <Component {...this.props} renderLoader={renderLoader} />
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
