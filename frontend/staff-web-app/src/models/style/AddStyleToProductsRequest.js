export default class AddStyleToProductsRequest {
    styleId;
    productIds;
  
    constructor(styleId, productIds) {
      this.styleId = styleId;
      this.productIds = productIds;
    }
  }
  