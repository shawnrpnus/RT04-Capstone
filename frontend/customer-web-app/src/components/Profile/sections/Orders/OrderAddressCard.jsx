import React from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import { Button } from "components/UI/CustomButtons/Button";
import CardBody from "components/UI/Card/CardBody";
import Card from "components/UI/Card/Card";

const OrderAddressCard = ({ address }) => {
  return (
    <div>
      <Card plain style={{ margin: 0 }}>
        <GridContainer>
          <GridItem xs={12} sm={10} md={10}>
            <h6>{address.buildingName !== null ? address.buildingName : ""}</h6>
            {address.line1} {address.line2}
            <br />
            Singapore, S{address.postalCode}
            <br />
          </GridItem>
        </GridContainer>
      </Card>
    </div>
  );
};

export default OrderAddressCard;
