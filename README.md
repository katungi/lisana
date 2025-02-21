# Lisana

## Overview

**Lisana** is a simple yet powerful task manager designed to streamline task
management through an intuitive interface. Users can effortlessly create, edit,
and delete tasks while switching between a traditional table view and a dynamic
Kanban board.

**Submission by:** Daniel Denis

## Live Demo & Code

- **Live App:** [Lisana on Vercel](https://lisana-chi.vercel.app/)
- **Source Code:** [GitHub Repository](https://github.com/katungi/lisana)

## Tech Stack

Lisana is built with a modern tech stack to ensure responsiveness,
maintainability, and a seamless user experience:

- **React & Next.js:** Core application framework
- **TypeScript:** Type safety and improved developer experience
- **ShadCn:** Headless UI components
- **Tailwind CSS:** Utility-first styling
- **Zustand:** Lightweight state management
- **React Beautiful DnD:** Drag-and-drop functionality
- **Zod:** Data validation
- **React Hook Form:** Efficient form handling

## Key Features

- **CRUD Operations:** Create, read, update, and delete tasks effortlessly.
- **Dual View Modes:**
  - **Table View:** Clean, structured overview with bulk operation capabilities.
  - **Kanban Board:** Visual task management with drag-and-drop support across
    priority columns.
- **Task Prioritization:** Categorize tasks by priority levels: `urgent`,
  `high`, `medium`, `low`, and `none`.
- **Filtering & Search:**
  - Filter tasks by priority and assignee.
  - Search tasks by title in both table and Kanban views.
- **Task Editing:**
  - Inline editing for task titles.
  - Modal-based detailed editing.
- **User Assignment:** Assign tasks to team members for better collaboration.
- **Bulk Operations:** Perform actions like bulk delete directly from the Table
  View.

## Design Assumptions

- The app targets **small teams** needing quick and collaborative task
  management.
- No authentication was included, assuming usage within trusted team
  environments.

## Bonus Features

- **Kanban Board:** Added to enhance task visualization and improve workflow
  management.
- **Inline Editing:** Quick edits without navigating away from the main views.

## Conclusion

Lisana focuses on simplicity and efficiency, making task management intuitive
for teams. With versatile views, robust features, and thoughtful design, it
delivers an optimal balance between functionality and user experience.
