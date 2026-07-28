import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { GroupedVerticalBarChartData } from './grouped-vertical-bar-chart.options.js';

const data: GroupedVerticalBarChartData[] = [
  {
    xAxisPoint: 'Jan',
    series: [
      { key: 'Alpha', data: 30 },
      { key: 'Beta', data: 45 },
    ],
  },
  {
    xAxisPoint: 'Feb',
    series: [
      { key: 'Alpha', data: 20 },
      { key: 'Beta', data: 60 },
    ],
  },
];

test.describe('GroupedVerticalBarChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-groupedverticalbarchart--basic'));
    await page.setContent(/* html */ `
      <fluent-grouped-vertical-bar-chart data='${JSON.stringify(
        data,
      )}' width='600' height='300'></fluent-grouped-vertical-bar-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-grouped-vertical-bar-chart'));
  });

  test('Should render bars', async ({ page }) => {
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    await expect(element.locator('.bar')).toHaveCount(4);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    const legendCount = await element.locator('.legend-text').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: GroupedVerticalBarChartData[] }).data = [
        { xAxisPoint: 'Mar', series: [{ key: 'Alpha', data: 18 }] },
      ];
    });
    await expect(element.locator('.bar')).toHaveCount(1);
  });

  test('Should render primary y-axis on right in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-grouped-vertical-bar-chart data='${JSON.stringify(
          data,
        )}' width='600' height='300'></fluent-grouped-vertical-bar-chart>
      </div>
    `);
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    await expect(element.locator('.y-axis .axis-tick-line').first()).toHaveAttribute('x2', '6');
  });
});
