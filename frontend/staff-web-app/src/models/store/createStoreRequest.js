
export default class CreateStoreRequest {
    storeName;
    numChangingRooms;
    openingTime;
    closingTime;
    numManagers;
    numAssistants;
    address;

    constructor(storeName, numChangingRooms, openingTime, closingTime, numManagers, numAssistants, address) {
        this.storeName = storeName;
        this.numChangingRooms = numChangingRooms;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.numManagers = numManagers;
        this.numAssistants = numAssistants;
        this.address = address;
    }
}


