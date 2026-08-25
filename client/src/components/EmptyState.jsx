import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({
    title = 'No results found',
    message = 'Try exploring a different skill or clearing your search filters.'
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-card-border bg-card/40">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3">
                <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
            <p className="text-sm text-slate-400 max-w-sm">{message}</p>
        </div>
    );
}
