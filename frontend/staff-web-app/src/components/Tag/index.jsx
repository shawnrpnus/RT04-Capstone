import React, { Component } from 'react';
import {Col, Container, Row} from 'reactstrap';
import TagEditCard from './components/TagEditCard';
import TagTable from "./components/TagTable";

const TagEdit = () => (
    <Container>
        <Row>
            <Col md={12}>
                <h3 className="page-title">Manage Tags</h3>
                <h3 className="page-subhead subhead">Manage your tags here.</h3>
            </Col>
        </Row>
        <Row>
            <TagEditCard />
        </Row>
        <Row>
            <TagTable/>
        </Row>
    </Container>
);

export default TagEdit;
