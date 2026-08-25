import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Circle } from 'lucide-react';

export default function JobCard({ job }) {
    const matchPercent = job.matchPercent || 0;
    const companyName = job.company?.name || job.companyName || 'Company';

    return (
        <Link
            to={`/jobs/${job.id}`}
            className="p-6 rounded-2xl card-surface card-hover transition-all flex flex-col justify-between group cursor-pointer animate-card"
        >
            <div>
                {/*Title + Match Score */}
                <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors tracking-tight">
                        {job.title}
                    </h3>
                    <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-indigo-400">
                            {matchPercent}%
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                            {job.matchCount || 0}/{job.totalRequired || 0} skills
                        </div>
                    </div>
                </div>

                {/* Company & Meta info */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-4">
                    <span className="font-semibold text-slate-300">{companyName}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                    <span>·</span>
                    <span>{job.type}</span>
                    {job.salary && (
                        <>
                            <span>·</span>
                            <span className="text-emerald-400 font-medium">{job.salary}</span>
                        </>
                    )}
                </div>

                {/* Required Skills List*/}
                <div className="flex flex-wrap gap-2 mb-5">
                    {job.skills?.map((s) => (
                        <span
                            key={s.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${s.userHasSkill
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-900/60 text-slate-400 border-slate-800'
                                }`}
                        >
                            {s.userHasSkill ? (
                                <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                            ) : (
                                <Circle className="w-2.5 h-2.5 text-slate-500" />
                            )}
                            {s.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Bottom Progress Bar */}
            <div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${matchPercent}%` }}
                    />
                </div>
                <div className="flex items-center justify-end text-[11px] text-slate-500">
                    <span>{job.postedAt || 'Recently'}</span>
                </div>
            </div>
        </Link>
    );
}
