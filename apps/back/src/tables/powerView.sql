DEFINE TABLE powerView SCHEMAFULL;

DEFINE FIELD label              ON TABLE powerView TYPE string DEFAULT '';
DEFINE FIELD tags               ON TABLE powerView FLEXIBLE TYPE array DEFAULT [];
DEFINE FIELD settings           ON TABLE powerView FLEXIBLE TYPE object DEFAULT {};
DEFINE FIELD userId             ON TABLE powerView TYPE record(user) | null VALUE $value DEFAULT null;
DEFINE FIELD type               ON TABLE powerView TYPE string DEFAULT 'user';
DEFINE FIELD reportType         ON TABLE powerView TYPE string DEFAULT 'table';
DEFINE FIELD shared             ON TABLE powerView TYPE string DEFAULT 'n';
DEFINE FIELD hits               ON TABLE powerView TYPE number DEFAULT 1;
DEFINE FIELD powerId            ON TABLE powerView  TYPE record(power) | null VALUE $value DEFAULT null;

-- DEFAULTS
DEFINE FIELD createdBy          ON TABLE powerView TYPE record(user) | null VALUE $value DEFAULT null;
DEFINE FIELD modifiedBy         ON TABLE powerView TYPE record(user) | null VALUE $value DEFAULT null;
DEFINE FIELD createdAt          ON TABLE powerView TYPE datetime VALUE $before OR time::now() DEFAULT time::now();
DEFINE FIELD updatedAt          ON TABLE powerView TYPE datetime VALUE time::now() DEFAULT time::now();
