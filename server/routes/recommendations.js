const express = require('express');
const router = express.Router();
const driver = require('../db/driver');

// GET /api/recommendations — Multi-hop graph recommendations for skills and jobs
router.get('/', async (req, res) => {
    const session = driver.session();

    try {
        // 1. Recommended Skills: Skills related to what Josh knows, which he doesn't have yet
        const skillsResult = await session.run(
            `MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(known:Skill)
       WITH p, collect(known) AS userSkills
       
       UNWIND userSkills AS known
       MATCH (known)-[:RELATED_TO]-(recommended:Skill)
       WHERE NOT recommended IN userSkills
       
       WITH recommended, collect(DISTINCT known.name) AS relatedToSkills, count(DISTINCT known) AS score
       RETURN recommended, relatedToSkills
       ORDER BY score DESC, recommended.name ASC
       LIMIT 6`,
            { personId: 'josh' }
        );

        const recommendedSkills = skillsResult.records.map(record => ({
            ...record.get('recommended').properties,
            relatedTo: record.get('relatedToSkills'),
        }));

        // 2. Recommended Jobs: Jobs requiring at least one of those recommended skills
        const jobsResult = await session.run(
            `MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(known:Skill)
       WITH p, collect(known) AS userSkills
       
       UNWIND userSkills AS known
       MATCH (known)-[:RELATED_TO]-(skillToLearn:Skill)
       WHERE NOT skillToLearn IN userSkills
       
       MATCH (j:Job)-[:REQUIRES]->(skillToLearn)
       MATCH (j)-[:OFFERED_BY]->(c:Company)
       
       MATCH (j)-[:REQUIRES]->(allReq:Skill)
       OPTIONAL MATCH (p)-[:HAS_SKILL]->(allReq)
       
       WITH j, c, skillToLearn,
            count(DISTINCT allReq) AS totalRequired,
            count(DISTINCT p) AS matchedCount
       
       RETURN DISTINCT j, c, skillToLearn, totalRequired, matchedCount,
              round((toFloat(matchedCount) / totalRequired) * 100) AS matchPercent
       ORDER BY matchPercent DESC, j.title ASC
       LIMIT 5`,
            { personId: 'josh' }
        );

        const recommendedJobs = jobsResult.records.map(record => {
            const job = record.get('j').properties;
            const company = record.get('c').properties;
            const skillToLearn = record.get('skillToLearn').properties;
            const totalRequired = record.get('totalRequired').toNumber();
            const matchedCount = record.get('matchedCount').toNumber();
            const matchPercent = record.get('matchPercent');

            return {
                ...job,
                company,
                skillToLearn,
                totalRequired,
                matchCount: matchedCount,
                matchPercent,
            };
        });

        res.json({
            recommendedSkills,
            recommendedJobs,
        });
    } catch (err) {
        console.error('Error fetching recommendations:', err);
        res.status(503).json({ error: 'Database unavailable' });
    } finally {
        await session.close();
    }
});

module.exports = router;
