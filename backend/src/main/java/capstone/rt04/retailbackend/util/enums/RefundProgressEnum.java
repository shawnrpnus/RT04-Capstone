package capstone.rt04.retailbackend.util.enums;

public enum RefundProgressEnum {
    PENDING_DELIVERY(0),
    RECEIVED_BY_STORE(1),
    HANDLED_BY_STAFF(2),
    REFUND_SUCCESS(3),
    REFUND_REJECTED(4);

    public final Integer value;

    RefundProgressEnum(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return this.value;
    }
}
