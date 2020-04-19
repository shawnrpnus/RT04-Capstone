package capstone.rt04.retailbackend.request.transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SalesByCategoryRequest {

    private String fromDateString;

    private String toDateString;
}
