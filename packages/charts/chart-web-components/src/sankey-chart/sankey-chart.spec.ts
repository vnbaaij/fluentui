import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { SankeyChartData } from './sankey-chart.options.js';

const data: SankeyChartData = {
  nodes: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
  links: [
    { source: 0, target: 1, value: 10 },
    { source: 0, target: 2, value: 5 },
  ],
};

test.describe('SankeyChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-sankeychart--basic'));
    await page.setContent(`<fluent-sankey-chart data='${JSON.stringify(data)}'></fluent-sankey-chart>`);
    await page.waitForFunction(() => customElements.whenDefined('fluent-sankey-chart'));
  });

  test('Should render node rectangles', async ({ page }) => {
    const element = page.locator('fluent-sankey-chart');
    await expect(element.locator('.sankey-node')).toHaveCount(data.nodes.length);
  });

  test('Should render link paths', async ({ page }) => {
    const element = page.locator('fluent-sankey-chart');
    await expect(element.locator('.sankey-link')).toHaveCount(data.links.length);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-sankey-chart');
    await expect(element.locator('.legend-text').nth(0)).toHaveText('A');
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-sankey-chart');
    const legendCount = await element.locator('.legend-text').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should re-render when data changes', async ({ page }) => {
    const element = page.locator('fluent-sankey-chart');
    const nextData: SankeyChartData = {
      nodes: [{ name: 'X' }, { name: 'Y' }],
      links: [{ source: 0, target: 1, value: 20 }],
    };
    await element.evaluate((el, value) => el.setAttribute('data', JSON.stringify(value)), nextData);
    await expect(element.locator('.sankey-node')).toHaveCount(2);
  });
});
