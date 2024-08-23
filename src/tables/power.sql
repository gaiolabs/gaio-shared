DEFINE TABLE power SCHEMAFULL;

DEFINE FIELD label              ON TABLE power TYPE string DEFAULT '';
DEFINE FIELD tableName          ON TABLE power TYPE string DEFAULT '';
DEFINE FIELD databaseName       ON TABLE power TYPE string DEFAULT '';
DEFINE FIELD appId              ON TABLE power TYPE record(app) | null VALUE $value DEFAULT null;
DEFINE FIELD sourceType         ON TABLE power TYPE string DEFAULT 'bucket';
DEFINE FIELD description        ON TABLE power TYPE string DEFAULT '';
DEFINE FIELD status             ON TABLE power TYPE string DEFAULT 'active';
DEFINE FIELD userFilter         ON TABLE power FLEXIBLE TYPE array DEFAULT [];
DEFINE FIELD fields             ON TABLE power FLEXIBLE TYPE array DEFAULT [];
DEFINE FIELD options            ON TABLE power FLEXIBLE TYPE object DEFAULT {};
DEFINE FIELD hits               ON TABLE power TYPE number DEFAULT 1;

-- DEFAULTS
DEFINE FIELD createdBy          ON TABLE power TYPE record(user) | null VALUE $value DEFAULT null;
DEFINE FIELD modifiedBy         ON TABLE power TYPE record(user) | null VALUE $value DEFAULT null;
DEFINE FIELD createdAt          ON TABLE power TYPE datetime VALUE $before OR time::now() DEFAULT time::now();
DEFINE FIELD updatedAt          ON TABLE power TYPE datetime VALUE time::now() DEFAULT time::now();
