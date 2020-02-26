
export default class CreateProductRequest {
    serialNumber;
    productName;
    description;
    price;
    cost;

   constructor(serialNumber, productName, description, price, cost) {
        this.serialNumber = serialNumber;
        this.productName = productName;
        this.description = description;
        this.price = price;
        this.cost = cost;
    }
}


