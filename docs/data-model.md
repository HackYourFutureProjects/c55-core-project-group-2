# Task Data Model

## Task fields
- id: integer
- name: string, required
- description: string, optional
- category: string, required
- importance: string, required
- status: string, required
- date_finished: string | null
- deadline: string | null
- created_at: string
- updated_at: string

## Rules
- name is required
- description is optional
- category is required
- importance must be one of: low, medium, high
- status must be one of: unfinished, finished
- date_finished should be null unless the task is finished
- deadline should be stored as a datetime string