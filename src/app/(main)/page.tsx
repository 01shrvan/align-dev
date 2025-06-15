import PostEditor from "@/components/posts/editor/PostEditor"
import TrendsSidebar from "@/components/TrendsSidebar"
import ForYouFeed from "./ForYouFeed"

export default function Home() {
  return (
    <main className="flex w-full min-w-0">
      <div className="w-full min-w-0 space-y-5 border-r border-dashed border-border pr-5 mr-5">
        <PostEditor />
        <div className="border-b border-dashed border-border my-5" />
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  )
}
