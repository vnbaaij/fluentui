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

  test('Should reverse group and series order in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-grouped-vertical-bar-chart data='${JSON.stringify(
          data,
        )}' width='600' height='300'></fluent-grouped-vertical-bar-chart>
      </div>
    `);
    const element = page.locator('fluent-grouped-vertical-bar-chart');

    const bars = element.locator('.bar');
    const xPositions = await bars.evaluateAll((elements: SVGRectElement[]) =>
      elements.map(element => Number(element.getAttribute('x'))),
    );
    expect(xPositions[0]).toBeGreaterThan(xPositions[1]);
    expect(xPositions[0]).toBeGreaterThan(xPositions[2]);
  });

  test('Line story should match the React mixed bar and line example', async ({ page }) => {
    await page.goto(fixtureURL('components-groupedverticalbarchart--line'));
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    const bars = element.locator('.bar');

    await expect(bars).toHaveCount(16);
    await expect(element.locator('.line-path')).toHaveCount(2);
    await expect(element.locator('.line-border')).toHaveCount(2);
    await expect(element.locator('.legend-text')).toHaveText([
      'From_Legacy_to_O365',
      'All',
      '2022',
      '2023',
      '2024',
      '2021',
    ]);

    const [firstBarX, lastBarEdge] = await bars.evaluateAll((elements: SVGRectElement[]) => {
      const positions = elements.map(element => ({
        x: Number(element.getAttribute('x')),
        width: Number(element.getAttribute('width')),
      }));
      return [Math.min(...positions.map(position => position.x)), Math.max(...positions.map(p => p.x + p.width))];
    });
    expect(firstBarX).toBeGreaterThan(100);
    expect(firstBarX).toBeCloseTo(620 - lastBarEdge, 5);

    const positiveBarY = Number(await bars.nth(0).getAttribute('y'));
    const negativeBarY = Number(await bars.nth(1).getAttribute('y'));
    expect(negativeBarY).toBeGreaterThan(positiveBarY);

    await page.locator('fluent-radio[value="stack"]').click();
    await bars.first().dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-info')).toHaveCount(6);
  });

  test('Secondary Y Axis story should scale its second bar series independently', async ({ page }) => {
    await page.goto(fixtureURL('components-groupedverticalbarchart--secondary-y-axis'));
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    const bars = element.locator('.bar');

    await expect(bars).toHaveCount(8);
    await expect(element.locator('.y-axis-secondary')).toHaveCount(1);
    await expect(element.locator('.legend-text')).toHaveText(['2021', '2022']);

    const heights = await bars.evaluateAll((elements: SVGRectElement[]) =>
      elements.map(element => Number(element.getAttribute('height'))),
    );
    expect(heights[0]).toBeGreaterThan(heights[2]);
    expect(heights[5]).toBeGreaterThan(heights[1]);
  });

  test('Additional feature stories should reuse the Basic story data', async ({ page }) => {
    const storyIds = ['tooltip-renderer', 'culture', 'title-align', 'title-and-legend-positions', 'rtl'];

    for (const storyId of storyIds) {
      await page.goto(fixtureURL(`components-groupedverticalbarchart--${storyId}`));
      await expect(page.locator('fluent-grouped-vertical-bar-chart .bar')).toHaveCount(16);
    }

    await expect(page.locator('[dir="rtl"]')).toHaveCount(1);
  });

  test('Shared Features should render grouped lines, metadata, layout, annotations, and scales', async ({ page }) => {
    await page.goto(fixtureURL('components-groupedverticalbarchart--shared-features'));
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    const bars = element.locator('.bar');

    await expect(bars).toHaveCount(6);
    await expect(bars.first()).toHaveAttribute('width', '24');
    await expect(bars.first()).toHaveAttribute('fill', '#0f6cbd');
    await expect(bars.first()).toHaveAttribute('aria-label', 'North Q1, 42 percent');
    await expect(element.locator('.bar-label').first()).toHaveText('42%');
    await expect(element.locator('.line-path')).toHaveCount(2);
    await expect(element.locator('.line-marker')).toHaveCount(6);
    await expect(element.locator('.y-axis-secondary')).toHaveCount(1);
    const annotation = element.locator('.chart-annotation-text');
    await expect(annotation).toHaveText('Peak quarter');
    await expect(annotation).toHaveAttribute('font-size', '10px');
    await expect(annotation).toHaveAttribute('font-weight', '600');
    const peakBarLabel = element.locator('.bar-label', { hasText: '70' });
    await expect
      .poll(async () => (await annotation.boundingBox())!.y + (await annotation.boundingBox())!.height)
      .toBeLessThan((await peakBarLabel.boundingBox())!.y);
    expect(await annotation.getAttribute('x')).toBe(
      await element.locator('.chart-annotation-connector').getAttribute('x1'),
    );
    await expect(element.locator('.y-axis-secondary .y-axis-text')).toHaveText(['10', '100', '1K']);
    await expect(element.locator('.x-axis-title')).toHaveText('Quarter');
    await expect(element.locator('.y-axis > .y-axis-title')).toHaveText('Performance');
    await expect(element.locator('.y-axis-secondary > .y-axis-title')).toHaveText('Growth index');
    await expect(element.locator('.legend-text')).toHaveText(['Growth', 'Forecast', 'North', 'South']);

    const axisTitlesSwitch = page.locator('#gvbar-shared-axis-titles');
    await axisTitlesSwitch.click();
    await expect(element.locator('.x-axis-title, .y-axis-title')).toHaveCount(0);
    await axisTitlesSwitch.click();
    await expect(element.locator('.x-axis-title')).toHaveText('Quarter');
    await expect(element.locator('.y-axis > .y-axis-title')).toHaveText('Performance');
    await expect(element.locator('.y-axis-secondary > .y-axis-title')).toHaveText('Growth index');

    await bars.first().dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-header')).toHaveText('First quarter');
    await expect(element.locator('.tooltip-info')).toHaveCount(4);

    await bars.first().click();
    await expect(element.locator('.chart-title')).toHaveText('North selected');
  });

  test('Should announce custom group accessibility text for aggregate callouts', async ({ page }) => {
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & { data: GroupedVerticalBarChartData[]; isCalloutForStack: boolean };
      chart.data = [
        {
          xAxisPoint: 'Jan',
          series: [{ key: 'Alpha', data: 30 }],
          stackCallOutAccessibilityData: { ariaLabel: 'January custom group summary' },
        },
      ];
      chart.isCalloutForStack = true;
    });
    await expect(element.locator('.bar')).toHaveCount(1);
    await element.locator('.bar').dispatchEvent('mouseenter');
    await expect(element.locator('.live-region')).toHaveText('January custom group summary');
  });

  test('Should match React spacing between bars within a group', async ({ page }) => {
    const bars = page.locator('fluent-grouped-vertical-bar-chart .bar');
    const firstBar = bars.nth(0);
    const secondBar = bars.nth(1);

    await expect(firstBar).toHaveAttribute('width', '16');
    await expect(secondBar).toHaveAttribute('width', '16');

    const gap = await Promise.all([
      firstBar.getAttribute('x'),
      firstBar.getAttribute('width'),
      secondBar.getAttribute('x'),
    ]).then(([firstX, firstWidth, secondX]) => Number(secondX) - Number(firstX) - Number(firstWidth));
    expect(gap).toBeCloseTo(16 / 9, 5);
  });

  test('Should support tab and arrow-key navigation through bars', async ({ page }) => {
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    const bars = element.locator('.bar');

    await expect(bars.first()).toHaveAttribute('tabindex', '0');
    await expect(bars.nth(1)).toHaveAttribute('tabindex', '-1');
    await expect(bars.first()).toHaveAttribute('role', 'img');
    await expect(bars.first()).toHaveAttribute('aria-label', 'Jan. Alpha, 30.');

    await page.keyboard.press('Tab');
    await expect(bars.first()).toBeFocused();
    await expect(element.locator('.tooltip')).toBeVisible();

    await page.keyboard.press('ArrowRight');
    await expect(bars.nth(1)).toBeFocused();
    await expect(bars.first()).toHaveAttribute('tabindex', '-1');
    await expect(bars.nth(1)).toHaveAttribute('tabindex', '0');

    await page.keyboard.press('ArrowLeft');
    await expect(bars.first()).toBeFocused();
    await expect(bars.first()).toHaveAttribute('tabindex', '0');
    await expect(bars.nth(1)).toHaveAttribute('tabindex', '-1');
  });

  test('Should render horizontal grid lines behind grouped bars', async ({ page }) => {
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    const gridLines = element.locator('.axis-grid-line');

    await expect(gridLines).toHaveCount(5);
    await expect(element.locator('.axis-grid')).toHaveAttribute('data-orientation', 'horizontal');

    const gridGeometry = await gridLines.first().evaluate(line => ({
      x1: line.getAttribute('x1'),
      x2: Number(line.getAttribute('x2')),
      y1: line.getAttribute('y1'),
      y2: line.getAttribute('y2'),
    }));
    expect(gridGeometry.x1).toBe('0');
    expect(gridGeometry.x2).toBeGreaterThan(0);
    expect(gridGeometry.y1).toBe(gridGeometry.y2);

    const gridRendersBehindBars = await element.evaluate(node => {
      const grid = node.shadowRoot?.querySelector('.axis-grid');
      const firstBar = node.shadowRoot?.querySelector('.bar');
      return Boolean(grid && firstBar && grid.compareDocumentPosition(firstBar) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(gridRendersBehindBars).toBe(true);
  });

  test('Should use explicit y-axis tick values for grid lines', async ({ page }) => {
    const element = page.locator('fluent-grouped-vertical-bar-chart');
    await element.evaluate(node => node.setAttribute('y-axis-tick-values', '[0,30,60]'));

    await expect(element.locator('.axis-grid-line')).toHaveCount(3);
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

  test('Standard Attributes should show labels, round bars, and support multiple legend selection', async ({
    page,
  }) => {
    await page.goto(fixtureURL('components-groupedverticalbarchart--standard-attributes'));
    await page.waitForFunction(() => customElements.whenDefined('fluent-grouped-vertical-bar-chart'));

    const element = page.locator('fluent-grouped-vertical-bar-chart');
    await expect(element.locator('.bar-label')).toHaveCount(16);
    await expect(element.locator('.bar-label').first()).toHaveText('24K');
    await expect(element.locator('.bar-label').first()).toHaveCSS('font-size', '10px');
    await expect(element.locator('.bar-label').first()).toHaveCSS('font-weight', '600');

    await page.locator('#gvbar-sa-round-corners').click();
    await expect(element.locator('.bar').first()).toHaveAttribute('rx', '3');
    await expect(element.locator('.bar').first()).toHaveAttribute('ry', '3');

    await page.locator('#gvbar-sa-multi-select').click();
    const legends = element.locator('.legend');
    await legends.nth(0).click();
    await legends.nth(1).click();

    await expect(element.locator('.bar[data-legend="2021"]').first()).toHaveAttribute('opacity', '1');
    await expect(element.locator('.bar[data-legend="2022"]').first()).toHaveAttribute('opacity', '1');
    await expect(element.locator('.bar[data-legend="2023"]').first()).toHaveAttribute('opacity', '0.1');
    await expect(element.locator('.bar-label[data-legend="2023"]').first()).toHaveAttribute('opacity', '0.1');
  });

  test('Chart Attributes should support a single color and gradients', async ({ page }) => {
    await page.goto(fixtureURL('components-groupedverticalbarchart--chart-attributes'));
    await page.waitForFunction(() => customElements.whenDefined('fluent-grouped-vertical-bar-chart'));

    const element = page.locator('fluent-grouped-vertical-bar-chart');
    const bars = element.locator('.bar');
    await expect(bars).toHaveCount(16);
    const originalFills = await bars.evaluateAll(items => items.slice(0, 4).map(item => item.getAttribute('fill')));
    expect(new Set(originalFills).size).toBe(4);

    await page.locator('#gvbar-chart-attributes-single-color').click();
    await expect(element).toHaveAttribute('use-single-color', '');
    await expect
      .poll(() => bars.evaluateAll(items => new Set(items.map(item => item.getAttribute('fill'))).size))
      .toBe(1);

    await page.locator('#gvbar-chart-attributes-gradient').click();
    await expect(element).toHaveAttribute('enable-gradient', '');
    await expect(element.locator('linearGradient')).toHaveCount(16);
    await expect(bars.first()).toHaveAttribute('fill', 'url(#gvbc-gradient-0)');
    await expect(element.locator('linearGradient').first()).toHaveAttribute('x1', '0%');
    await expect(element.locator('linearGradient').first()).toHaveAttribute('x2', '0%');
    await expect(element.locator('linearGradient').first()).toHaveAttribute('y1', '100%');
    await expect(element.locator('linearGradient').first()).toHaveAttribute('y2', '0%');

    await page.locator('#gvbar-chart-attributes-group-callout').click();
    await expect(element).toHaveAttribute('is-callout-for-stack', '');
    await bars.first().dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-header')).toHaveText('Jan - Mar');
    await expect(element.locator('.tooltip-info')).toHaveCount(4);
    await expect(element.locator('.tooltip-legend-text')).toHaveText(['2021', '2022', '2023', '2024']);
  });
});
