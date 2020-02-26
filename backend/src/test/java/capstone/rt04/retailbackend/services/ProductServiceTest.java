package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductImageNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.TagNotFoundException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ProductServiceTest extends ServiceTestSetup {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private PromoCodeService promoCodeService;
    @Autowired
    private ProductService productService;
    @Autowired
    private StyleService styleService;
    @Autowired
    private TagService tagService;

    @Test
    public void createErrorProduct() throws Exception {
        try {
            Product invalidProduct = new Product("0003", null, "Fila", BigDecimal.valueOf(89.90), BigDecimal.valueOf(39.90));
            invalidProduct.setCategory(categoryService.retrieveCategoryByCategoryId(categoryFilaId));
            List<SizeEnum> sizes = new ArrayList<>();
            sizes.add(SizeEnum.S);
            sizes.add(SizeEnum.M);
            List<String> colors = new ArrayList<>();
            colors.add("Aquamarine");
            colors.add("Silver");
            productService.createNewProduct(invalidProduct, categoryFilaId, null, null, sizes, colors);
        } catch (InputDataValidationException ex) {
            Map<String, String> expectedErrorMap = new HashMap<>();
            expectedErrorMap.put("productName", "must not be null");
            assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
        }
    }

    @Test(expected = ProductVariantNotFoundException.class)
    public void CDMultipleProductVariant() throws Exception {
        List<String> colors = new ArrayList<>();
        colors.add("Ember");
        colors.add("Snow");
        List<ProductVariant> productVariants = new ArrayList<>(productService.createMultipleProductVariants(productId1, colors, sizes));
        assertThat(productVariants.size()).isNotEqualTo(0);

        for(ProductVariant productVariant : productVariants) {
            productService.deleteProductVariant(productVariant.getProductVariantId());
        }
        productService.retrieveProductVariantById(productVariants.get(0).getProductVariantId());
    }

    @Test(expected = ProductStockNotFoundException.class)
    public void CDProductStock() throws Exception {

        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);

        ProductStock validProductStock = new ProductStock(50, 100, 10, 20);
        validProductStock.setProductVariant(productVariant);

        ProductStock productStock = productService.createProductStock(validProductStock, productVariant.getProductVariantId());
        assertThat(productStock).isEqualTo(validProductStock);

        productService.deleteProductStock(productStock.getProductStockId());
        productService.retrieveProductStockById(productStock.getProductStockId());
    }

    @Test(expected = ProductImageNotFoundException.class)
    public void CDProductImage() throws Exception {
        // Create
        ProductVariant productVariant = productService.retrieveProductVariantById(productVariantId);
        ProductImage validProductImage = new ProductImage("https://i.ebayimg.com/images/g/af8AAOSwd9dcdYMT/s-l640.jpg",1);

        List<ProductImage> productImagesToAdd = new ArrayList<>();
        productImagesToAdd.add(validProductImage);

        List<ProductImage> productImages = productService.createProductImage(productImagesToAdd, productVariant.getProductVariantId());
        productVariant.getProductImages().add(productImages.get(0));
        assertThat(productImages.get(0)).isEqualTo(validProductImage);

        // Delete
        productVariant.getProductImages().remove(validProductImage);
        productService.deleteProductImage(productImages, productVariant.getProductVariantId());
        productService.retrieveProductImageById(productImages.get(0).getProductImageId());
    }

    // TODO: test assignProductStock - need to create store and warehouse service before

    @Test(expected = PromoCodeNotFoundException.class)
    public void addAndRemovePromoCode() throws Exception {
        List<Product> products = productService.retrieveAllProducts();

        PromoCode promoCode = new PromoCode("CNY Promotion", BigDecimal.TEN, BigDecimal.valueOf(5), BigDecimal.valueOf(20), 5, products);
        promoCodeService.createNewPromoCode(promoCode);

        products = productService.retrieveAllProducts();
        assertThat(products.get(0).getPromoCodes().get(0).getPromoCodeId()).isEqualTo(promoCode.getPromoCodeId());

        productService.addOrRemovePromoCode(promoCode.getPromoCodeId(), null, null, products, false);
        products = productService.retrieveAllProducts();
        assertThat(products.get(0).getPromoCodes().size()).isEqualTo(0);

        productService.addOrRemovePromoCode(promoCode.getPromoCodeId(), null, null, products, true);
        products = productService.retrieveAllProducts();
        assertThat(products.get(0).getPromoCodes().get(0).getPromoCodeId()).isEqualTo(promoCode.getPromoCodeId());

        promoCodeService.deletePromoCode(promoCode.getPromoCodeId());
        promoCodeService.retrievePromoCodeById(promoCode.getPromoCodeId());
    }

    @Test(expected = StyleNotFoundException.class)
    public void addAndRemoveStyle() throws Exception {
        List<Product> products = productService.retrieveAllProducts();
        Style style = new Style("Chic", products);
        styleService.createNewStyle(style);

        products = productService.retrieveAllProducts();
        assertThat(products.get(0).getStyles().get(0).getStyleId()).isEqualTo(style.getStyleId());

        styleService.deleteStyle(style.getStyleId());
        styleService.retrieveStyleByStyleId(style.getStyleId());
    }

    @Test(expected = TagNotFoundException.class)
    public void addAndRemoveTag() throws Exception {
        List<Product> products = productService.retrieveAllProducts();
        Tag tag = new Tag("Chic", null);
        tagService.createNewTag(tag);

        productService.addOrRemoveTag(tag.getTagId(), null, null, products);
        products = productService.retrieveAllProducts();
        assertThat(products.get(0).getTags().get(0).getTagId()).isEqualTo(tag.getTagId());

        productService.addOrRemoveTag(tag.getTagId(), null, null, new ArrayList<>());
        products = productService.retrieveAllProducts();
        assertThat(products.get(0).getTags().size()).isEqualTo(0);

        tagService.deleteTag(tag.getTagId());
        tagService.retrieveTagByTagId(tag.getTagId());
    }

    @Test
    public void retrieveProductByCategory() throws Exception {
        Category category = categoryService.retrieveCategoryByCategoryId(categoryFilaId);

        List<Product> products = productService.retrieveProductByCategory(category);
        assertThat(products.size()).isNotEqualTo(0);
    }


    @Test
    public void retrieveProductByCriteria() throws Exception {
        List<Product> products = productService.retrieveAllProducts();
        Tag tag1 = new Tag("Classy", null);
        tagService.createNewTag(tag1);
        Tag tag2 = new Tag("Urban", null);
        tagService.createNewTag(tag2);

        productService.addOrRemoveTag(tag1.getTagId(), null, null, products);
        products = productService.retrieveAllProducts();

        Category category = categoryService.retrieveCategoryByCategoryId(categoryFilaId);
        List<Tag> tags = new ArrayList<>();
        tags.add(tag1);
        List<String> colours = new ArrayList<>();
        colours.add("White");
        colours.add("Pink");

        List<Product> productList = productService.retrieveProductByCriteria(category, tags, colours, null, BigDecimal.ZERO, BigDecimal.valueOf(300), null);
        assertThat(productList.size()).isNotEqualTo(0);
        assertThat(productList.get(0).getProductName()).isEqualTo("Adidas Alpha Bounce");

        productList = productService.retrieveProductByCriteria(category, tags, colours, null, BigDecimal.ZERO, BigDecimal.valueOf(300), SortEnum.PRICE_HIGH_TO_LOW);
        assertThat(productList.get(0).getProductName()).isEqualTo("Adidas Alpha Bounce");

        productList = productService.retrieveProductByCriteria(category, tags, colours, null, BigDecimal.ZERO, BigDecimal.valueOf(300), SortEnum.PRICE_LOW_TO_HIGH);
        assertThat(productList.get(0).getProductName()).isEqualTo("Fila Disruptor II");

        colours.remove("White");
        colours.remove("Pink");
        colours.add("Red");
        productList = productService.retrieveProductByCriteria(category, tags, colours, null, BigDecimal.ZERO, BigDecimal.valueOf(300), null);
        // Product does not have Red tag
        assertThat(productList.size()).isEqualTo(0);
        colours.remove("Red");

        colours.add("White");
        tags.remove(tag1);
        productList = productService.retrieveProductByCriteria(category, tags, colours, null, BigDecimal.ZERO, BigDecimal.valueOf(500), null);
        // No tags case - one product with 'white' tag exist
        // 2 products with same tag
        assertThat(productList.size()).isEqualTo(2);

        tags.add(tag1);
        tags.add(tag2);
        colours.add("White");
        colours.add("Pink");
        colours.add("Red");
        productList = productService.retrieveProductByCriteria(category, tags, colours, null, BigDecimal.valueOf(500), BigDecimal.valueOf(300), null);
        // Wrong min price
         assertThat(productList.size()).isEqualTo(0);

        tagService.deleteTag(tag1.getTagId());
        tagService.deleteTag(tag2.getTagId());
    }

    @Test
    public void retrieveProductToShowProductStocks() throws ProductNotFoundException {
        Product originalProduct;

        List<Product> products = productService.retrieveProductStocksByParameter(storeId1, null, null);
        for(Product product : products) {

            for(ProductStock productStock : product.getProductVariants().get(0).getProductStocks()) {
                System.out.println("Product stock ID of : " + productStock.getProductStockId());
            }
        }
    }
}
