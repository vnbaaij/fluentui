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

  test('Should render primary y-axis on right in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-vertical-bar-chart data='${JSON.stringify(data)}' width='500' height='300'></fluent-vertical-bar-chart>
      </div>
    `);
    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.y-axis .axis-tick-line').first()).toHaveAttribute('x2', '6');
  });

  test('Should support x-axis category order', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify(data)}'
        width='500'
        height='300'
        x-axis-category-order='category descending'
      ></fluent-vertical-bar-chart>
    `);
    const tickLabelsLocator = page.locator('fluent-vertical-bar-chart .x-axis .axis-text');
    await expect(tickLabelsLocator).toHaveCount(4);
    const tickLabels = await tickLabelsLocator.allTextContents();
    expect(tickLabels).toEqual(['Q4', 'Q3', 'Q2', 'Q1']);
  });

  test('Should render line path and markers when lineData is provided', async ({ page }) => {
    const dataWithLine = [
      { x: 0, y: 40, legend: 'A', lineData: { y: 20 } },
      { x: 10000, y: 70, legend: 'B', lineData: { y: 55 } },
      { x: 25000, y: 55, legend: 'C', lineData: { y: 35 } },
    ];

    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify(dataWithLine)}'
        line-legend-text='just line'
        line-legend-color='brown'
        width='500'
        height='300'>
      </fluent-vertical-bar-chart>
    `);

    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.line-path')).toHaveCount(1);
    await expect(element.locator('.line-marker')).toHaveCount(3);
    await expect(element.locator('.legend-text')).toHaveCount(4);
  });

  test('Should position numeric x values by scale instead of equal category spacing', async ({ page }) => {
    const numericData = [
      { x: 0, y: 20, legend: 'A' },
      { x: 10, y: 25, legend: 'B' },
      { x: 100, y: 35, legend: 'C' },
    ];

    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart data='${JSON.stringify(
        numericData,
      )}' width='500' height='300'></fluent-vertical-bar-chart>
    `);

    const xPositions = await page
      .locator('fluent-vertical-bar-chart .bar')
      .evaluateAll((bars: SVGRectElement[]) => bars.map(bar => Number(bar.getAttribute('x') ?? '0')));

    const gapOne = xPositions[1] - xPositions[0];
    const gapTwo = xPositions[2] - xPositions[1];
    expect(gapTwo).toBeGreaterThan(gapOne * 2);
  });
});
