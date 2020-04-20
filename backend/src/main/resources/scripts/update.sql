# UPDATE product_stock SET quantity = FLOOR(RAND()*(101)) + 19 WHERE true;
# UPDATE product_stock SET quantity = 1000 WHERE true;
UPDATE product_stock SET notification_level = 20 WHERE true;
UPDATE product_stock SET reorder_quantity = 50 WHERE true;