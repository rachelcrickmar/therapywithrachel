import { groq } from "next-sanity";

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    title,
    description,
    order
  }
`;

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    body
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    practiceName,
    phone,
    email,
    thrizerWidgetUrl,
    seoTitle,
    seoDescription
  }
`;
