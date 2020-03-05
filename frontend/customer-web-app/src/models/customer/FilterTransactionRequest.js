export default class FilterTransactionRequest {
  customerId;
  collectionMode;
  deliveryStatus;
  startDate; //dateTime must be in format 'YYYY-MM-DD hh:mm:ss' should start with 00:00:00
  endDate; //dateTime must be in format 'YYYY-MM-DD hh:mm:ss' end with 23:59:59
  sortEnum;

  constructor(
    customerId,
    collectionMode,
    deliveryStatus,
    startDate,
    endDate,
    sortEnum
  ) {
    this.customerId = customerId;
    this.collectionMode = collectionMode;
    this.deliveryStatus = deliveryStatus;
    this.startDate = startDate;
    this.endDate = endDate;
    this.sortEnum = sortEnum;
  }
}
