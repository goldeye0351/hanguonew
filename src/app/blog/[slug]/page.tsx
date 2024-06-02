import { Metadata } from 'next';

import Link from 'next/link';
import { notFound } from 'next/navigation';


import { getRecordMap } from '@/libs/notion';
import { getAllPostsFromNotion } from '@/services/posts';
import { Post } from '@/types/post';

export default async function PostPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const allPosts = await getAllPostsFromNotion();
  const onlyposts=allPosts.filter((post) =>post.type == 'Post');

  const post = onlyposts.find((p) => p.slug == slug);
  if (!post) {
    return notFound();
  }



  return (
    <>
      {post.title}
    </>
  );
}

export async function generateStaticParams() {
  const allPosts = await getAllPostsFromNotion();

  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

