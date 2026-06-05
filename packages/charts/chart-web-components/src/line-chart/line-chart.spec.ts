
import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { LineChartSeries } from './line-chart.options.js';

const data: LineChartSeries[] = [
  { legend: 'Series A', data: [{ x: 0, y: 10 }, { x: 1, y: 20 }, { x: 2, y: 15 }] },
  { legend: 'Series B', data: [{ x: 0, y: 5 }, { x: 1, y: 12 }, { x: 2, y: 18 }] },
];

test.describe('LineChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-linechart--basic'));
    await page.setContent(/* html */ `
      <fluent-line-chart data='${JSON.stringify(data)}' width='600' height='300'></fluent-line-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-line-chart'));
  });

  test('Should render line paths', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await expect(element.locator('.line-path')).toHaveCount(2);
  });

  test('Should render markers when show-markers set', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => node.setAttribute('show-markers', ''));
    await expect(element.locator('.line-marker')).toHaveCount(6);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: LineChartSeries[] }).data = [
        { legend: 'Only Series', data: [{ x: 0, y: 10 }, { x: 1, y: 12 }] },
      ];
    });
    await expect(element.locator('.line-path')).toHaveCount(1);
  });
});
