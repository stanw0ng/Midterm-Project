DROP TABLE IF EXISTS chapter_relationships CASCADE;
CREATE TABLE chapter_relationships (
  id SERIAL PRIMARY KEY NOT NULL,
  story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES contributions(id) DEFAULT NULL ON DELETE CASCADE,
  child_id INTEGER REFERENCES contributions(id) ON DELETE CASCADE
);
