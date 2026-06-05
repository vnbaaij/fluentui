
import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { VerticalStackedBarChartProps } from './vertical-stacked-bar-chart.options.js';

const data: VerticalStackedBarChartProps[] = [
  { xAxisPoint: 'Q1', chartData: [{ legend: 'A', data: 30, color: '#637cef' }, { legend: 'B', data: 20 }] },
  { xAxisPoint: 'Q2', chartData: [{ legend: 'A', data: 40 }, { legend: 'B', data: 35 }] },
];

test.describe('VerticalStackedBarChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-verticalstackedbarchart--basic'));
    await page.setContent(/* html */ `
      <fluent-vertical-stacked-bar-chart data='${JSON.stringify(data)}' width='600' height='350'></fluent-vertical-stacked-bar-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-vertical-stacked-bar-chart'));
  });

  test('Should render bars', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await expect(element.locator('.bar')).toHaveCount(4);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: VerticalStackedBarChartProps[] }).data = [
        { xAxisPoint: 'Q3', chartData: [{ legend: 'A', data: 12 }] },
      ];
    });
    await expect(element.locator('.bar')).toHaveCount(1);
  });
});
