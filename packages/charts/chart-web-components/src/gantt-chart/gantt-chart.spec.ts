import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { GanttChartDataPoint } from './gantt-chart.options.js';

// Colors resolved from DataVizPalette tokens (light theme)
const color1 = '#637cef'; // DataVizPalette.color1 ('qualitative.1')
const color2 = '#e3008c'; // DataVizPalette.color2 ('qualitative.2')
const successColor = '#107c10'; // DataVizPalette.success ('semantic.success')
const warningColor = '#f7630c'; // DataVizPalette.warning ('semantic.warning')
const errorColor = '#c50f1f'; // DataVizPalette.error ('semantic.error')

const basicData: GanttChartDataPoint[] = [
  { x: { start: 0, end: 10 }, y: 'Task A', legend: 'Team Alpha', color: color1 },
  { x: { start: 5, end: 20 }, y: 'Task B', legend: 'Team Alpha', color: color1 },
  { x: { start: 12, end: 30 }, y: 'Task C', legend: 'Team Beta', color: color2 },
];

const groupedData: GanttChartDataPoint[] = [
  { x: { start: 0, end: 5 }, y: 'Job-1', legend: 'Complete', color: successColor },
  { x: { start: 6, end: 12 }, y: 'Job-2', legend: 'Incomplete', color: warningColor },
  { x: { start: 13, end: 20 }, y: 'Job-3', legend: 'Not Started', color: errorColor },
];

const ganttTitle = 'Gantt chart basic';

test.describe('GanttChart - Basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="${ganttTitle}"
          data='${JSON.stringify(basicData)}'
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
  });

  test('Should render chart title', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    await expect(element.locator('.chart-title')).toHaveText(ganttTitle);
  });

  test('Should render correct number of bars', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    const bars = element.locator('.bar');
    await expect(bars).toHaveCount(basicData.length);
  });

  test('Should render bars with correct fill colors', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('fill', color1);
    await expect(bars.nth(1)).toHaveAttribute('fill', color1);
    await expect(bars.nth(2)).toHaveAttribute('fill', color2);
  });

  test('Should render first bar with tabindex 0 and the rest with -1', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('tabindex', '0');
    await expect(bars.nth(1)).toHaveAttribute('tabindex', '-1');
    await expect(bars.nth(2)).toHaveAttribute('tabindex', '-1');
  });

  test('Should render bars with role img', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('role', 'img');
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    const legends = element.locator('.legend-text');
    await expect(legends.nth(0).getByText('Team Alpha')).toBeVisible();
    await expect(legends.nth(1).getByText('Team Beta')).toBeVisible();
  });

  test('Should hide legends when hide-legends is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="${ganttTitle}"
          data='${JSON.stringify(basicData)}'
          hide-legends
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const element = page.locator('fluent-gantt-chart');
    await expect(element.locator('fluent-chart-legend')).toBeHidden();
  });
});

test.describe('GanttChart - Grouped', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--grouped'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Grouped gantt"
          data='${JSON.stringify(groupedData)}'
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
  });

  test('Should render correct number of bars', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    const bars = element.locator('.bar');
    await expect(bars).toHaveCount(groupedData.length);
  });

  test('Should render bars with correct fill colors', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('fill', successColor);
    await expect(bars.nth(1)).toHaveAttribute('fill', warningColor);
    await expect(bars.nth(2)).toHaveAttribute('fill', errorColor);
  });

  test('Should render legend items for each group', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    const legends = element.locator('.legend-text');
    await expect(legends.nth(0).getByText('Complete')).toBeVisible();
    await expect(legends.nth(1).getByText('Incomplete')).toBeVisible();
    await expect(legends.nth(2).getByText('Not Started')).toBeVisible();
  });
});

test.describe('GanttChart - Legend interaction', () => {
  test('Should dim inactive bars when a legend is hovered', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          data='${JSON.stringify(basicData)}'
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));

    const element = page.locator('fluent-gantt-chart');
    const firstLegend = element.locator('.legend-text').nth(0);
    await firstLegend.hover();

    const bars = element.locator('.bar');
    // 'Team Alpha' bars (indices 0 and 1) should remain active
    await expect(bars.nth(0)).toHaveAttribute('opacity', '1');
    await expect(bars.nth(1)).toHaveAttribute('opacity', '1');
    // 'Team Beta' bar (index 2) should be dimmed
    await expect(bars.nth(2)).toHaveAttribute('opacity', '0.1');
  });

  test('Should restore bar opacity when mouse leaves a legend item', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          data='${JSON.stringify(basicData)}'
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));

    const element = page.locator('fluent-gantt-chart');
    const firstLegend = element.locator('.legend-text').nth(0);
    await firstLegend.hover();
    // Move mouse away from legend
    await page.mouse.move(0, 0);

    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('opacity', '1');
    await expect(bars.nth(2)).toHaveAttribute('opacity', '1');
  });
});

// ── title-align ───────────────────────────────────────────────────────────────

test.describe('GanttChart - title-align', () => {
  async function setupWithTitle(page: import('@playwright/test').Page, extraAttrs = '') {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="${ganttTitle}"
          ${extraAttrs}
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
  }

  test('Should render .chart-title when chart-title is set', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-gantt-chart');
    await expect(element.locator('.chart-title')).toHaveText(ganttTitle);
  });

  test('Should not render .chart-title when chart-title is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart data='${JSON.stringify(basicData)}'></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const element = page.locator('fluent-gantt-chart');
    await expect(element.locator('.chart-title')).toHaveCount(0);
  });

  test('Should apply text-align:start by default', async ({ page }) => {
    await setupWithTitle(page);
    const title = page.locator('fluent-gantt-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
  });

  test('Should apply text-align:center when title-align="center"', async ({ page }) => {
    await setupWithTitle(page, "title-align='center'");
    const title = page.locator('fluent-gantt-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'center');
  });

  test('Should apply text-align:end when title-align="end"', async ({ page }) => {
    await setupWithTitle(page, "title-align='end'");
    const title = page.locator('fluent-gantt-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'end');
  });

  test('Should update text-align when title-align attribute changes dynamically', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-gantt-chart');
    const title = element.locator('.chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
    await element.evaluate(el => el.setAttribute('title-align', 'center'));
    await expect(title).toHaveCSS('text-align', 'center');
  });
});

// ── legend-position ───────────────────────────────────────────────────────────

test.describe('GanttChart - legend-position', () => {
  async function setupWithLegendPosition(page: import('@playwright/test').Page, position: string) {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="${ganttTitle}"
          legend-position="${position}"
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
  }

  test('Should set position attribute on fluent-chart-legend when legend-position="top"', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const legend = page.locator('fluent-gantt-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="start"', async ({ page }) => {
    await setupWithLegendPosition(page, 'start');
    const legend = page.locator('fluent-gantt-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'start');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="end"', async ({ page }) => {
    await setupWithLegendPosition(page, 'end');
    const legend = page.locator('fluent-gantt-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'end');
  });

  test('Should update legend position attribute when legend-position changes dynamically', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const element = page.locator('fluent-gantt-chart');
    const legend = element.locator('fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
    await element.evaluate(el => el.setAttribute('legend-position', 'end'));
    await expect(legend).toHaveAttribute('position', 'end');
  });
});

test.describe('GanttChart - axis-titles', () => {
  test('Should render x-axis-title when attribute is set', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Axis title test"
          x-axis-title="Sprint"
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const titleEl = page.locator('fluent-gantt-chart').locator('.axis-title');
    await expect(titleEl.first()).toContainText('Sprint');
  });

  test('Should render y-axis-title when attribute is set', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Y axis title test"
          y-axis-title="Task"
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const titleEl = page.locator('fluent-gantt-chart').locator('.axis-title');
    await expect(titleEl.first()).toContainText('Task');
  });

  test('Should not render axis-title when attributes are absent', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="No axis title test"
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const titleEls = page.locator('fluent-gantt-chart').locator('.axis-title');
    await expect(titleEls).toHaveCount(0);
  });
});

test.describe('GanttChart - rotate-x-axis-labels', () => {
  test('Should add transform rotate to x-axis text when rotate-x-axis-labels is set', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Rotate labels test"
          rotate-x-axis-labels
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const axisTexts = page.locator('fluent-gantt-chart').locator('.axis-text');
    const transform = await axisTexts.first().getAttribute('transform');
    await expect(transform).toMatch(/rotate\(-45/);
  });
});

test.describe('GanttChart - support-negative-data', () => {
  test('Should render bars when y values include negatives and support-negative-data is set', async ({ page }) => {
    const negativeNumericData: GanttChartDataPoint[] = [
      { x: { start: -10, end: 0 }, y: 5, legend: 'Past', color: color1 },
      { x: { start: -5, end: 10 }, y: 10, legend: 'Current', color: color2 },
    ];
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Negative data test"
          support-negative-data
          data='${JSON.stringify(negativeNumericData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const bars = page.locator('fluent-gantt-chart').locator('.bar');
    await expect(bars).toHaveCount(negativeNumericData.length);
  });
});

// ── bar-height ────────────────────────────────────────────────────────────────

test.describe('GanttChart - bar-height', () => {
  test('Should render bars with specified bar-height', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Bar height test"
          bar-height="15"
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const bars = page.locator('fluent-gantt-chart').locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('height', '15');
    await expect(bars.nth(1)).toHaveAttribute('height', '15');
    await expect(bars.nth(2)).toHaveAttribute('height', '15');
  });

  test('Should update bar height when bar-height attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Bar height reactivity test"
          bar-height="10"
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const element = page.locator('fluent-gantt-chart');
    const firstBar = element.locator('.bar').first();

    await expect(firstBar).toHaveAttribute('height', '10');

    await element.evaluate(el => el.setAttribute('bar-height', '20'));
    await page.waitForTimeout(50);

    await expect(firstBar).toHaveAttribute('height', '20');
  });
});

test.describe('GanttChart - tick-format', () => {
  test('Should accept tick-format attribute without error (placeholder for future d3 support)', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));

    const start = new Date('2024-03-01T00:00:00').getTime();
    const end = new Date('2024-06-30T00:00:00').getTime();
    const tasks = JSON.stringify([
      { startTime: start, endTime: new Date('2024-04-01T00:00:00').getTime(), legendText: 'A', color: '#0078d4' },
    ]);

    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Tick format test"
          tick-format="%m/%d"
          data='${tasks}'
          start-time='${start}'
          end-time='${end}'
        ></fluent-gantt-chart>
      </div>
    `);

    const chart = page.locator('fluent-gantt-chart');
    await expect(chart).toBeAttached();
    await expect(chart).toHaveAttribute('tick-format', '%m/%d');
  });
});

test.describe('GanttChart - tick-values', () => {
  test('Should render exactly the provided tick values on the x-axis', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Tick values test"
          tick-values='[5, 15, 25]'
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const axisLabels = page.locator('fluent-gantt-chart').locator('.axis-text');
    await expect(axisLabels).toHaveCount(3);
  });

  test('Should update tick positions when tick-values attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Tick values reactivity test"
          tick-values='[5, 15, 25]'
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const element = page.locator('fluent-gantt-chart');

    await expect(element.locator('.axis-text')).toHaveCount(3);

    await element.evaluate(el => el.setAttribute('tick-values', '[0, 10, 20, 30]'));
    await page.waitForTimeout(50);

    await expect(element.locator('.axis-text')).toHaveCount(4);
  });
});

test.describe('GanttChart - stroke-width', () => {
  test('Should apply stroke-width attribute to bars', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Stroke width test"
          stroke-width="3"
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const bars = page.locator('fluent-gantt-chart').locator('.bar');
    await expect(bars.nth(0)).toHaveAttribute('stroke-width', '3');
    await expect(bars.nth(1)).toHaveAttribute('stroke-width', '3');
    await expect(bars.nth(2)).toHaveAttribute('stroke-width', '3');
  });

  test('Should not set stroke-width when attribute is absent', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="No stroke width test"
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const firstBar = page.locator('fluent-gantt-chart').locator('.bar').first();
    await expect(firstBar).not.toHaveAttribute('stroke-width');
  });
});

test.describe('GanttChart - show-x-axis-labels-tooltip', () => {
  test('Should truncate long x-axis labels and add title tooltip when enabled', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    // Use .10f format to produce labels > 10 chars (e.g. "0.0000000000")
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="X-axis labels tooltip test"
          x-axis-tick-format=".10f"
          show-x-axis-labels-tooltip
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const axisLabels = page.locator('fluent-gantt-chart').locator('.axis-text');
    await expect(axisLabels.first()).not.toBeEmpty();
    // Every x-axis tick label should have a <title> child (tooltip)
    const titleCount = await axisLabels.first().locator('title').count();
    expect(titleCount).toBe(1);
  });

  test('Should not add title tooltip when show-x-axis-labels-tooltip is absent', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="No x-axis labels tooltip test"
          data='${JSON.stringify(basicData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const axisLabels = page.locator('fluent-gantt-chart').locator('.axis-text');
    const firstTitleCount = await axisLabels.first().locator('title').count();
    expect(firstTitleCount).toBe(0);
  });
});

test.describe('GanttChart - date-localize-options', () => {
  const dateData: GanttChartDataPoint[] = [
    { x: { start: '2009-01-01', end: '2009-02-28' }, y: 'Alpha', legend: 'Phase 1', color: color1 },
    { x: { start: '2009-03-05', end: '2009-06-15' }, y: 'Beta', legend: 'Phase 2', color: color2 },
  ];

  test('Should use provided dateLocalizeOptions when formatting date axis ticks', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="Date localize options test"
          date-localize-options='{"year":"numeric","month":"long"}'
          data='${JSON.stringify(dateData)}'>
        </fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const axisLabels = page.locator('fluent-gantt-chart').locator('.axis-text');
    await expect(axisLabels.first()).not.toBeEmpty();
    // With month:"long", labels should contain full month names (e.g. "January")
    const allText = await axisLabels.allTextContents();
    const hasLongMonth = allText.some(t =>
      [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ].some(m => t.includes(m)),
    );
    expect(hasLongMonth).toBe(true);
  });
});

test.describe('GanttChart - tooltipRenderer', () => {
  test('Should inject custom renderer output into tooltip-body', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="tooltipRenderer test"
          data='${JSON.stringify(basicData)}'
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const element = page.locator('fluent-gantt-chart');

    await element.evaluate((el: any) => {
      el.tooltipRenderer = (_point: any, defaultRender: any) =>
        `<span class="custom-tip">${defaultRender(_point)}</span>`;
    });

    await element.locator('.bar').first().hover();
    await expect(element.locator('.tooltip-body .custom-tip')).toBeVisible();
  });

  test('Should show default tooltip-body when tooltipRenderer is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gantt-chart
          chart-title="default tooltip test"
          data='${JSON.stringify(basicData)}'
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
    const element = page.locator('fluent-gantt-chart');

    await element.locator('.bar').first().hover();
    await expect(element.locator('.tooltip')).toHaveCount(1);
    await expect(element.locator('.tooltip-body')).toBeVisible();
  });
});

test.describe('GanttChart - use-utc', () => {
  const utcData: GanttChartDataPoint[] = [
    {
      x: { start: '2024-03-31T23:30:00Z', end: '2024-04-01T05:00:00Z' },
      y: 'Overnight import',
      legend: 'UTC series',
      color: color1,
    },
    {
      x: { start: '2024-04-01T06:00:00Z', end: '2024-04-01T12:00:00Z' },
      y: 'Morning sync',
      legend: 'UTC series',
      color: color2,
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--use-utc'));
    await page.setContent(/* html */ `
      <div style="width: 640px">
        <fluent-gantt-chart
          chart-title="UTC gantt test"
          tick-format="%Y-%m-%d %H:%M"
          data='${JSON.stringify(utcData)}'
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
  });

  test('Should re-render when use-utc attribute is set', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');
    const initialTickCount = await element.locator('.axis-text').count();

    await element.evaluate(el => el.setAttribute('use-utc', ''));
    await page.waitForTimeout(50);

    await expect(element).toHaveAttribute('use-utc', '');
    await expect(element.locator('svg.chart-svg')).toBeVisible();

    const rerenderedTickCount = await element.locator('.axis-text').count();
    expect(initialTickCount).toBeGreaterThan(0);
    expect(rerenderedTickCount).toBe(initialTickCount);
  });
});

test.describe('GanttChart - y-axis-tick-values', () => {
  const numericYAxisData: GanttChartDataPoint[] = [
    { x: { start: 0, end: 20 }, y: 0, legend: 'Alpha', color: color1 },
    { x: { start: 10, end: 35 }, y: 25, legend: 'Alpha', color: color1 },
    { x: { start: 20, end: 50 }, y: 50, legend: 'Beta', color: color2 },
    { x: { start: 40, end: 70 }, y: 75, legend: 'Beta', color: color2 },
    { x: { start: 60, end: 90 }, y: 100, legend: 'Gamma', color: successColor },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div style="width: 640px">
        <fluent-gantt-chart
          chart-title="Gantt y-axis tick values test"
          data='${JSON.stringify(numericYAxisData)}'
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
  });

  test('Should render only the provided y-axis tick values', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');

    await element.evaluate(el => el.setAttribute('y-axis-tick-values', '[0,50,100]'));
    await page.waitForTimeout(50);

    const labels = element.locator('.y-axis-text');
    await expect(labels).toHaveCount(3);
    await expect(labels.nth(0)).toContainText('0');
    await expect(labels.nth(1)).toContainText('50');
    await expect(labels.nth(2)).toContainText('100');
  });
});

test.describe('GanttChart - hide-tick-overlap', () => {
  const crowdedTickData: GanttChartDataPoint[] = [
    { x: { start: 0, end: 10 }, y: 'Task A', legend: 'Series A', color: color1 },
    { x: { start: 2, end: 12 }, y: 'Task B', legend: 'Series B', color: color2 },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-ganttchart--default'));
    await page.setContent(/* html */ `
      <div style="width: 320px">
        <fluent-gantt-chart
          chart-title="Gantt tick overlap test"
          tick-values='[0,1,2,3,4,5,6,7,8,9,10,11,12]'
          x-axis-tick-format=".0f"
          data='${JSON.stringify(crowdedTickData)}'
        ></fluent-gantt-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gantt-chart'));
  });

  test('Should hide overlapping x-axis tick labels when hide-tick-overlap is present', async ({ page }) => {
    const element = page.locator('fluent-gantt-chart');

    await element.evaluate(el => el.setAttribute('hide-tick-overlap', ''));
    await page.waitForTimeout(50);

    const hiddenTickCount = await element.evaluate(el => {
      return Array.from(el.shadowRoot!.querySelectorAll<SVGTextElement>('text.axis-text')).filter(
        tick => tick.style.display === 'none',
      ).length;
    });

    expect(hiddenTickCount).toBeGreaterThan(0);
  });
});
