UPDATE transaction SET created_date_time = FROM_UNIXTIME(UNIX_TIMESTAMP(now()) - FLOOR(0 + (RAND() * 2592000 * 3))) WHERE true;