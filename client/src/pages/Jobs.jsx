import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { fetchJobs } from '../api';
import JobCard from '../components/JobCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchJobs();
            setJobs(data);
        } catch (err) {
            console.error(err);
            setError('Could not load job listings from CognoDB.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    // Filter by search term (matches title, company name, required skills)
    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const term = searchTerm.toLowerCase();
            const titleMatch = job.title.toLowerCase().includes(term);
            const companyMatch = (job.company?.name || '').toLowerCase().includes(term);
            const skillMatch = job.skills?.some((s) => s.name.toLowerCase().includes(term));
            const locationMatch = (job.location || '').toLowerCase().includes(term);
            return titleMatch || companyMatch || skillMatch || locationMatch;
        });
    }, [jobs, searchTerm]);

    if (loading) return <LoadingState message="Calculating job match scores across your skills..." />;
    if (error) return <ErrorState message={error} onRetry={loadJobs} />;

    return (
        <div className="space-y-6 max-w-6xl w-full animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Jobs</h1>
                <p className="text-slate-400 mt-1 text-sm">
                    Explore opportunities that match your skills.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search jobs, skills, or companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-card-border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            {/* Results Count */}
            <div className="text-xs text-slate-500 font-medium">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </div>

            {/* Jobs Stacked List */}
            {filteredJobs.length === 0 ? (
                <EmptyState
                    title="No jobs match your search"
                    message="Try searching for a different skill or clearing your search query."
                />
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}
