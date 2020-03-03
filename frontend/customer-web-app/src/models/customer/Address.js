export default class Address {
  addressId;
  line1;
  line2;
  postalCode;
  buildingName;
  default;
  billing;

  constructor(addressId, line1, line2, postalCode, buildingName, isDefault, isBilling) {
    this.addressId = addressId;
    this.line1 = line1;
    this.line2 = line2;
    this.postalCode = postalCode;
    this.buildingName = buildingName;
    this.default = isDefault;
    this.billing = isBilling;
  }
}
