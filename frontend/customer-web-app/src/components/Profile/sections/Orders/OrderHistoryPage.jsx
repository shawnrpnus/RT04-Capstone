import React from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import { Button } from "components/UI/CustomButtons/Button";

function OrderHistoryPage(props) {
  return (
    <GridContainer>
      <GridItem md={12}>
        <Button color="primary" style={{ float: "right" }}>
          Filter/Sort
        </Button>
      </GridItem>
    </GridContainer>
  );
}

export default OrderHistoryPage;
