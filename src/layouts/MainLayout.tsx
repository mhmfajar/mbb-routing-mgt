import { Outlet, NavLink } from 'react-router';

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-text font-sans">
            <header className="bg-background-secondary px-8 py-4 shadow-md sticky top-0 z-100">
                <nav className="container flex gap-6">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? 'nav-link-active after:(content-empty absolute bottom-0 left-0 w-full h-0.5 bg-primary)'
                                : 'nav-link after:(content-empty absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200) hover:after:w-full'
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive
                                ? 'nav-link-active after:(content-empty absolute bottom-0 left-0 w-full h-0.5 bg-primary)'
                                : 'nav-link after:(content-empty absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200) hover:after:w-full'
                        }
                    >
                        About
                    </NavLink>
                </nav>
            </header>
            <main className="flex-1 p-8 container">
                <Outlet />
            </main>
            <footer className="bg-background-secondary px-8 py-4 text-center text-text-muted text-sm">
                <p>&copy; {new Date().getFullYear()} MBB Routing MGT. All rights reserved.</p>
            </footer>
        </div>
    );
}
