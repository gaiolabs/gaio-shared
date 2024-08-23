CREATE TABLE pass (
    passId String,
    appId String,
    repoId String,
    sees String DEFAULT '[]',
    password String,
    createdBy String,
    modifiedBy String,
    createdAt DateTime DEFAULT now(),
    updatedAt DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY tuple();
