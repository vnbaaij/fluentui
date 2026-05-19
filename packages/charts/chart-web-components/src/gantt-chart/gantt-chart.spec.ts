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
