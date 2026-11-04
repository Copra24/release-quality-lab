import { expect, test } from '@playwright/test';

test.describe('Task API contract', () => {
  test('returns a contract-shaped task list', async ({ request }) => {
    const response = await request.get('/api/tasks');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ tasks: expect.any(Array) });
    for (const task of body.tasks) {
      expect(task).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        completed: expect.any(Boolean)
      });
    }
  });

  test('creates, updates, and removes a release task', async ({ request }) => {
    const create = await request.post('/api/tasks', {
      data: { title: 'Validate API release evidence' }
    });
    expect(create.status()).toBe(201);
    const created = await create.json();
    expect(created.task).toMatchObject({ title: 'Validate API release evidence', completed: false });
    expect(created.task.id).toEqual(expect.any(Number));

    const update = await request.patch(`/api/tasks/${created.task.id}`, {
      data: { completed: true }
    });
    expect(update.status()).toBe(200);
    expect(await update.json()).toEqual({ task: { id: created.task.id, title: 'Validate API release evidence', completed: true } });

    const remove = await request.delete(`/api/tasks/${created.task.id}`);
    expect(remove.status()).toBe(204);
  });

  test('rejects an invalid task payload with a useful error', async ({ request }) => {
    const response = await request.post('/api/tasks', { data: { title: '' } });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: 'title is required' });
  });

  test('rejects an invalid completion-state type without changing a task', async ({ request }) => {
    const create = await request.post('/api/tasks', {
      data: { title: 'Protect task state from invalid updates' }
    });
    const created = await create.json();

    const response = await request.patch(`/api/tasks/${created.task.id}`, {
      data: { completed: 'true' }
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: 'completed must be boolean' });

    const validUpdate = await request.patch(`/api/tasks/${created.task.id}`, {
      data: { completed: true }
    });
    expect(validUpdate.status()).toBe(200);
    expect((await validUpdate.json()).task.completed).toBe(true);
  });

  test('returns a stable error contract for unknown task identifiers', async ({ request }) => {
    const missingId = 999_999;

    const update = await request.patch(`/api/tasks/${missingId}`, { data: { completed: true } });
    expect(update.status()).toBe(404);
    expect(await update.json()).toEqual({ error: 'task not found' });

    const remove = await request.delete(`/api/tasks/${missingId}`);
    expect(remove.status()).toBe(404);
    expect(await remove.json()).toEqual({ error: 'task not found' });
  });
});
