package capstone.rt04.retailbackend.repositories;

import capstone.rt04.retailbackend.entities.ProductStock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductStockRepository extends CrudRepository<ProductStock, Long> {

    @Override
    Optional<ProductStock> findById(Long aLong);

    List<ProductStock> findAllByStoreStoreId(Long storeId);

    ProductStock findByWarehouse_WarehouseIdAndProductVariant_ProductVariantId(Long warehouseId, Long productVariantId);

    List<ProductStock> findAllByProductVariantProductVariantId(Long productVariantId);

    @Query("SELECT ps FROM ProductStock ps WHERE ps.store.storeId =?1 AND ps.productVariant.productVariantId =?2")
    ProductStock findAllByStoreStoreIdAndProductVariantProductVariantId(Long storeId, Long productVariantId);

    @Query("SELECT ps FROM ProductStock ps WHERE ps.quantity <= ps.notificationLevel AND ps.warehouse.warehouseId =?1")
    List<ProductStock> findAllQuantityLessThanNotificationLevel(Long warehouseId);



}
