import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { FunnelDataPoint } from './funnel-chart.options.js';

const simpleData: FunnelDataPoint[] = [
  { stage: 'Impressions', value: 8000, color: '#637cef' },
  { stage: 'Clicks', value: 4000, color: '#e3008c' },
  { stage: 'Leads', value: 1500, color: '#2aa0a4' },
  { stage: 'Conversions', value: 600, color: '#9373c0' },
];

const stackedData: FunnelDataPoint[] = [
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

    expect(firstSegmentPath).toContain('M360,');
    expect(lastSegmentPath).toContain('M0,');
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
