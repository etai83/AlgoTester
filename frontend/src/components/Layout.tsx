import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
    title?: string; // Optional title for the header if not page-specific
}

const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                    ? 'bg-surface-dark border border-border-dark/50 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
            }
        >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </NavLink>
    );
};

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-border-dark bg-surface-darker shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">candlestick_chart</span>
                        <h1 className="text-xl font-bold tracking-tight text-white">AlgoTester</h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-2 flex flex-col gap-2">
                    <NavItem to="/" icon="dashboard" label="Dashboard" />
                    <NavItem to="/history" icon="history" label="Run History" />
                    <NavItem to="/editor" icon="code" label="Strategy Editor" />
                    <NavItem to="/settings" icon="tune" label="Settings" />
                    <NavItem to="/live" icon="bolt" label="Live Trading" />
                </nav>

                <div className="p-4 border-t border-border-dark">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            JD
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">John Doe</span>
                            <span className="text-xs text-slate-500">Pro Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
