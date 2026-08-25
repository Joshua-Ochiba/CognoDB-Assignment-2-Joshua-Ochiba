const express = require('express');
const router = express.Router();
const driver = require('../db/driver');

// GET /api/jobs — All jobs with skill match scores
router.get('/', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (j:Job)-[:REQUIRES]->(reqSkill:Skill)
       MATCH (j)-[:OFFERED_BY]->(c:Company)
       
       OPTIONAL MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(reqSkill)
       
       WITH j, c,
            collect({
              id: reqSkill.id,
              name: reqSkill.name,
              category: reqSkill.category,
              userHasSkill: (p IS NOT NULL)
            }) AS skills,
            count(reqSkill) AS totalRequired,
            count(p) AS matchCount
            
       RETURN j, c, skills, totalRequired, matchCount,
              round((toFloat(matchCount) / totalRequired) * 100) AS matchPercent
       ORDER BY matchPercent DESC, j.title ASC`,
            { personId: 'josh' }
        );

        const jobs = result.records.map(record => {
            const job = record.get('j').properties;
            const company = record.get('c').properties;
            const skills = record.get('skills');
            const totalRequired = record.get('totalRequired').toNumber();
            const matchCount = record.get('matchCount').toNumber();
            const matchPercent = record.get('matchPercent');

            return {
                ...job,
                company,
                skills,
                totalRequired,
                matchCount,
                matchPercent,
            };
        });

        res.json(jobs);
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(503).json({ error: 'Database unavailable' });
    } finally {
        await session.close();
    }
});


// GET /api/jobs/:id — Single job details with match percentage and missing skills
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (j:Job {id: $jobId})-[:REQUIRES]->(reqSkill:Skill)
       MATCH (j)-[:OFFERED_BY]->(c:Company)
       
       OPTIONAL MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(reqSkill)
       
       WITH j, c,
            collect({
              id: reqSkill.id,
              name: reqSkill.name,
              category: reqSkill.category,
              description: reqSkill.description,
              userHasSkill: (p IS NOT NULL)
            }) AS skills,
            count(reqSkill) AS totalRequired,
            count(p) AS matchCount
            
       RETURN j, c, skills, totalRequired, matchCount,
              round((toFloat(matchCount) / totalRequired) * 100) AS matchPercent`,
            { jobId: id, personId: 'josh' }
        );

        if (result.records.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const record = result.records[0];
        const job = record.get('j').properties;
        const company = record.get('c').properties;
        const skills = record.get('skills');
        const totalRequired = record.get('totalRequired').toNumber();
        const matchCount = record.get('matchCount').toNumber();
        const matchPercent = record.get('matchPercent');

        // Missing skills Josh could learn to qualify for this role
        const missingSkills = skills.filter(s => !s.userHasSkill);

        res.json({
            ...job,
            company,
            skills,
            totalRequired,
            matchCount,
            matchPercent,
            missingSkills,
        });
    } catch (err) {
        console.error(`Error fetching job ${id}:`, err);
        res.status(503).json({ error: 'Database unavailable' });
    } finally {
        await session.close();
    }
});

module.exports = router;
