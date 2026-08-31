import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { SparklineChartData } from './sparkline-chart.options.js';

const data: SparklineChartData = {
  chartTitle: '20',
  lineChartData: [
    {
      legend: '20',
      color: '#637cef',
      data: [
        { x: 0, y: 10 },
        { x: 1, y: 18 },
        { x: 2, y: 12 },
        { x: 3, y: 20 },
      ],
    },
  ],
};

test.describe('SparklineChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-sparklinechart--basic'));
    await page.setContent(/* html */ `
      <fluent-sparkline-chart width="200" height="60" data='${JSON.stringify(data)}'></fluent-sparkline-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-sparkline-chart'));
  });

  test('Should render chart elements', async ({ page }) => {
    const element = page.locator('fluent-sparkline-chart');
    await expect(element.locator('.sparkline-line')).toHaveCount(1);
    await expect(element.locator('.sparkline-area')).toHaveCount(1);
    await expect(element.locator('.sparkline-line')).toHaveAttribute('stroke', '#637cef');
  });

  test('Should use the default Sparkline dimensions', async ({ page }) => {
    await page.setContent(`<fluent-sparkline-chart data='${JSON.stringify(data)}'></fluent-sparkline-chart>`, {
      waitUntil: 'domcontentloaded',
    });
    const element = page.locator('fluent-sparkline-chart');

    await expect(element).toHaveJSProperty('width', 80);
    await expect(element).toHaveJSProperty('height', 20);
    await expect(element.locator('.chart')).toHaveAttribute('width', '80');
    await expect(element.locator('.chart')).toHaveAttribute('height', '20');
  });
  test('Should render legend metadata from the data model', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-sparkline-chart
        width="80"
        height="20"
        value-text-width="120"
        show-legend
        data='${JSON.stringify(data)}'
      ></fluent-sparkline-chart>
    `);
    const element = page.locator('fluent-sparkline-chart');

    await expect(element.locator('.sparkline-legend')).toHaveAttribute('width', '120');
    await expect(element.locator('.sparkline-legend-text')).toHaveText('20');
  });

  test('Basic story should mirror the React narrative and table data', async ({ page }) => {
    await page.goto(fixtureURL('components-sparklinechart--basic'));

    await expect(page.getByText('Below table shows sparklines in one of its columns.')).toBeVisible();
    await expect(page.getByRole('grid').getByRole('row')).toHaveCount(8);
    await expect(page.getByRole('grid').getByText('Row 8')).toBeVisible();
    await expect(page.locator('fluent-sparkline-chart')).toHaveCount(10);
    await expect(page.locator('fluent-sparkline-chart .sparkline-legend')).toHaveCount(6);

    const dateSeriesUsesDates = await page
      .getByRole('grid')
      .getByRole('row')
      .nth(5)
      .locator('fluent-sparkline-chart')
      .evaluate(chart =>
        (chart as HTMLElement & { data: SparklineChartData }).data.lineChartData[0].data.every(
          point => point.x instanceof Date,
        ),
      );
    expect(dateSeriesUsesDates).toBe(true);
  });

  test('RTL story should replicate the Basic story data and content in RTL', async ({ page }) => {
    const readStory = async (storyId: string) => {
      await page.goto(fixtureURL(`components-sparklinechart--${storyId}`));
      const charts = page.locator('fluent-sparkline-chart');
      await expect(charts).toHaveCount(10);
      const chartData = await charts.evaluateAll(elements =>
        elements.map(chart => {
          const sparkline = chart as HTMLElement & { data: SparklineChartData; showLegend: boolean };
          return { data: JSON.stringify(sparkline.data), showLegend: sparkline.showLegend };
        }),
      );
      const legendGap = await charts.first().evaluate(chart => {
        const lineBounds = chart.shadowRoot!.querySelector('.sparkline-line')!.getBoundingClientRect();
        const legendBounds = chart.shadowRoot!.querySelector('.sparkline-legend-text')!.getBoundingClientRect();
        return getComputedStyle(chart).direction === 'rtl'
          ? lineBounds.left - legendBounds.right
          : legendBounds.left - lineBounds.right;
      });
      return { chartData, legendGap };
    };

    const basicCharts = await readStory('basic');
    const rtlCharts = await readStory('rtl');

    expect(rtlCharts.chartData).toEqual(basicCharts.chartData);
    expect(basicCharts.legendGap).toBeCloseTo(12);
    expect(rtlCharts.legendGap).toBeGreaterThan(0);
    expect(Math.abs(rtlCharts.legendGap - basicCharts.legendGap)).toBeLessThan(1);
    await expect(page.getByText('Below table shows sparklines in one of its columns.')).toBeVisible();
    await expect(page.getByRole('grid').getByRole('row')).toHaveCount(8);
    await expect(page.locator('fluent-sparkline-chart')).toHaveCount(10);
    await expect(page.locator('fluent-sparkline-chart').first()).toHaveCSS('direction', 'rtl');
    const rtlLegendText = page.locator('fluent-sparkline-chart').first().locator('.sparkline-legend-text');
    await expect(rtlLegendText).toHaveAttribute('x', '100%');
    await expect(rtlLegendText).toHaveAttribute('text-anchor', 'end');
    await expect(rtlLegendText).toHaveAttribute('dx', '-8');
  });

  test('Dimensions story should mirror the React dimensions examples', async ({ page }) => {
    await page.goto(fixtureURL('components-sparklinechart--dimensions'));

    await expect(page.getByText('Default (80x20):')).toBeVisible();
    await expect(page.getByText('Custom width=150:')).toBeVisible();
    await expect(page.getByText('Custom height=40:')).toBeVisible();
    await expect(page.getByText('Both (200x60):')).toBeVisible();

    const dimensions = await page
      .locator('fluent-sparkline-chart')
      .evaluateAll(charts => charts.map(chart => [chart.getAttribute('width'), chart.getAttribute('height')]));
    expect(dimensions).toEqual([
      ['80', '20'],
      ['150', '20'],
      ['80', '40'],
      ['200', '60'],
    ]);
  });

  test('Chart Attributes story should use the default Sparkline dimensions', async ({ page }) => {
    await page.goto(fixtureURL('components-sparklinechart--chart-attributes'));
    const element = page.locator('fluent-sparkline-chart');

    await expect(element).toHaveAttribute('width', '80');
    await expect(element).toHaveAttribute('height', '20');
    await expect(element).toHaveJSProperty('width', 80);
    await expect(element).toHaveJSProperty('height', 20);
  });

  test('Should support an explicit line-only variant', async ({ page }) => {
    const element = page.locator('fluent-sparkline-chart');
    await element.evaluate(el => el.setAttribute('variant', 'line'));
    await expect(element.locator('.sparkline-area')).toHaveCount(0);
    await expect(element.locator('.sparkline-line')).toHaveCount(1);
  });

  test('Should re-render when data attribute changes', async ({ page }) => {
    const element = page.locator('fluent-sparkline-chart');
    const before = await element.locator('.sparkline-line').getAttribute('d');
    const nextData: SparklineChartData = {
      chartTitle: '16',
      lineChartData: [
        {
          legend: '16',
          color: '#e3008c',
          data: [
            { x: 0, y: 5 },
            { x: 1, y: 8 },
            { x: 2, y: 16 },
            { x: 3, y: 4 },
          ],
        },
      ],
    };

    await element.evaluate((el, value) => el.setAttribute('data', JSON.stringify(value)), nextData);
    // Wait for d attribute to change, retrying until the re-render completes
    await expect(async () => {
      expect(await element.locator('.sparkline-line').getAttribute('d')).not.toBe(before);
    }).toPass({ timeout: 5000 });
    const after = await element.locator('.sparkline-line').getAttribute('d');
    expect(after).not.toBe(before);
  });
});
