const express = require('express');
const router = express.Router();
const driver = require('../db/driver');

// GET /api/skills — All skills with user ownership flag
router.get('/', async (req, res) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (s:Skill)
            OPTIONAL MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s)
            RETURN s, (p IS NOT NULL) AS userHasSkill
            ORDER BY s.category, s.name`,
            { personId: 'josh' }
        );

        const skills = result.records.map(record => ({
            ...record.get('s').properties,
            userHasSkill: record.get('userHasSkill'),
        }));

        res.json(skills);
    } catch (err) {
        console.error('Error fetching skills:', err);
        res.status(503).json({ error: 'Database unavailable' });
    } finally {
        await session.close();
    }
});

// GET /api/skills/:id — Single skill details + bidirectional related skills + full job cards
// GET /api/skills/:id — Single skill details + bidirectional related skills + full job cards
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (s:Skill {id: $skillId})
       OPTIONAL MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s)
       WITH s, (p IS NOT NULL) AS userHasSkill
       
       // 1. Bidirectional related skills traversal
       OPTIONAL MATCH (s)-[:RELATED_TO]-(related:Skill)
       OPTIONAL MATCH (p2:Person {id: $personId})-[:HAS_SKILL]->(related)
       WITH s, userHasSkill, 
            collect(DISTINCT {
              id: related.id,
              name: related.name,
              category: related.category,
              description: related.description,
              userHasSkill: (p2 IS NOT NULL)
            }) AS rawRelated
       
       // 2. Jobs requiring this skill
       OPTIONAL MATCH (j:Job)-[:REQUIRES]->(s)
       OPTIONAL MATCH (j)-[:OFFERED_BY]->(c:Company)
       OPTIONAL MATCH (j)-[:REQUIRES]->(jobSkill:Skill)
       OPTIONAL MATCH (p3:Person {id: $personId})-[:HAS_SKILL]->(matchedSkill:Skill)
       WHERE matchedSkill = jobSkill
       
       WITH s, userHasSkill, rawRelated, j, c,
            collect(DISTINCT {
              id: jobSkill.id,
              name: jobSkill.name,
              category: jobSkill.category,
              userHasSkill: (matchedSkill IS NOT NULL)
            }) AS jobSkills,
            count(DISTINCT jobSkill) AS totalRequired,
            count(DISTINCT matchedSkill) AS matchCount
            
       WITH s, userHasSkill, rawRelated,
            collect(DISTINCT {
              id: j.id,
              title: j.title,
              type: j.type,
              location: j.location,
              salary: j.salary,
              postedAt: j.postedAt,
              company: c.name,
              skills: jobSkills,
              totalRequired: totalRequired,
              matchCount: matchCount,
              matchPercent: CASE WHEN totalRequired > 0 THEN round((toFloat(matchCount) / totalRequired) * 100) ELSE 0 END
            }) AS rawJobs
       
       RETURN s, userHasSkill,
              [r IN rawRelated WHERE r.id IS NOT NULL] AS relatedSkills,
              [job IN rawJobs WHERE job.id IS NOT NULL] AS jobs`,
            { skillId: id, personId: 'josh' }
        );

        if (result.records.length === 0) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        const record = result.records[0];
        const skill = record.get('s').properties;
        const userHasSkill = record.get('userHasSkill');
        const relatedSkills = record.get('relatedSkills');
        const rawJobs = record.get('jobs');

        // Helper to safely convert Neo4j Integers { low, high } into normal JS numbers
        const toNumber = (val) => {
            if (val === null || val === undefined) return 0;
            if (typeof val === 'number') return val;
            if (typeof val.toNumber === 'function') return val.toNumber();
            if (typeof val.low === 'number') return val.low;
            return Number(val) || 0;
        };

        const jobs = rawJobs.map((j) => ({
            ...j,
            totalRequired: toNumber(j.totalRequired),
            matchCount: toNumber(j.matchCount),
            matchPercent: toNumber(j.matchPercent),
        }));

        res.json({
            ...skill,
            userHasSkill,
            relatedSkills,
            jobs,
        });
    } catch (err) {
        console.error(`Error fetching skill ${id}:`, err);
        res.status(503).json({ error: 'Database unavailable' });
    } finally {
        await session.close();
    }
});


module.exports = router;