CREATE TABLE tag (
    userId String,
    refId String,
    role String DEFAULT 'view',
    type String DEFAULT 'app',
    createdBy String,
    modifiedBy String,
    createdAt DateTime DEFAULT now(),
    updatedAt DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (userId, refId, type)
