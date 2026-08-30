import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { VerticalStackedBarChartProps } from './vertical-stacked-bar-chart.options.js';

const data: VerticalStackedBarChartProps[] = [
  {
    xAxisPoint: 'Q1',
    chartData: [
      { legend: 'A', data: 30, color: '#637cef' },
      { legend: 'B', data: 20 },
    ],
  },
  {
    xAxisPoint: 'Q2',
    chartData: [
      { legend: 'A', data: 40 },
      { legend: 'B', data: 35 },
    ],
  },
];

test.describe('VerticalStackedBarChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-verticalstackedbarchart--basic'));
    await page.setContent(/* html */ `
      <fluent-vertical-stacked-bar-chart data='${JSON.stringify(
        data,
      )}' width='600' height='350'></fluent-vertical-stacked-bar-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-vertical-stacked-bar-chart'));
  });

  test('Should render bars', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await expect(element.locator('.bar')).toHaveCount(4);
  });

  test('Should use axis callout data to override segment tooltip values', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-stacked-bar-chart
        data='${JSON.stringify([
          {
            xAxisPoint: 0,
            chartData: [
              {
                legend: 'Metadata1',
                data: 40,
                xAxisCalloutData: '2026/04/30',
                yAxisCalloutData: '40%',
              },
            ],
          },
        ])}'
        width='500'
        height='300'
      ></fluent-vertical-stacked-bar-chart>
    `);

    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.locator('.bar').dispatchEvent('mouseenter');

    await expect(element.locator('.tooltip-header')).toHaveText('2026/04/30');
    await expect(element.locator('.tooltip-primary-value')).toHaveText('40%');
  });

  test('Should format date callout data using the configured culture', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-stacked-bar-chart culture='de-DE' width='500' height='300'></fluent-vertical-stacked-bar-chart>
    `);

    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: VerticalStackedBarChartProps[] }).data = [
        {
          xAxisPoint: 0,
          chartData: [
            { legend: 'Metadata1', data: 40, xAxisCalloutData: new Date(2026, 3, 30), yAxisCalloutData: '40%' },
          ],
        },
      ];
    });
    await expect(element.locator('.bar')).toHaveCount(1);
    await element.locator('.bar').dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-header')).toHaveText('30.04.2026');

    const browserDefaultDate = await page.evaluate(() =>
      new Intl.DateTimeFormat(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(
        new Date(2026, 3, 30),
      ),
    );
    await element.evaluate(node => node.removeAttribute('culture'));
    await expect(element.locator('.bar')).toHaveCount(1);
    await element.locator('.bar').dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-header')).toHaveText(browserDefaultDate);
  });

  test('Should render horizontal grid lines behind data marks', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await expect(element.locator('.axis-grid-line')).toHaveCount(5);

    const gridRendersBehindBars = await element.evaluate(node => {
      const grid = node.shadowRoot?.querySelector('.axis-grid');
      const firstBar = node.shadowRoot?.querySelector('.bar');
      return Boolean(grid && firstBar && grid.compareDocumentPosition(firstBar) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(gridRendersBehindBars).toBe(true);
  });

  test('Should render gradient fills when enable-gradient is set', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');

    await element.evaluate(node => {
      node.setAttribute('enable-gradient', '');
    });

    await expect(element.locator('linearGradient')).toHaveCount(4);
    await expect(element.locator('.bar').first()).toHaveAttribute('fill', /^url\(#vsbc-gradient-0-0\)$/);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    const legendCount = await element.locator('.legend-text').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: VerticalStackedBarChartProps[] }).data = [
        { xAxisPoint: 'Q3', chartData: [{ legend: 'A', data: 12 }] },
      ];
    });
    await expect(element.locator('.bar')).toHaveCount(1);
  });

  test('Should honor width updates from attribute', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');

    await element.evaluate(node => {
      node.setAttribute('width', '420');
    });

    await expect(element.locator('svg')).toHaveAttribute('width', '420');
  });

  test('Should increase the gap between stacked segments when bar-gap-max is set', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');

    const getFirstStackSegmentGap = async (): Promise<number> => {
      return element.evaluate(node => {
        // First two bars belong to the first stack (Q1): segment A (bottom), then B (above it).
        const [first, second] = Array.from(node.shadowRoot!.querySelectorAll('.bar')) as SVGRectElement[];
        const firstTop = Number(first.getAttribute('y'));
        const secondBottom = Number(second.getAttribute('y')) + Number(second.getAttribute('height'));
        return firstTop - secondBottom;
      });
    };

    const defaultGap = await getFirstStackSegmentGap();

    await element.evaluate(node => {
      node.setAttribute('bar-gap-max', '20');
    });

    await page.waitForFunction(previousGap => {
      const node = document.querySelector('fluent-vertical-stacked-bar-chart');
      const bars = Array.from(node?.shadowRoot?.querySelectorAll('.bar') ?? []) as SVGRectElement[];
      if (bars.length < 2) {
        return false;
      }
      const [first, second] = bars;
      const firstTop = Number(first.getAttribute('y'));
      const secondBottom = Number(second.getAttribute('y')) + Number(second.getAttribute('height'));
      return firstTop - secondBottom > previousGap;
    }, defaultGap);

    const widenedGap = await getFirstStackSegmentGap();
    expect(widenedGap).toBeGreaterThan(defaultGap);
  });

  test('Should render primary y-axis on right in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-vertical-stacked-bar-chart data='${JSON.stringify(
          data,
        )}' width='600' height='350'></fluent-vertical-stacked-bar-chart>
      </div>
    `);
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await expect(element.locator('.y-axis .axis-tick-line').first()).toHaveAttribute('x2', '6');
  });
});
