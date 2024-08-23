CREATE TABLE settings (
    settingId String,
    name String DEFAULT '',
    options String DEFAULT '{}',
    createdBy String,
    modifiedBy String,
    createdAt DateTime DEFAULT now(),
    updatedAt DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (name)
