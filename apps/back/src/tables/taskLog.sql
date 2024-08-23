CREATE TABLE taskLog (
    taskLogId String,
    tasks String DEFAULT '{}',
    appId String,
    userId String,
    flowId String,
    status String DEFAULT 'started',
    aborted Bool DEFAULT false,
    startedAt DateTime DEFAULT now(),
    endedAt DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (appId, userId, flowId, status);
