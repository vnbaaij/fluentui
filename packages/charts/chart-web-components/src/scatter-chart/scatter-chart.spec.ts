import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { ScatterChartSeries } from './scatter-chart.options.js';

const data: ScatterChartSeries[] = [
  {
    legend: 'Group A',
    data: [
      { x: 1, y: 4 },
      { x: 3, y: 7 },
      { x: 5, y: 2 },
    ],
  },
  {
    legend: 'Group B',
    data: [
      { x: 2, y: 9 },
      { x: 4, y: 3 },
      { x: 6, y: 8 },
    ],
  },
];

test.describe('ScatterChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-scatterchart--basic'));
    await page.setContent(/* html */ `
      <fluent-scatter-chart data='${JSON.stringify(data)}' width='500' height='300'></fluent-scatter-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-scatter-chart'));
  });

  test('Should render scatter points', async ({ page }) => {
    const element = page.locator('fluent-scatter-chart');
    await expect(element.locator('.scatter-point')).toHaveCount(6);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-scatter-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-scatter-chart');
    const legendCount = await element.locator('.legend-text').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-scatter-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: ScatterChartSeries[] }).data = [
        {
          legend: 'Only Group',
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
          ],
        },
      ];
    });
    await expect(element.locator('.scatter-point')).toHaveCount(2);
  });

  test('Should render primary y-axis on right in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-scatter-chart data='${JSON.stringify(data)}' width='500' height='300'></fluent-scatter-chart>
      </div>
    `);
    const element = page.locator('fluent-scatter-chart');
    await expect(element.locator('.y-axis .axis-tick-line').first()).toHaveAttribute('x2', '6');
  });
});
