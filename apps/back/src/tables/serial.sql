CREATE TABLE serial (
    serial Int64 DEFAULT 1,
    type String DEFAULT 'app',
) ENGINE = MergeTree()
ORDER BY (serial, type)
