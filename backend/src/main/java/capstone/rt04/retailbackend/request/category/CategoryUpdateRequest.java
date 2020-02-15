package capstone.rt04.retailbackend.request.category;

import capstone.rt04.retailbackend.entities.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryUpdateRequest {
    @NotNull(message = "Category must be provided")
    private Category category;

    private Long parentCategoryId;
}