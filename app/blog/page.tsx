import Link from "next/link"
import { Button } from "@/components/ui/button"

const blogPosts = [
  {
    id: 1,
    title: "The Future of eLearning: Trends to Watch",
    excerpt: "Explore the latest trends shaping the future of online education and corporate training.",
    date: "2023-05-15",
  },
  {
    id: 2,
    title: "Maximizing ROI in Corporate Training",
    excerpt: "Learn how to measure and maximize the return on investment for your corporate training programs.",
    date: "2023-05-10",
  },
  {
    id: 3,
    title: "The Power of Microlearning in the Workplace",
    excerpt: "Discover how bite-sized learning can lead to big results in employee performance and engagement.",
    date: "2023-05-05",
  },
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{post.date}</span>
                <Button variant="outline" asChild>
                  <Link href={`/blog/${post.id}`}>Read More</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

