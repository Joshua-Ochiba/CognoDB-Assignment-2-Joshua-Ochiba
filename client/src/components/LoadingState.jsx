import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading graph data...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium">{message}</p>
        </div>
    );
}
