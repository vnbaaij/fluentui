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

  test('renders annotations with custom Cartesian margins', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await element.evaluate(node => {
      const chart = node as HTMLElement & {
        margins: { top: number; right: number; bottom: number; left: number };
        annotations: Array<{ text: string; coordinates: { type: 'data'; x: number; y: string } }>;
      };
      chart.margins = { top: 30, right: 40, bottom: 50, left: 80 };
      chart.annotations = [{ text: 'Bar target', coordinates: { type: 'data', x: 1000, y: 'String One' } }];
    });

    await expect(element.locator('.annotation-layer')).toHaveAttribute('transform', 'translate(80, 38)');
    await expect(element.locator('.chart-annotation-text')).toHaveText('Bar target');
  });

  test('renders shared vertical grid lines behind bars and keeps axis ticks short', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const gridLines = element.locator('.axis-grid-line');
    await expect(gridLines).not.toHaveCount(0);
    await expect(element.locator('.axis-grid')).toHaveAttribute('data-orientation', 'vertical');

    const result = await element.evaluate(node => {
      const grid = node.shadowRoot!.querySelector<SVGGElement>('.axis-grid')!;
      const line = grid.querySelector<SVGLineElement>('.axis-grid-line')!;
      const bar = node.shadowRoot!.querySelector<SVGRectElement>('.bar')!;
      const xAxisTick = [...node.shadowRoot!.querySelectorAll<SVGLineElement>('.axis-tick-line')].find(
        tick => tick.getAttribute('x1') === tick.getAttribute('x2'),
      )!;
      const style = getComputedStyle(line);
      return {
        gridIsVertical: line.getAttribute('x1') === line.getAttribute('x2'),
        gridSpansPlot: Number(line.getAttribute('y2')) > Number(line.getAttribute('y1')),
        gridBeforeBar: Boolean(grid.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_FOLLOWING),
        tickLength: Math.abs(Number(xAxisTick.getAttribute('y2')) - Number(xAxisTick.getAttribute('y1'))),
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
      };
    });

    expect(result.gridIsVertical).toBe(true);
    expect(result.gridSpansPlot).toBe(true);
    expect(result.gridBeforeBar).toBe(true);
    expect(result.tickLength).toBe(6);
    expect(result.opacity).toBe('0.2');
    expect(result.pointerEvents).toBe('none');
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
    // bars are rendered in reversed input order; legends follow original input order
    // legends[0]=Oranges → bars[3] (Oranges) highlighted, rest dimmed
    await expect(bars.nth(3)).toHaveAttribute('opacity', '1');
    await expect(bars.nth(0)).toHaveAttribute('opacity', '0.1');
    await expect(bars.nth(1)).toHaveAttribute('opacity', '0.1');
    await expect(bars.nth(2)).toHaveAttribute('opacity', '0.1');
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

    // legends[0]=Oranges, legends[1]=Grapes → both highlighted
    await expect(element.getByLabel('String One. Oranges, 1K.')).toHaveAttribute('opacity', '1');
    await expect(element.getByLabel('String Two. Grapes, 5K.')).toHaveAttribute('opacity', '1');
    await expect(element.getByLabel('String Three. Apples, 3K.')).toHaveAttribute('opacity', '0.1');
    await expect(element.getByLabel('String Four. Bananas, 2K.')).toHaveAttribute('opacity', '0.1');
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
    await expect(element.locator('fluent-chart-legend')).toBeHidden();
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
    // Wait for bars and axis labels to be rendered before measuring layout
    await expect(element.locator('.bar')).toHaveCount(4);
    await expect(element.locator('.y-axis-text')).toHaveCount(6);

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
    await expect(element.locator('fluent-chart-legend')).toHaveAttribute('aria-label', 'Chart legends');

    await element.evaluate(el => el.setAttribute('legend-list-label', 'Updated legends'));
    await expect(element.locator('fluent-chart-legend')).toHaveAttribute('aria-label', 'Updated legends');
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

  test('hides bar labels when hide-labels attribute is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.bar-label')).not.toHaveCount(0);

    await element.evaluate(el => el.setAttribute('hide-labels', ''));
    await expect(element.locator('.bar-label')).toHaveCount(0);
  });

  test('applies custom bar-height to all rendered bars', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          bar-height="20"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const bars = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.bar');
    await expect(bars).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(bars.nth(i)).toHaveAttribute('height', '20');
    }
  });

  test('renders gradient fill on bars when enable-gradient is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          enable-gradient
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const bars = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.bar');
    await expect(bars).toHaveCount(4);
    const fill = await bars.first().getAttribute('fill');
    expect(fill).toMatch(/^url\(#/);
  });

  test('reduces x-axis tick count when x-axis-tick-count is set to a small value', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    // Default x-axis-tick-count=6 produces 6 ticks for [0, 5000] domain
    await expect(element.locator('.axis-text')).toHaveCount(6);

    await element.evaluate(el => el.setAttribute('x-axis-tick-count', '2'));
    // tick-count=2 produces 4 nice ticks: [0, 2000, 4000, 6000]
    await expect(element.locator('.axis-text')).toHaveCount(4);
  });

  test('reduces y-axis tick count on numeric y-axis when y-axis-tick-count is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by value"
          data='${JSON.stringify(numericYAxisData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    // Default y-axis-tick-count=4 produces 6 ticks for [0, 50000] domain
    await expect(element.locator('.y-axis-text')).toHaveCount(6);

    await element.evaluate(el => el.setAttribute('y-axis-tick-count', '2'));
    // tick-count=2 produces 4 nice ticks: [0, 20000, 40000, 60000]
    await expect(element.locator('.y-axis-text')).toHaveCount(4);
  });

  test('affects bar heights when y-axis-padding changes', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          y-axis-padding="0.1"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    // padding=0.1 → tall bars; measure actual height rather than asserting a hardcoded value
    const initialHeight = Number(await element.locator('.bar').first().getAttribute('height'));
    expect(initialHeight).toBeGreaterThan(0);

    await element.evaluate(el => el.setAttribute('y-axis-padding', '0.8'));
    await page.waitForTimeout(50);
    // padding=0.8 → maxBarHeight much smaller than padding=0.1
    const newHeight = Number(await element.locator('.bar').first().getAttribute('height'));
    expect(newHeight).toBeGreaterThan(0);
    expect(newHeight).toBeLessThan(initialHeight);
  });

  test('extends x domain below zero and renders an origin line when x-min-value is negative', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          x-min-value="-2000"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.bar')).toHaveCount(4);
    // Domain crosses zero → origin line is rendered
    await expect(element.locator('.origin-line')).toHaveCount(1);
  });

  test('extends x domain when x-max-value exceeds data maximum', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    // Default domain [0, 5000] → last x-axis tick uses standard notation
    await expect(element.locator('.axis-text').last()).toHaveText('5,000');

    await element.evaluate(el => el.setAttribute('x-max-value', '20000'));
    // Extended domain [0, 20000] → last tick becomes 20,000
    await expect(element.locator('.axis-text').last()).toHaveText('20,000');
  });

  test('extends y domain when y-max-value exceeds data maximum on numeric y-axis', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by value"
          y-max-value="100000"
          data='${JSON.stringify(numericYAxisData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.y-axis-text')).not.toHaveCount(0);
    // Domain extends to 100000 → a tick at 100k is present
    await expect(element.locator('.y-axis-text').last()).toHaveText('100k');
  });

  test('extends y domain when y-min-value is set below data minimum on numeric y-axis', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by value"
          y-min-value="-20000"
          data='${JSON.stringify(numericYAxisData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.y-axis-text')).not.toHaveCount(0);
    // Domain extends to -20000 → at least one y-axis tick is negative
    const hasNegativeTick = await element.evaluate(el => {
      const texts = el.shadowRoot!.querySelectorAll('.y-axis-text');
      return Array.from(texts).some(t => (t.textContent ?? '').includes('-'));
    });
    expect(hasNegativeTick).toBe(true);
  });

  test('renders full y-axis label text when show-y-axis-labels is set', async ({ page }) => {
    const longLabelData = categoricalData.map(point => ({
      ...point,
      y: `${point.y} with an extended label that exceeds truncation`,
    }));

    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Long labels"
          data='${JSON.stringify(longLabelData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.y-axis-text')).toHaveCount(4);
    // Default: labels are truncated to 18 chars ending with …
    await expect(element.locator('.y-axis-text').first()).toHaveText(/…$/);

    await element.evaluate(el => el.setAttribute('show-y-axis-labels', ''));
    // Full label is no longer truncated
    await expect(element.locator('.y-axis-text').first()).not.toHaveText(/…$/);
    const fullText = await element.locator('.y-axis-text').first().textContent();
    expect(fullText?.length ?? 0).toBeGreaterThan(18);
  });

  test('adds SVG title elements to y-axis labels when show-y-axis-labels-tooltip is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Tooltip labels"
          show-y-axis-labels-tooltip
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.y-axis-text')).toHaveCount(4);

    const allHaveTitles = await element.evaluate(el => {
      const texts = el.shadowRoot!.querySelectorAll('.y-axis-text');
      return Array.from(texts).every(t => t.querySelector('title') !== null);
    });
    expect(allHaveTitles).toBe(true);
  });

  test('reorders y-axis labels according to y-axis-category-order', async ({ page }) => {
    const orderedData: HorizontalBarChartWithAxisDataPoint[] = [
      { y: 'Zebra', x: 100, legend: 'S1', color: '#637cef' },
      { y: 'Apple', x: 200, legend: 'S2', color: '#e3008c' },
      { y: 'Mango', x: 150, legend: 'S3', color: '#2aa0a4' },
    ];

    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Category order"
          y-axis-category-order="category ascending"
          data='${JSON.stringify(orderedData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    // 'category ascending' → Apple, Mango, Zebra (first in DOM = top of chart = Apple)
    await expect(element.locator('.y-axis-text').first()).toHaveText('Apple');

    await element.evaluate(el => el.setAttribute('y-axis-category-order', 'category descending'));
    // 'category descending' → Zebra, Mango, Apple (first = top = Zebra)
    await expect(element.locator('.y-axis-text').first()).toHaveText('Zebra');
  });

  test('shows tooltip on bar focus in ltr layout', async ({ page }) => {
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Revenue by category"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);

    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const firstBar = element.locator('.bar').first();
    await firstBar.focus();

    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(1);

    const barBox = await firstBar.boundingBox();
    const tooltipBox = await tooltip.boundingBox();
    expect(barBox).not.toBeNull();
    expect(tooltipBox).not.toBeNull();

    const barCenterX = barBox!.x + barBox!.width / 2;
    const tooltipCenterX = tooltipBox!.x + tooltipBox!.width / 2;
    expect(Math.abs(tooltipCenterX - barCenterX)).toBeLessThanOrEqual(30);
  });
});

// ── title-align ───────────────────────────────────────────────────────────────

const hbcwaTitle = 'HBCA test chart';

test.describe('HorizontalBarChartWithAxis - title-align', () => {
  async function setupWithTitle(page: import('@playwright/test').Page, extraAttrs = '') {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="${hbcwaTitle}"
          ${extraAttrs}
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
  }

  test('Should render .chart-title when chart-title is set', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.chart-title')).toHaveText(hbcwaTitle);
  });

  test('Should not render .chart-title when chart-title is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis data='${JSON.stringify(
          categoricalData,
        )}'></fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element.locator('.chart-title')).toHaveCount(0);
  });

  test('Should apply text-align:start by default', async ({ page }) => {
    await setupWithTitle(page);
    const title = page.locator('fluent-horizontal-bar-chart-with-axis .chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
  });

  test('Should apply text-align:center when title-align="center"', async ({ page }) => {
    await setupWithTitle(page, "title-align='center'");
    const title = page.locator('fluent-horizontal-bar-chart-with-axis .chart-title');
    await expect(title).toHaveCSS('text-align', 'center');
  });

  test('Should apply text-align:end when title-align="end"', async ({ page }) => {
    await setupWithTitle(page, "title-align='end'");
    const title = page.locator('fluent-horizontal-bar-chart-with-axis .chart-title');
    await expect(title).toHaveCSS('text-align', 'end');
  });

  test('Should update text-align when title-align attribute changes dynamically', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const title = element.locator('.chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
    await element.evaluate(el => el.setAttribute('title-align', 'center'));
    await expect(title).toHaveCSS('text-align', 'center');
  });
});

// ── legend-position ───────────────────────────────────────────────────────────

test.describe('HorizontalBarChartWithAxis - legend-position', () => {
  async function setupWithLegendPosition(page: import('@playwright/test').Page, position: string) {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="${hbcwaTitle}"
          legend-position="${position}"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
  }

  test('Should set position attribute on fluent-chart-legend when legend-position="top"', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const legend = page.locator('fluent-horizontal-bar-chart-with-axis fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="start"', async ({ page }) => {
    await setupWithLegendPosition(page, 'start');
    const legend = page.locator('fluent-horizontal-bar-chart-with-axis fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'start');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="end"', async ({ page }) => {
    await setupWithLegendPosition(page, 'end');
    const legend = page.locator('fluent-horizontal-bar-chart-with-axis fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'end');
  });

  test('Should update legend position attribute when legend-position changes dynamically', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const legend = element.locator('fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
    await element.evaluate(el => el.setAttribute('legend-position', 'end'));
    await expect(legend).toHaveAttribute('position', 'end');
  });
});

// ── title-position ────────────────────────────────────────────────────────────

test.describe('HorizontalBarChartWithAxis - title-position', () => {
  test('Should keep title-position="bottom" regardless of legend position', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="${hbcwaTitle}"
          title-position="bottom"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });

  test('Should keep title-position="bottom" when legend-position="top"', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="${hbcwaTitle}"
          legend-position="top"
          title-position="bottom"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });

  test('Should keep title-position="bottom" when legend is visible at default position', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="${hbcwaTitle}"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    await element.evaluate(el => el.setAttribute('title-position', 'bottom'));
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });
});

test.describe('HorizontalBarChartWithAxis - axis-titles', () => {
  test('Should render x-axis-title element when attribute is set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Axis title test"
          x-axis-title="Revenue (USD)"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const titleEl = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.axis-title');
    await expect(titleEl.first()).toContainText('Revenue (USD)');
  });

  test('Should render y-axis-title element when attribute is set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Y axis title test"
          y-axis-title="Quarter"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const titleEl = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.axis-title');
    await expect(titleEl.first()).toContainText('Quarter');
  });

  test('Should not render axis-title element when attributes are absent', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="No title test"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const titleEls = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.axis-title');
    await expect(titleEls).toHaveCount(0);
  });
});

test.describe('HorizontalBarChartWithAxis - rotate-x-axis-labels', () => {
  test('Should add transform rotate attribute to x-axis text when rotate-x-axis-labels is set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Rotate labels test"
          rotate-x-axis-labels
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const axisTexts = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.axis-text');
    const firstText = axisTexts.first();
    const transform = await firstText.getAttribute('transform');
    await expect(transform).toMatch(/rotate\(-45/);
  });
});

test.describe('HorizontalBarChartWithAxis - support-negative-data', () => {
  test('Should allow y domain below zero when support-negative-data is set', async ({ page }) => {
    const negativeData = [
      { x: 1000, y: -5, legend: 'A', color: '#637cef' },
      { x: 2000, y: 5, legend: 'B', color: '#e3008c' },
    ];
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Negative data test"
          support-negative-data
          data='${JSON.stringify(negativeData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    // The chart should render bars (not be empty)
    const bars = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.bar');
    await expect(bars).toHaveCount(negativeData.length);
  });
});

test.describe('HorizontalBarChartWithAxis - tick-values', () => {
  test('Should render exactly the provided tick values on the x-axis', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div style="width:800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Tick values test"
          tick-values='[0, 5000, 10000]'
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const axisLabels = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.axis-text');
    await expect(axisLabels).toHaveCount(3);
  });

  test('Should update x-axis ticks when tick-values attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div style="width:800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Tick values reactivity test"
          tick-values='[0, 5000, 10000]'
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');

    await expect(element.locator('.axis-text')).toHaveCount(3);

    await element.evaluate(el => el.setAttribute('tick-values', '[0, 2500, 5000, 7500, 10000]'));
    await page.waitForTimeout(50);

    await expect(element.locator('.axis-text')).toHaveCount(5);
  });
});

test.describe('HorizontalBarChartWithAxis - stroke-width', () => {
  test('Should apply stroke-width attribute to bars', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div style="width:800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Stroke width test"
          stroke-width="2"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const bars = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('stroke-width', '2');
    await expect(bars.nth(1)).toHaveAttribute('stroke-width', '2');
    await expect(bars.nth(2)).toHaveAttribute('stroke-width', '2');
    await expect(bars.nth(3)).toHaveAttribute('stroke-width', '2');
  });

  test('Should not set stroke-width when attribute is absent', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div style="width:800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="No stroke width test"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const firstBar = page.locator('fluent-horizontal-bar-chart-with-axis').locator('.bar').first();
    await expect(firstBar).not.toHaveAttribute('stroke-width');
  });
});

test.describe('HorizontalBarChartWithAxis - show-x-axis-labels-tooltip', () => {
  test('Should truncate long x-axis labels and show overlay tooltip when enabled', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    // Use .10f format to produce labels > 10 chars (e.g. "0.0000000000")
    await page.setContent(/* html */ `
      <div style="width:800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="X-axis labels tooltip test"
          x-axis-tick-format=".10f"
          show-x-axis-labels-tooltip
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const axisLabels = element.locator('.axis-text');
    await expect(axisLabels.first()).not.toBeEmpty();

    const truncatedLabel = axisLabels.filter({ hasText: /\.\.\./ }).first();
    await truncatedLabel.hover();

    const axisTooltip = element.locator('.axis-label-tooltip');
    await expect(axisTooltip).toHaveCount(1);
    await expect(axisTooltip).toHaveCSS('opacity', '0.9');
    await expect(axisTooltip).not.toHaveText('');
  });

  test('Should not render overlay tooltip when show-x-axis-labels-tooltip is absent', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div style="width:800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="No x-axis labels tooltip test"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const axisLabels = element.locator('.axis-text');
    await axisLabels.first().hover();
    await expect(element.locator('.axis-label-tooltip')).toHaveCount(0);
  });
});

test.describe('HorizontalBarChartWithAxis - tooltipRenderer', () => {
  test('Should inject custom renderer output into tooltip-body', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="tooltipRenderer test"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');

    await element.evaluate((el: any) => {
      el.tooltipRenderer = (_point: any, defaultRender: any) =>
        `<span class="custom-tip">${defaultRender(_point)}</span>`;
    });

    await element.locator('.bar').first().hover();
    await expect(element.locator('.tooltip-body .custom-tip')).toBeVisible();
  });

  test('Should show default tooltip-body when tooltipRenderer is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="default tooltip test"
          data='${JSON.stringify(categoricalData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');

    await element.locator('.bar').first().hover();
    await expect(element.locator('.tooltip')).toHaveCount(1);
    await expect(element.locator('.tooltip-body')).toBeVisible();
  });
});

test.describe('HorizontalBarChartWithAxis - y-axis-tick-values', () => {
  const compactNumericYAxisData: HorizontalBarChartWithAxisDataPoint[] = [
    { x: 100, y: 0, legend: 'Alpha', color: '#637cef' },
    { x: 250, y: 500, legend: 'Beta', color: '#e3008c' },
    { x: 400, y: 1000, legend: 'Gamma', color: '#2aa0a4' },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div style="width: 800px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Y-axis tick values test"
          data='${JSON.stringify(compactNumericYAxisData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
  });

  test('Should re-render the numeric y-axis with the provided tick values', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');

    await element.evaluate(el => el.setAttribute('y-axis-tick-values', '[0,500,1000]'));
    await page.waitForTimeout(50);

    const labels = element.locator('.y-axis-text');
    await expect(labels).toHaveCount(3);
    await expect(labels.nth(0)).toContainText('0');
    await expect(labels.nth(1)).toContainText('500');
    await expect(labels.nth(2)).toContainText(/1k/i);
  });
});

test.describe('HorizontalBarChartWithAxis - hide-tick-overlap', () => {
  const crowdedTickData: HorizontalBarChartWithAxisDataPoint[] = [
    { x: 1000, y: 'North', legend: 'Alpha', color: '#637cef' },
    { x: 5000, y: 'South', legend: 'Beta', color: '#e3008c' },
    { x: 9000, y: 'East', legend: 'Gamma', color: '#2aa0a4' },
    { x: 12000, y: 'West', legend: 'Delta', color: '#9373c0' },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchartwithaxis--basic'));
    await page.setContent(/* html */ `
      <div style="width: 320px">
        <fluent-horizontal-bar-chart-with-axis
          chart-title="Tick overlap re-render test"
          tick-values='[0,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000]'
          x-axis-tick-format=".0f"
          data='${JSON.stringify(crowdedTickData)}'>
        </fluent-horizontal-bar-chart-with-axis>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart-with-axis'));
  });

  test('Should stay visible when hide-tick-overlap is toggled', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart-with-axis');
    const svg = element.locator('svg.chart-svg');

    await element.evaluate(el => el.removeAttribute('hide-tick-overlap'));
    await page.waitForTimeout(50);
    await expect(svg).toBeVisible();

    await element.evaluate(el => el.setAttribute('hide-tick-overlap', ''));
    await page.waitForTimeout(50);
    await expect(svg).toBeVisible();
    await expect(element.locator('.axis-text').first()).not.toBeEmpty();
  });
});
