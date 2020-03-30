package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.response.ColourToSizeImageMap;
import capstone.rt04.retailbackend.response.ProductDetailsResponse;
import capstone.rt04.retailbackend.response.SizeToProductVariantAndStockMap;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class RelationshipService {

    private final ProductService productService;

    public RelationshipService(@Lazy ProductService productService) {
        this.productService = productService;
    }

    public void clearCustomerRelationships(Customer customer) {
        customer.setVerificationCode(null);
        customer.setPassword(null);
        for (ShoppingCartItem sci : customer.getOnlineShoppingCart().getShoppingCartItems()) {
            clearShoppingCartItemRelationships(sci);
        }
        for (ShoppingCartItem sci : customer.getInStoreShoppingCart().getShoppingCartItems()) {
            clearShoppingCartItemRelationships(sci);
        }
        Store s = customer.getInStoreShoppingCart().getStore();
        if (s != null){
            s.setProductStocks(null);
            s.setStaff(null);
            s.setTransactions(null);
            s.setInStoreRestockOrders(null);
            s.setReservations(null);
        }
        for (ProductVariant pv : customer.getWishlistItems()) {
            clearCustomerReservationOrWishlist(pv);
        }
        for (ProductVariant pv : customer.getReservationCartItems()) {
            clearCustomerReservationOrWishlist(pv);
        }
        customer.setReviews(null);
        if (customer.getStyle() != null) {
            customer.getStyle().setProducts(null);
            customer.getStyle().setCustomers(null);
        }
        customer.setReservations(null);
        customer.setTransactions(null);
    }

    public void clearCustomerReservationOrWishlist(ProductVariant productVariant) {
        productVariant.getProduct().setProductVariants(null);
        productVariant.getProduct().setTags(null);
        productVariant.getProduct().setCategory(null);
        productVariant.getProduct().setStyles(null);
        removeStoreStocksFromProductVariant(productVariant);
        clearDiscountRelationships(productVariant.getProduct().getDiscounts());
        applyDiscount(productVariant);
    }

    private void applyDiscount(ProductVariant productVariant) {
        List<Discount> discounts = productVariant.getProduct().getDiscounts();
        if (discounts != null && discounts.size() > 0) {
            for (Discount discount : discounts) {
                BigDecimal discountPrice = productService.applyDiscount(discount, productVariant.getProduct(), null);
                productVariant.getProduct().setDiscountedPrice(discountPrice);
                if (discountPrice != null) return;
            }
        } else {
            productVariant.getProduct().setDiscountedPrice(null);
        }
    }

    private void clearShoppingCartItemRelationships(ShoppingCartItem sci) {
        if (sci.getProductVariant() != null) {
            sci.getProductVariant().getProduct().setProductVariants(null);
            sci.getProductVariant().getProduct().setTags(null);
            sci.getProductVariant().getProduct().setCategory(null);
            sci.getProductVariant().getProduct().setStyles(null);
            removeStoreStocksFromProductVariant(sci.getProductVariant());
        }
    }

    private void removeStoreStocksFromProductVariant(ProductVariant pv) {
        List<ProductStock> pdtStocks = pv.getProductStocks();
        for (int i = 0; i < pdtStocks.size(); i++) { //remove all store stocks
            if (pdtStocks.get(i).getStore() != null) {
                pv.getProductStocks().remove(pdtStocks.get(i));
                i--;
            }
        }
        for (ProductStock ps : pv.getProductStocks()) {
            ps.setProductVariant(null);
            ps.setWarehouse(null);
        }
        applyDiscount(pv);
    }

    public void clearPdrRelationships(List<ProductDetailsResponse> PDRs, boolean needProductProductVariants) {
        for (ProductDetailsResponse pdr : PDRs) {
            if (!needProductProductVariants) {
                pdr.getProduct().setProductVariants(null);
            } else {
                for (ProductVariant pv : pdr.getProduct().getProductVariants()) {
                    pv.setProductStocks(null);
                    applyDiscount(pv);
                }
            }
            for (Tag tag : pdr.getProduct().getTags()) {
                tag.setProducts(null);
            }

            for (Review review : pdr.getProduct().getReviews()) {
                review.setProduct(null);
                review.setCustomer(null);
                review.setStaff(null);
            }

            for (Style style : pdr.getProduct().getStyles()) {
                style.setProducts(null);
                style.setCustomers(null);
            }

            clearDiscountRelationships(pdr.getProduct().getDiscounts());

            pdr.getProduct().getCategory().setProducts(null);
            pdr.getProduct().getCategory().setParentCategory(null);
            pdr.getProduct().getCategory().setChildCategories(null);
            for (ColourToSizeImageMap csiMap : pdr.getColourToSizeImageMaps()) {
                for (SizeToProductVariantAndStockMap spvsMap : csiMap.getSizeMaps()) {
                    if (spvsMap.getProductStock() != null) {
                        spvsMap.getProductStock().setStore(null);
                        if (spvsMap.getProductStock().getProductVariant() != null) {
                            spvsMap.getProductStock().getProductVariant().setProductStocks(null);
                            spvsMap.getProductStock().getProductVariant().setProductImages(null);
                            spvsMap.getProductStock().getProductVariant().setProduct(null);
                            spvsMap.getProductStock().getProductVariant().setSizeDetails(null);
                            spvsMap.getProductStock().setWarehouse(null);
                        }
                    }
                }
            }
        }
    }

    public void clearTransactionRelationships(Transaction transaction) {
        transaction.setCustomer(null);
        transaction.setDeliveries(null);

        for (TransactionLineItem transactionLineItem : transaction.getTransactionLineItems()) {
            ProductVariant productVariant = transactionLineItem.getProductVariant();
            productVariant.setProductStocks(null);
            applyDiscount(productVariant);
            Product product = transactionLineItem.getProductVariant().getProduct();
            transactionLineItem.getProductVariant().getProduct().setCategory(null);
            transactionLineItem.getProductVariant().getProduct().setProductVariants(null);
            transactionLineItem.getProductVariant().getProduct().setStyles(null);
            transactionLineItem.setTransaction(null);
            product.setTags(null);
            product.setReviews(null);
            product.setDiscounts(null);
        }
        if (transaction.getStoreToCollect() != null)
            clearStoreRelationships(transaction.getStoreToCollect());
    }

    public void clearTransactionRelationshipsForStaffSide(Transaction transaction) {
        for (TransactionLineItem transactionLineItem : transaction.getTransactionLineItems()) {
            ProductVariant productVariant = transactionLineItem.getProductVariant();
            productVariant.setProductStocks(null);
            Product product = transactionLineItem.getProductVariant().getProduct();
            transactionLineItem.getProductVariant().getProduct().setCategory(null);
            transactionLineItem.getProductVariant().getProduct().setProductVariants(null);
            transactionLineItem.getProductVariant().getProduct().setStyles(null);
            product.setTags(null);
            product.setReviews(null);
//            product.setPromoCodes(null);
            product.setDiscounts(null);
        }
//        transaction.setCustomer(null);
    }


    public void clearStaffRelationships(Staff staff) {
        staff.setPayrolls(null);
        staff.setDeliveries(null);
        staff.setAdvertisements(null);
        staff.setLeaves(null);
        staff.setAddress(null);
        staff.setRepliedReviews(null);
        staff.setStore(null);
        staff.setRole(null);
        staff.setDepartment(null);
    }

    // Only maintain product details
    public void clearProductRelationships(Product product) {
        product.setStyles(null);
        product.setReviews(null);
        product.setCategory(null);
        product.setTags(null);
        product.setDiscounts(null);
        product.setProductVariants(null);
    }

    // Clear product variant but maintain product details
    public void clearProductVariantRelationships(ProductVariant productVariant) {
        productVariant.setProductStocks(null);
        // Product
        clearProductRelationships(productVariant.getProduct());
    }

    public void clearStoreRelationships(Store store) {
        store.setProductStocks(null);
        store.setReservations(null);
        store.setInStoreRestockOrders(null);
        store.setTransactions(null);
        store.setStaff(null);
    }

    public void clearCategoryRelationships(Category category) {
        category.setProducts(null);
        category.setChildCategories(null);
        category.setParentCategory(null);
    }

    public void clearDiscountRelationships(List<Discount> discounts) {
        discounts.forEach(discount -> discount.setProducts(null));
    }
}
