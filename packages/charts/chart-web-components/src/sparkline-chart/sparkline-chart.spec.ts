import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { SparklineDataPoint } from './sparkline-chart.options.js';

const data: SparklineDataPoint[] = [
  { x: 0, y: 10 },
  { x: 1, y: 18 },
  { x: 2, y: 12 },
  { x: 3, y: 20 },
];

test.describe('SparklineChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-sparklinechart--basic'));
    await page.setContent(/* html */ `
      <fluent-sparkline-chart width="200" height="60" data='${JSON.stringify(data)}'></fluent-sparkline-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-sparkline-chart'));
  });

  test('Should render chart elements', async ({ page }) => {
    const element = page.locator('fluent-sparkline-chart');
    await expect(element.locator('.sparkline-line')).toHaveCount(1);
  });

  test('Should render area variant', async ({ page }) => {
    const element = page.locator('fluent-sparkline-chart');
    await element.evaluate(el => el.setAttribute('variant', 'area'));
    await expect(element.locator('.sparkline-area')).toHaveCount(1);
  });

  test('Should re-render when data attribute changes', async ({ page }) => {
    const element = page.locator('fluent-sparkline-chart');
    const before = await element.locator('.sparkline-line').getAttribute('d');
    const nextData: SparklineDataPoint[] = [
      { x: 0, y: 5 },
      { x: 1, y: 8 },
      { x: 2, y: 16 },
      { x: 3, y: 4 },
    ];

    await element.evaluate((el, value) => el.setAttribute('data', JSON.stringify(value)), nextData);
    // Wait for d attribute to change, retrying until the re-render completes
    await expect(async () => {
      expect(await element.locator('.sparkline-line').getAttribute('d')).not.toBe(before);
    }).toPass({ timeout: 5000 });
    const after = await element.locator('.sparkline-line').getAttribute('d');
    expect(after).not.toBe(before);
  });
});
