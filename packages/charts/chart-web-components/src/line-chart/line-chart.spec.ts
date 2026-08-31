import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { LineChartSeries } from './line-chart.options.js';

const data: LineChartSeries[] = [
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

  test('Should reverse x-axis data order in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-line-chart data='${JSON.stringify(data)}' width='600' height='300' show-markers></fluent-line-chart>
      </div>
    `);
    const element = page.locator('fluent-line-chart');

    const markers = element.locator('.line-marker');
    await expect(markers).toHaveCount(6);
    expect(Number(await markers.first().getAttribute('cx'))).toBeGreaterThan(
      Number(await markers.nth(2).getAttribute('cx')),
    );
  });

  test('RTL story should format tooltip dates like Basic', async ({ page }) => {
    const readFirstTooltipHeader = async (storyId: string): Promise<string> => {
      await page.goto(fixtureURL(`components-linechart--${storyId}`));
      const element = page.locator('fluent-line-chart');
      await element.evaluate(chart => ((chart as HTMLElement & { showMarkers: boolean }).showMarkers = true));
      await element.locator('.line-marker').first().dispatchEvent('mouseenter');
      return element.locator('.tooltip-header').innerText();
    };

    const basicHeader = await readFirstTooltipHeader('basic');
    expect(await readFirstTooltipHeader('rtl')).toBe(basicHeader);
  });

  test('Should render shared gridlines and annotations with custom Cartesian margins', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & {
        margins: { top: number; right: number; bottom: number; left: number };
        annotations: Array<{ text: string; coordinates: { type: 'data'; x: number; y: number } }>;
      };
      chart.margins = { top: 30, right: 40, bottom: 50, left: 80 };
      chart.annotations = [{ text: 'Line target', coordinates: { type: 'data', x: 1, y: 20 } }];
    });

    expect(await element.locator('.axis-grid-line').count()).toBeGreaterThan(0);
    await expect(element.locator('.annotation-layer')).toHaveAttribute('transform', 'translate(80, 30)');
    await expect(element.locator('.chart-annotation-text')).toHaveText('Line target');
  });

  test('Should render markers when show-markers set', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => node.setAttribute('show-markers', ''));
    await expect(element.locator('.line-marker')).toHaveCount(6);
  });

  test('Should honor logarithmic x and y scales', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & {
        data: LineChartSeries[];
        xScaleType: 'log';
        yScaleType: 'log';
        showMarkers: boolean;
      };
      chart.data = [
        {
          legend: 'Log series',
          data: [
            { x: 1, y: 1 },
            { x: 10, y: 10 },
            { x: 100, y: 100 },
          ],
        },
      ];
      chart.xScaleType = 'log';
      chart.yScaleType = 'log';
      chart.showMarkers = true;
    });

    await expect(element.locator('.line-marker')).toHaveCount(3);
    const positions = await element.locator('.line-marker').evaluateAll(markers =>
      markers.map(marker => ({
        x: Number(marker.getAttribute('cx')),
        y: Number(marker.getAttribute('cy')),
      })),
    );
    expect(positions[1].x).toBeCloseTo((positions[0].x + positions[2].x) / 2, 5);
    expect(positions[1].y).toBeCloseTo((positions[0].y + positions[2].y) / 2, 5);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    const legendCount = await element.locator('.legend-text').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: LineChartSeries[] }).data = [
        {
          legend: 'Only Series',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 12 },
          ],
        },
      ];
    });
    await expect(element.locator('.line-path')).toHaveCount(1);
  });

  test('Should render primary y-axis on right in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-line-chart data='${JSON.stringify(data)}' width='600' height='300'></fluent-line-chart>
      </div>
    `);
    const element = page.locator('fluent-line-chart');
    await expect(element.locator('.y-axis .axis-tick-line').first()).toHaveAttribute('x2', '6');
  });
});
