//Centralize data fetching
export async function fetchProfile() {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}



export async function fetchSkills() {
    const res = await fetch('/api/skills');
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
}


export async function fetchSkillDetail(id) {
    const res = await fetch(`/api/skills/${id}`);
    if (!res.ok) throw new Error('Failed to fetch skill details');
    return res.json();
}


export async function fetchJobs() {
    const res = await fetch('/api/jobs');
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
}
export async function fetchJobDetail(id) {
    const res = await fetch(`/api/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job details');
    return res.json();
}
export async function fetchRecommendations() {
    const res = await fetch('/api/recommendations');
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
}
