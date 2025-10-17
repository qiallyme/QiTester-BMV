# QiAlly • Indiana Driver’s Mastery (Adaptive Flashcards)

Local-first, no-backend adaptive flashcard app for Indiana BMV knowledge exam prep. Wrong answers get re-queued quickly; a card retires only after **4 consecutive correct** answers.

## Quick start

```bash
npm i
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Add more questions

Edit `src/questions.json`. Each item:

```json
{
  "id": "S-001",
  "q": "What does a downward-pointing triangle sign indicate?",
  "choices": ["Stop","Yield","Do Not Enter","No Passing"],
  "answer": "Yield",
  "domain": "signs",
  "ref": "Manual: Signs",
  "why": "Triangular downward equals Yield. You must slow and give right-of-way."
}
```

Domains used: `signs`, `rules`. Add new domains as needed.

## Mastery logic

- Required streak: **4** correct in a row.
- Correct: card is reinserted deeper in queue.
- Wrong: streak resets to 0; card is reinserted near-front.
- Mastered: removed from the active queue view.