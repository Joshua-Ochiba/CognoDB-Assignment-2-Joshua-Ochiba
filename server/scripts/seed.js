const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.COGNODB_URI,
    neo4j.auth.basic('cognodb', process.env.COGNODB_PASSWORD)
);


//Raw Material for the Graph
const skills = [
    { id: 'javascript', name: 'JavaScript', category: 'Language', description: 'The programming language of the web, running in browsers and on servers via Node.js.' },
    { id: 'typescript', name: 'TypeScript', category: 'Language', description: 'Typed superset of JavaScript that compiles to plain JS. Industry standard for large codebases.' },
    { id: 'react', name: 'React', category: 'Frontend', description: 'A JavaScript library for building user interfaces, maintained by Meta.' },
    { id: 'react-native', name: 'React Native', category: 'Mobile', description: 'Build native mobile apps for iOS and Android using React and JavaScript.' },
    { id: 'nextjs', name: 'Next.js', category: 'Frontend', description: 'React framework for production — hybrid static and server rendering.' },
    { id: 'nodejs', name: 'Node.js', category: 'Backend', description: 'JavaScript runtime built on Chrome\'s V8 engine for building server-side applications.' },
    { id: 'css', name: 'CSS', category: 'Frontend', description: 'Stylesheet language used to describe the presentation of HTML documents.' },
    { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS framework for rapidly building custom user interfaces.' },
    { id: 'graphql', name: 'GraphQL', category: 'API', description: 'Query language for APIs and a runtime for executing those queries.' },
    { id: 'git', name: 'Git', category: 'DevOps', description: 'Distributed version control system for tracking changes in source code.' },
    { id: 'postgresql', name: 'PostgreSQL', category: 'Database', description: 'Powerful open source relational database system.' },
    { id: 'docker', name: 'Docker', category: 'DevOps', description: 'Platform for developing, shipping, and running applications in containers.' },
    { id: 'python', name: 'Python', category: 'Language', description: 'Versatile programming language popular for data science, backend, and automation.' },
    { id: 'java', name: 'Java', category: 'Language', description: 'Object-oriented programming language widely used in enterprise applications.' },
    { id: 'redux', name: 'Redux', category: 'Frontend', description: 'Predictable state container for JavaScript applications, commonly used with React.' },
];

const companies = [
    { id: 'flutterwave', name: 'Flutterwave', location: 'Lagos, Nigeria' },
    { id: 'paystack', name: 'Paystack', location: 'Lagos, Nigeria' },
    { id: 'moniepoint', name: 'Moniepoint', location: 'Lagos, Nigeria' },
    { id: 'andela', name: 'Andela', location: 'Remote' },
    { id: 'interswitch', name: 'Interswitch', location: 'Lagos, Nigeria' },
];


const jobs = [
    { id: 'frontend-dev-flutterwave', title: 'Frontend Developer', description: 'Join our product team to build next-generation payment interfaces used by millions across Africa.', location: 'Lagos, Nigeria', type: 'Full-time', salary: '$60k – $90k', postedAt: '2 days ago', company: 'flutterwave', requires: ['react', 'javascript', 'typescript', 'graphql'] },
    { id: 'react-dev-paystack', title: 'React Developer', description: 'Build and maintain customer-facing features for Africa\'s leading payment gateway.', location: 'Lagos, Nigeria', type: 'Full-time', salary: '$55k – $80k', postedAt: '4 days ago', company: 'paystack', requires: ['react', 'typescript', 'css', 'nextjs'] },
    { id: 'frontend-eng-moniepoint', title: 'Frontend Engineer', description: 'Help shape the digital banking experience for small businesses across Nigeria.', location: 'Lagos, Nigeria', type: 'Full-time', salary: '$50k – $75k', postedAt: '1 week ago', company: 'moniepoint', requires: ['react', 'javascript', 'css', 'tailwind', 'git'] },
    { id: 'fullstack-andela', title: 'Full Stack Developer', description: 'Work with global engineering teams to build scalable web platforms.', location: 'Remote', type: 'Full-time', salary: '$70k – $100k', postedAt: '3 days ago', company: 'andela', requires: ['nodejs', 'react', 'postgresql', 'typescript'] },
    { id: 'mobile-dev-interswitch', title: 'React Native Developer', description: 'Build cross-platform mobile apps for financial services used across West Africa.', location: 'Lagos, Nigeria', type: 'Full-time', salary: '$55k – $85k', postedAt: '5 days ago', company: 'interswitch', requires: ['react-native', 'javascript', 'typescript', 'redux'] },
    { id: 'backend-eng-flutterwave', title: 'Backend Engineer', description: 'Design and build the APIs that power payment processing at scale.', location: 'Lagos, Nigeria', type: 'Full-time', salary: '$65k – $95k', postedAt: '1 week ago', company: 'flutterwave', requires: ['nodejs', 'postgresql', 'docker', 'python'] },
    { id: 'nextjs-dev-paystack', title: 'Next.js Developer', description: 'Build fast, SEO-optimised marketing and product pages using the React ecosystem.', location: 'Remote', type: 'Contract', salary: '$50k – $70k', postedAt: '2 days ago', company: 'paystack', requires: ['nextjs', 'react', 'typescript', 'tailwind'] },
];


const skillRelationships = [
    { from: 'react', to: 'typescript' },
    { from: 'react', to: 'nextjs' },
    { from: 'react', to: 'react-native' },
    { from: 'react', to: 'redux' },
    { from: 'javascript', to: 'typescript' },
    { from: 'javascript', to: 'nodejs' },
    { from: 'javascript', to: 'react' },
    { from: 'typescript', to: 'graphql' },
    { from: 'typescript', to: 'react' },
    { from: 'nodejs', to: 'postgresql' },
    { from: 'nodejs', to: 'graphql' },
    { from: 'nodejs', to: 'docker' },
    { from: 'css', to: 'tailwind' },
    { from: 'nextjs', to: 'react' },
];


async function seed() {
    const session = driver.session();

    try {
        console.log('Clearing database...');
        await session.run('MATCH (n) DETACH DELETE n');

        console.log('Creating Person node...');
        await session.run(
            `CREATE (p:Person {
            id: $id,
            name: $name,
            title: $title,
            bio: $bio
            })`,
            {
                id: 'josh',
                name: 'Josh',
                title: 'Frontend Developer',
                bio: '5 years building modern web interfaces. Focused on the React ecosystem, performance, and developer experience.',
            }
        );

        console.log('Creating Skill nodes...');
        await session.run(
            `UNWIND $skills AS skill
       CREATE (s:Skill {
         id: skill.id,
         name: skill.name,
         category: skill.category,
         description: skill.description
       })`,
            { skills }
        );


        console.log('Creating Company nodes...');
        await session.run(
            `UNWIND $companies AS company
       CREATE (c:Company {
         id: company.id,
         name: company.name,
         location: company.location
       })`,
            { companies }
        );


        console.log('Creating Job nodes...');
        await session.run(
            `UNWIND $jobs AS job
       CREATE (j:Job {
         id: job.id,
         title: job.title,
         description: job.description,
         location: job.location,
         type: job.type,
         salary: job.salary,
         postedAt: job.postedAt
       })`,
            { jobs }
        );


        console.log('Creating HAS_SKILL relationships...');
        await session.run(
            `MATCH (p:Person {id: 'josh'})
             UNWIND $skillIds AS skillId
              MATCH (s:Skill {id: skillId})
              CREATE (p)-[:HAS_SKILL]->(s)
            `,
            { skillIds: ['react', 'javascript', 'typescript', 'css', 'git'] }
        );


        console.log('Creating RELATED_TO relationships...');
        await session.run(
            `UNWIND $rels AS rel
           MATCH (a:Skill {id: rel.from})
           MATCH (b:Skill {id: rel.to})
           CREATE (a)-[:RELATED_TO]->(b)`,
            { rels: skillRelationships }
        );


        console.log('Creating REQUIRES relationships...');
        await session.run(
            `UNWIND $jobs AS job
           MATCH (j:Job {id: job.id})
           UNWIND job.requires AS skillId
           MATCH (s:Skill {id: skillId})
           CREATE (j)-[:REQUIRES]->(s)`,
            { jobs }
        );


        console.log('Creating OFFERED_BY relationships...');
        await session.run(
            `UNWIND $jobs AS job
           MATCH (j:Job {id: job.id})
           MATCH (c:Company {id: job.company})
           CREATE (j)-[:OFFERED_BY]->(c)`,
            { jobs }
        );


        console.log('Seed complete!');


    } catch (err) {
        console.error('Seed Failed', err)
    } finally {
        await session.close();
        await driver.close();
    }
}

seed();