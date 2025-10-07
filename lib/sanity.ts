
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Verificar si las credenciales de Sanity están configuradas
const isSanityConfigured = projectId !== '' && projectId !== 'placeholder'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Query para obtener todos los posts
export async function getAllPosts() {
  if (!isSanityConfigured) {
    return []
  }
  
  try {
    return await client.fetch(
      `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        mainImage,
        "author": author->name,
        "categories": categories[]->title,
        tags,
        featured
      }`
    )
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error)
    return []
  }
}

// Query para obtener un post por slug
export async function getPostBySlug(slug: string) {
  if (!isSanityConfigured) {
    return null
  }
  
  try {
    return await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        publishedAt,
        mainImage,
        body,
        "author": author->{name, image, bio},
        "categories": categories[]->title,
        tags,
        featured
      }`,
      { slug }
    )
  } catch (error) {
    console.error('Error fetching post from Sanity:', error)
    return null
  }
}

// Query para obtener posts destacados
export async function getFeaturedPosts() {
  if (!isSanityConfigured) {
    return []
  }
  
  try {
    return await client.fetch(
      `*[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        mainImage,
        "author": author->name,
        "categories": categories[]->title,
        tags
      }`
    )
  } catch (error) {
    console.error('Error fetching featured posts from Sanity:', error)
    return []
  }
}
