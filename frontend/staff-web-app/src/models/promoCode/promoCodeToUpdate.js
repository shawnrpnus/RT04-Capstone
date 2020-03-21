class promoCodeToUpdate {
    promoCodeId;
    promoCodeName;
    flatDiscount;
    percentageDiscount;
    minimumPurchase;
    numRemaining;

    constructor(promoCodeId, promoCodeName, flatDiscount, percentageDiscount, minimumPurchase, numRemaining) {
        this.promoCodeId = promoCodeId;
        this.promoCodeName = promoCodeName;
        this.flatDiscount = flatDiscount;
        this.percentageDiscount = percentageDiscount;
        this.minimumPurchase = minimumPurchase;
        this.numRemaining = numRemaining;
    }
}

export default promoCodeToUpdate;