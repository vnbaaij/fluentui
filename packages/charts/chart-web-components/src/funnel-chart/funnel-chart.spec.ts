import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { FunnelChartDataPoint } from './funnel-chart.options.js';

const simpleData: FunnelChartDataPoint[] = [
  { stage: 'Impressions', value: 8000, color: '#637cef' },
  { stage: 'Clicks', value: 4000, color: '#e3008c' },
  { stage: 'Leads', value: 1500, color: '#2aa0a4' },
  { stage: 'Conversions', value: 600, color: '#9373c0' },
];

const stackedData: FunnelChartDataPoint[] = [
  {
    stage: 'Awareness',
    subValues: [
      { category: 'Organic', value: 5000, color: '#637cef' },
      { category: 'Paid', value: 3000, color: '#e3008c' },
    ],
  },
  {
    stage: 'Interest',
    subValues: [
      { category: 'Organic', value: 3000, color: '#637cef' },
      { category: 'Paid', value: 2000, color: '#e3008c' },
    ],
  },
  {
    stage: 'Decision',
    subValues: [
      { category: 'Organic', value: 1200, color: '#637cef' },
      { category: 'Paid', value: 800, color: '#e3008c' },
    ],
  },
  {
    stage: 'Purchase',
    subValues: [
      { category: 'Organic', value: 500, color: '#637cef' },
      { category: 'Paid', value: 300, color: '#e3008c' },
    ],
  },
];

test.describe('FunnelChart - Basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="Test funnel"
          width="350"
          height="400"
          data='${JSON.stringify(simpleData)}'
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
  });

  test('Should render chart title', async ({ page }) => {
    const element = page.locator('fluent-funnel-chart');
    await expect(element.locator('.chart-title')).toContainText('Test funnel');
  });

  test('Should render correct number of segments', async ({ page }) => {
    const element = page.locator('fluent-funnel-chart');
    const segments = element.locator('.funnel-segment');
    await expect(segments).toHaveCount(simpleData.length);
  });

  test('Should render segments with correct fill colors', async ({ page }) => {
    const element = page.locator('fluent-funnel-chart');
    const segments = element.locator('.funnel-segment');
    await expect(segments.nth(0)).toHaveAttribute('fill', '#637cef');
    await expect(segments.nth(1)).toHaveAttribute('fill', '#e3008c');
    await expect(segments.nth(2)).toHaveAttribute('fill', '#2aa0a4');
    await expect(segments.nth(3)).toHaveAttribute('fill', '#9373c0');
  });

  test('Should render segments with aria-label', async ({ page }) => {
    const element = page.locator('fluent-funnel-chart');
    const segments = element.locator('.funnel-segment');
    await expect(segments.nth(0)).toHaveAttribute('aria-label', 'Impressions, 8000.');
    await expect(segments.nth(1)).toHaveAttribute('aria-label', 'Clicks, 4000.');
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-funnel-chart');
    const legends = element.locator('.legend-text');
    await expect(legends.nth(0).getByText('Impressions')).toBeVisible();
    await expect(legends.nth(1).getByText('Clicks')).toBeVisible();
    await expect(legends.nth(2).getByText('Leads')).toBeVisible();
    await expect(legends.nth(3).getByText('Conversions')).toBeVisible();
  });

  test('Should hide legends when hide-legends is set', async ({ page }) => {
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="Test funnel"
          width="350"
          height="400"
          data='${JSON.stringify(simpleData)}'
          hide-legends
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
    const element = page.locator('fluent-funnel-chart');
    await expect(element.locator('fluent-chart-legend')).toBeHidden();
  });
});

test.describe('FunnelChart - Horizontal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--horizontal'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="Horizontal funnel"
          width="600"
          height="300"
          orientation="horizontal"
          data='${JSON.stringify(simpleData)}'
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
  });

  test('Should render correct number of segments in horizontal mode', async ({ page }) => {
    const element = page.locator('fluent-funnel-chart');
    const segments = element.locator('.funnel-segment');
    await expect(segments).toHaveCount(simpleData.length);
  });

  test('Should mirror horizontal segment direction in RTL mode', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-funnel-chart
          chart-title="Horizontal RTL funnel"
          width="600"
          height="300"
          orientation="horizontal"
          data='${JSON.stringify(simpleData)}'
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));

    const element = page.locator('fluent-funnel-chart');
    const segments = element.locator('.funnel-segment');
    const firstSegmentPath = await segments.nth(0).getAttribute('d');
    const lastSegmentPath = await segments.nth(simpleData.length - 1).getAttribute('d');
    const funnelWidth = 600 * 0.8;
    const segmentWidth = funnelWidth / simpleData.length;
    const expectedFirstX = funnelWidth - segmentWidth;
    const expectedLastX = 0;

    expect(firstSegmentPath).toContain(`M${expectedFirstX},`);
    expect(lastSegmentPath).toContain(`M${expectedLastX},`);
  });
});

test.describe('FunnelChart - Stacked', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--stacked'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="Stacked funnel"
          width="350"
          height="400"
          data='${JSON.stringify(stackedData)}'
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
  });

  test('Should render correct number of stacked segments', async ({ page }) => {
    const element = page.locator('fluent-funnel-chart');
    const segments = element.locator('.funnel-segment');
    // 4 stages × 2 sub-values
    await expect(segments).toHaveCount(8);
  });

  test('Should render stacked legend items', async ({ page }) => {
    const element = page.locator('fluent-funnel-chart');
    const legends = element.locator('.legend-text');
    await expect(legends.nth(0).getByText('Organic')).toBeVisible();
    await expect(legends.nth(1).getByText('Paid')).toBeVisible();
  });
});

test.describe('FunnelChart - Legend interaction', () => {
  test('Should dim other segments when a legend is hovered', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="Test funnel"
          width="350"
          height="400"
          data='${JSON.stringify(simpleData)}'
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
    const element = page.locator('fluent-funnel-chart');
    const firstLegend = element.locator('.legend-text').nth(0);
    await firstLegend.hover();

    const segments = element.locator('.funnel-segment');
    await expect(segments.nth(0)).not.toHaveClass(/inactive/);
    await expect(segments.nth(1)).toHaveClass(/inactive/);
  });
});

// ── title-align ───────────────────────────────────────────────────────────────

const funnelTitle = 'Funnel chart basic';

test.describe('FunnelChart - title-align', () => {
  async function setupWithTitle(page: import('@playwright/test').Page, extraAttrs = '') {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="${funnelTitle}"
          width="350"
          height="400"
          ${extraAttrs}
          data='${JSON.stringify(simpleData)}'>
        </fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
  }

  test('Should render .chart-title when chart-title is set', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-funnel-chart');
    await expect(element.locator('.chart-title')).toHaveText(funnelTitle);
  });

  test('Should not render .chart-title when chart-title is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart width="350" height="400" data='${JSON.stringify(simpleData)}'></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
    const element = page.locator('fluent-funnel-chart');
    await expect(element.locator('.chart-title')).toHaveCount(0);
  });

  test('Should apply text-align:start by default', async ({ page }) => {
    await setupWithTitle(page);
    const title = page.locator('fluent-funnel-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
  });

  test('Should apply text-align:center when title-align="center"', async ({ page }) => {
    await setupWithTitle(page, "title-align='center'");
    const title = page.locator('fluent-funnel-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'center');
  });

  test('Should apply text-align:end when title-align="end"', async ({ page }) => {
    await setupWithTitle(page, "title-align='end'");
    const title = page.locator('fluent-funnel-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'end');
  });

  test('Should update text-align when title-align attribute changes dynamically', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-funnel-chart');
    const title = element.locator('.chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
    await element.evaluate(el => el.setAttribute('title-align', 'center'));
    await expect(title).toHaveCSS('text-align', 'center');
  });
});

// ── legend-position ───────────────────────────────────────────────────────────

test.describe('FunnelChart - legend-position', () => {
  async function setupWithLegendPosition(page: import('@playwright/test').Page, position: string) {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="${funnelTitle}"
          width="350"
          height="400"
          legend-position="${position}"
          data='${JSON.stringify(simpleData)}'>
        </fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
  }

  test('Should set position attribute on fluent-chart-legend when legend-position="top"', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const legend = page.locator('fluent-funnel-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="start"', async ({ page }) => {
    await setupWithLegendPosition(page, 'start');
    const legend = page.locator('fluent-funnel-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'start');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="end"', async ({ page }) => {
    await setupWithLegendPosition(page, 'end');
    const legend = page.locator('fluent-funnel-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'end');
  });

  test('Should update legend position attribute when legend-position changes dynamically', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const element = page.locator('fluent-funnel-chart');
    const legend = element.locator('fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
    await element.evaluate(el => el.setAttribute('legend-position', 'end'));
    await expect(legend).toHaveAttribute('position', 'end');
  });
});

// ── title-position ────────────────────────────────────────────────────────────

test.describe('FunnelChart - title-position', () => {
  test('Should keep title-position="bottom" regardless of legend position', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="${funnelTitle}"
          width="350"
          height="400"
          title-position="bottom"
          data='${JSON.stringify(simpleData)}'>
        </fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
    const element = page.locator('fluent-funnel-chart');
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });

  test('Should keep title-position="bottom" when legend-position="top"', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="${funnelTitle}"
          width="350"
          height="400"
          legend-position="top"
          title-position="bottom"
          data='${JSON.stringify(simpleData)}'>
        </fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
    const element = page.locator('fluent-funnel-chart');
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });

  test('Should keep title-position="bottom" when legend is visible at default position', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="${funnelTitle}"
          width="350"
          height="400"
          data='${JSON.stringify(simpleData)}'>
        </fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
    const element = page.locator('fluent-funnel-chart');
    await element.evaluate(el => el.setAttribute('title-position', 'bottom'));
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });
});

test.describe('FunnelChart - tooltipRenderer', () => {
  test('Should inject custom renderer output into tooltip-body', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="tooltipRenderer test"
          width="350"
          height="400"
          data='${JSON.stringify(simpleData)}'>
        </fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
    const element = page.locator('fluent-funnel-chart');

    await element.evaluate((el: any) => {
      el.tooltipRenderer = (_point: any, defaultRender: any) =>
        `<span class="custom-tip">${defaultRender(_point)}</span>`;
    });

    await element.locator('.funnel-segment').first().dispatchEvent('mouseover');
    await expect(element.locator('.tooltip-body .custom-tip')).toBeVisible();
  });

  test('Should show default tooltip-body when tooltipRenderer is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="default tooltip test"
          width="350"
          height="400"
          data='${JSON.stringify(simpleData)}'>
        </fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));
    const element = page.locator('fluent-funnel-chart');

    await element.locator('.funnel-segment').first().dispatchEvent('mouseover');
    await expect(element.locator('.tooltip')).toHaveCount(1);
    await expect(element.locator('.tooltip-body')).toBeVisible();
  });
});

test.describe('FunnelChart - width and height', () => {
  test('Should reflect numeric width and height on SVG attributes', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="Test funnel"
          width="350"
          height="400"
          data='${JSON.stringify(simpleData)}'
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));

    const svg = page.locator('fluent-funnel-chart svg.chart');
    await expect(svg).toHaveAttribute('width', '350');
    await expect(svg).toHaveAttribute('height', '400');
  });

  test('Should update SVG attributes when width and height change', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="Test funnel"
          width="350"
          height="400"
          data='${JSON.stringify(simpleData)}'
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));

    const element = page.locator('fluent-funnel-chart');
    const svg = element.locator('svg.chart');

    await element.evaluate(el => {
      el.setAttribute('width', '600');
      el.setAttribute('height', '500');
    });

    await expect(svg).toHaveAttribute('width', '600');
    await expect(svg).toHaveAttribute('height', '500');
  });

  test('Should accept percentage string values for width and height', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div style="width:800px;height:600px;">
        <fluent-funnel-chart
          chart-title="Test funnel"
          width="50%"
          height="50%"
          data='${JSON.stringify(simpleData)}'
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));

    const svg = page.locator('fluent-funnel-chart svg.chart');
    // Percentage values must be forwarded as-is to the SVG attribute.
    await expect(svg).toHaveAttribute('width', '50%');
    await expect(svg).toHaveAttribute('height', '50%');
    // The SVG should resolve to ~400 px (50% of the 800 px container).
    const box = await svg.boundingBox();
    expect(box!.width).toBeGreaterThan(350);
    expect(box!.width).toBeLessThan(450);
  });

  test('Should rerender segments with updated geometry when width changes', async ({ page }) => {
    await page.goto(fixtureURL('components-funnelchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-funnel-chart
          chart-title="Test funnel"
          width="350"
          height="400"
          data='${JSON.stringify(simpleData)}'
        ></fluent-funnel-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-funnel-chart'));

    const element = page.locator('fluent-funnel-chart');
    const firstSegment = element.locator('.funnel-segment').first();
    const originalPath = await firstSegment.getAttribute('d');

    await element.evaluate(el => {
      el.setAttribute('width', '700');
      el.setAttribute('height', '600');
    });

    await expect(firstSegment).not.toHaveAttribute('d', originalPath ?? '');
  });
});
