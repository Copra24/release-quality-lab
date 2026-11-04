import { expect, test } from '@playwright/test';

test.describe('Release taskboard on mobile Chrome', () => {
  test('supports a touch user journey for creating and completing a release task', async ({ page }, testInfo) => {
    const taskTitle = `Confirm mobile release readiness ${testInfo.project.name}-${testInfo.parallelIndex}-${testInfo.retry}`;
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Release Taskboard' })).toBeVisible();
    await expect(page.getByTestId('new-task-input')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add task' })).toBeVisible();

    await page.getByTestId('new-task-input').fill(taskTitle);
    await page.getByRole('button', { name: 'Add task' }).tap();

    const task = page.locator('li[data-testid^="task-"]').filter({ hasText: taskTitle });
    await expect(task).toBeVisible();
    await task.getByRole('checkbox', { name: `Mark ${taskTitle} complete` }).tap();
    await expect(task.locator('span')).toHaveClass('completed');
  });
});
