import { expect, test } from '@playwright/test';

test.describe('Release taskboard', () => {
  test('adds and completes a task through the user interface', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Release Taskboard' })).toBeVisible();

    await page.getByTestId('new-task-input').fill('Run mobile smoke suite');
    await page.getByRole('button', { name: 'Add task' }).click();

    const task = page.getByTestId(/task-/).filter({ hasText: 'Run mobile smoke suite' });
    await expect(task).toBeVisible();
    await task.getByRole('checkbox', { name: 'Mark Run mobile smoke suite complete' }).check();
    await expect(task.locator('span')).toHaveClass('completed');
  });

  test('keeps the user informed when an invalid task is submitted', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="task-form"]').evaluate((form) => form.noValidate = true);
    await page.getByRole('button', { name: 'Add task' }).click();
    await expect(page.getByTestId('error-message')).toHaveText('A task title is required.');
  });
});
