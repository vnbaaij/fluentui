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

  test('Should update bar corner radius when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    const firstBar = element.locator('.bar').first();

    await expect(firstBar).toHaveAttribute('rx', '0');
    await expect(firstBar).toHaveAttribute('ry', '0');

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(firstBar).toHaveAttribute('rx', '3');
    await expect(firstBar).toHaveAttribute('ry', '3');
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    const legendCount = await element.getByRole('option').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should render bars', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.bar')).toHaveCount(4);
  });

  test('Should render gradient fill on bars when enable-gradient is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify(data)}'
        width='500'
        height='300'
        enable-gradient
      ></fluent-vertical-bar-chart>
    `);

    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('linearGradient')).toHaveCount(4);
    await expect(element.locator('linearGradient').first()).toHaveAttribute('x1', '0%');
    await expect(element.locator('linearGradient').first()).toHaveAttribute('x2', '0%');
    await expect(element.locator('linearGradient').first()).toHaveAttribute('y1', '100%');
    await expect(element.locator('linearGradient').first()).toHaveAttribute('y2', '0%');
    await expect(element.locator('.bar').first()).toHaveAttribute('fill', /url\(#vbc-gradient-0\)/);
  });

  test('Should render a secondary y-axis when line data opts into secondary scale', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify([
          { x: 0, y: 10, lineData: { y: 7000, useSecondaryYScale: true } },
          { x: 10, y: 20, lineData: { y: 30000, useSecondaryYScale: true } },
          { x: 20, y: 15, lineData: { y: 12000, useSecondaryYScale: true } },
        ])}'
        width='500'
        height='300'
        secondary-y-axis-title='Line values'
      ></fluent-vertical-bar-chart>
    `);

    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.y-axis-secondary')).toHaveCount(1);
    await expect(element.locator('.y-axis-secondary .y-axis-title')).toContainText('Line values');
  });

  test('Should support roving keyboard focus with left and right arrow keys', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    const bars = element.locator('.bar');

    await expect(bars.first()).toHaveAttribute('tabindex', '0');
    await expect(bars.nth(1)).toHaveAttribute('tabindex', '-1');

    await bars.first().focus();
    await bars.first().press('ArrowRight');

    await expect(bars.first()).toHaveAttribute('tabindex', '-1');
    await expect(bars.nth(1)).toHaveAttribute('tabindex', '0');

    await bars.nth(1).press('ArrowLeft');
    await expect(bars.first()).toHaveAttribute('tabindex', '0');
    await expect(bars.nth(1)).toHaveAttribute('tabindex', '-1');
  });

  test('Should respect categorical x-axis inner and outer padding attributes', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify([
          { x: 'A', y: 40 },
          { x: 'B', y: 50 },
        ])}'
        width='500'
        height='300'
        x-axis-inner-padding='0.25'
        x-axis-outer-padding='0.5'
      ></fluent-vertical-bar-chart>
    `);

    const barXPositions = await page
      .locator('fluent-vertical-bar-chart .bar')
      .evaluateAll((bars: SVGRectElement[]) => bars.map(bar => Number(bar.getAttribute('x') ?? '0')));

    expect(barXPositions[0]).toBeLessThan(barXPositions[1]);
    expect(barXPositions[1] - barXPositions[0]).toBeGreaterThan(80);
  });

  test('Should render bar labels and use the default bar width for categorical axes', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.bar-label')).toHaveCount(4);
    await expect(element.locator('.bar-label').first()).toHaveText('40');
    await expect(element.locator('.bar').first()).toHaveAttribute('width', '16');
  });

  test('Should leave spacing before the first numeric bar when the first x value is 0', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify([
          { x: 0, y: 40 },
          { x: 10, y: 70 },
        ])}'
        width='500'
        height='300'
      ></fluent-vertical-bar-chart>
    `);

    const firstBarX = await page.locator('fluent-vertical-bar-chart .bar').first().getAttribute('x');
    expect(Number(firstBarX)).toBeGreaterThan(0);
    expect(Number(firstBarX)).toBeLessThan(30);
  });

  test('Should render bars below zero when support-negative-data is enabled', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify([
          { x: 0, y: -20 },
          { x: 10, y: 20 },
        ])}'
        width='500'
        height='300'
        support-negative-data
      ></fluent-vertical-bar-chart>
    `);

    const firstBarHeight = await page
      .locator('fluent-vertical-bar-chart .bar')
      .first()
      .evaluate((bar: SVGRectElement) => {
        return Number(bar.getAttribute('height') ?? '0');
      });

    expect(firstBarHeight).toBeGreaterThan(0);
  });

  test('Should not add positive y-axis padding for all-negative data', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify([
          { x: 0, y: -20 },
          { x: 10, y: -10 },
        ])}'
        width='500'
        height='300'
        support-negative-data
      ></fluent-vertical-bar-chart>
    `);

    const tickValues = await page.locator('fluent-vertical-bar-chart .y-axis .axis-text').allTextContents();

    expect(tickValues.some(value => Number(value) > 0)).toBe(false);
  });

  test('Should format date x-axis ticks for vertical bar charts', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify([
          { x: '2018-01-01T00:00:00Z', y: 10 },
          { x: '2018-02-01T00:00:00Z', y: 20 },
        ])}'
        width='500'
        height='300'
        tick-format='%b %Y'
        tick-values='${JSON.stringify(['2018-01-01T00:00:00Z', '2018-02-01T00:00:00Z'])}'
      ></fluent-vertical-bar-chart>
    `);

    const tickLabelsLocator = page.locator('fluent-vertical-bar-chart .x-axis .axis-text');
    await expect(tickLabelsLocator).toHaveCount(2);

    const tickLabels = await tickLabelsLocator.allTextContents();
    expect(tickLabels).toContain('Jan 2018');
    expect(tickLabels).toContain('Feb 2018');
  });

  test('Should render a line and legend for negative-value data with line points', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify([
          { x: 0, y: -20, lineData: { y: -10 } },
          { x: 10, y: 20 },
        ])}'
        width='500'
        height='300'
        line-legend-text='just line'
        support-negative-data
      ></fluent-vertical-bar-chart>
    `);

    await expect(page.locator('fluent-vertical-bar-chart .line-path')).toHaveCount(1);
    await expect(page.locator('fluent-vertical-bar-chart .legend-text')).toContainText(['just line']);
  });

  test('Should use locale formatting for bar labels', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify([{ x: 'Q1', y: 1000 }])}'
        width='500'
        height='300'
        culture='de-DE'
      ></fluent-vertical-bar-chart>
    `);

    await expect(page.locator('fluent-vertical-bar-chart .bar-label')).toHaveText('1000');
  });

  test('Should render x-axis', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.x-axis')).toHaveCount(1);
  });

  test('Should render y-axis', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.y-axis')).toHaveCount(1);
  });

  test('Should render horizontal grid lines for y-axis ticks', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.y-axis-grid-line')).toHaveCount(5);
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

  test('Should rotate string-axis x-axis labels by -45 degrees when rotate-x-axis-labels is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-bar-chart
        data='${JSON.stringify(data)}'
        width='500'
        height='300'
        rotate-x-axis-labels
      ></fluent-vertical-bar-chart>
    `);

    const firstTickLabel = page.locator('fluent-vertical-bar-chart .x-axis .axis-text').first();
    await expect(firstTickLabel).toHaveAttribute('transform', /rotate\(-45\)/);
  });

  test('Should render a polished tooltip card with spacing and rounded corners', async ({ page }) => {
    const element = page.locator('fluent-vertical-bar-chart');

    await element
      .locator('.bar')
      .first()
      .evaluate(bar => {
        bar.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveCSS('padding-top', '8px');
    await expect(tooltip).toHaveCSS('padding-left', '12px');
    await expect(tooltip).toHaveCSS('border-radius', '4px');
  });

  test('Should render a line border path when line-border-width is provided', async ({ page }) => {
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
        line-border-width='2'
        width='500'
        height='300'>
      </fluent-vertical-bar-chart>
    `);

    const element = page.locator('fluent-vertical-bar-chart');
    await expect(element.locator('.line-border')).toHaveCount(1);
    await expect(element.locator('.line-border')).toHaveAttribute('stroke-width', '7');
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
    const allHiddenInitially = await element
      .locator('.line-marker')
      .evaluateAll(markers =>
        markers.every(marker => marker.getAttribute('visibility') === 'hidden' && marker.getAttribute('r') === '0'),
      );
    expect(allHiddenInitially).toBeTruthy();

    await element
      .locator('.bar')
      .first()
      .evaluate(bar => {
        bar.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });
    await expect(element.locator('.line-marker').first()).toHaveAttribute('visibility', 'visible');
    await expect(element.locator('.line-marker').first()).toHaveAttribute('r', '8');
    await expect(element.locator('.tooltip')).toContainText('40');
    await expect(element.locator('.tooltip')).toContainText('20');
    await expect(element.locator('.tooltip .tooltip-info')).toHaveCount(2);
    await expect(element.locator('.legend-text')).toHaveCount(4);

    const legendLabels = await element.locator('.legend-text').allTextContents();
    expect(legendLabels[0]).toBe('just line');
    await expect(element.locator('.legend-rect').first()).toHaveClass(/line/);
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

    await expect(page.locator('fluent-vertical-bar-chart .bar')).toHaveCount(3);
    const xPositions = await page
      .locator('fluent-vertical-bar-chart .bar')
      .evaluateAll((bars: SVGRectElement[]) => bars.map(bar => Number(bar.getAttribute('x') ?? '0')));

    const gapOne = xPositions[1] - xPositions[0];
    const gapTwo = xPositions[2] - xPositions[1];
    expect(gapTwo).toBeGreaterThan(gapOne * 2);
  });
});
