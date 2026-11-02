import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Release taskboard accessibility', () => {
  test('has no automated WCAG A or AA violations on the release taskboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Release Taskboard' })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('supports keyboard-first task entry with an accessible input name', async ({ page }, testInfo) => {
    const taskTitle = `Confirm accessible release evidence ${testInfo.project.name}-${testInfo.parallelIndex}`;
    await page.goto('/');

    const input = page.getByRole('textbox', { name: 'New task' });
    await input.focus();
    await expect(input).toBeFocused();
    await input.fill(taskTitle);
    await page.getByRole('button', { name: 'Add task' }).press('Enter');

    await expect(page.getByText(taskTitle, { exact: true })).toBeVisible();
  });
});
