import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { StackedBarChartData } from './stacked-bar-chart.options.js';

const data: StackedBarChartData = {
  chartTitle: 'Stacked bar chart basic',
  chartData: [
    { legend: 'Alpha', data: 25, color: '#637cef' },
    { legend: 'Beta', data: 15, color: '#e3008c' },
    { legend: 'Gamma', data: 10, color: '#107c10' },
  ],
};

test.describe('StackedBarChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-stackedbarchart--basic'));
    await page.setContent(/* html */ `
      <fluent-stacked-bar-chart chart-title="${data.chartTitle}" data='${JSON.stringify(
      data,
    )}'></fluent-stacked-bar-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-stacked-bar-chart'));
  });

  test('Should render chart title', async ({ page }) => {
    const element = page.locator('fluent-stacked-bar-chart');
    await expect(element.locator('.chart-title')).toHaveText(data.chartTitle!);
  });

  test('Should render chart elements', async ({ page }) => {
    const element = page.locator('fluent-stacked-bar-chart');
    await expect(element.locator('.bar')).toHaveCount(data.chartData.length);
  });

  test('Should render legend items', async ({ page }) => {
    const legends = page.locator('fluent-stacked-bar-chart .legend-text');
    await expect(legends.nth(0)).toHaveText('Alpha');
    await expect(legends.nth(1)).toHaveText('Beta');
    await expect(legends.nth(2)).toHaveText('Gamma');
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-stacked-bar-chart');
    const legendCount = await element.locator('.legend-text').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should hide legends when hide-legends is set', async ({ page }) => {
    const element = page.locator('fluent-stacked-bar-chart');
    await element.evaluate(el => el.setAttribute('hide-legends', ''));
    await expect(element.locator('fluent-chart-legend')).toHaveAttribute('hidden', '');
  });

  test('Should show tooltip on element hover', async ({ page }) => {
    const element = page.locator('fluent-stacked-bar-chart');
    await element.locator('.bar').first().hover();
    await expect(element.locator('.tooltip')).toBeVisible();
  });

  test('Should re-render when data attribute changes', async ({ page }) => {
    const element = page.locator('fluent-stacked-bar-chart');
    const nextData: StackedBarChartData = {
      chartData: [
        { legend: 'Delta', data: 12, color: '#637cef' },
        { legend: 'Epsilon', data: 18, color: '#e3008c' },
      ],
    };

    await element.evaluate((el, value) => el.setAttribute('data', JSON.stringify(value)), nextData);
    await expect(element.locator('.bar')).toHaveCount(nextData.chartData.length);
    await expect(element.locator('.legend-text').nth(0)).toHaveText('Delta');
  });
});
