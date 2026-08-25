const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

//require('dotenv').config();

const express = require('express');
const cors = require('cors');


const profileRoutes = require('./routes/profile');
const skillsRoutes = require('./routes/skills');
const jobsRoutes = require('./routes/jobs');
const recommendationsRoutes = require('./routes/recommendations');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        name: 'DevPath API',
        status: 'online',
        database: 'CognoDB',
        endpoints: [
            '/api/profile',
            '/api/skills',
            '/api/skills/:id',
            '/api/jobs',
            '/api/jobs/:id',
            '/api/recommendations'
        ]
    });
});



app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/recommendations', recommendationsRoutes);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});