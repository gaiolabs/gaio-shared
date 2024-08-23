CREATE TABLE user (
    userId String,
    name String DEFAULT '',
    email String DEFAULT '',
    password String DEFAULT '',
    lang String DEFAULT 'en-US',
    token String,
    tags String DEFAULT '[]',
    options String DEFAULT '{}',
    role String DEFAULT 'user',
    status String DEFAULT 'active',
    twoFactorKey String DEFAULT '',
    twoFactorSigned String DEFAULT '',
    twoFactorStatus String DEFAULT '',
    profileId String DEFAULT '',
    createdBy String,
    modifiedBy String,
    createdAt DateTime DEFAULT now(),
    updatedAt DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (userId, email)
