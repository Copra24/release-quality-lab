import { expect, test } from '@playwright/test';

test.describe('Task API contract', () => {
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
});
