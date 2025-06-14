import PostEditor from "@/components/posts/editor/PostEditor"
import Post from "@/components/posts/Post"
import TrendsSidebar from "@/components/TrendsSidebar"
import prisma from "@/lib/prisma"
import { postDataInclude } from "@/lib/types"

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="flex w-full min-w-0">
      <div className="w-full min-w-0 space-y-5 border-r border-dashed border-border pr-5 mr-5">
        <PostEditor />
        <div className="border-b border-dashed border-border my-5" />
        {posts.map((post) => (
          <div key={post.id}>
            <Post post={post} />
            <div className="border-b border-dashed border-border my-5" />
          </div>
        ))}
      </div>
      <TrendsSidebar />
    </main>
  )
}
