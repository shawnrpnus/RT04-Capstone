UPDATE product_stock SET quantity = FLOOR(RAND()*(26)) WHERE true;
UPDATE product_stock SET notification_level = 10 WHERE true;
UPDATE product_stock SET reorder_quantity = 50 WHERE true;