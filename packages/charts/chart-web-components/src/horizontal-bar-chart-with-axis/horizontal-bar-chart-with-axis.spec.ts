import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { HorizontalBarChartWithAxisDataPoint } from './horizontal-bar-chart-with-axis.options.js';

const categoricalData: HorizontalBarChartWithAxisDataPoint[] = [
  {
    y: 'String One',
    x: 1000,
    legend: 'Oranges',
    color: '#637cef',
    xAxisCalloutData: '1K',
    yAxisCalloutData: 'String One',
  },
  {
    y: 'String Two',
    x: 5000,
    legend: 'Grapes',
    color: '#e3008c',
    xAxisCalloutData: '5K',
    yAxisCalloutData: 'String Two',
  },
  {
    y: 'String Three',
    x: 3000,
    legend: 'Apples',
    color: '#2aa0a4',
    xAxisCalloutData: '3K',
    yAxisCalloutData: 'String Three',
  },
  {
    y: 'String Four',
    x: 2000,
    legend: 'Bananas',
    color: '#9373c0',
    xAxisCalloutData: '2K',
    yAxisCalloutData: 'String Four',
  },
];

const numericYAxisData: HorizontalBarChartWithAxisDataPoint[] = [
  {
    x: 10000,
    y: 5000,
    legend: 'Oranges',
    color: '#637cef',
  },
  {
    x: 20000,
    y: 50000,
    legend: 'Grapes',
    color: '#e3008c',
  },
  {
    x: 25000,
    y: 30000,
    legend: 'Apples',
    color: '#2aa0a4',
  },
  {
    x: 40000,
    y: 13000,
    legend: 'Bananas',
    color: '#9373c0',
  },
];

const stackedData: HorizontalBarChartWithAxisDataPoint[] = [
  { x: 10000, y: 'Q1', legend: 'Product A', color: '#637cef', xAxisCalloutData: '10K', yAxisCalloutData: 'Q1' },
  { x: -5000, y: 'Q1', legend: 'Product B', color: '#e3008c', xAxisCalloutData: '-5K', yAxisCalloutData: 'Q1' },
  { x: 8000, y: 'Q1', legend: 'Product C', color: '#2aa0a4', xAxisCalloutData: '8K', yAxisCalloutData: 'Q1' },
  { x: -7000, y: 'Q2', legend: 'Product A', color: '#637cef', xAxisCalloutData: '-7K', yAxisCalloutData: 'Q2' },
  { x: 12000, y: 'Q2', legend: 'Product B', color: '#e3008c', xAxisCalloutData: '12K', yAxisCalloutData: 'Q2' },
  { x: 3000, y: 'Q2', legend: 'Product C', color: '#2aa0a4', xAxisCalloutData: '3K', yAxisCalloutData: 'Q2' },
];

test.describe('horizontal-bar-chart-with-axis', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
  });

  test('renders a categorical chart with axis labels and legends', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis chart-title="Revenue by category" data='${JSON.stringify(
          categoricalData,
        )}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(page.getByText('Revenue by category')).toBeVisible();
    await expect(element.locator('.bar')).toHaveCount(4);
    await expect(element.locator('.legend')).toHaveCount(4);
    await expect(element.locator('.y-axis-text').filter({ hasText: 'String One' })).toHaveCount(1);
  });

  test('renders a numeric y-axis chart', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis chart-title="Revenue by value" data='${JSON.stringify(
          numericYAxisData,
        )}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.bar')).toHaveCount(4);
    await expect(element.locator('.y-axis-text')).toHaveCount(6);
  });

  test('rerenders when data attribute changes after initial render', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis chart-title="Revenue by category" data='${JSON.stringify(
          categoricalData,
        )}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.bar')).toHaveCount(4);

    const newData: HorizontalBarChartWithAxisDataPoint[] = [
      {
        x: 1200,
        y: 'Alpha',
        legend: 'Series A',
        color: '#637cef',
        xAxisCalloutData: '1.2K',
        yAxisCalloutData: 'Alpha',
      },
      { x: 2400, y: 'Beta', legend: 'Series B', color: '#e3008c', xAxisCalloutData: '2.4K', yAxisCalloutData: 'Beta' },
      {
        x: 3600,
        y: 'Gamma',
        legend: 'Series C',
        color: '#2aa0a4',
        xAxisCalloutData: '3.6K',
        yAxisCalloutData: 'Gamma',
      },
    ];

    await element.evaluate((el, d) => {
      el.setAttribute('chart-title', 'Updated revenue by category');
      el.setAttribute('data', JSON.stringify(d));
    }, newData);

    await expect(page.getByText('Updated revenue by category')).toBeVisible();
    await expect(element.locator('.bar')).toHaveCount(3);
    await expect(element.locator('.legend')).toHaveCount(3);
    await expect(page.getByText('Series A')).toBeVisible();
    await expect(page.getByText('Series B')).toBeVisible();
    await expect(page.getByText('Series C')).toBeVisible();
  });

  test('dims non-selected bars when hovering a legend', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis chart-title="Revenue by category" data='${JSON.stringify(
          categoricalData,
        )}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const legends = element.locator('.legend');
    await legends.nth(0).dispatchEvent('mouseover');

    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('opacity', '1');
    await expect(bars.nth(1)).toHaveAttribute('opacity', '0.1');
    await expect(bars.nth(2)).toHaveAttribute('opacity', '0.1');
    await expect(bars.nth(3)).toHaveAttribute('opacity', '0.1');
  });

  test('shows all legends as active before hover and restores them after hover ends', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis chart-title="Revenue by category" data='${JSON.stringify(
          categoricalData,
        )}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const legends = element.locator('.legend');

    await expect(legends).toHaveCount(4);
    await expect(legends.nth(0)).toHaveAttribute('aria-selected', 'false');
    await expect(legends.nth(1)).toHaveAttribute('aria-selected', 'false');
    await expect(legends.nth(2)).toHaveAttribute('aria-selected', 'false');
    await expect(legends.nth(3)).toHaveAttribute('aria-selected', 'false');

    await legends.nth(0).dispatchEvent('mouseover');
    await expect(legends.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(legends.nth(1)).toHaveAttribute('aria-selected', 'false');
    await expect(legends.nth(2)).toHaveAttribute('aria-selected', 'false');
    await expect(legends.nth(3)).toHaveAttribute('aria-selected', 'false');

    await legends.nth(0).dispatchEvent('mouseout');
    await expect(legends.nth(0)).toHaveAttribute('aria-selected', 'false');
    await expect(legends.nth(1)).toHaveAttribute('aria-selected', 'false');
    await expect(legends.nth(2)).toHaveAttribute('aria-selected', 'false');
    await expect(legends.nth(3)).toHaveAttribute('aria-selected', 'false');
  });

  test('supports multiple legend selection when enabled', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          allow-multiple-legend-selection
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const legends = element.locator('.legend');
    await legends.nth(0).click();
    await legends.nth(1).click();

    await expect(element.getByLabel('String Four. Bananas, 2K.')).toHaveAttribute('opacity', '1');
    await expect(element.getByLabel('String Three. Apples, 3K.')).toHaveAttribute('opacity', '1');
    await expect(element.getByLabel('String Two. Grapes, 5K.')).toHaveAttribute('opacity', '0.1');
    await expect(element.getByLabel('String One. Oranges, 1K.')).toHaveAttribute('opacity', '0.1');
  });

  test('re-enables all bars when multi-select mode is turned off', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          allow-multiple-legend-selection
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const legends = element.locator('.legend');
    await legends.nth(0).click();
    await legends.nth(1).click();

    await element.evaluate(el => el.removeAttribute('allow-multiple-legend-selection'));

    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('opacity', '1');
    await expect(bars.nth(1)).toHaveAttribute('opacity', '1');
    await expect(bars.nth(2)).toHaveAttribute('opacity', '1');
    await expect(bars.nth(3)).toHaveAttribute('opacity', '1');
  });

  test('uses a single color when single-color mode is enabled', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by value"
          use-single-color
          data='${JSON.stringify(numericYAxisData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const bars = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.bar');
    await expect(bars).toHaveCount(4);
    await expect(bars.nth(0)).toHaveAttribute('fill', '#637cef');
    await expect(bars.nth(1)).toHaveAttribute('fill', '#637cef');
    await expect(bars.nth(2)).toHaveAttribute('fill', '#637cef');
    await expect(bars.nth(3)).toHaveAttribute('fill', '#637cef');
  });

  test('applies width and height attributes to the rendered chart', async ({ page }) => {
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by value"
          width="720"
          height="360"
          data='${JSON.stringify(numericYAxisData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const svg = element.locator('svg');
    await expect(svg).toHaveAttribute('width', '720');
    await expect(svg).toHaveAttribute('height', '360');
    await expect(element).toHaveCSS('width', '720px');
    await expect(element).toHaveCSS('height', '360px');
  });

  test('shows tooltip data for a hovered bar', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis chart-title="Revenue by category" data='${JSON.stringify(
          categoricalData,
        )}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await element.locator('.bar').nth(0).hover();
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.locator('.tooltip-header')).toHaveText('String Four');
    await expect(tooltip.locator('.tooltip-legend-text')).toHaveText('Bananas');
    await expect(tooltip.locator('.tooltip-primary-value')).toHaveText('2K');
  });

  test('hides legends when hide-legends is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          hide-legends
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.legend')).toHaveCount(0);
  });

  test('renders stacked categories and rounded corners', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Quarterly comparison"
          round-corners
          data='${JSON.stringify(stackedData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.bar')).toHaveCount(6);
    await expect(element.locator('.legend')).toHaveCount(3);
    await expect(element.locator('.bar').first()).toHaveAttribute('rx', '3');
  });

  test('renders rtl bars and y-axis labels on the correct side', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl" style="width: 650px; height: 350px">
        <fluent-horizontal-bar-chart-with-axis
          style="width: 650px; height: 350px"
          chart-title="Horizontal bar chart basic example"
          data='${JSON.stringify(numericYAxisData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const firstBar = element.locator('.bar').first();
    const firstLabel = element.locator('.bar-label').first();
    const firstYAxisLabel = element.locator('.y-axis-text').first();

    const firstBarBox = await firstBar.boundingBox();
    const firstLabelBox = await firstLabel.boundingBox();
    const firstYAxisLabelBox = await firstYAxisLabel.boundingBox();
    const yAxisTick = await element.evaluate(el => {
      const tick = [...el.shadowRoot!.querySelectorAll<SVGLineElement>('.axis-tick-line')].find(
        line => line.getAttribute('y1') === line.getAttribute('y2'),
      );

      if (!tick) {
        return null;
      }

      return {
        x1: Number(tick.getAttribute('x1')),
        x2: Number(tick.getAttribute('x2')),
      };
    });

    expect(firstBarBox).not.toBeNull();
    expect(firstLabelBox).not.toBeNull();
    expect(firstYAxisLabelBox).not.toBeNull();
    expect(yAxisTick).not.toBeNull();

    const firstBarRight = firstBarBox!.x + firstBarBox!.width;
    const hostBox = await element.boundingBox();

    expect(hostBox).not.toBeNull();

    const yAxisX = hostBox!.x + yAxisTick!.x1;

    expect(Math.abs(firstBarRight - yAxisX)).toBeLessThanOrEqual(2);
    expect(firstLabelBox!.x + firstLabelBox!.width).toBeLessThanOrEqual(firstBarBox!.x + 1);
    expect(firstYAxisLabelBox!.x).toBeGreaterThanOrEqual(yAxisX + 4);
    expect(yAxisTick!.x2).toBeGreaterThan(yAxisTick!.x1);
  });

  test('positions the tooltip relative to rtl inline start when a bar receives focus', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl" style="width: 650px; height: 350px">
        <fluent-horizontal-bar-chart-with-axis
          style="width: 650px; height: 350px"
          chart-title="Horizontal bar chart basic example"
          data='${JSON.stringify(numericYAxisData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const firstBar = element.locator('.bar').first();
    await firstBar.focus();

    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(1);

    const firstBarBox = await firstBar.boundingBox();
    const tooltipBox = await tooltip.boundingBox();

    expect(firstBarBox).not.toBeNull();
    expect(tooltipBox).not.toBeNull();

    const firstBarCenterX = firstBarBox!.x + firstBarBox!.width / 2;
    const tooltipCenterX = tooltipBox!.x + tooltipBox!.width / 2;

    expect(Math.abs(tooltipCenterX - firstBarCenterX)).toBeLessThanOrEqual(24);
  });

  test('deselects a legend on second click in single-select mode', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis chart-title="Revenue by category" data='${JSON.stringify(
          categoricalData,
        )}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const legends = element.locator('.legend');

    await legends.nth(0).click();
    await expect(legends.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(element.locator('.bar').nth(0)).toHaveAttribute('opacity', '0.1');

    await legends.nth(0).click(); // deselect
    await expect(legends.nth(0)).toHaveAttribute('aria-selected', 'false');
    await expect(element.locator('.bar').nth(0)).toHaveAttribute('opacity', '1');
  });

  test('sets aria-label on legend container from legend-list-label attribute', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          legend-list-label="Chart legends"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.legend-container')).toHaveAttribute('aria-label', 'Chart legends');

    await element.evaluate(el => el.setAttribute('legend-list-label', 'Updated legends'));
    await expect(element.locator('.legend-container')).toHaveAttribute('aria-label', 'Updated legends');
  });

  test('hides tooltip when hide-tooltip attribute is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis chart-title="Revenue by category" data='${JSON.stringify(
          categoricalData,
        )}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');

    await element.locator('.bar').nth(0).hover();
    await expect(element.locator('.tooltip')).toHaveCount(1);

    await element.evaluate(el => el.toggleAttribute('hide-tooltip', true));
    await element.locator('.bar').nth(0).hover();
    await expect(element.locator('.tooltip')).toHaveCount(0);
  });

  test('formats axis labels and bar labels using the specified culture', async ({ page }) => {
    const cultureData: HorizontalBarChartWithAxisDataPoint[] = [
      { x: 1234567, y: 'Alpha', legend: 'Series A', color: '#637cef' },
      { x: 2345678, y: 'Beta', legend: 'Series B', color: '#e3008c' },
    ];

    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Culture test"
          culture="de-DE"
          data='${JSON.stringify(cultureData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    // de-DE uses period as grouping separator — compact notation "1,2M"
    const axisTexts = element.locator('.axis-text');
    const firstAxisText = await axisTexts.first().textContent();
    // Any de-DE formatted number uses comma as decimal separator
    expect(firstAxisText).toMatch(/[0-9,\.]+/);

    await element.evaluate(el => el.setAttribute('culture', 'en-US'));
    const axisTextsAfter = element.locator('.axis-text');
    const firstAxisTextAfter = await axisTextsAfter.first().textContent();
    expect(firstAxisTextAfter).not.toBeNull();
  });
});
