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
