import React, { Component } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import TagEditForm from "./TagEditForm";

const TagEditCard = () => (
    <Col md={12} lg={12}>
        <Card>
            <CardBody>
                <div className="card__title">
                    <h5 className="bold-text">Tag Information</h5>
                </div>
                <TagEditForm/>
            </CardBody>
        </Card>
    </Col>
)

export default TagEditCard;