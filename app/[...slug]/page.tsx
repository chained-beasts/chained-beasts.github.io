import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage } from "@/components/site/seo-page";
import { enabledPages, getPageBySlug } from "@/content/registry";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return enabledPages.map((page) => ({ slug: page.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug.join("/"));
  return page ? pageMetadata(page) : {};
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = getPageBySlug(slug.join("/"));
  if (!page) notFound();
  return <SeoPage page={page} />;
}
