
export default class CreateUpdateStoreRequest {
    storeName;
    numChangingRooms;
    numReservedChangingRooms;
    openingTime;
    closingTime;
    numManagers;
    numAssistants;
    address;

    constructor(storeName, numChangingRooms, numReservedChangingRooms, openingTime, closingTime, numManagers, numAssistants, address) {
        this.storeName = storeName;
        this.numChangingRooms = numChangingRooms;
        this.numReservedChangingRooms = numReservedChangingRooms;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.numManagers = numManagers;
        this.numAssistants = numAssistants;
        this.address = address;
    }
}


