import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex h-screen overflow-hidden bg-background text-slate-100">
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto px-8 py-8">
                <div className="max-w-6xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
