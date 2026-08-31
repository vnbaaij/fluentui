import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { HeatMapChartData } from './heat-map-chart.options.js';

// Resolved colors from default color scale and DataVizPalette tokens (light theme)
const domainValues = [0, 100];
const rangeColors = ['#d4e8ff', '#003a78'];

const stringData: HeatMapChartData[] = [
  {
    value: 20,
    legend: 'Low',
    data: [
      { x: 'Mon', y: 'Team A', value: 12, rectText: 12 },
      { x: 'Tue', y: 'Team C', value: 18, rectText: 18 },
    ],
  },
  {
    value: 50,
    legend: 'Medium',
    data: [
      { x: 'Mon', y: 'Team B', value: 45, rectText: 45 },
      { x: 'Wed', y: 'Team A', value: 52, rectText: 52 },
    ],
  },
  {
    value: 80,
    legend: 'High',
    data: [
      { x: 'Tue', y: 'Team A', value: 78, rectText: 78 },
      { x: 'Wed', y: 'Team B', value: 82, rectText: 82 },
    ],
  },
];

// Total cells = 3 x-labels (Mon,Tue,Wed) × 3 y-labels (Team A, Team B, Team C) = 9 cells
const TOTAL_CELLS = 9;
const DATA_POINTS = 6; // points with actual values

const chartTitle = 'Heat map basic test';

test.describe('HeatMapChart - Basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-heatmapchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-heat-map-chart
          chart-title="${chartTitle}"
          data='${JSON.stringify(stringData)}'
          domain-values-for-color-scale='${JSON.stringify(domainValues)}'
          range-values-for-color-scale='${JSON.stringify(rangeColors)}'
        ></fluent-heat-map-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-heat-map-chart'));
  });

  test('Should render chart title', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    await expect(element.locator('.chart-title')).toHaveText(chartTitle);
  });

  test('Should render correct number of cells', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const cells = element.locator('.heat-cell');
    await expect(cells).toHaveCount(TOTAL_CELLS);
  });

  test('Should render annotations with custom Cartesian margins', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & {
        margins: { top: number; right: number; bottom: number; left: number };
        annotations: Array<{ text: string; coordinates: { type: 'data'; x: string; y: string } }>;
        xAxisTitle: string;
        yAxisTitle: string;
      };
      chart.margins = { top: 30, right: 40, bottom: 50, left: 80 };
      chart.annotations = [{ text: 'Heat target', coordinates: { type: 'data', x: 'Mon', y: 'Team A' } }];
      chart.xAxisTitle = 'Day';
      chart.yAxisTitle = 'Team';
    });

    await expect(element.locator('.annotation-layer')).toHaveAttribute('transform', 'translate(80, 30)');
    await expect(element.locator('.chart-annotation-text')).toHaveText('Heat target');
    await expect(element.locator('.x-axis > .axis-title')).toHaveText('Day');
    await expect(element.locator('.y-axis > .axis-title')).toHaveText('Team');
  });

  test('Should render cells with role img', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const cells = element.locator('.heat-cell');
    await expect(cells.nth(0)).toHaveAttribute('role', 'img');
  });

  test('Should render first cell with tabindex 0 and the rest with -1', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const cells = element.locator('.heat-cell');
    await expect(cells.nth(0)).toHaveAttribute('tabindex', '0');
    await expect(cells.nth(1)).toHaveAttribute('tabindex', '-1');
  });

  test('Should render rect text values in cells', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    // Cells with data should contain text elements
    const cellTexts = element.locator('.cell-text');
    await expect(cellTexts).toHaveCount(DATA_POINTS);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const legends = element.locator('.legend-text');
    await expect(legends.nth(0).getByText('Low')).toBeVisible();
    await expect(legends.nth(1).getByText('Medium')).toBeVisible();
    await expect(legends.nth(2).getByText('High')).toBeVisible();
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const legendCount = await element.locator('.legend-text').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should hide legends when hide-legends is set', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    await element.evaluate(el => el.setAttribute('hide-legends', ''));
    const legend = element.locator('fluent-chart-legend');
    await expect(legend).toHaveAttribute('hidden', '');
  });

  test('Should render x-axis tick labels', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const xLabels = element.locator('.axis-text');
    // Mon, Tue, Wed sorted alphabetically
    await expect(xLabels.nth(0)).toContainText('Mon');
  });

  test('Should render y-axis tick labels', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const yLabels = element.locator('.y-axis-text');
    await expect(yLabels.nth(0)).toContainText('Team');
  });
});

test.describe('HeatMapChart - Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-heatmapchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-heat-map-chart
          chart-title="${chartTitle}"
          data='${JSON.stringify(stringData)}'
          domain-values-for-color-scale='${JSON.stringify(domainValues)}'
          range-values-for-color-scale='${JSON.stringify(rangeColors)}'
        ></fluent-heat-map-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-heat-map-chart'));
  });

  test('Should show tooltip on cell hover', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    // Find a cell with actual data (has cell-text)
    const filledCell = element
      .locator('.heat-cell')
      .filter({ has: page.locator('.cell-text') })
      .first();
    await filledCell.hover();
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toBeVisible();
  });

  test('Should hide tooltip when hide-tooltip is set', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    await element.evaluate(el => el.setAttribute('hide-tooltip', ''));
    const filledCell = element
      .locator('.heat-cell')
      .filter({ has: page.locator('.cell-text') })
      .first();
    await filledCell.hover();
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toBeHidden();
  });
});

test.describe('HeatMapChart - Legend interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-heatmapchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-heat-map-chart
          chart-title="${chartTitle}"
          data='${JSON.stringify(stringData)}'
          domain-values-for-color-scale='${JSON.stringify(domainValues)}'
          range-values-for-color-scale='${JSON.stringify(rangeColors)}'
        ></fluent-heat-map-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-heat-map-chart'));
  });

  test('Should highlight cells of the hovered legend', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const legend = element.locator('.legend').first();
    await legend.hover();
    // Cells not matching the hovered legend should become inactive
    const inactiveCells = element.locator('.heat-cell.inactive');
    const count = await inactiveCells.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Should reset cell opacity after legend mouse out', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const legend = element.locator('.legend').first();
    await legend.hover();
    // Move away
    await page.mouse.move(0, 0);
    const inactiveCells = element.locator('.heat-cell.inactive');
    await expect(inactiveCells).toHaveCount(0);
  });
});

test.describe('HeatMapChart - Reactive updates', () => {
  test('Should re-render when data attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-heatmapchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-heat-map-chart
          data='${JSON.stringify(stringData)}'
          domain-values-for-color-scale='${JSON.stringify(domainValues)}'
          range-values-for-color-scale='${JSON.stringify(rangeColors)}'
        ></fluent-heat-map-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-heat-map-chart'));

    const element = page.locator('fluent-heat-map-chart');
    const initialCount = await element.locator('.heat-cell').count();

    // Update with only 1 row and 1 col
    const newData: HeatMapChartData[] = [
      { value: 50, legend: 'Only', data: [{ x: 'X', y: 'Y', value: 50, rectText: 50 }] },
    ];
    await element.evaluate((el, d) => el.setAttribute('data', JSON.stringify(d)), newData);

    await expect(element.locator('.heat-cell')).toHaveCount(1);
    const newCount = await element.locator('.heat-cell').count();
    expect(newCount).toBeLessThan(initialCount);
  });
});

test.describe('HeatMapChart - x-axis-string-labels', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-heatmapchart--string-labels'));
    await page.setContent(/* html */ `
      <div>
        <fluent-heat-map-chart
          chart-title="Heat map string labels test"
          data='${JSON.stringify(stringData)}'
          domain-values-for-color-scale='${JSON.stringify(domainValues)}'
          range-values-for-color-scale='${JSON.stringify(rangeColors)}'
          x-axis-string-labels='{"Mon":"Monday","Tue":"Tuesday","Wed":"Wednesday"}'
        ></fluent-heat-map-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-heat-map-chart'));
  });

  test('Should render display labels instead of the raw x-axis string keys', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');
    const xLabels = element.locator('.axis-text');
    await expect(xLabels.nth(0)).toContainText('Monday');
    await expect(xLabels.nth(1)).toContainText('Tuesday');
    await expect(xLabels.nth(2)).toContainText('Wednesday');
  });
});

test.describe('HeatMapChart - x-axis-category-order', () => {
  const orderedData: HeatMapChartData[] = [
    {
      value: 50,
      legend: 'Usage',
      data: [
        { x: 'Banana', y: 'Team A', value: 40, rectText: 40 },
        { x: 'Apple', y: 'Team A', value: 55, rectText: 55 },
        { x: 'Cherry', y: 'Team A', value: 70, rectText: 70 },
      ],
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-heatmapchart--category-order'));
    await page.setContent(/* html */ `
      <div>
        <fluent-heat-map-chart
          chart-title="Heat map category order test"
          data='${JSON.stringify(orderedData)}'
          domain-values-for-color-scale='[0,50,100]'
          range-values-for-color-scale='["#d4e8ff","#0078d4","#003a78"]'
          sort-order="none"
        ></fluent-heat-map-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-heat-map-chart'));
  });

  test('Should sort labels alphabetically when the order is alphabetical', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');

    await element.evaluate(el => el.setAttribute('x-axis-category-order', 'alphabetical'));
    await page.waitForTimeout(50);

    const labels = (await element.locator('.axis-text').allTextContents()).map(text => text.trim());
    expect(labels).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  test('Should sort labels in reverse alphabetical order when the order is descending', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');

    await element.evaluate(el => el.setAttribute('x-axis-category-order', 'category descending'));
    await page.waitForTimeout(50);

    const labels = (await element.locator('.axis-text').allTextContents()).map(text => text.trim());
    expect(labels).toEqual(['Cherry', 'Banana', 'Apple']);
  });

  test('Should preserve insertion order when the order is none', async ({ page }) => {
    const element = page.locator('fluent-heat-map-chart');

    await element.evaluate(el => el.setAttribute('x-axis-category-order', 'none'));
    await page.waitForTimeout(50);

    const labels = (await element.locator('.axis-text').allTextContents()).map(text => text.trim());
    expect(labels).toEqual(['Banana', 'Apple', 'Cherry']);
  });
});
