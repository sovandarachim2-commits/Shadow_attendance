-- Correct five checkout timestamps that were stored seven hours behind.
-- Safe to rerun: each row is updated only when its current checkout timestamp
-- exactly matches the known incorrect value.

SET time_zone = 'SYSTEM';

START TRANSACTION;

UPDATE attendance
SET
    check_out_at = CASE id
        WHEN 461 THEN '2026-06-27 17:19:07'
        WHEN 462 THEN '2026-06-27 17:38:32'
        WHEN 463 THEN '2026-06-27 17:15:41'
        WHEN 465 THEN '2026-06-27 17:36:06'
        WHEN 468 THEN '2026-06-27 17:36:47'
    END,
    work_minutes = CASE id
        WHEN 461 THEN 498
        WHEN 462 THEN 501
        WHEN 463 THEN 472
        WHEN 465 THEN 486
        WHEN 468 THEN 481
    END
WHERE
    (id = 461 AND check_out_at = '2026-06-27 10:19:07')
    OR (id = 462 AND check_out_at = '2026-06-27 10:38:32')
    OR (id = 463 AND check_out_at = '2026-06-27 10:15:41')
    OR (id = 465 AND check_out_at = '2026-06-27 10:36:06')
    OR (id = 468 AND check_out_at = '2026-06-27 10:36:47');

SELECT ROW_COUNT() AS corrected_rows;

SELECT
    id,
    employee_id,
    attendance_date,
    check_in_at,
    check_out_at,
    work_minutes
FROM attendance
WHERE id IN (461, 462, 463, 465, 468)
ORDER BY id;

COMMIT;
