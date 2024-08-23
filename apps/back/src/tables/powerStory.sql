DEFINE TABLE powerStory SCHEMAFULL;

DEFINE FIELD label              ON TABLE powerStory TYPE string DEFAULT '';
DEFINE FIELD views              ON TABLE powerStory FLEXIBLE TYPE array DEFAULT [];
DEFINE FIELD options            ON TABLE powerStory FLEXIBLE TYPE object DEFAULT {};
DEFINE FIELD userId             ON TABLE powerStory TYPE record(user) | null VALUE $value DEFAULT null;
DEFINE FIELD shared             ON TABLE powerStory TYPE string DEFAULT 'n';
DEFINE FIELD hits               ON TABLE powerStory TYPE number DEFAULT 1;

-- DEFAULTS
DEFINE FIELD createdBy          ON TABLE powerStory TYPE record(user) | null VALUE $value DEFAULT null;
DEFINE FIELD modifiedBy         ON TABLE powerStory TYPE record(user) | null VALUE $value DEFAULT null;
DEFINE FIELD createdAt          ON TABLE powerStory TYPE datetime VALUE $before OR time::now() DEFAULT time::now();
DEFINE FIELD updatedAt          ON TABLE powerStory TYPE datetime VALUE time::now() DEFAULT time::now();
