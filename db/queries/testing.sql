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


SELECT winners.child_id, chapters.title
FROM winners
JOIN stories ON winners.story_id = stories.id
JOIN contributions ON winners.child_id = contributions.id
JOIN chapters ON contributions.chapter_id = chapters.id
WHERE stories.story_title = $1
