package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RelationshipService {

    public void clearCustomerRelationships(Customer customer){
        customer.setVerificationCode(null);
        customer.setPassword(null);
        for (ShoppingCartItem sci : customer.getOnlineShoppingCart().getShoppingCartItems()){
            clearShoppingCartItemRelationships(sci);
        }
        for (ShoppingCartItem sci : customer.getInStoreShoppingCart().getShoppingCartItems()){
            clearShoppingCartItemRelationships(sci);
        }
        for (ProductVariant pv : customer.getWishlistItems()){
            pv.getProduct().setProductVariants(null);
            pv.getProduct().setTags(null);
            pv.getProduct().setCategory(null);
            pv.getProduct().setStyles(null);
            removeStoreStocksFromProductVariant(pv);
        }
        for (ProductVariant pv : customer.getReservationCartItems()){
            pv.getProduct().setProductVariants(null);
            pv.getProduct().setTags(null);
            pv.getProduct().setCategory(null);
            pv.getProduct().setStyles(null);
            removeStoreStocksFromProductVariant(pv);
        }
        customer.setReservations(null);
        customer.setTransactions(null);
    }

    private void clearShoppingCartItemRelationships(ShoppingCartItem sci){
        if (sci.getProductVariant()!=null){
            sci.getProductVariant().getProduct().setProductVariants(null);
            sci.getProductVariant().getProduct().setTags(null);
            sci.getProductVariant().getProduct().setCategory(null);
            sci.getProductVariant().getProduct().setStyles(null);
            removeStoreStocksFromProductVariant(sci.getProductVariant());
        }
    }

    private void removeStoreStocksFromProductVariant(ProductVariant pv){
        List<ProductStock> pdtStocks = pv.getProductStocks();
        for (int i = 0; i < pdtStocks.size(); i++){ //remove all store stocks
            if (pdtStocks.get(i).getStore() != null){
                pv.getProductStocks().remove(pdtStocks.get(i));
                i--;
            }
        }
        for (ProductStock ps: pv.getProductStocks()){
            ps.setProductVariant(null);
            ps.setWarehouse(null);
        }
    }

    public void clearTransactionRelationships (Transaction transaction){
        for (TransactionLineItem transactionLineItem : transaction.getTransactionLineItems()){
            ProductVariant productVariant= transactionLineItem.getProductVariant();
            productVariant.setProductStocks(null);
            Product product = transactionLineItem.getProductVariant().getProduct();
            transactionLineItem.getProductVariant().getProduct().setCategory(null);
            transactionLineItem.getProductVariant().getProduct().setProductVariants(null);
            transactionLineItem.getProductVariant().getProduct().setStyles(null);
            product.setTags(null);
            product.setReviews(null);
            product.setPromoCodes(null);
            product.setDiscounts(null);
        }
        transaction.setCustomer(null);
    }
}
