import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, MapPin, CheckCircle2 } from 'lucide-react';
import { fetchSkillDetail } from '../api';
import SkillTag from '../components/SkillTag';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import JobCard from '../components/JobCard';


export default function SkillDetail() {
    const { id } = useParams();
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadSkill = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchSkillDetail(id);
            setSkill(data);
        } catch (err) {
            console.error(err);
            setError(`Could not load details for skill "${id}".`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSkill();
    }, [id]);

    if (loading) return <LoadingState message="Traversing related skills and opportunities..." />;
    if (error) return <ErrorState message={error} onRetry={loadSkill} />;
    if (!skill) return null;

    const relatedSkills = skill.relatedSkills || [];
    const jobs = skill.jobs || [];


    return (
        <div className="space-y-8 max-w-5xl w-full animate-fade-in">
            {/* Back Link */}
            <Link
                to="/skills"
                className="inline-flex items-center gap-1.5 text-xs
                 font-medium text-slate-400 hover:text-indigo-300 
                 transition-colors"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Skills
            </Link>

            {/* Header */}
            <div className="p-7 rounded-2xl card-surface">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                            {skill.name}
                        </h1>
                        <SkillTag name={skill.category} category={skill.category} />
                    </div>

                    {skill.userHasSkill && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 
                        rounded-full text-xs font-medium bg-emerald-500/10
                         text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            In your skills
                        </span>
                    )}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                    {skill.description}
                </p>
            </div>

            {/*  Related Skills */}
            <div className="p-7 rounded-2xl card-surface space-y-5">
                <div>
                    <h2 className="text-lg font-semibold text-slate-100">
                        Related Skills
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Technologies frequently paired or connected with {skill.name} in the ecosystem.
                    </p>
                </div>

                {relatedSkills.length === 0 ? (

                    <p className="text-xs text-slate-500 italic">
                        No direct connections recorded.
                    </p>

                ) : (
                    <div className="space-y-2.5">
                        {relatedSkills.map((rel) => (
                            <Link
                                key={rel.id}
                                to={`/skills/${rel.id}`}
                                className="flex items-center justify-between p-3.5 rounded-xl 
                                bg-slate-900/60 hover:bg-slate-800/80 border 
                                border-slate-800/80 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-slate-200
                                     group-hover:text-indigo-300 transition-colors">
                                        {rel.name}
                                    </span>
                                    <SkillTag name={rel.category} category={rel.category} />
                                </div>

                                <div className="flex items-center gap-3 text-xs">
                                    {rel.userHasSkill ? (
                                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Your skill
                                        </span>
                                    ) : (
                                        <span className="text-slate-500 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                                            Explore <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Section 2: Jobs Using this Skill */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-100">
                        Jobs using {skill.name}
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                        {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
                    </span>
                </div>

                {jobs.length === 0 ? (
                    <div className="p-8 rounded-2xl card-surface text-center text-xs text-slate-500">
                        No active job openings currently require {skill.name}.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}