CREATE TABLE flow (
    flowId String,
    flowName String DEFAULT '',
    flowDescription Nullable(String),
    flowKey String DEFAULT '',
    flowType String DEFAULT 'dataPrep',
    locked Bool DEFAULT false,
    flowOrder Int32 DEFAULT 0,
    flowNumber Int32 DEFAULT 0,
    status String DEFAULT 'active',
    cron Nullable(String),
    cronStatus String DEFAULT 'active',
    cronBase String,
    workflow String DEFAULT '{"nodes":[],"edges":[]}',
    options String DEFAULT '{}',
    appId String,
    createdBy String,
    modifiedBy String,
    createdAt DateTime DEFAULT now(),
    updatedAt DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY tuple();
