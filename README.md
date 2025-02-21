# Lisana

## Description

Lisana is a simple task manager that allows you to create, edit, and delete
tasks.

Submission by: Daniel Denis

## Accessing the app

The app is hosted on Vercel and can be accessed
[here](https://lisana.vercel.app/). The code is hosted on GitHub and can be
accessed [here](https://github.com/katungi/lisana).

## Tools used

- React and Next.js
- TypeScript
- ShadCn (for the headless components)
- TailwindCSS
- Zustand (for state management)
- React-Beautiful-DnD (for drag and drop)
- Zod - for validation
- React-hook-form - for form handling

## Features

- Basic Crud operations for tasks (Create, Read, Update, Delete)
- Users can switch between Table view and Kanban board. When in Kanban board
  view, users can drag and drop tasks between columns of priorities ('urgent', 'high', 'medium', 'low', 'none')
- Users can filter tasks by priority, and search for tasks by title on both modes
- Users can perform bulk operations like delete in Table View mode
- Users can edit tasks in a modal, and can also edit titles in line in both kanban and table mode. 
- Users can assign users to tasks when creating/editing them, and in both can filter tasks by user/assignee

## Assumptions

- I assumed that the application would be used at a team level, hence the ability to assign tasks to users. I also assumed that the application would be used by a small team, hence the lack of authentication.

## Bonus features

- I added the Kanban board view as a bonus feature. I thought it would be a nice way to visualize tasks and their priorities.
