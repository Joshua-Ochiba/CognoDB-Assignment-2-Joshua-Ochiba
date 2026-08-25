const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchProfile() {
    const res = await fetch(`${API_BASE_URL}/api/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}

export async function fetchSkills() {
    const res = await fetch(`${API_BASE_URL}/api/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
}

export async function fetchSkillDetail(id) {
    const res = await fetch(`${API_BASE_URL}/api/skills/${id}`);
    if (!res.ok) throw new Error('Failed to fetch skill details');
    return res.json();
}

export async function fetchJobs() {
    const res = await fetch(`${API_BASE_URL}/api/jobs`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
}

export async function fetchJobDetail(id) {
    const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job details');
    return res.json();
}

export async function fetchRecommendations() {
    const res = await fetch(`${API_BASE_URL}/api/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
}
