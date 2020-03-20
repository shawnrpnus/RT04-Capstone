class PromoCode {
    promoCodeName;
    flatDiscount;
    percentageDiscount;
    minimumPurchase;
    numRemaining;

    constructor(promoCodeName, flatDiscount, percentageDiscount, minimumPurchase, numRemaining) {
        this.promoCodeName = promoCodeName;
        this.flatDiscount = flatDiscount;
        this.percentageDiscount = percentageDiscount;
        this.minimumPurchase = minimumPurchase;
        this.numRemaining = numRemaining;
    }
}

export default PromoCode;