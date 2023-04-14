-- /* fetch response to winner */
-- SELECT contributions.id, stories.story_title
-- FROM contributions
-- JOIN stories ON contributions.story_id = stories.id
-- JOIN chapter_relationships ON contributions.id = chapter_relationships.child_id
-- WHERE chapter_relationships.parent_id IS NOT NULL

-- /* fetch first generation response to winner (parent is root)*/
-- SELECT contributions.id, stories.story_title
-- FROM contributions
-- JOIN stories ON contributions.story_id = stories.id
-- JOIN chapter_relationships ON contributions.id = chapter_relationships.child_id
-- WHERE chapter_relationships.parent_id IS NULL

-- /* fetch the selected contribution from selected parent ID*/
-- SELECT contributions.id, chapters.body
-- FROM contributions
-- JOIN chapters ON contributions.chapter_id = chapters.id
-- JOIN stories ON contributions.story_id = stories.id
-- JOIN winners ON contributions.id = winners.child_id
-- WHERE winners.parent_id = 1;

-- /* fetch root chapter data from a story */
-- SELECT stories.story_title, chapters.title, chapters.id, chapters.body
-- FROM stories
-- JOIN chapters ON stories.chapter_id = chapters.id
-- WHERE stories.id = $1

-- SELECT winners.child_id, chapters.title, chapters.id
-- FROM winners
-- JOIN stories ON winners.story_id = stories.id
-- JOIN contributions ON winners.child_id = contributions.id
-- JOIN chapters ON contributions.chapter_id = chapters.id
-- WHERE stories.story_title = 'Dracula'
-- ORDER BY winners.child_id

-- SELECT winners.parent_id, chapters.title
-- FROM winners
-- JOIN contributions ON winners.child_id = contributions.id
-- JOIN chapters ON chapters.id = contributions.chapter_id
-- WHERE contributions.story_id = 1;

-- SELECT chapters.body, stories.story
-- FROM chapters
-- JOIN contributions ON contributions.chapter_id = chapters.id
-- JOIN stories ON contributions.story_id = stories.id
-- WHERE contributions.id = $1

-- SELECT chapters.body, stories.story_title, root_chapter.title AS root_chapter_title, chapters.title, users.name
-- FROM contributions
-- JOIN chapters ON contributions.chapter_id = chapters.id
-- JOIN users ON contributions.contributor_id = users.id
-- LEFT JOIN stories ON contributions.story_id = stories.id
-- LEFT JOIN chapters AS root_chapter ON stories.chapter_id = root_chapter.id
-- WHERE contributions.id = 6;

-- SELECT contributions.*
-- FROM contributions
-- JOIN stories on contributions.story_id = stories.id
-- WHERE stories.story_title = 'Dracula'

-- SELECT winners.child_id, chapters.title
-- FROM winners
-- JOIN stories ON winners.story_id = stories.id
-- JOIN contributions ON winners.child_id = contributions.id
-- JOIN chapters ON contributions.chapter_id = chapters.id
-- WHERE stories.story_title = $1


-- SELECT child_id FROM chapter_relationships WHERE story_id = 1 ORDER BY child_id DESC LIMIT 1;

-- SELECT winners.child_id, chapters.title
-- FROM winners
-- JOIN stories ON winners.story_id = stories.id
-- JOIN contributions ON winners.child_id = contributions.id
-- JOIN chapters ON contributions.chapter_id = chapters.id
-- WHERE stories.story_title = $1


-- SELECT child_id FROM chapter_relationships WHERE story_id = 1 ORDER BY child_id DESC LIMIT 1;

  -- SELECT TO_CHAR(contributions.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date, users.name, COUNT(upvotes.user_id) AS upvotes
  -- FROM contributions
  -- JOIN users ON contributions.contributor_id = users.id
  -- LEFT JOIN upvotes ON upvotes.contribution_id = contributions.id
  -- JOIN stories ON contributions.story_id = stories.id
  -- JOIN chapters ON contributions.chapter_id = chapters.id
  -- WHERE stories.story_title = 'Dracula'
  -- GROUP BY contributions.date_created, chapters.id, users.name

--  SELECT contributions.id, TO_CHAR(contributions.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date, chapters.title, users.name, COUNT(upvotes.user_id) AS upvotes
--   FROM contributions
--   JOIN users ON contributions.contributor_id = users.id
--   LEFT JOIN upvotes ON upvotes.contribution_id = contributions.id
--   JOIN stories ON contributions.story_id = stories.id
--   JOIN chapters ON contributions.chapter_id = chapters.id
--   WHERE stories.id = 2
--   GROUP BY contributions.id, chapters.title, users.name

-- SELECT stories.story_title, TO_CHAR(stories.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date,
--   stories.description, stories.genre, stories.age_rating, stories.completed, users.name
--   FROM stories
--   JOIN users ON users.id = stories.author_id
--   ORDER BY date_created DESC LIMIT 10;

-- SELECT story.story_title as story_title, author.email as author_email, author.name as author_name, chapters.title as chapter_title, contributor.name as contributor_name, contributor.email as contributor_email, chapters.body as chapter_text
-- FROM contributions
-- JOIN users contributor ON contributions.contributor_id = contributor.id
-- JOIN stories story ON contributions.story_id = story.id
-- JOIN users author ON story.author_id = author.id
-- JOIN chapters ON contributions.chapter_id = chapters.id
-- WHERE contributions.id = 1;

-- SELECT contributions.id AS contributions_id, TO_CHAR(contributions.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date,
--   chapters.title, users.name, COUNT(upvotes.user_id) AS upvotes, stories.completed
--   FROM contributions
--   JOIN users ON contributions.contributor_id = users.id
--   LEFT JOIN upvotes ON upvotes.contribution_id = contributions.id
--   JOIN stories ON contributions.story_id = stories.id
--   JOIN chapters ON contributions.chapter_id = chapters.id
--   WHERE stories.id = 1
--   GROUP BY contributions_id, chapters.title, users.name, stories.id

  -- SELECT stories.completed FROM stories WHERE id = 1;


-- SELECT stories.*, chapters.published FROM stories
-- JOIN users ON stories.author_id = users.id
-- JOIN chapters ON stories.chapter_id = chapters.id
-- WHERE users.email = $1;

-- SELECT stories.story_title, stories.description, stories.category, stories.genre, stories.age_rating, chapters.title as chapter_title, chapters.body
-- FROM stories
-- JOIN chapters ON stories.chapter_id = chapters.id
-- WHERE stories.id = $1


