-- Show attendance clocks as saved (08:38, 17:01), not shifted by +07:00.
-- In phpMyAdmin: select database rentroom_shadow-hr, open SQL, paste this, click Go.
-- Changes columns only when id 1820 is already 2026-10-07 08:38:55 and 17:01:52.

SET time_zone = '+00:00';

SELECT id, check_in_at, check_out_at
FROM attendance
WHERE id = 1820;

SET @ok = (
    SELECT IF(
        check_in_at = '2026-10-07 08:38:55'
        AND check_out_at = '2026-10-07 17:01:52',
        1,
        0
    )
    FROM attendance
    WHERE id = 1820
);

SET @sql = IF(
    @ok = 1,
    'ALTER TABLE `attendance`
        MODIFY `check_in_at` datetime NULL DEFAULT NULL,
        MODIFY `check_out_at` datetime NULL DEFAULT NULL,
        MODIFY `synced_at` datetime NULL DEFAULT NULL,
        MODIFY `created_at` datetime NULL DEFAULT NULL,
        MODIFY `updated_at` datetime NULL DEFAULT NULL',
    'SELECT ''Stopped. Id 1820 is not 08:38:55 and 17:01:52, so attendance was not changed.'' AS result'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT id, check_in_at, check_out_at
FROM attendance
WHERE id = 1820;
