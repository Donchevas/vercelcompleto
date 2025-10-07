import { getAllPosts } from '@/lib/sanity'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const revalidate = 60 // Revalidar cada 60 segundos

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen py-20 px-6 bg-[#f7f8fa]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-[#0f4c81]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f4c81] mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Artículos sobre tecnología, automatización y lecciones aprendidas 
            en proyectos reales de ingeniería de sistemas.
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <article 
                key={post._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <Link href={`/blog/${post.slug.current}`}>
                  {post.mainImage && (
                    <div className="relative aspect-video bg-gray-200">
                      <Image
                        src={urlFor(post.mainImage).width(800).height(450).url()}
                        alt={post.mainImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {post.categories && post.categories.length > 0 && (
                      <span className="inline-block text-sm font-semibold text-[#0f4c81] bg-blue-50 px-3 py-1 rounded-full mb-3">
                        {post.categories[0]}
                      </span>
                    )}
                    
                    <h2 className="text-xl font-bold text-[#0f4c81] mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span>
                        {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                      {post.author && (
                        <span className="font-medium">
                          {post.author}
                        </span>
                      )}
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span 
                            key={index}
                            className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">
              No hay posts publicados aún. ¡Vuelve pronto!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
