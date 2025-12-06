import { notFound } from "next/navigation";
import { getChaptersByBookName } from "../../../lib/shopify";
import BookPageClient from "./BookPageClient";

interface BookPageProps {
  params: Promise<{
    "book-name": string;
  }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { "book-name": encodedBookName } = await params;
  const bookName = decodeURIComponent(encodedBookName);

  const chaptersResult = await getChaptersByBookName(bookName);

  if (
    !chaptersResult.success ||
    !chaptersResult.data ||
    chaptersResult.data.length === 0
  ) {
    notFound();
  }

  const chapters = chaptersResult.data;

  return <BookPageClient bookName={bookName} chapters={chapters} />;
}
