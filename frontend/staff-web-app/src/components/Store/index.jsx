import React from 'react';
import {Col, Container, Row} from 'reactstrap';
import StoreEditCard from './components/StoreEditCard';


const StoreEdit = () => (
    <Container>
        <Row>
            <Col md={12}>
                <h3 className="page-title">Manage Stores</h3>
                <h3 className="page-subhead subhead">Manage your stores here.</h3>
            </Col>
        </Row>
        <Row>
            <StoreEditCard />
        </Row>
    </Container>
);

export default StoreEdit;
