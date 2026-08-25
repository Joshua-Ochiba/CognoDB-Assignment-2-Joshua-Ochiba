import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Circle, MapPin, Briefcase, DollarSign, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { fetchJobDetail } from '../api';
import SkillTag from '../components/SkillTag';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function JobDetail() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadJob = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchJobDetail(id);
            setJob(data);
        } catch (err) {
            console.error(err);
            setError(`Could not load details for job "${id}".`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJob();
    }, [id]);

    if (loading) return <LoadingState message="Analyzing role requirements & calculating skill path..." />;
    if (error) return <ErrorState message={error} onRetry={loadJob} />;
    if (!job) return null;

    const skills = job.skills || [];
    const missingSkills = job.missingSkills || [];
    const matchPercent = job.matchPercent || 0;

    return (
        <div className="space-y-8 max-w-5xl w-full animate-fade-in">
            {/* Back to Jobs Link */}
            <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Jobs
            </Link>

            {/* Main Job Header Card */}
            <div className="p-7 rounded-2xl card-surface space-y-6">
                <div>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                                {job.title}
                            </h1>
                            <div className="text-sm font-semibold text-slate-300 mt-1">
                                {job.company?.name || 'Company'}
                            </div>
                        </div>

                        {/* Match percentage badge */}
                        <div className="text-right">
                            <span className="text-2xl font-black text-indigo-400">
                                {matchPercent}%
                            </span>
                            <span className="text-xs text-slate-400 block font-medium">
                                skill match
                            </span>
                        </div>
                    </div>

                    {/* Meta Tags */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 pt-2">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {job.location}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                            {job.type}
                        </span>
                        {job.salary && (
                            <>
                                <span>·</span>
                                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                    <DollarSign className="w-3.5 h-3.5" />
                                    {job.salary}
                                </span>
                            </>
                        )}
                        <span>·</span>
                        <span className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            Posted {job.postedAt}
                        </span>
                    </div>
                </div>

                {/* Match Progress Bar Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-300 font-medium">Your qualification score</span>
                        <span className="text-slate-400 font-semibold">
                            {job.matchCount} of {job.totalRequired} skills matched
                        </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                            style={{ width: `${matchPercent}%` }}
                        />
                    </div>
                </div>

                {/* Job Description */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-200 mb-2">About the role</h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                        {job.description}
                    </p>
                </div>
            </div>

            {/* Required Skills Checklist */}
            <div className="p-7 rounded-2xl card-surface space-y-5">
                <div>
                    <h2 className="text-lg font-semibold text-slate-100">Required Skills</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Core technologies required for this role and your current status.
                    </p>
                </div>

                <div className="space-y-2.5">
                    {skills.map((s) => (
                        <Link
                            key={s.id}
                            to={`/skills/${s.id}`}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${s.userHasSkill
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-amber-500/10 text-amber-400'
                                    }`}>
                                    {s.userHasSkill ? (
                                        <Check className="w-3 h-3 stroke-[2.5]" />
                                    ) : (
                                        <Circle className="w-2 h-2 fill-current" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                                    {s.name}
                                </span>
                                <SkillTag name={s.category} category={s.category} />
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                                {s.userHasSkill ? (
                                    <span className="text-emerald-400 font-medium">In your skills</span>
                                ) : (
                                    <span className="text-amber-400 font-medium">Missing skill</span>
                                )}
                                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors ml-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Graph-Powered Next Skill Recommendation */}
            {missingSkills.length > 0 && (
                <div className="p-7 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-card to-card border border-indigo-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        Graph Learning Recommendation
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-100">
                            Bridge your skill gap to qualify
                        </h2>
                        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                            By learning <strong className="text-indigo-300">{missingSkills[0].name}</strong>, your match score for this role will increase to{' '}
                            <strong className="text-emerald-400">
                                {Math.round(((job.matchCount + 1) / job.totalRequired) * 100)}%
                            </strong>.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link
                            to={`/skills/${missingSkills[0].id}`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
                        >
                            Explore {missingSkills[0].name} in graph <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
