import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { PolarChartSeries } from './polar-chart.options.js';

const data: PolarChartSeries[] = [
  {
    legend: 'Series A',
    data: [
      { x: 'Speed', y: 8 },
      { x: 'Power', y: 5 },
      { x: 'Agility', y: 7 },
    ],
  },
  {
    legend: 'Series B',
    data: [
      { x: 'Speed', y: 4 },
      { x: 'Power', y: 9 },
      { x: 'Agility', y: 3 },
    ],
  },
];

test.describe('PolarChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-polarchart--basic'));
    await page.setContent(`<fluent-polar-chart data='${JSON.stringify(data)}'></fluent-polar-chart>`);
    await page.waitForFunction(() => customElements.whenDefined('fluent-polar-chart'));
  });

  test('Should render series polygons', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await expect(element.locator('.polar-series')).toHaveCount(2);
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    const legendCount = await element.locator('.legend-text').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    const nextData: PolarChartSeries[] = [
      {
        legend: 'Series C',
        data: [
          { x: 'Speed', y: 6 },
          { x: 'Power', y: 4 },
          { x: 'Agility', y: 8 },
        ],
      },
    ];
    await element.evaluate((el, value) => el.setAttribute('data', JSON.stringify(value)), nextData);
    await expect(element.locator('.polar-series')).toHaveCount(1);
  });
});
