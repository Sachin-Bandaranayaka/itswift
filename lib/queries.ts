import { groq } from 'next-sanity';

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    excerpt,
    publishedAt,
    author->{
      name,
      image
    },
    categories[]->{
      title
    }
  }
`;

// Query for published blog posts only (for public blog page)
export const publishedPostsQuery = groq`
  *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    excerpt,
    publishedAt,
    author->{
      name,
      image
    },
    categories[]->{
      title
    },
    _createdAt,
    _updatedAt
  }
`;

// Query for paginated published posts
export const paginatedPublishedPostsQuery = groq`
  *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    mainImage,
    excerpt,
    publishedAt,
    author->{
      name,
      image
    },
    categories[]->{
      title
    },
    _createdAt,
    _updatedAt
  }
`;

// Query to count total published posts
export const publishedPostsCountQuery = groq`
  count(*[_type == "post" && publishedAt <= now()])
`;

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage {
      ...,
      alt
    },
    body,
    excerpt,
    publishedAt,
    author->{
      name,
      image,
      bio
    },
    categories[]->{
      title
    }
  }
`;

// Alias for consistency
export const postBySlugQuery = postQuery; 