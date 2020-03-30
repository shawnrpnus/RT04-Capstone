package capstone.rt04.retailbackend.entities;


import capstone.rt04.retailbackend.util.enums.RefundReasonEnum;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class RefundLineItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long refundLineItemId;

    private BigDecimal unitPrice;

    private Integer quantity;

    private BigDecimal totalPrice;

    private RefundReasonEnum refundReasonEnum;


    @ManyToOne // persistent constraint
    @JoinColumn // db constraint
    private Refund refund;

    @ManyToOne
    @JoinColumn
    private TransactionLineItem transactionLineItem;

    @OneToMany(mappedBy = "refundLineItem")
    private List<RefundLineItemHandler> refundLineItemHandlerList;

    public RefundLineItem() {
        this.refundLineItemHandlerList = new ArrayList<>();
    }

    public RefundLineItem(BigDecimal unitPrice, Integer quantity, BigDecimal totalPrice) {
        this();
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    public RefundLineItem(BigDecimal unitPrice, Integer quantity, BigDecimal totalPrice, RefundReasonEnum refundReasonEnum) {
        this();
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.refundReasonEnum = refundReasonEnum;
    }
}
