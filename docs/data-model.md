# Data Model

## Task

Fields:
- id: integer
- name: string, required
- description: string, optional
- category_id: integer, required
- importance: string, required, one of: low, medium, high
- status: string, required, one of: unfinished, finished
- date_finished: string | null
- deadline: string | null
- created_at: string
- updated_at: string

Rules:
- task name is required
- task name is not unique
- one category can have many tasks
- date_finished is null unless status is finished
- deadline should use ISO datetime string format

## Category

Fields:
- id: integer
- name: string, required, unique

Rules:
- category name must be unique
- one category can be linked to many tasks