# 🎨 Context-Aware Refinement

The "Wow" factor of DocBuilder is its ability to refine content like a human editor who understands the full context of your document.

## The Problem with Standard AI Editing
Most AI tools treat a refinement request (e.g., "Make it shorter") in isolation. They don't know what came before or after, often leading to disjointed text.

## The DocBuilder Solution

When you ask for a refinement, we send a massive context payload to the LLM:

1.  **Document Metadata**: Title, type, total section count.
2.  **Position Marker**: "Section 3 of 7" (Visualized for the AI).
3.  **Adjacent Context**:
    - **Previous Section**: Summary and key points.
    - **Next Section**: Title.
4.  **Current Content**: The full text (no truncation).
5.  **Word Count Intelligence**:
    - Current count vs. Target count.
    - Automatic calculation of ±30% for "expand"/"condense" requests.
6.  **Refinement History**:
    - A log of your past requests (e.g., "Make it formal", "Add more data").
    - **Reactions**: Did you Like (✓) or Dislike (✗) previous attempts? The AI learns from this!

## Smart Features

- **Automatic Transitions**: Ask "Connect to the next section," and the AI looks at the *next section's title* to write a perfect segue.
- **Tone Consistency**: By seeing the history of what you liked, the AI adapts its style to your preference.
- **Format Switching**: Intelligently converts paragraphs to bullets (and vice-versa) while preserving the core information.

## Technical Implementation

See `backend/app/core/llm.py` -> `refine_section`.
