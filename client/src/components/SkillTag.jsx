import React from 'react';

const categoryColors = {
    Frontend: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Language: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Backend: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Mobile: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    API: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Database: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    DevOps: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
};

export default function SkillTag({ name, category, userHasSkill }) {
    const colorClass = categoryColors[category] || 'bg-slate-500/10 text-slate-300 border-slate-500/30';

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
            {userHasSkill && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
            {name}
        </span>
    );
}
