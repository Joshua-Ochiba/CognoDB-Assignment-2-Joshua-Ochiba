import React from 'react';

export default function StatCard({ label, value, sublabel, icon: Icon }) {
    return (
        <div className="p-5 rounded-xl card-surface flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-sm font-medium">{label}</span>
                {Icon && <Icon className="w-5 h-5 text-indigo-400" />}
            </div>
            <div>
                <div className="text-3xl font-bold text-slate-100 tracking-tight">{value}</div>
                {sublabel && <div className="text-xs text-slate-400 mt-1">{sublabel}</div>}
            </div>
        </div>
    );
}
