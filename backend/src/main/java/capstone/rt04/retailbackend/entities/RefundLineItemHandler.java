package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.enums.RefundProgressEnum;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class RefundLineItemHandler implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long refundLineItemHandlerId;

    private Long staffId;

    private Timestamp handledDateTime;

    private Integer quantityConfirmedRefunded;

    private RefundProgressEnum refundProgressEnum;

    @ManyToOne
    private RefundLineItem refundLineItem;

    public RefundLineItemHandler() {
        this.handledDateTime = new Timestamp(System.currentTimeMillis());
    }

    public RefundLineItemHandler(Long staffId, Integer quantityConfirmedRefunded, RefundProgressEnum refundProgressEnum) {
        this();
        this.staffId = staffId;
        this.quantityConfirmedRefunded = quantityConfirmedRefunded;
        this.refundProgressEnum = refundProgressEnum;
    }
}
