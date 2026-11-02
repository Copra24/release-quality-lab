import { expect, test } from '@playwright/test';

test.describe('Release taskboard on mobile Chrome', () => {
  test('supports a touch user journey for creating and completing a release task', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Release Taskboard' })).toBeVisible();
    await expect(page.getByTestId('new-task-input')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add task' })).toBeVisible();

    await page.getByTestId('new-task-input').fill('Confirm mobile release readiness');
    await page.getByRole('button', { name: 'Add task' }).tap();

    const task = page.locator('li[data-testid^="task-"]').filter({ hasText: 'Confirm mobile release readiness' });
    await expect(task).toBeVisible();
    await task.getByRole('checkbox', { name: 'Mark Confirm mobile release readiness complete' }).tap();
    await expect(task.locator('span')).toHaveClass('completed');
  });
});
