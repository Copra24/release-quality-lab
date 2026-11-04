import { expect, test } from '@playwright/test';

const invalidTitles = [
  { name: 'missing title', body: {}, error: 'title is required' },
  { name: 'empty title', body: { title: '' }, error: 'title is required' },
  { name: 'whitespace-only title', body: { title: '   ' }, error: 'title is required' },
  { name: 'numeric title', body: { title: 42 }, error: 'title is required' },
  { name: 'title over the documented maximum', body: { title: 'x'.repeat(121) }, error: 'title must be 120 characters or fewer' }
];

const invalidCompletionStates = [
  { name: 'string', value: 'true' },
  { name: 'number', value: 1 },
  { name: 'null', value: null },
  { name: 'object', value: { complete: true } }
];

test.describe('Task API data-driven validation', () => {
  for (const invalidTitle of invalidTitles) {
    test(`rejects a ${invalidTitle.name}`, async ({ request }) => {
      const response = await request.post('/api/tasks', { data: invalidTitle.body });

      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({ error: invalidTitle.error });
    });
  }

  test('accepts boundary-safe text and normalizes surrounding whitespace', async ({ request }) => {
    const title = `  ${'r'.repeat(120)}  `;
    const response = await request.post('/api/tasks', { data: { title } });

    expect(response.status()).toBe(201);
    expect((await response.json()).task).toMatchObject({ title: 'r'.repeat(120), completed: false });
  });

  for (const invalidState of invalidCompletionStates) {
    test(`rejects a ${invalidState.name} completion state`, async ({ request }) => {
      const create = await request.post('/api/tasks', {
        data: { title: `Validate invalid state ${invalidState.name}` }
      });
      const { task } = await create.json();

      const response = await request.patch(`/api/tasks/${task.id}`, {
        data: { completed: invalidState.value }
      });

      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({ error: 'completed must be boolean' });
    });
  }
});
