import { Outlet } from "react-router";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-text font-sans">
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
