import { allFlashcards } from '@/lib/flashcards';
import FlashcardClient from './flashcard-client';

export function generateStaticParams() {
  return allFlashcards.map((f) => ({ flashcardId: f.id }));
}

export default function FlashcardPage({ params }: { params: { flashcardId: string } }) {
  return <FlashcardClient flashcardId={params.flashcardId} />;
}
