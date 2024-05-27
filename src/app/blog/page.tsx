import Link from 'next/link';
import { getAllPostsFromNotion } from '@/services/posts';
export const metadata = {
  title: 'Blog',
  description: 'All posts are created by notion ai.',
};
export default async function BlogPage() {
  const allPosts = await getAllPostsFromNotion();
  return (
    <>
{allPosts.map((post) => {
  return (
    <>
      <Link href={`blog/${post.slug}`} >
        <div>{post.title}</div>
      </Link>
    </>
  );
})}

    </>
  );
}
