import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Briefcase, Zap, MapPin } from 'lucide-react';
import { fetchProfile, fetchRecommendations, fetchJobs } from '../api';
import StatCard from '../components/StatCard';
import SkillTag from '../components/SkillTag';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';


export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [profileData, recsData, jobsData] = await Promise.all([
                fetchProfile(),
                fetchRecommendations(),
                fetchJobs(),
            ]);

            setProfile(profileData);
            setRecommendations(recsData);
            setJobs(jobsData);
        } catch (err) {
            console.error(err);
            setError('Could not load dashboard data from CognoDB.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadDashboardData();
    }, []);

    if (loading) return <LoadingState message="Connecting to graph database & computing recommendations..." />;

    if (error) return <ErrorState message={error} onRetry={loadDashboardData} />;


    const ownedSkills = profile?.skills || [];
    const recommendedSkills = recommendations?.recommendedSkills || [];
    const recommendedJobs = recommendations?.recommendedJobs || [];

    return (
        <div className="space-y-8 max-w-6xl w-full">
            {/*Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                    Good morning, {profile?.name || 'Josh'}
                </h1>
                <p className="text-slate-400 mt-1 text-sm">
                    Explore where your skills can take you.
                </p>
            </div>


            {/*Stat Cards-Top */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                <StatCard
                    label="Your Skills"
                    value={ownedSkills.length}
                    sublabel="skills added to profile"
                    icon={Zap}
                />

                <StatCard
                    label="Matching Jobs"
                    value={jobs.length}
                    sublabel="opportunities found"
                    icon={Briefcase}
                />

                <StatCard
                    label="Recommended Skills"
                    value={recommendedSkills.length}
                    sublabel="to learn next "
                    icon={Sparkles}
                />
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left Column: Your Skills */}
                <div className="p-6 rounded-xl card-surface flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold text-slate-100">Your Skills</h2>

                            <Link
                                to='/skills'
                                className='text-xs fonr-medium text-indigo-400 hover:text-indigo-300
                            flex items-center gap-1 transition-colors'
                            >
                                View All <ArrowRight className='w-5 h-5' />
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            {ownedSkills.map((skill) => (
                                <Link
                                    key={skill.id}
                                    to={`/skills/${skill.id}`}
                                >
                                    <SkillTag
                                        name={skill.name}
                                        category={skill.category}
                                        userHasSkill={true}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Recommended Skills */}
                <div className="p-6 rounded-xl card-surface">
                    <div className='flex items-center justify-between mb-5'>
                        <h2 className="text-base font-semibold text-slate-100">Recommended Skills</h2>

                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                            graph-powered
                        </span>
                    </div>

                    <div className="space-y-2.5">
                        {recommendedSkills.slice(0, 4).map((skill) => (
                            <Link
                                key={skill.id}
                                to={`/skills/${skill.id}`}
                                className="flex items-center justify-between p-3 rounded-lg
                                 bg-slate-900/60 hover:bg-slate-800/80 border 
                                 border-slate-800/80 transition-all group"
                            >
                                <span className="text-sm font-medium text-slate-200 
                                group-hover:text-indigo-300">
                                    {skill.name}
                                </span>

                                <span className="text-xs text-slate-400">
                                    {skill.relatedTo?.length > 0 ?
                                        `Related to ${skill.relatedTo.join(',')}` : skill.category}
                                </span>
                            </Link>
                        ))}
                    </div>

                </div>

            </div>


            {/* Bottom Section: Recommended Jobs */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-slate-100">
                        Recommended Jobs
                    </h2>

                    <Link to='/jobs'
                        className="text-xs font-medium text-indigo-400 
                        hover:text-indigo-300
                         flex items-center gap-1 transition-colors">
                        Explore all Jobs
                        <ArrowRight className='w-3.5 h-3.5' />
                    </Link>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    {
                        recommendedJobs.slice(0, 3).map((job) => (
                            <Link
                                key={job.id}
                                to={`/jobs/${job.id}`}
                                className="p-5 rounded-xl card-surface card-hover transition-all 
                                flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 
                                        transition-colors text-sm">
                                            {job.title}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/10 
                                        text-indigo-400 border border-indigo-500/30 shrink-0">
                                            {job.matchPercent}%
                                        </span>
                                    </div>

                                    <div className="text-xs text-slate-400 mb-3">
                                        {job.company?.name}
                                    </div>

                                    <div className='flex items-center gap-1.5 text-xs text-slate-400 mb-4'>
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{job.location}</span>
                                    </div>
                                </div>

                                <div>
                                    {/* Match Progress Bar */}
                                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                                        <div
                                            className='h-full bg-indigo-500 rounded-full
                                         transition-all duration-500 '
                                            style={{ width: `${job.matchPercent}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                        <span>
                                            {job.matchCount} / {job.totalRequired} skills matched
                                        </span>
                                        <span>{job.postedAt}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}