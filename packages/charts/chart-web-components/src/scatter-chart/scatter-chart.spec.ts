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

  test('Should preserve continuous marker sizes when they fit the available plot padding', async ({ page }) => {
    const element = page.locator('fluent-scatter-chart');
    await element.evaluate(chart => {
      const scatterChart = chart as HTMLElement & { data: ScatterChartSeries[]; width: number; height: number };
      scatterChart.width = 800;
      scatterChart.height = 600;
      scatterChart.data = [
        {
          legend: 'Series',
          data: [
            { x: 0, y: 0, markerSize: 5 },
            { x: 100, y: 100, markerSize: 10 },
          ],
        },
      ];
    });

    await expect(element.locator('.scatter-point')).toHaveCount(2);
    await expect
      .poll(() =>
        element.locator('.scatter-point').evaluateAll(points => points.map(point => Number(point.getAttribute('r')))),
      )
      .toEqual([5, 10]);
  });

  test('Should render every story without a vertical scrollbar', async ({ page }) => {
    const stories = [
      ['components-scatterchart--basic', 470],
      ['components-scatterchart--standard-attributes', 560],
      ['components-scatterchart--scatter-chart-date', 520],
      ['components-scatterchart--scatter-chart-string', 520],
      ['components-scatterchart--scatter-chart-log-axis-example', 500],
      ['components-scatterchart--tooltip-renderer-story', 470],
      ['components-scatterchart--culture', 470],
      ['components-scatterchart--title-align', 470],
      ['components-scatterchart--title-and-legend-positions', 470],
      ['components-scatterchart--rtl', 470],
    ] as const;

    for (const [storyId, height] of stories) {
      await page.setViewportSize({ width: 320, height });
      await page.goto(fixtureURL(storyId));
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight))
        .toBeLessThanOrEqual(0);
    }
  });

  test('Should render React-like hover selection, guideline, and tooltip', async ({ page }) => {
    const element = page.locator('fluent-scatter-chart');
    const point = element.locator('.scatter-point').nth(1);
    const originalFill = await point.getAttribute('fill');
    await point.dispatchEvent('mouseenter');

    await expect(point).toHaveClass(/active/);
    await expect(point).toHaveAttribute('fill', 'var(--colorNeutralBackground1)');
    await expect(element.locator('.tooltip-header')).toHaveText('3');
    await expect(element.locator('.tooltip-primary-value')).toHaveText('7');

    const guideline = element.locator('.hover-line');
    await expect(guideline).toHaveCSS('display', 'inline');
    await expect(guideline).toHaveCSS('stroke-dasharray', '5px, 5px');
    const geometry = await Promise.all(
      ['cx', 'cy', 'r'].map(attribute => point.getAttribute(attribute).then(value => Number(value))),
    );
    await expect(guideline).toHaveAttribute('x1', String(geometry[0]));
    await expect(guideline).toHaveAttribute('x2', String(geometry[0]));
    await expect(guideline).toHaveAttribute('y1', String(geometry[1] + geometry[2]));
    expect(Number(await guideline.getAttribute('y2'))).toBeGreaterThan(geometry[1]);

    await expect
      .poll(async () => {
        const tooltipBounds = await element.locator('.tooltip').boundingBox();
        const lineBounds = await guideline.boundingBox();
        return tooltipBounds && lineBounds ? tooltipBounds.x - (lineBounds.x + lineBounds.width) : 0;
      })
      .toBeGreaterThanOrEqual(14);

    await point.dispatchEvent('mouseleave');
    await expect(point).not.toHaveClass(/active/);
    await expect(point).toHaveAttribute('fill', originalFill!);
    await expect(guideline).toHaveCSS('display', 'none');
    await expect(element.locator('.tooltip')).toHaveCount(0);
  });

  test('Should position the hover tooltip to the left when it does not fit right of the guideline', async ({
    page,
  }) => {
    const element = page.locator('fluent-scatter-chart');
    const point = element.locator('.scatter-point').last();
    const guideline = element.locator('.hover-line');
    await point.dispatchEvent('mouseenter');

    await expect(element.locator('.tooltip')).toBeVisible();
    await expect
      .poll(async () => {
        const tooltipBounds = await element.locator('.tooltip').boundingBox();
        const lineBounds = await guideline.boundingBox();
        return tooltipBounds && lineBounds ? lineBounds.x - (tooltipBounds.x + tooltipBounds.width) : 0;
      })
      .toBeGreaterThanOrEqual(14);
  });

  test('Basic story should match the React data and visual scale', async ({ page }) => {
    await page.goto(fixtureURL('components-scatterchart--basic'));
    const element = page.locator('fluent-scatter-chart');
    await expect(element.locator('.scatter-point')).toHaveCount(11);

    const storyData = await element.evaluate(chart => (chart as HTMLElement & { data: ScatterChartSeries[] }).data);
    expect(storyData.map(series => series.legend)).toEqual(['Phase 1', 'Phase 2', 'Milestone']);
    expect(storyData.flatMap(series => series.data.map(point => point.markerSize))).toEqual([
      12, 15, 18, 22, 25, 28, 30, 32, 35, 40, 50,
    ]);

    const markerRadii = await element
      .locator('.scatter-point')
      .evaluateAll(points => points.map(point => Number(point.getAttribute('r'))));
    [4.8, 6, 7.2, 8.8, 10, 11.2, 12, 12.8, 14, 16, 20].forEach((radius, index) => {
      expect(markerRadii[index]).toBeCloseTo(radius);
    });
    await expect(element.locator('.x-axis .axis-text')).toHaveText([
      '0',
      '10',
      '20',
      '30',
      '40',
      '50',
      '60',
      '70',
      '80',
      '90',
      '100',
      '110',
    ]);
    await expect(element.locator('.y-axis .y-axis-text')).toHaveText(['0', '81.25k', '162.5k', '243.75k', '325k']);
    await expect(element.locator('.axis-grid-line')).toHaveCount(5);
    const gridline = element.locator('.axis-grid-line').first();
    const xAxisDomain = element.locator('.x-axis .axis-domain');
    const xAxisTick = element.locator('.x-axis .axis-tick-line').first();
    await expect(gridline).toHaveCSS('opacity', '0.2');
    await expect(xAxisDomain).toHaveCSS('opacity', '0.2');
    await expect(xAxisTick).toHaveCSS('opacity', '0.2');
    expect(await xAxisDomain.evaluate(node => getComputedStyle(node).stroke)).toBe(
      await gridline.evaluate(node => getComputedStyle(node).stroke),
    );
    expect(await xAxisTick.evaluate(node => getComputedStyle(node).stroke)).toBe(
      await gridline.evaluate(node => getComputedStyle(node).stroke),
    );
    await expect(element.locator('.y-axis .axis-domain')).toHaveCSS('display', 'none');
    await expect(element.locator('.y-axis .axis-tick-line').first()).toHaveCSS('display', 'none');
  });

  test('Date story should replicate the React example', async ({ page }) => {
    await page.goto(fixtureURL('components-scatterchart--scatter-chart-date'));
    const element = page.locator('fluent-scatter-chart');

    await expect(page.getByText('Scatter chart date x example.')).toBeVisible();
    await expect(element.locator('.scatter-point')).toHaveCount(15);
    await expect(element.locator('.legend-text')).toHaveText([
      'Website Traffic',
      'Sales Performance',
      'Promotional Campaign',
    ]);
    expect(
      await element.evaluate(chart =>
        (chart as HTMLElement & { data: ScatterChartSeries[] }).data.every(series =>
          series.data.every(point => point.x instanceof Date),
        ),
      ),
    ).toBe(true);
    await expect(element.locator('.x-axis .axis-text')).toHaveText([
      'Feb 28',
      'Mar 01',
      'Mar 02',
      'Mar 03',
      'Mar 04',
      'Mar 05',
      'Mar 06',
      'Mar 07',
      'Mar 08',
    ]);
    await expect(element.locator('.x-axis-title')).toHaveText('Date');
    await expect(element.locator('.y-axis-title')).toHaveText('Number of visitors');

    const websitePoint = element.locator('.scatter-point').nth(5);
    const salesPoint = element.locator('.scatter-point').nth(12);
    await websitePoint.dispatchEvent('mouseenter');

    await expect(element.locator('.scatter-point.active')).toHaveCount(2);
    await expect(websitePoint).toHaveAttribute('fill', 'var(--colorNeutralBackground1)');
    await expect(salesPoint).toHaveAttribute('fill', 'var(--colorNeutralBackground1)');
    await expect(websitePoint).toHaveCSS('opacity', '1');
    await expect(salesPoint).toHaveCSS('opacity', '1');
    await expect(element.locator('.tooltip-legend-text')).toHaveText(['Website Traffic', 'Sales Performance']);
    await expect(element.locator('.tooltip-primary-value')).toHaveText(['8500', '4200']);

    const guideline = element.locator('.hover-line');
    const dateTick = element.locator('.x-axis .tick').filter({ hasText: 'Mar 06' });
    const [guidelineX, tickX] = await Promise.all([
      guideline.evaluate(line => (line as SVGGraphicsElement).getScreenCTM()!.e + Number(line.getAttribute('x1'))),
      dateTick
        .locator('.axis-tick-line')
        .evaluate(line => (line as SVGGraphicsElement).getScreenCTM()!.e + Number(line.getAttribute('x1') ?? 0)),
    ]);
    expect(guidelineX).toBeCloseTo(tickX, 5);
    const highestPointGeometry = await Promise.all(
      ['cy', 'r'].map(attribute => websitePoint.getAttribute(attribute).then(value => Number(value))),
    );
    await expect(guideline).toHaveAttribute('y1', String(highestPointGeometry[0] + highestPointGeometry[1]));
    expect(
      await guideline.evaluate(line => {
        const firstPoint = line.parentElement?.querySelector('.scatter-point');
        return firstPoint
          ? Boolean(line.compareDocumentPosition(firstPoint) & Node.DOCUMENT_POSITION_FOLLOWING)
          : false;
      }),
    ).toBe(true);
  });

  test('String story should replicate the React example', async ({ page }) => {
    await page.goto(fixtureURL('components-scatterchart--scatter-chart-string'));
    const element = page.locator('fluent-scatter-chart');

    await expect(page.getByText('Scatter chart string x example.')).toBeVisible();
    await expect(element.locator('.scatter-point')).toHaveCount(10);
    await expect(element.locator('.x-axis .axis-text')).toHaveText([
      'Electronics',
      'Furniture',
      'Clothing',
      'Toys',
      'Books',
    ]);
    const radii = await element
      .locator('.scatter-point')
      .evaluateAll(points => points.map(point => Number(point.getAttribute('r'))));
    expect(Math.min(...radii)).toBe(4);
    expect(Math.max(...radii)).toBe(16);
    await expect(element.locator('.x-axis-title')).toHaveText('Product Category');
  });

  test('Log Axis story should replicate the React example and controls', async ({ page }) => {
    await page.goto(fixtureURL('components-scatterchart--scatter-chart-log-axis-example'));
    const element = page.locator('fluent-scatter-chart');

    await expect(element.locator('.scatter-point')).toHaveCount(30);
    await expect(element).toHaveJSProperty('xScaleType', 'log');
    await expect(element).toHaveJSProperty('yScaleType', 'log');
    await expect(page.locator('#scatter-log-x-scale')).toHaveAttribute('value', 'log');
    await expect(page.locator('#scatter-log-y-scale')).toHaveAttribute('value', 'log');
    await expect(element.locator('.legend-text')).toHaveText(['Trace 1', 'Trace 2']);

    const [widthControlBounds, xScaleControlBounds, yScaleControlBounds] = await Promise.all(
      ['#scatter-log-width', '#scatter-log-x-scale', '#scatter-log-y-scale'].map(selector =>
        page.locator(selector).boundingBox(),
      ),
    );
    expect(xScaleControlBounds!.y).toBeGreaterThan(widthControlBounds!.y + widthControlBounds!.height);
    expect(yScaleControlBounds!.y).toBeCloseTo(xScaleControlBounds!.y, 1);

    const xTickCount = await element.locator('.x-axis .axis-tick-line').count();
    const xLabelCount = await element.locator('.x-axis .axis-text').count();
    const horizontalGridlineCount = await element
      .locator('.axis-grid[data-orientation="horizontal"] .axis-grid-line')
      .count();
    const yLabelCount = await element.locator('.y-axis .y-axis-text').count();
    expect(xTickCount).toBeGreaterThan(20);
    expect(xLabelCount).toBeLessThan(xTickCount);
    expect(horizontalGridlineCount).toBeGreaterThan(20);
    expect(yLabelCount).toBeLessThan(horizontalGridlineCount);

    const expectMarkersInsidePlot = async () => {
      const bounds = await element.locator('.scatter-point').evaluateAll(points => {
        const geometry = points.map(point => ({
          x: Number(point.getAttribute('cx')),
          y: Number(point.getAttribute('cy')),
          radius: Number(point.getAttribute('r')),
        }));
        return {
          left: Math.min(...geometry.map(point => point.x - point.radius)),
          right: Math.max(...geometry.map(point => point.x + point.radius)),
          top: Math.min(...geometry.map(point => point.y - point.radius)),
          bottom: Math.max(...geometry.map(point => point.y + point.radius)),
        };
      });
      expect(bounds.left).toBeGreaterThan(0);
      expect(bounds.right).toBeLessThan(620);
      expect(bounds.top).toBeGreaterThan(0);
      expect(bounds.bottom).toBeLessThan(210);
    };

    await expectMarkersInsidePlot();

    const logarithmicFirstX = Number(await element.locator('.scatter-point').first().getAttribute('cx'));
    await element.evaluate(chart => {
      const scatterChart = chart as HTMLElement & { xScaleType: 'default'; yScaleType: 'default' };
      scatterChart.xScaleType = 'default';
      scatterChart.yScaleType = 'default';
    });
    await expect
      .poll(() => element.locator('.scatter-point').first().getAttribute('cx').then(Number))
      .not.toBeCloseTo(logarithmicFirstX, 5);
    await expectMarkersInsidePlot();
  });

  test('Should reverse x-axis data order in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-scatter-chart data='${JSON.stringify(data)}' width='500' height='300'></fluent-scatter-chart>
      </div>
    `);
    const element = page.locator('fluent-scatter-chart');

    const points = element.locator('.scatter-point');
    expect(Number(await points.first().getAttribute('cx'))).toBeGreaterThan(
      Number(await points.nth(2).getAttribute('cx')),
    );
  });

  test('Should honor logarithmic x and y scales', async ({ page }) => {
    const element = page.locator('fluent-scatter-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & {
        data: ScatterChartSeries[];
        xScaleType: 'log';
        yScaleType: 'log';
      };
      chart.data = [
        {
          legend: 'Log group',
          data: [
            { x: 1, y: 1 },
            { x: 10, y: 10 },
            { x: 100, y: 100 },
          ],
        },
      ];
      chart.xScaleType = 'log';
      chart.yScaleType = 'log';
    });

    await expect(element.locator('.scatter-point')).toHaveCount(3);
    const positions = await element.locator('.scatter-point').evaluateAll(points =>
      points.map(point => ({
        x: Number(point.getAttribute('cx')),
        y: Number(point.getAttribute('cy')),
      })),
    );
    expect(positions[1].x).toBeCloseTo((positions[0].x + positions[2].x) / 2, 5);
    expect(positions[1].y).toBeCloseTo((positions[0].y + positions[2].y) / 2, 5);
  });

  test('Should render shared gridlines and annotations with custom Cartesian margins', async ({ page }) => {
    const element = page.locator('fluent-scatter-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & {
        margins: { top: number; right: number; bottom: number; left: number };
        annotations: Array<{ text: string; coordinates: { type: 'data'; x: number; y: number } }>;
      };
      chart.margins = { top: 30, right: 40, bottom: 50, left: 80 };
      chart.annotations = [{ text: 'Scatter target', coordinates: { type: 'data', x: 3, y: 7 } }];
    });

    expect(await element.locator('.axis-grid-line').count()).toBeGreaterThan(0);
    await expect(element.locator('.annotation-layer')).toHaveAttribute('transform', 'translate(80, 30)');
    await expect(element.locator('.chart-annotation-text')).toHaveText('Scatter target');
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

  test('Should render y-axis labels without an axis line on the right in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-scatter-chart data='${JSON.stringify(data)}' width='500' height='300'></fluent-scatter-chart>
      </div>
    `);
    const element = page.locator('fluent-scatter-chart');
    await expect(element.locator('.y-axis .y-axis-text').first()).toBeVisible();
    await expect(element.locator('.y-axis .axis-domain')).toHaveCSS('display', 'none');
    await expect(element.locator('.y-axis .axis-tick-line').first()).toHaveCSS('display', 'none');
  });
});
