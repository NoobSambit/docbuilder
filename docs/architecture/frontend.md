# 🖥️ Frontend Architecture

The frontend is a modern Next.js application designed for a responsive and interactive user experience.

## Core Technologies

- **Next.js 13**: Using the Pages Router (migration to App Router planned).
- **React 18**: Functional components and Hooks.
- **TailwindCSS**: For rapid, utility-first styling.
- **Firebase SDK**: For client-side authentication.

## Key Components

### 1. Project Dashboard (`pages/dashboard.tsx`)
- Lists user projects.
- Allows creating new projects (DOCX/PPTX).
- Displays project status and metadata.

### 2. Project Workspace (`pages/projects/[id].tsx`)
The main working area.
- **Sidebar**: Displays the document outline (drag-and-drop reordering).
- **Main Content Area**: Shows the current section's content.
- **Rich Text Editor**: TipTap-based editor for manual edits.
- **AI Controls**: Buttons for "Generate", "Refine", and "Regenerate".

### 3. Components (`src/components/`)
- **`SectionList.tsx`**: Draggable list of document sections using `dnd-kit`.
- **`SectionUnit.tsx`**: The core component for a single section. Handles:
    - Displaying content (HTML).
    - Editing mode.
    - Refinement input.
    - History view.
- **`RichTextEditor.tsx`**: Wrapper around TipTap editor.
- **`ExportDialog.tsx`**: UI for selecting export format and theme.

## State Management

- **Local State**: `useState` for component-level UI state (e.g., dialog open/close).
- **Server State**: Data is fetched from the FastAPI backend using `fetch` or `axios`.
- **Auth State**: Managed by `AuthContext` (Firebase `onAuthStateChanged`).

## Design System

- **Colors**: Custom palette defined in `tailwind.config.js`.
- **Typography**: Inter font family.
- **Icons**: Heroicons.
- **UI Elements**: Custom buttons, inputs, and dialogs built with Tailwind.
