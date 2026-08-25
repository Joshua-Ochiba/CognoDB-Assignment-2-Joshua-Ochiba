const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.COGNODB_URI,
    neo4j.auth.basic('cognodb', process.env.COGNODB_PASSWORD)
);



module.exports = driver;