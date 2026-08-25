const express = require('express');
const router = express.Router();
const driver = require('../db/driver');
const { error } = require('neo4j-driver');


// GET /api/profile
router.get('/', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s:Skill)
            RETURN p, collect(s) AS skills
            `,
            { personId: 'josh' }
        );

        if (result.records.length === 0) {
            return res.status(404).json({
                error: 'Profile not found'
            });
        }


        const record = result.records[0];
        const person = record.get('p').properties;
        const skills = record.get('skills').map(node => node.properties);


        res.json({
            ...person,
            skills,
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(503).json({ error: 'Database unavailable' });
    } finally {
        await session.close();
    }
});


module.exports = router;