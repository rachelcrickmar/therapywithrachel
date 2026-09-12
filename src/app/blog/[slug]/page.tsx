import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { PortableBody } from "@/components/PortableBody";
import { SanityImage } from "@/components/SanityImage";
import { samplePosts } from "@/lib/content";
import { sanityFetch } from "@/sanity/lib/client";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/lib/queries";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  body?: unknown;
  coverImage?: unknown;
  coverImageAlt?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: postSlugsQuery,
    revalidate: false,
  });

  const fromCms = (slugs || []).map((slug) => ({ slug }));
  const samples = samplePosts.map((post) => ({ slug: post.slug }));

  const seen = new Set<string>();
  return [...fromCms, ...samples].filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

async function getPost(slug: string): Promise<Post | null> {
  const fromCms = await sanityFetch<Post>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
  });
  if (fromCms) return fromCms;

  const sample = samplePosts.find((post) => post.slug === slug);
  if (!sample) return null;

  return {
    _id: sample._id,
    title: sample.title,
    slug: sample.slug,
    excerpt: sample.excerpt,
    publishedAt: sample.publishedAt,
    body: sample.body,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="atmosphere relative overflow-hidden">
      <div className="paper-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <FadeIn>
          <Link
            href="/blog"
            className="text-sm text-sage-deep transition hover:underline"
          >
            ← All posts
          </Link>
          <h1 className="mt-6 font-serif text-4xl text-ink md:text-5xl">
            {post.title}
          </h1>
          {post.publishedAt ? (
            <time
              dateTime={post.publishedAt}
              className="mt-4 block text-sm text-ink-muted"
            >
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          ) : null}
        </FadeIn>

        {post.coverImage ? (
          <div className="mt-10 overflow-hidden rounded-sm">
            <SanityImage
              value={post.coverImage as never}
              alt={post.coverImageAlt || post.title}
              className="h-auto w-full object-cover"
              sizes="(min-width: 768px) 720px, 100vw"
              priority
            />
          </div>
        ) : null}

        <div className="mt-10">
          <PortableBody value={post.body} />
        </div>
      </div>
    </article>
  );
}
