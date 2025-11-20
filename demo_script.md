# AI Document Authoring App - Demo Script

**Goal**: Showcase the end-to-end flow of creating, refining, and exporting a document using AI.

## 1. Setup & Login (0:00 - 0:30)
- **Action**: Open the app in the browser (`http://localhost:3000`).
- **Action**: Click "Login" (or "Get Started").
- **Action**: Sign in with Google (or email/password if configured).
- **Visual**: Dashboard loads, showing existing projects (if any) or empty state.

## 2. Create Project & Generate Outline (0:30 - 1:30)
- **Action**: Click "New Project".
- **Action**: Enter Title: "The Future of Remote Work".
- **Action**: Select Type: "Report" (or DOCX).
- **Action**: Click "Create".
- **Visual**: Project page opens. "Content" area is empty.
- **Action**: In "Start with an AI Outline", type: "Trends in remote work, benefits, challenges, and future outlook."
- **Action**: Click "Suggest".
- **Visual**: Loading spinner... then a structured outline appears (e.g., "Introduction", "Benefits", "Challenges", "Conclusion").

## 3. Generate Content (1:30 - 2:30)
- **Action**: Locate the first section ("Introduction").
- **Action**: Click the "Generate" (magic wand) button next to it.
- **Visual**: Status changes to "Generating..." -> "Done". Content appears in the section.
- **Action**: Expand the section to read the content.
- **Action**: Repeat for the second section ("Benefits").

## 4. Refine Content (2:30 - 4:00)
- **Action**: Read the "Introduction" content.
- **Say**: "This is good, but let's make it more professional."
- **Action**: In the "Refine with AI" input box for that section, type: "Make the tone more professional and add a statistic about remote work growth."
- **Action**: Click "Refine".
- **Visual**: Loading... then the content updates.
- **Action**: Click "History" toggle. Show the previous version and the new one.
- **Action**: Click the "Like" (thumbs up) button on the new version.

## 5. Collaboration (Comments) (4:00 - 5:00)
- **Action**: Click "Comments" toggle on the "Benefits" section.
- **Action**: Type: "We need to mention mental health here."
- **Action**: Click "Add Comment".
- **Visual**: Comment appears in the thread with your name and timestamp.

## 6. Export (5:00 - 6:00)
- **Action**: Click the "Export" dropdown in the top right.
- **Action**: Select "Download as DOCX".
- **Visual**: File downloads. Open it in Word to show the formatted document.
- **Action**: Select "Download as PPTX".
- **Visual**: File downloads. Open it in PowerPoint to show the slides (Title slide + content slides).

## 7. Conclusion (6:00+)
- **Say**: "That's how easy it is to go from idea to polished document with AI assistance."
