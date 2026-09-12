import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { samplePosts } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Blog",
  description: `Articles and notes from ${siteConfig.therapistName} at ${siteConfig.name}.`,
};

type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
};

export default async function BlogPage() {
  const fromCms = await sanityFetch<PostListItem[]>({
    query: postsQuery,
    tags: ["post"],
  });

  const posts: PostListItem[] =
    fromCms && fromCms.length > 0
      ? fromCms
      : samplePosts.map((post) => ({
          _id: post._id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          publishedAt: post.publishedAt,
        }));

  return (
    <section className="atmosphere relative overflow-hidden">
      <div className="paper-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid items-end gap-10 md:grid-cols-[1.15fr_0.85fr]">
          <FadeIn>
            <p className="text-sm font-medium tracking-[0.14em] text-sage uppercase">
              Blog
            </p>
            <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
              Writing
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              Short pieces for prospective and current clients — notes on
              therapy, getting started, and finding steadier ground.
            </p>
          </FadeIn>
          <FadeIn delayMs={80}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[5/6]">
              <Image
                src="/images/woman-soft-light.jpg"
                alt="Young woman resting in soft light"
                fill
                className="object-cover object-[center_20%]"
                sizes="(min-width: 768px) 32vw, 100vw"
              />
            </div>
          </FadeIn>
        </div>

        <ul className="mt-14 space-y-0">
          {posts.map((post, index) => (
            <li key={post._id}>
              <FadeIn delayMs={index * 60}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block border-t border-line py-8 transition hover:bg-paper/40"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-8">
                    <h2 className="font-serif text-2xl text-ink transition group-hover:text-sage-deep md:text-3xl">
                      {post.title}
                    </h2>
                    {post.publishedAt ? (
                      <time
                        dateTime={post.publishedAt}
                        className="shrink-0 text-sm text-ink-muted"
                      >
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    ) : null}
                  </div>
                  {post.excerpt ? (
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
                      {post.excerpt}
                    </p>
                  ) : null}
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
