import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, Briefcase, Network, User } from 'lucide-react';

export default function Sidebar() {
    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Skills', path: '/skills', icon: Zap },
        { label: 'Jobs', path: '/jobs', icon: Briefcase },
    ];

    return (
        <aside className='w-64 h-screen bg-sidebar border-r border-card-border
        flex flex-col justify-between shrink-0 sticky top-0 overflow-y-auto'>
            <div>
                {/*Logo */}
                <div className='h-16 flex items-center gap-3 px-6 border-b 
                border-card-border/50'>
                    <div className='w-8 h-8 rounded-lg bg-indigo-600 flex
                    items-center justify-center text-white shadow-lg shadow-indigo-600/30'>
                        <Network className='w-5 h-5' />
                    </div>
                    <span className="font-bold text-lg text-slate-100 tracking-tight">
                        DevPath
                    </span>
                </div>


                {/*Menu*/}
                <div className='px-3 py-6'>
                    <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase px-3 mb-2">
                        Explore
                    </div>

                    <nav className='space-y-1'>
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/'}
                                    className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                                    font-medium transition-all
                                    ${isActive ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                        }
                                    `}
                                >
                                    <Icon className='w-4' />
                                    {item.label}
                                </NavLink>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/*Footer */}
            <div className="p-4 border-t border-card-border/50 m-3 rounded-xl bg-card/60">
                <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-lg bg-indigo-600/30 border
                    border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300
                    text-sm'>
                        J
                    </div>
                    <div className='overflow-hidden'>
                        <div className="text-sm font-semibold text-slate-200 truncate">Josh</div>
                        <div className="text-xs text-slate-400 truncate">Frontend Dev</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
