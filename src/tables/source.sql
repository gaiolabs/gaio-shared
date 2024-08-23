CREATE TABLE source (
    sourceId String,
    sourceName String DEFAULT '',
    credentials String DEFAULT '{}',
    options String DEFAULT '{}',
    createdBy String,
    modifiedBy String,
    createdAt DateTime DEFAULT now(),
    updatedAt DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (sourceId)
