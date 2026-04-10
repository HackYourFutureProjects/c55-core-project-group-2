export class Task {
  constructor({
    id = null,
    name,
    description = null,
    category,
    importance,
    status = 'unfinished',
    date_finished = null,
    deadline = null,
    created_at = null,
    updated_at = null,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.importance = importance;
    this.status = status;
    this.date_finished = date_finished;
    this.deadline = deadline;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  validate() {
    const allowedImportance = ['low', 'medium', 'high'];
    const allowedStatus = ['unfinished', 'finished'];

    if (!this.name || this.name.trim() === '') {
      throw new Error('Task name is required.');
    }

    if (!this.category || this.category.trim() === '') {
      throw new Error('Task category is required.');
    }

    if (!allowedImportance.includes(this.importance)) {
      throw new Error('Invalid importance value.');
    }

    if (!allowedStatus.includes(this.status)) {
      throw new Error('Invalid status value.');
    }
  }
}
