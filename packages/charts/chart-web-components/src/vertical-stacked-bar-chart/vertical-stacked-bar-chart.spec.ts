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

  test('Shared Features should render shared layout, palette, metadata, annotations, and scales', async ({ page }) => {
    await page.goto(fixtureURL('components-verticalstackedbarchart--shared-features'));
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    const bars = element.locator('.bar');

    await expect(bars).toHaveCount(6);
    await expect(bars.first()).toHaveAttribute('width', '28');
    await expect(bars.first()).toHaveAttribute('fill', '#0f6cbd');
    await expect(bars.first()).toHaveAttribute('aria-label', 'North Q1, 35 percent');
    await expect(element.locator('.bar-label').first()).toHaveText('Q1 total');
    await expect(element.locator('.chart-annotation-text')).toHaveText('Combined target');
    const annotation = element.locator('.chart-annotation-text');
    const targetLabel = element.locator('.bar-label', { hasText: '65' }).first();
    await expect
      .poll(async () => (await annotation.boundingBox())!.y + (await annotation.boundingBox())!.height)
      .toBeLessThan((await targetLabel.boundingBox())!.y);
    expect(await annotation.getAttribute('x')).toBe(
      await element.locator('.chart-annotation-connector').getAttribute('x1'),
    );
    await expect(element.locator('.y-axis-secondary')).toHaveCount(1);
    await expect(element.locator('.x-axis-title')).toHaveText('Quarter');
    await expect(element.locator('.y-axis > .y-axis-title')).toHaveText('Performance');
    await expect(element.locator('.y-axis-secondary > .y-axis-title')).toHaveText('Growth index');

    const axisTitlesSwitch = page.locator('#vsbar-shared-axis-titles');
    await axisTitlesSwitch.click();
    await expect(element.locator('.x-axis-title, .y-axis-title')).toHaveCount(0);
    await axisTitlesSwitch.click();
    await expect(element.locator('.x-axis-title')).toHaveText('Quarter');
    await expect(element.locator('.y-axis > .y-axis-title')).toHaveText('Performance');
    await expect(element.locator('.y-axis-secondary > .y-axis-title')).toHaveText('Growth index');

    await bars.first().click();
    await expect(element.locator('.chart-title')).toHaveText('North selected');
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
    await expect(element.locator('.bar')).toHaveCount(1);
    await element.locator('.bar').dispatchEvent('mouseenter');

    await expect(element.locator('.tooltip-header')).toHaveText('2026/04/30');
    await expect(element.locator('.tooltip-primary-value')).toHaveText('40%');
  });

  test('Should show all bar and line values for a stack when stack callouts are enabled', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-vertical-stacked-bar-chart
        data='${JSON.stringify([
          {
            xAxisPoint: 'Jan',
            chartData: [
              { legend: 'Metadata1', data: 40, color: '#637cef' },
              { legend: 'Metadata2', data: 5, color: '#e3008c', yAxisCalloutData: '5%' },
              { legend: 'Metadata3', data: 15, color: '#00b7c3' },
            ],
            lineData: [
              { legend: 'line1', y: 42, color: '#498205' },
              { legend: 'line2', y: 10, color: '#8764b8' },
            ],
          },
        ])}'
        is-callout-for-stack
        width='500'
        height='300'
      ></fluent-vertical-stacked-bar-chart>
    `);

    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.locator('.bar').first().dispatchEvent('mouseenter');

    await expect(element.locator('.tooltip-header')).toHaveText('Jan');
    await expect(element.locator('.tooltip-info')).toHaveCount(5);
    await expect(element.locator('.tooltip-legend-text')).toHaveText([
      'Metadata1',
      'Metadata2',
      'Metadata3',
      'line1',
      'line2',
    ]);
    await expect(element.locator('.tooltip-primary-value')).toHaveText(['40', '5%', '15', '42', '10']);
  });

  test('Should announce custom stack accessibility text for aggregate callouts', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & { data: VerticalStackedBarChartProps[]; isCalloutForStack: boolean };
      chart.data = [
        {
          xAxisPoint: 'Q1',
          chartData: [{ legend: 'A', data: 30 }],
          stackCallOutAccessibilityData: { ariaLabel: 'Q1 custom stack summary' },
        },
      ];
      chart.isCalloutForStack = true;
    });
    await element.locator('.bar').dispatchEvent('mouseenter');
    await expect(element.locator('.live-region')).toHaveText('Q1 custom stack summary');
  });

  test('Should keep per-segment callouts as the default', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.locator('.bar').first().dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-info')).toHaveCount(1);
    await expect(element.locator('.tooltip-legend-text')).toHaveText('A');
  });

  test('Should pass the full stack to a custom stack callout renderer', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & {
        isCalloutForStack: boolean;
        tooltipRenderer: (point: VerticalStackedBarChartProps) => HTMLElement;
      };
      chart.isCalloutForStack = true;
      chart.tooltipRenderer = point => {
        const content = document.createElement('div');
        content.className = 'custom-stack-callout';
        content.textContent = `${point.xAxisPoint}: ${point.chartData.length}`;
        return content;
      };
    });

    await element.locator('.bar').first().dispatchEvent('mouseenter');
    await expect(element.locator('.custom-stack-callout')).toHaveText('Q1: 2');
  });

  test('Should restore the default tooltip when a custom renderer is removed', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & { tooltipRenderer?: () => HTMLElement };
      chart.tooltipRenderer = () => {
        const content = document.createElement('div');
        content.className = 'custom-callout';
        content.textContent = 'Custom content';
        return content;
      };
    });
    await element.locator('.bar').first().dispatchEvent('mouseenter');
    await expect(element.locator('.custom-callout')).toHaveText('Custom content');

    await element.evaluate(node => {
      (
        node as HTMLElement & {
          setTooltipRenderer: (renderer: (() => HTMLElement) | undefined) => void;
        }
      ).setTooltipRenderer(undefined);
    });
    await expect(element.locator('.custom-callout')).toBeHidden();
    await expect(element.locator('.tooltip-legend-text')).toBeVisible();
    await expect(element.locator('.tooltip-legend-text')).toHaveText('A');

    await element.locator('svg').dispatchEvent('mouseleave');
    await element.locator('.bar').first().dispatchEvent('mouseenter');
    await expect(element.locator('.custom-callout')).toBeHidden();
    await expect(element.locator('.tooltip-legend-text')).toBeVisible();
    await expect(element.locator('.tooltip-legend-text')).toHaveText('A');
  });

  test('Should show custom content when a renderer is added to a visible stack tooltip', async ({ page }) => {
    const element = page.locator('fluent-vertical-stacked-bar-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { isCalloutForStack: boolean }).isCalloutForStack = true;
    });
    await element.locator('.bar').first().dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-legend-text')).toHaveText(['A', 'B']);

    await element.evaluate(node => {
      (
        node as HTMLElement & {
          setTooltipRenderer: (renderer: (point: VerticalStackedBarChartProps) => HTMLElement) => void;
        }
      ).setTooltipRenderer(point => {
        const content = document.createElement('div');
        content.className = 'custom-stack-callout';
        content.textContent = `${point.xAxisPoint}: ${point.chartData.length}`;
        return content;
      });
    });

    await expect(element.locator('.tooltip-default-content')).toBeHidden();
    await expect(element.locator('.custom-stack-callout')).toBeVisible();
    await expect(element.locator('.custom-stack-callout')).toHaveText('Q1: 2');
  });

  test('Should switch the Callout story from default stack content to custom stack content', async ({ page }) => {
    await page.goto(fixtureURL('components-verticalstackedbarchart--callout'));
    const element = page.locator('fluent-vertical-stacked-bar-chart');

    await page.locator('fluent-radio[value="MultiCallout"]').click();
    await element.locator('.bar').first().dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-default-content')).toBeVisible();

    await page.locator('fluent-radio[value="MultiCustomCallout"]').click();
    await element.locator('.bar').first().dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-default-content')).toBeHidden();
    await expect(element.locator('.tooltip-custom-content pre')).toBeVisible();
    await expect(element.locator('.tooltip-custom-content pre')).toContainText('"xAxisPoint": "Jan"');
  });

  test('Should match the React Date Axis labels and callout options', async ({ page }) => {
    await page.goto(fixtureURL('components-verticalstackedbarchart--date-axis'));
    const element = page.locator('fluent-vertical-stacked-bar-chart');

    await expect(element.locator('.x-axis .axis-text')).toHaveText([
      '03/01',
      '05/01',
      '07/01',
      '09/01',
      '11/01',
      '02/01',
      '05/01',
      '07/01',
      '09/01',
    ]);
    await expect(element.locator('.y-axis .y-axis-text').first()).toHaveText('0 h');
    await expect(element.locator('.bar-label').first()).toHaveText('2.5 h');
    await expect(element.locator('fluent-chart-legend')).toBeVisible();
    await expect(page.locator('fluent-radio[value="singleCallout"]')).toBeVisible();
    await expect(page.locator('fluent-radio[value="MultiCallout"]')).toHaveAttribute('checked', '');
    await expect(page.locator('fluent-radio-group[name="vsbar-date-axis-callout"]')).toHaveAttribute(
      'orientation',
      'vertical',
    );
    const sliderBounds = await page.locator('#vsbar-date-axis-bar-gap-max').boundingBox();
    const singleRadioBounds = await page.locator('fluent-radio[value="singleCallout"]').boundingBox();
    const stackRadioBounds = await page.locator('fluent-radio[value="MultiCallout"]').boundingBox();
    expect(singleRadioBounds?.y).toBeGreaterThan(sliderBounds?.y ?? Number.POSITIVE_INFINITY);
    expect(stackRadioBounds?.y).toBeGreaterThan(singleRadioBounds?.y ?? Number.POSITIVE_INFINITY);

    await element.locator('.bar').first().dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-info')).toHaveCount(3);
    await page.locator('fluent-radio[value="singleCallout"]').click();
    await element.locator('.bar').first().dispatchEvent('mouseenter');
    await expect(element.locator('.tooltip-info')).toHaveCount(1);
  });

  test('Should use the React Negative story data', async ({ page }) => {
    await page.goto(fixtureURL('components-verticalstackedbarchart--negative'));
    const element = page.locator('fluent-vertical-stacked-bar-chart');

    const storyData = await element.evaluate(node => {
      const chartData = (node as HTMLElement & { data: VerticalStackedBarChartProps[] }).data;
      return {
        xAxisPoints: chartData.map(stack => stack.xAxisPoint),
        segmentValues: chartData.map(stack => stack.chartData.map(point => point.data)),
        yAxisCalloutData: chartData.map(stack => stack.chartData.map(point => point.yAxisCalloutData)),
        xAxisCalloutData: chartData.flatMap(stack => stack.chartData.map(point => point.xAxisCalloutData)),
        lineValues: chartData.map(stack => stack.lineData?.map(point => point.y) ?? []),
      };
    });

    expect(storyData.xAxisPoints).toEqual([0, 20, 40, 60, 80, 100]);
    expect(storyData.segmentValues).toEqual([
      [40, 5, -20, 10, 23, 0.4, -0.5, -0.3, 0.7, 0.1],
      [-30, -20, -40],
      [44, 28, 30],
      [40, 5, -20, 10, 23, 0.4, -0.5, -0.3, 0.7, 0.1],
      [88, 22, 30],
      [40, 5, -20, 10, 23, 0.4, -0.5, -0.3, 0.7, 0.1],
    ]);
    expect(storyData.yAxisCalloutData[0]).toEqual([
      '68%',
      '8.5%',
      '34%',
      '17%',
      '39%',
      '0.7%',
      '0.85%',
      '0.5%',
      '1.2%',
      '0.2%',
    ]);
    expect(new Set(storyData.xAxisCalloutData)).toEqual(new Set(['2020/04/30']));
    expect(storyData.lineValues).toEqual([[42, 10], [33], [60, 20], [41, 10], [100, 70], []]);
    await expect(element.locator('.bar')).toHaveCount(39);
    const negativeBars = element.locator('.bar[data-value^="-"]');
    await expect(negativeBars).toHaveCount(12);
    expect(await negativeBars.evaluateAll(bars => bars.every(bar => Number(bar.getAttribute('height')) > 0))).toBe(
      true,
    );
    expect(await element.locator('.y-axis .y-axis-text').allTextContents()).toEqual(
      expect.arrayContaining([expect.stringMatching(/^-/)]),
    );
    await expect(element.locator('.bar-label')).toContainText(['58.4', '-90', '102', '58.4', '140', '58.4']);
    await expect(element.locator('.x-axis-title')).toHaveText('Number of days');
    await expect(element.locator('.y-axis-title')).toHaveText('Variation of number of sales');
  });

  test('Should render the React secondary y-axis data', async ({ page }) => {
    await page.goto(fixtureURL('components-verticalstackedbarchart--secondary-y-axis'));
    const element = page.locator('fluent-vertical-stacked-bar-chart');

    const lineData = await element.evaluate(node =>
      (node as HTMLElement & { data: VerticalStackedBarChartProps[] }).data.map(stack => stack.lineData),
    );
    expect(lineData).toEqual([
      [{ y: 150, legend: 'Sales Target', color: 'qualitative.9', useSecondaryYScale: true }],
      [{ y: 180, legend: 'Sales Target', color: 'qualitative.9', useSecondaryYScale: true }],
      [{ y: 200, legend: 'Sales Target', color: 'qualitative.9', useSecondaryYScale: true }],
      [{ y: 250, legend: 'Sales Target', color: 'qualitative.9', useSecondaryYScale: true }],
    ]);
    await expect(element.locator('.y-axis-secondary')).toBeVisible();
    await expect(element.locator('.y-axis-secondary .y-axis-text')).not.toHaveCount(0);
    await expect(element.locator('.line-path')).toHaveCount(1);
    await expect(element.locator('fluent-chart-legend')).toContainText('Sales Target');
  });

  test('Should arrange Axis Category Order controls around the chart', async ({ page }) => {
    await page.goto(fixtureURL('components-verticalstackedbarchart--axis-category-order'));

    const sliderRow = page.locator('.axis-category-order-sliders');
    const dropdownRow = page.locator('.axis-category-order-dropdown');
    const actionRow = page.locator('.axis-category-order-actions');
    const chart = page.locator('fluent-vertical-stacked-bar-chart');
    await expect(sliderRow.locator('fluent-slider')).toHaveCount(3);
    await expect(dropdownRow.locator('#vsbar-axis-order-dropdown')).toBeVisible();
    await expect(actionRow).toContainText('Change data');

    const dataSizeSlider = page.locator('#vsbar-axis-order-size');
    const dataSizeMessage = page.locator('fluent-field:has(#vsbar-axis-order-size) fluent-label[slot="message"]');
    await dataSizeSlider.evaluate(slider => {
      (slider as HTMLElement & { value: string }).value = '12';
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(await dataSizeMessage.evaluate(message => message.textContent)).toBe('12');

    const sliderBounds = await sliderRow.boundingBox();
    const dropdownBounds = await dropdownRow.boundingBox();
    const chartBounds = await chart.boundingBox();
    const actionBounds = await actionRow.boundingBox();
    expect(dropdownBounds?.y).toBeGreaterThan(sliderBounds?.y ?? Number.POSITIVE_INFINITY);
    expect(actionBounds?.y).toBeGreaterThanOrEqual(
      (chartBounds?.y ?? Number.POSITIVE_INFINITY) + (chartBounds?.height ?? 0),
    );

    await expect(chart).toHaveAttribute('support-negative-data', '');
    const changeDataButton = actionRow.getByText('Change data');
    for (let attempt = 0; attempt < 10; attempt++) {
      const hasNegativeValue = await chart.evaluate(node =>
        (node as HTMLElement & { data: VerticalStackedBarChartProps[] }).data.some(stack =>
          stack.chartData.some(point => point.data < 0),
        ),
      );
      if (hasNegativeValue) {
        break;
      }
      await changeDataButton.click();
    }
    const negativeBars = chart.locator('.bar[data-value^="-"]');
    await expect(negativeBars).not.toHaveCount(0);
    expect(await negativeBars.evaluateAll(bars => bars.every(bar => Number(bar.getAttribute('height')) > 0))).toBe(
      true,
    );
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
