package capstone.rt04.retailbackend.request.staff;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.util.enums.RoleNameEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoleCreateRequest {

    private RoleNameEnum name;
    private BigDecimal salary;
}
