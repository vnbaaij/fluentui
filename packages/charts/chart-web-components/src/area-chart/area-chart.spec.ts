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

const singleSeriesData: AreaChartSeries[] = [
  {
    legend: 'Single Series',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
      { x: 2, y: 15 },
    ],
  },
];

const localeFormattingData: AreaChartSeries[] = [
  {
    legend: 'Series A',
    data: [
      {
        x: 1,
        y: 1234.5,
      },
    ],
  },
];

const positiveAxisData: AreaChartSeries[] = [
  {
    legend: 'Positive',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
      { x: 2, y: 12 },
    ],
  },
];

const allNegativeData: AreaChartSeries[] = [
  {
    legend: 'Negative',
    data: [
      { x: 0, y: -12 },
      { x: 1, y: -30 },
      { x: 2, y: -18 },
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

  test('Should render gradient defs and gradient fills when enable-gradient is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-area-chart data='${JSON.stringify(data)}' width='600' height='300' enable-gradient></fluent-area-chart>
    `);

    const element = page.locator('fluent-area-chart');
    await expect(element.locator('linearGradient[id^="area-gradient-"]')).toHaveCount(2);
    await expect(element.locator('.area-path').first()).toHaveAttribute('fill', 'url(#area-gradient-0)');
    await expect(element.locator('.area-path').nth(1)).toHaveAttribute('fill', 'url(#area-gradient-1)');
  });

  test('Should keep single-series area line emphasized by default', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-area-chart data='${JSON.stringify(singleSeriesData)}' width='600' height='300'></fluent-area-chart>
    `);

    const line = page.locator('fluent-area-chart').locator('.area-line').first();
    await expect(line).not.toHaveClass(/multi-series/);
  });

  test('Should de-emphasize multi-series area lines by class', async ({ page }) => {
    const line = page.locator('fluent-area-chart').locator('.area-line').first();
    await expect(line).toHaveClass(/multi-series/);
  });

  test('Should render horizontal grid lines for y-axis ticks', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    const gridLines = element.locator('.y-axis-grid-line');

    await expect(gridLines).toHaveCount(5);

    const firstGridLineWidth = await gridLines.first().evaluate(line => {
      const x1 = Number(line.getAttribute('x1') ?? '0');
      const x2 = Number(line.getAttribute('x2') ?? '0');
      return Math.abs(x2 - x1);
    });

    expect(firstGridLineWidth).toBeGreaterThan(100);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should default legend boxes to square corners', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);
  });

  test('Should round legend boxes when round-corners is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-area-chart data='${JSON.stringify(data)}' width='600' height='300' round-corners></fluent-area-chart>
    `);
    const element = page.locator('fluent-area-chart');
    await expect(element.locator('.legend-rect.rounded')).toHaveCount(2);
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

  test('Should include zero in y-axis tick labels for all-negative data', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-area-chart data='${JSON.stringify(
        allNegativeData,
      )}' width='600' height='300' y-axis-title='Value'></fluent-area-chart>
    `);

    const yTickLocator = page.locator('fluent-area-chart').locator('.y-axis .y-axis-text');
    await expect(yTickLocator).toHaveCount(5);
    const yTicks = await yTickLocator.allTextContents();

    expect(yTicks.some(t => t.trim() === '0')).toBe(true);
    expect(yTicks.some(t => t.trim().startsWith('-') || t.trim().startsWith('−'))).toBe(true);
  });

  test('Should reduce y-axis title offset when negative tick labels are present', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-area-chart data='${JSON.stringify(
        positiveAxisData,
      )}' width='600' height='300' y-axis-title='Value'></fluent-area-chart>
    `);

    const element = page.locator('fluent-area-chart');
    const positiveTitleY = await element
      .locator('.y-axis .y-axis-title')
      .evaluate(title => Number(title.getAttribute('y') ?? '0'));

    await page.setContent(/* html */ `
      <fluent-area-chart data='${JSON.stringify(
        allNegativeData,
      )}' width='600' height='300' y-axis-title='Value'></fluent-area-chart>
    `);

    const negativeTitleY = await page
      .locator('fluent-area-chart')
      .locator('.y-axis .y-axis-title')
      .evaluate(title => Number(title.getAttribute('y') ?? '0'));

    // Negative labels reduce the extra title gap, so the rotated title should be less offset.
    expect(negativeTitleY).toBeGreaterThan(positiveTitleY);
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

  test('Should render secondary y-axis on right in LTR', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-area-chart data='${JSON.stringify(dataWithSecondaryYAxis)}' width='600' height='300'></fluent-area-chart>
    `);
    const element = page.locator('fluent-area-chart');
    await expect(element.locator('.y-axis-secondary .axis-tick-line').first()).toHaveAttribute('x2', '6');
  });

  test('Should support custom tooltip renderer output', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-area-chart id='chart' data='${JSON.stringify(data)}' width='600' height='300'></fluent-area-chart>
    `);

    await page.evaluate(() => {
      const chart = document.querySelector('fluent-area-chart') as
        | (HTMLElement & {
            tooltipRenderer?: (point: unknown, defaultRender: (point: unknown) => string) => HTMLElement;
          })
        | null;

      if (!chart) {
        return;
      }

      chart.tooltipRenderer = (point, defaultRender) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-tooltip';
        wrapper.innerHTML = `<div class='custom-header'>Custom renderer</div>${defaultRender(point)}`;
        return wrapper;
      };
    });

    const firstPoint = page.locator('fluent-area-chart').locator('.data-point-focus-target').first();
    await firstPoint.focus();

    const customTooltip = page.locator('fluent-area-chart').locator('.custom-tooltip');
    await expect(customTooltip).toBeVisible();
    await expect(customTooltip).toContainText('Custom renderer');
    await expect(customTooltip).toContainText('Series A');
  });

  test('Should keep multi-series hover tooltip rows aligned to visual stack order', async ({ page }) => {
    const element = page.locator('fluent-area-chart');

    await page.evaluate(() => {
      const chart = document.querySelector('fluent-area-chart');
      const root = chart?.shadowRoot;
      const overlay = root?.querySelector<SVGRectElement>('rect[fill-opacity="0"]');
      const point = Array.from(root?.querySelectorAll<SVGCircleElement>('.data-point-focus-target') ?? []).find(p =>
        (p.getAttribute('aria-label') ?? '').startsWith('1,'),
      );

      if (!overlay || !point) {
        return;
      }

      const pointRect = point.getBoundingClientRect();
      overlay.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          clientX: pointRect.left + pointRect.width / 2,
          clientY: pointRect.top + pointRect.height / 2,
        }),
      );
    });

    await expect(element.locator('.tooltip')).toBeVisible();
    const tooltipLegendRows = element.locator('.tooltip .tooltip-legend-text');
    await expect(tooltipLegendRows.first()).toHaveText('Series B');
    await expect(tooltipLegendRows.nth(1)).toHaveText('Series A');
  });

  test('Should announce focused datapoint details in the live region', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    const point = element.locator('.data-point-focus-target').first();

    await point.focus();

    const liveRegion = element.locator('.live-region');
    await expect(liveRegion).toContainText('Series A');
    await expect(liveRegion).toContainText('10');
  });

  test('Should format tooltip values using culture-specific formatting', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-area-chart data='${JSON.stringify(
        localeFormattingData,
      )}' width='600' height='300' culture='en-US'></fluent-area-chart>
    `);

    const element = page.locator('fluent-area-chart');
    const firstPoint = element.locator('.data-point-focus-target').first();
    await firstPoint.focus();

    const enValue = (await firstPoint.getAttribute('aria-label')) ?? '';
    expect(enValue).toContain('1,234.5');

    await page.evaluate(() => {
      const chart = document.querySelector('fluent-area-chart');
      chart?.setAttribute('culture', 'de-DE');
    });

    await page.waitForFunction(() => {
      const chart = document.querySelector('fluent-area-chart');
      const point = chart?.shadowRoot?.querySelector<SVGCircleElement>('.data-point-focus-target');
      return (point?.getAttribute('aria-label') ?? '').includes('1.234,5');
    });

    const deValue = (await element.locator('.data-point-focus-target').first().getAttribute('aria-label')) ?? '';
    expect(deValue).toContain('1.234,5');
    expect(deValue).not.toEqual(enValue);
  });

  test('Should update chart layout when legend/title position attributes and title-align are changed', async ({
    page,
  }) => {
    await page.setContent(/* html */ `
      <fluent-area-chart
        data='${JSON.stringify(data)}'
        width='600'
        height='300'
        chart-title='Positioned chart'>
      </fluent-area-chart>
    `);

    const element = page.locator('fluent-area-chart');

    const initialLayout = await element.evaluate(node => getComputedStyle(node).gridTemplateAreas.replaceAll('"', ''));
    expect(initialLayout).toContain('title');
    expect(initialLayout).toContain('chart');
    expect(initialLayout).toContain('legend');

    await element.evaluate(node => {
      node.setAttribute('legend-position', 'start');
      node.setAttribute('title-position', 'bottom');
      node.setAttribute('title-align', 'end');
    });

    const updatedLayout = await element.evaluate(node => getComputedStyle(node).gridTemplateAreas.replaceAll('"', ''));
    expect(updatedLayout).toContain('legend chart');
    expect(updatedLayout).toContain('title title');

    const titleAlign = await element.locator('.chart-title').evaluate(title => getComputedStyle(title).textAlign);
    expect(titleAlign === 'end' || titleAlign === 'right').toBe(true);
  });

  test('Should move focus between datapoints with ArrowRight and show the focused datapoint tooltip', async ({
    page,
  }) => {
    const element = page.locator('fluent-area-chart');
    const points = element.locator('.data-point-focus-target');

    await expect(points).toHaveCount(6);
    await expect(points.first()).toHaveAttribute('tabindex', '0');
    await expect(points.nth(1)).toHaveAttribute('tabindex', '-1');

    await points.first().focus();
    await expect(element.locator('.tooltip')).toBeVisible();

    await points.first().press('ArrowRight');

    await expect(points.first()).toHaveAttribute('tabindex', '-1');
    await expect(points.nth(1)).toHaveAttribute('tabindex', '0');
    await expect(element.locator('.tooltip')).toBeVisible();
  });

  test('Should move focus between datapoints with ArrowDown and ArrowUp', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    const points = element.locator('.data-point-focus-target');

    await expect(points).toHaveCount(6);

    const xGroup = await points.evaluateAll(elements => {
      return elements
        .map((point, index) => ({
          index,
          cy: Number(point.getAttribute('cy') ?? '0'),
          label: point.getAttribute('aria-label') ?? '',
        }))
        .filter(point => point.label.startsWith('1,'))
        .sort((left, right) => left.cy - right.cy);
    });

    const bottomPoint = points.nth(xGroup[xGroup.length - 1].index);
    const pointAboveBottom = points.nth(xGroup[xGroup.length - 2].index);

    await bottomPoint.focus();
    await bottomPoint.press('ArrowUp');

    await expect(bottomPoint).toHaveAttribute('tabindex', '-1');
    await expect(pointAboveBottom).toHaveAttribute('tabindex', '0');

    await pointAboveBottom.press('ArrowDown');

    await expect(bottomPoint).toHaveAttribute('tabindex', '0');
    await expect(pointAboveBottom).toHaveAttribute('tabindex', '-1');
    await expect(element.locator('.tooltip')).toBeVisible();
  });

  test('Should wrap datapoint roving navigation at the ends of the list', async ({ page }) => {
    const element = page.locator('fluent-area-chart');
    const points = element.locator('.data-point-focus-target');

    await expect(points).toHaveCount(6);

    const xGroup = await points.evaluateAll(elements => {
      return elements
        .map((point, index) => ({
          index,
          cy: Number(point.getAttribute('cy') ?? '0'),
          label: point.getAttribute('aria-label') ?? '',
        }))
        .filter(point => point.label.startsWith('1,'))
        .sort((left, right) => left.cy - right.cy);
    });

    const topPoint = points.nth(xGroup[0].index);
    const bottomPoint = points.nth(xGroup[xGroup.length - 1].index);

    await topPoint.focus();
    await topPoint.press('ArrowUp');

    await expect(topPoint).toHaveAttribute('tabindex', '-1');
    await expect(bottomPoint).toHaveAttribute('tabindex', '0');

    await bottomPoint.press('ArrowDown');

    await expect(topPoint).toHaveAttribute('tabindex', '0');
    await expect(bottomPoint).toHaveAttribute('tabindex', '-1');
  });
});
