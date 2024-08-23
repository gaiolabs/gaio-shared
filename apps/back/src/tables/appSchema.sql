CREATE TABLE app (
    appId String,
    appName String DEFAULT '',
    appDescription Nullable(String) DEFAULT NULL,
    appStatus String DEFAULT 'dev',
    appToken String DEFAULT '',
    params String DEFAULT '[]',
    forms String DEFAULT '[]',
    options String,
    repoId String DEFAULT '',
    createdBy Nullable(String) DEFAULT NULL,
    createdAt DateTime DEFAULT now(),
    modifiedBy Nullable(String) DEFAULT NULL,
    updatedAt DateTime DEFAULT now()
)
ENGINE = MergeTree
ORDER BY appId
