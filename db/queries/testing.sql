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

SELECT chapters.body, stories.story_title, root_chapter.title AS root_chapter_title, chapters.title, users.name
FROM contributions
JOIN chapters ON contributions.chapter_id = chapters.id
JOIN users ON contributions.contributor_id = users.id
LEFT JOIN stories ON contributions.story_id = stories.id
LEFT JOIN chapters AS root_chapter ON stories.chapter_id = root_chapter.id
WHERE contributions.id = 6;