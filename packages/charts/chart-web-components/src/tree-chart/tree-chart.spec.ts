import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { TreeChartDataPoint } from './tree-chart.options.js';

const data: TreeChartDataPoint = {
  name: 'Root',
  fill: '#637cef',
  children: [
    { name: 'Child A', fill: '#e3008c' },
    { name: 'Child B', fill: '#107c10', children: [{ name: 'Leaf', fill: '#0078d4' }] },
  ],
};

test.describe('TreeChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-treechart--basic'));
    await page.setContent(`<fluent-tree-chart data='${JSON.stringify(data)}'></fluent-tree-chart>`);
    await page.waitForFunction(() => customElements.whenDefined('fluent-tree-chart'));
  });

  test('Should render node rectangles', async ({ page }) => {
    const element = page.locator('fluent-tree-chart');
    await expect(element.locator('.tree-node')).toHaveCount(4);
  });

  test('Should render link paths', async ({ page }) => {
    const element = page.locator('fluent-tree-chart');
    await expect(element.locator('.tree-link')).toHaveCount(3);
  });

  test('Should re-render when data changes', async ({ page }) => {
    const element = page.locator('fluent-tree-chart');
    const nextData: TreeChartDataPoint = {
      name: 'Next Root',
      children: [{ name: 'Next Child' }],
    };
    await element.evaluate((el, value) => el.setAttribute('data', JSON.stringify(value)), nextData);
    await expect(element.locator('.tree-node')).toHaveCount(2);
  });
});
