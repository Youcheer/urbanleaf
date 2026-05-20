import { Metadata } from 'next';
import { getArticles } from '../../../lib/db';
import ArticleClient from './ArticleClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const articles = await getArticles();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return { title: 'Article Not Found | Urban Leaf' };
  }

  return {
    title: `${article.title} | Urban Leaf Plant Care`,
    description: `Read ${article.title} to learn the best plant care tips.`,
    openGraph: {
      title: article.title,
      description: `Read about ${article.title} at Urban Leaf`,
      images: [article.featuredImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      images: [article.featuredImage],
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const articles = await getArticles();
  const article = articles.find(a => a.slug === slug);

  return <ArticleClient initialArticle={article || null} slug={slug} />;
}
