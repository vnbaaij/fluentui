
import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { VerticalBarChartDataPoint } from './vertical-bar-chart.options.js';

const data: VerticalBarChartDataPoint[] = [
  { x: 'Q1', y: 40 },
  { x: 'Q2', y: 70 },
  { x: 'Q3', y: 55 },
  { x: 'Q4', y: 90 },
];

test.describe('VerticalBarChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-verticalbarchart--basic'));
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart data='${JSON.stringify(data)}' width='500' height='300'></fluent-vertical-bar-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-vertical-bar-chart'));
  });

  test('Should render bars', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.bar')).toHaveCount(4);
  });

  test('Should render x-axis', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.x-axis')).toHaveCount(1);
  });

  test('Should render y-axis', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.y-axis')).toHaveCount(1);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: VerticalBarChartDataPoint[] }).data = [{ x: 'Q1', y: 10 }];
    });
    await expect(element.locator('.bar')).toHaveCount(1);
  });
});
