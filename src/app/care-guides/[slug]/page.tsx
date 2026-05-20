import { Metadata } from 'next';
import { getArticles } from '../../../lib/db';
import ArticleClient from './ArticleClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const articles = await getArticles();
  const article = articles.find(a => a.slug === params.slug);

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

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const articles = await getArticles();
  const article = articles.find(a => a.slug === params.slug);

  return <ArticleClient initialArticle={article || null} slug={params.slug} />;
}
