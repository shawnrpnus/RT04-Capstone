export default class Address {
  line1;
  line2;
  postalCode;
  buildingName;
  default;
  billing;

  constructor(line1, line2, postalCode, buildingName, isDefault, isBilling) {
    this.line1 = line1;
    this.line2 = line2;
    this.postalCode = postalCode;
    this.buildingName = buildingName;
    this.default = isDefault;
    this.billing = isBilling;
  }
}
