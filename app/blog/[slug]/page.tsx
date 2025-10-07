import { getAllPosts, getPostBySlug, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft, Tag, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const revalidate = 60 // Revalidar cada 60 segundos

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts?.map((post: any) => ({
    slug: post.slug.current,
  })) ?? []
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post no encontrado - Specialistati',
    }
  }

  return {
    title: `${post.title} - Specialistati`,
    description: post.excerpt || `Artículo sobre ${post.title}`,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Calcular tiempo de lectura estimado
  const wordsPerMinute = 200
  const textContent = post.body?.map((block: any) => {
    if (block._type === 'block') {
      return block.children?.map((child: any) => child.text).join(' ')
    }
    return ''
  }).join(' ') || ''
  const wordCount = textContent.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return (
    <div className="min-h-screen py-20 px-6 bg-[#f7f8fa]">
      <article className="max-w-4xl mx-auto">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-[#0f4c81] hover:gap-3 transition-all duration-300 mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al blog
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {post.mainImage && (
            <div className="relative w-full aspect-video bg-gray-200">
              <Image
                src={urlFor(post.mainImage).width(1200).height(675).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            {post.categories && post.categories.length > 0 && (
              <span className="inline-block text-sm font-semibold text-[#0f4c81] bg-blue-50 px-4 py-1.5 rounded-full mb-4">
                {post.categories[0]}
              </span>
            )}
            
            <h1 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Lectura de {readingTime} min</span>
              </div>
              {post.author?.name && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{post.author.name}</span>
                </div>
              )}
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <Tag className="w-5 h-5 text-gray-500" />
                {post.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <PortableText 
                value={post.body} 
                components={portableTextComponents}
              />
            </div>

            {post.author?.bio && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-start gap-4">
                  {post.author.image && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={urlFor(post.author.image).width(64).height(64).url()}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-[#0f4c81] mb-2">
                      Acerca del autor: {post.author.name}
                    </h3>
                    <div className="text-gray-600">
                      <PortableText value={post.author.bio} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
