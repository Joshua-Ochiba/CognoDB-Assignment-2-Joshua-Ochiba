import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { fetchSkills } from '../api';
import SkillTag from '../components/SkillTag';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

const CATEGORIES = [
    'All',
    'Frontend',
    'Language',
    'Backend',
    'Mobile',
    'API',
    'DevOps',
    'Database',
];


export default function SKills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const loadSkills = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchSkills();

            setSkills(data);
        } catch (err) {
            console.error(err);
            setError('Could not load skills from CognoDB.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSkills();
    }, []);


    //Client SIde filtering using search keywords and category

    const filteredSkills = useMemo(() => {

        return skills.filter((skill) => {
            const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                skill.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [skills, searchTerm, selectedCategory]);

    if (loading) return <LoadingState message="Fetching skill nodes from graph..." />;
    if (error) return <ErrorState message={error} onRetry={loadSkills} />


    return (
        <div className="space-y-6 max-w-6xl w-full">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Skills</h1>
                <p className="text-slate-400 mt-1 text-sm">
                    Browse the skill graph and discover how technologies connect to each other and to opportunities.
                </p>
            </div>

            {/*Search BAr */}
            <div className='relative'>
                <Search className='w-4 h-4 text-late-500 absolute left-3.5
                top-1/2 -translate-y-1/2'/>
                <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-1/2 pl-10 pr-4 py-2.5 rounded-xl bg-card
                    border border-card-border text-sm text-slate-100 placeholder:text-slate-500
                     focus:outline-none focus:border-indigo-500 transition-colors'
                />
            </div>


            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all
                            ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                                : 'bg-card border border-card-border text-slate-400 hover:text-slate-200 hover:border-slate-700'}
                            `}
                    >
                        {cat}
                    </button>
                ))}
            </div>


            {/* Results Count */}
            <div className="text-xs text-slate-500 font-medium">
                {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'} found
            </div>


            {/*SKills Grid*/}
            {filteredSkills.length === 0 ?
                (
                    <EmptyState
                        title="No matching skills found"
                        message="Try a different search term or category filter."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredSkills.map((skill) => (
                            <Link
                                key={skill.id}
                                to={`/skills/${skill.id}`}
                                className="p-4.5 rounded-xl card-surface card-hover 
                                transition-all flex flex-col justify-between group
                                 cursor-pointer animate-card min-h-[165px]"
                            >
                                <div>
                                    {/* Title & Category */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors text-base tracking-tight">
                                            {skill.name}
                                        </h3>
                                        <SkillTag name={skill.category} category={skill.category} />
                                    </div>


                                    {skill.userHasSkill && (
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-2.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Your skill
                                        </div>
                                    )}


                                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                                        {skill.description}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="pt-3 mt-3 border-t border-slate-800/60
                                 flex items-center justify-between text-xs 
                                 text-slate-500 font-medium">
                                    <span className="group-hover:text-indigo-400 transition-colors">
                                        Explore connections →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                )}
        </div>
    )
}