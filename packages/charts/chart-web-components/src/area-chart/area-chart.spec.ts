import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { AreaChartSeries } from './area-chart.options.js';

const data: AreaChartSeries[] = [
  {
    legend: 'Series A',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
      { x: 2, y: 15 },
    ],
  },
  {
    legend: 'Series B',
    data: [
      { x: 0, y: 5 },
      { x: 1, y: 12 },
      { x: 2, y: 18 },
    ],
  },
];
const dataWithSecondaryYAxis: AreaChartSeries[] = [
  {
    legend: 'Series A',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
      { x: 2, y: 15 },
    ],
  },
  {
    legend: 'Series B',
    useSecondaryYScale: true,
    data: [
      { x: 0, y: 5 },
      { x: 1, y: 12 },
      { x: 2, y: 18 },
    ],
  },
];

test.describe('AreaChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-areachart--basic'));
    await page.setContent(/* html */ `
      <fluent-area-chart data='${JSON.stringify(data)}' width='600' height='300'></fluent-area-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-area-chart'));
  });

  test('Should render area paths', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    await expect(element.locator('.area-path')).toHaveCount(2);
  });

  test('Should render area lines', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    await expect(element.locator('.area-line')).toHaveCount(2);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: AreaChartSeries[] }).data = [
        {
          legend: 'Only Series',
          data: [
            { x: 0, y: 8 },
            { x: 1, y: 16 },
          ],
        },
      ];
    });
    await expect(element.locator('.area-path')).toHaveCount(1);
  });

  test('Should switch to non-stacked mode when mode="tozeroy"', async ({ page }) => {
    const element = page.locator('fluent-area-chart');

    // In stacked (tonexty) mode the second area's y1 is the sum of both series.
    // In tozeroy mode each area is independent from y=0, so the paths will differ.
    const stackedPaths = await element
      .locator('.area-path')
      .evaluateAll((paths: SVGPathElement[]) => paths.map(p => p.getAttribute('d')));

    await element.evaluate(node => node.setAttribute('mode', 'tozeroy'));

    const zeroPaths = await element
      .locator('.area-path')
      .evaluateAll((paths: SVGPathElement[]) => paths.map(p => p.getAttribute('d')));

    // At least one path must differ between the two modes.
    const hasChanged = stackedPaths.some((p, i) => p !== zeroPaths[i]);
    expect(hasChanged).toBe(true);
  });

  test('Should render primary y-axis on right in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-area-chart data='${JSON.stringify(data)}' width='600' height='300'></fluent-area-chart>
      </div>
    `);
    const element = page.locator('fluent-area-chart');
    await expect(element.locator('.y-axis .axis-tick-line').first()).toHaveAttribute('x2', '6');
  });

  test('Should render secondary y-axis on left in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-area-chart data='${JSON.stringify(
          dataWithSecondaryYAxis,
        )}' width='600' height='300'></fluent-area-chart>
      </div>
    `);
    const element = page.locator('fluent-area-chart');
    await expect(element.locator('.y-axis-secondary .axis-tick-line').first()).toHaveAttribute('x2', '-6');
  });
});
