import Card from "../../../UI/Card/Card";
import GridContainer from "../../../Layout/components/Grid/GridContainer";
import GridItem from "../../../Layout/components/Grid/GridItem";
import React from "react";

const RefundAddressCard = ({ address }) => {
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

export default RefundAddressCard;
