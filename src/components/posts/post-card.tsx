'use client';

import Image from 'next/image';
import Link from 'next/link';

import CategoryList from '@/components/category-list';
import { Post } from '@/types/post';

export default function PostCard({
  post: { slug,emoji,link,summary, type,title, date,  categories, blurUrl },
}: {
  post: Post;
}) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="mx-auto flex max-w-[25rem] flex-col overflow-hidden rounded-xl shadow-xl shadow-gray-400 transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl dark:shadow-black">
        {link}{type}
        <div className="flex h-48 flex-col p-4">
          <h3 className="line-clamp-2 h-16 text-2xl font-bold">{emoji}{title}</h3>
          <h1 > {summary}</h1>
          <time className="mb-4 mt-2 pl-2 text-sm text-gray-400">{date}</time>
          {type}
          <CategoryList categories={categories} />
        </div>
      </article>
    </Link>
  );
}
