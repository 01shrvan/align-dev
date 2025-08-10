import PostEditor from "@/components/posts/editor/PostEditor"
import TrendsSidebar from "@/components/TrendsSidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ForYouFeed from "./ForYouFeed"
import FollowingFeed from "./FollowingFeed"

export default function Home() {
  return (
    <div className="flex-1 pl-5 ml-5 border-l border-dashed border-border">
      <main className="flex w-full min-w-0 min-h-full">
        <div className="w-full min-w-0 space-y-5 border-r border-dashed border-border pr-5 mr-5 min-h-full">
          <PostEditor />
          <div className="border-b border-dashed border-border mt-1 mb-2" />
          <Tabs defaultValue="for-you" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="for-you">For you</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            <TabsContent value="for-you" className="space-y-4">
              <ForYouFeed />
            </TabsContent>
            <TabsContent value="following" className="space-y-4">
              <FollowingFeed />
            </TabsContent>
          </Tabs>
        </div>
        <TrendsSidebar />
      </main>
    </div>
  )
}