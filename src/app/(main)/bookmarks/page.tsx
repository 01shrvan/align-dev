import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import Bookmarks from "./Bookmarks";

export const metadata: Metadata = {
    title: "Bookmarks",
};

export default function Page() {
    return (
        <div className="flex-1 pl-5 ml-5 border-l border-dashed border-border">
            <main className="flex w-full min-w-0 min-h-full">
                <div className="w-full min-w-0 space-y-5 border-r border-dashed border-border pr-5 mr-5 min-h-full">
                    <div className="rounded-2xl bg-card p-5 shadow-sm">
                        <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
                    </div>
                    <Bookmarks />
                </div>
                <TrendsSidebar />
            </main>
        </div>
    );
}