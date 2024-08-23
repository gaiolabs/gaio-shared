CREATE TABLE favorite (
    favoriteId String,
    userId String,
    type String,
    tableRelatedId,
    createdBy String,
    modifiedBy String,
    createdAt DateTime DEFAULT now(),
    updatedAt DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY tuple();
