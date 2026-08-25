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

// GET /api/skills/:id — Single skill details + related skills + jobs requiring it
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (s:Skill {id: $skillId})
            OPTIONAL MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s)
            WITH s, (p IS NOT NULL) AS userHasSkill

             OPTIONAL MATCH (s)-[:RELATED_TO]->(related:Skill)
              OPTIONAL MATCH (p2:Person {id: $personId})-[:HAS_SKILL]->(related)
              WITH s, userHasSkill, 
            collect(DISTINCT {
              id: related.id,
              name: related.name,
              category: related.category,
              description: related.description,
              userHasSkill: (p2 IS NOT NULL)
            }) AS rawRelated

            OPTIONAL MATCH (j:Job)-[:REQUIRES]->(s)
       OPTIONAL MATCH (j)-[:OFFERED_BY]->(c:Company)
       WITH s, userHasSkill, rawRelated,
            collect(DISTINCT {
              id: j.id,
              title: j.title,
              type: j.type,
              location: j.location,
              salary: j.salary,
              postedAt: j.postedAt,
              companyName: c.name
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
        const jobs = record.get('jobs');

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