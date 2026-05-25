import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { GaugeChartSegment } from './gauge-chart.options.js';

const basicTitle = 'Gauge chart basic example';

const multiSegments: GaugeChartSegment[] = [
  { legend: 'Low', size: 33 },
  { legend: 'Medium', size: 34 },
  { legend: 'High', size: 33 },
];

const singleSegment: GaugeChartSegment[] = [{ legend: 'Used', size: 55 }];

test.describe('GaugeChart - Basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-gaugechart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gauge-chart
          chart-title="${basicTitle}"
          segments='${JSON.stringify(multiSegments)}'
          chart-value="50"
          max-value="100"
        >
        </fluent-gauge-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gauge-chart'));
  });

  test('Should render chart title', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    await expect(element.locator('.chart-title')).toBeVisible();
    await expect(element.locator('.chart-title')).toHaveText(basicTitle);
  });

  test('Should render segments as SVG paths', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const segments = element.locator('.segment');
    // 3 user segments + 1 trailing "Unknown" filler
    await expect(segments).toHaveCount(4);
  });

  test('Should render the needle', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    await expect(element.locator('.needle')).toHaveCount(1);
    await expect(element.locator('.needle')).toHaveAttribute('role', 'img');
  });

  test('Should render min/max labels by default', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const limits = element.locator('.limit-label');
    await expect(limits).toHaveCount(2);
  });

  test('Should render the chart value text', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    await expect(element.locator('.chart-value')).toHaveCount(1);
    // Default format is percentage: 50/100 = 50%
    await expect(element.locator('.chart-value')).toContainText('50%');
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const legendItems = element.getByRole('option');
    // 3 user segments → 3 legend items (filler "Unknown" is excluded)
    await expect(legendItems).toHaveCount(3);
    await expect(element.getByRole('option', { name: 'Low' })).toBeVisible();
    await expect(element.getByRole('option', { name: 'Medium' })).toBeVisible();
    await expect(element.getByRole('option', { name: 'High' })).toBeVisible();
  });

  test('Should render segments with correct aria labels', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const lowSegment = element.locator('.segment[data-id="Low"]');
    await expect(lowSegment).toHaveAttribute('role', 'img');
  });

  test('Should render with first segment having tabindex 0', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const segments = element.locator('.segment');
    await expect(segments.first()).toHaveAttribute('tabindex', '0');
    await expect(segments.nth(1)).toHaveAttribute('tabindex', '-1');
  });
});

test.describe('GaugeChart - Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-gaugechart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gauge-chart
          chart-title="${basicTitle}"
          segments='${JSON.stringify(multiSegments)}'
          chart-value="50"
          max-value="100"
        >
        </fluent-gauge-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gauge-chart'));
  });

  test('Should show tooltip on segment hover', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const firstSegment = element.locator('.segment[data-id="Low"]');
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(0);
    await firstSegment.dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.locator('.tooltip-header')).toContainText('Current value:');
  });

  test('Should hide tooltip after mouseleave', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const firstSegment = element.locator('.segment[data-id="Low"]');
    const tooltip = element.locator('.tooltip');
    await firstSegment.dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await firstSegment.dispatchEvent('mouseleave');
    await expect(tooltip).toHaveCount(0);
  });

  test('Should not show tooltip when hide-tooltip is set', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    await element.evaluate(el => el.setAttribute('hide-tooltip', ''));
    const firstSegment = element.locator('.segment[data-id="Low"]');
    await firstSegment.dispatchEvent('mouseover');
    await expect(element.locator('.tooltip')).toHaveCount(0);
  });
});

test.describe('GaugeChart - Legend interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-gaugechart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gauge-chart
          chart-title="${basicTitle}"
          segments='${JSON.stringify(multiSegments)}'
          chart-value="50"
          max-value="100"
        >
        </fluent-gauge-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gauge-chart'));
  });

  test('Should apply inactive class to other segments on legend click', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const lowLegend = element.getByRole('option', { name: 'Low' });
    const mediumSegment = element.locator('.segment[data-id="Medium"]');

    await lowLegend.click();
    await expect(mediumSegment).toHaveClass(/inactive/);
  });

  test('Should restore all segments on second legend click', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const lowLegend = element.getByRole('option', { name: 'Low' });
    const mediumSegment = element.locator('.segment[data-id="Medium"]');

    await lowLegend.click();
    await expect(mediumSegment).toHaveClass(/inactive/);
    await lowLegend.click();
    await expect(mediumSegment).not.toHaveClass(/inactive/);
  });

  test('Should apply hover style on legend mouseover', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const lowLegend = element.getByRole('option', { name: 'Low' });
    const mediumSegment = element.locator('.segment[data-id="Medium"]');
    const highSegment = element.locator('.segment[data-id="High"]');

    await lowLegend.dispatchEvent('mouseover');
    await expect(mediumSegment).toHaveCSS('opacity', '0.1');
    await expect(highSegment).toHaveCSS('opacity', '0.1');
    await lowLegend.dispatchEvent('mouseout');
    await expect(mediumSegment).toHaveCSS('opacity', '1');
    await expect(highSegment).toHaveCSS('opacity', '1');
  });
});

test.describe('GaugeChart - hide-min-max', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-gaugechart--hide-min-max'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gauge-chart
          chart-title="${basicTitle}"
          segments='${JSON.stringify(multiSegments)}'
          chart-value="50"
          max-value="100"
          hide-min-max
        >
        </fluent-gauge-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gauge-chart'));
  });

  test('Should not render limit labels when hide-min-max is set', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    await expect(element.locator('.limit-label')).toHaveCount(0);
  });
});

test.describe('GaugeChart - fraction format', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-gaugechart--fraction-format'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gauge-chart
          chart-title="${basicTitle}"
          segments='${JSON.stringify(multiSegments)}'
          chart-value="50"
          max-value="100"
          chart-value-format="fraction"
        >
        </fluent-gauge-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gauge-chart'));
  });

  test('Should display fraction format in chart value', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    await expect(element.locator('.chart-value')).toContainText('50/100');
  });
});

test.describe('GaugeChart - sublabel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-gaugechart--with-sublabel'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gauge-chart
          chart-title="${basicTitle}"
          segments='${JSON.stringify(multiSegments)}'
          chart-value="50"
          max-value="100"
          sublabel="of 100"
        >
        </fluent-gauge-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gauge-chart'));
  });

  test('Should render sublabel text', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    await expect(element.locator('.sublabel')).toBeVisible();
    await expect(element.locator('.sublabel')).toContainText('of 100');
  });
});

test.describe('GaugeChart - Single segment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-gaugechart--single-segment'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gauge-chart
          chart-title="${basicTitle}"
          segments='${JSON.stringify(singleSegment)}'
          chart-value="55"
          max-value="100"
          variant="single-segment"
        >
        </fluent-gauge-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gauge-chart'));
  });

  test('Should render single segment with Unknown filler', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    const segments = element.locator('.segment');
    // 1 user segment + 1 "Unknown" filler
    await expect(segments).toHaveCount(2);
  });

  test('Should show only one legend item', async ({ page }) => {
    const element = page.locator('fluent-gauge-chart');
    await expect(element.getByRole('option')).toHaveCount(1);
    await expect(element.getByRole('option', { name: 'Used' })).toBeVisible();
  });
});

test.describe('GaugeChart - Reactive rerender', () => {
  test('Should rerender when segments attribute changes after initial render', async ({ page }) => {
    await page.goto(fixtureURL('components-gaugechart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gauge-chart
          chart-title="${basicTitle}"
          segments='${JSON.stringify(multiSegments)}'
          chart-value="50"
          max-value="100"
        >
        </fluent-gauge-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gauge-chart'));

    const element = page.locator('fluent-gauge-chart');
    await expect(element.locator('.segment')).toHaveCount(4); // 3 + filler

    const newSegments: GaugeChartSegment[] = [
      { legend: 'Alpha', size: 50 },
      { legend: 'Beta', size: 50 },
    ];

    await element.evaluate((el, segs) => {
      el.setAttribute('segments', JSON.stringify(segs));
    }, newSegments);

    // 2 user segments + filler = 3, but since sum equals max there's no filler
    await expect(element.locator('.segment')).toHaveCount(2);
    await expect(element.getByRole('option', { name: 'Alpha' })).toBeVisible();
    await expect(element.getByRole('option', { name: 'Beta' })).toBeVisible();
  });

  test('Should rerender when chart-value attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-gaugechart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-gauge-chart
          chart-title="${basicTitle}"
          segments='${JSON.stringify(multiSegments)}'
          chart-value="50"
          max-value="100"
        >
        </fluent-gauge-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-gauge-chart'));

    const element = page.locator('fluent-gauge-chart');
    await expect(element.locator('.chart-value')).toContainText('50%');

    await element.evaluate(el => {
      el.setAttribute('chart-value', '75');
    });

    await expect(element.locator('.chart-value')).toContainText('75%');
  });
});
