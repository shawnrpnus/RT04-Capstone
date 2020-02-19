import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import StoreEditForm from "./StoreEditForm";


const StoreEditCard = () => (
    <Col md={12} lg={12}>
        <Card>
            <CardBody>
                <div className="card__title">
                    <h5 className="bold-text">Store Information</h5>
                </div>
                <StoreEditForm/>
            </CardBody>
        </Card>
    </Col>
)

export default StoreEditCard;
