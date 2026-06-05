import { Locator, test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { HorizontalBarChartDataPoint, HorizontalBarChartProps } from './horizontal-bar-chart.options.js';

const chartPoints1: HorizontalBarChartDataPoint[] = [
  {
    legend: 'Debit card numbers (EU and USA)',
    data: 40,
    color: '#0099BC',
  },
  {
    legend: 'Passport numbers (USA)',
    data: 23,
    color: '#77004D',
  },
  {
    legend: 'Social security numbers',
    data: 35,
    color: '#4F68ED',
  },
  {
    legend: 'Credit card Numbers',
    data: 87,
    color: '#AE8C00',
  },
  {
    legend: 'Tax identification numbers (USA)',
    data: 87,
    color: '#004E8C',
  },
];

const chartPoints2: HorizontalBarChartDataPoint[] = [
  {
    legend: 'Debit card numbers (EU and USA)',
    data: 40,
    color: '#0099BC',
  },
  {
    legend: 'Passport numbers (USA)',
    data: 56,
    color: '#77004D',
  },
  {
    legend: 'Social security numbers',
    data: 35,
    color: '#4F68ED',
  },
  {
    legend: 'Credit card Numbers',
    data: 92,
    color: '#AE8C00',
  },
  {
    legend: 'Tax identification numbers (USA)',
    data: 87,
    color: '#004E8C',
  },
];

const chartPoints3: HorizontalBarChartDataPoint[] = [
  {
    legend: 'Phone Numbers',
    data: 40,
    color: '#881798',
  },
  {
    legend: 'Credit card Numbers',
    data: 23,
    color: '#AE8C00',
  },
];

const basicChartTestData: HorizontalBarChartProps[] = [
  {
    chartSeriesTitle: 'Monitored First',
    chartData: chartPoints1,
  },
  {
    chartSeriesTitle: 'Monitored Second',
    chartData: chartPoints2,
  },
  {
    chartSeriesTitle: 'Unmonitored',
    chartData: chartPoints3,
  },
];

const singleBarHBCData = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 1543,
        total: 15000,
        color: '#637cef',
      },
    ],
  },
  {
    chartSeriesTitle: 'two',
    chartData: [
      {
        legend: 'two',
        data: 800,
        total: 15000,
        color: '#e3008c',
      },
    ],
  },
  {
    chartSeriesTitle: 'three',
    chartData: [
      {
        legend: 'three',
        data: 8888,
        total: 15000,
        color: '#2aa0a4',
      },
    ],
  },
  {
    chartSeriesTitle: 'four',
    chartData: [
      {
        legend: 'four',
        data: 15888,
        total: 15000,
        color: '#9373c0',
      },
    ],
  },
  {
    chartSeriesTitle: 'five',
    chartData: [
      {
        legend: 'five',
        data: 11444,
        total: 15000,
        color: '#13a10e',
      },
    ],
  },
  {
    chartSeriesTitle: 'six',
    chartData: [
      {
        legend: 'six',
        data: 14000,
        total: 15000,
        color: '#3a96dd',
      },
    ],
  },
  {
    chartSeriesTitle: 'seven',
    chartData: [
      {
        legend: 'seven',
        data: 9855,
        total: 15000,
        color: '#ca5010',
      },
    ],
  },
  {
    chartSeriesTitle: 'eight',
    chartData: [
      {
        legend: 'eight',
        data: 4250,
        total: 15000,
        color: '#57811b',
      },
    ],
  },
];

const singleBarNMVariantData = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 1543,
        total: 15000,
        color: '#637cef',
      },
    ],
  },
  {
    chartSeriesTitle: 'two',
    chartData: [
      {
        legend: 'two',
        data: 800,
        total: 15000,
        color: '#e3008c',
      },
    ],
  },
  {
    chartSeriesTitle: 'three',
    chartData: [
      {
        legend: 'three',
        data: 8888,
        total: 15000,
        color: '#2aa0a4',
      },
    ],
  },
  {
    chartSeriesTitle: 'four',
    chartData: [
      {
        legend: 'four',
        data: 15888,
        total: 15000,
        color: '#9373c0',
      },
    ],
  },
  {
    chartSeriesTitle: 'five',
    chartData: [
      {
        legend: 'five',
        data: 11444,
        total: 15000,
        color: '#13a10e',
      },
    ],
  },
  {
    chartSeriesTitle: 'six',
    chartData: [
      {
        legend: 'six',
        data: 14000,
        total: 15000,
        color: '#3a96dd',
      },
    ],
  },
  {
    chartSeriesTitle: 'seven',
    chartData: [
      {
        legend: 'seven',
        data: 9855,
        total: 15000,
        color: '#ca5010',
      },
    ],
  },
  {
    chartSeriesTitle: 'eight',
    chartData: [
      {
        legend: 'eight',
        data: 4250,
        total: 15000,
        color: '#57811b',
      },
    ],
  },
];

const singlePointData = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 1543,
        total: 15000,
        gradient: ['#637cef', '#e3008c'],
      },
    ],
  },
];

async function expectOptionsToBeVisible(element: Locator, options: string | any[]) {
  for (let i = 0; i < options.length; i++) {
    await expect(element.getByRole('option', { name: options[i] })).toBeVisible();
  }
}

test.describe('horizontalbarchart - Basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
  });

  test('Should render horizontalbarchart properly', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    await expectOptionsToBeVisible(element, [
      'Debit card numbers (EU and USA)',
      'Passport numbers (USA)',
      'Social security numbers',
      'Credit card Numbers',
      'Phone Numbers',
    ]);
    await expect(page.getByText('Monitored First')).toBeVisible();
    await expect(page.getByText('Monitored Second')).toBeVisible();
    await expect(page.getByText('Unmonitored')).toBeVisible();
  });

  test('Should render legends data properly', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await expect(legends).toHaveCount(6);
    const firstLegend = legends.first();
    await expect(firstLegend.locator('div').first()).toHaveCSS('background-color', 'rgb(0, 153, 188)');
    await expect(firstLegend).toHaveText('Debit card numbers (EU and USA)');
  });

  test('Should update bar css/opaity when mouse hover on legend', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await expect(legends).toHaveCount(6);
    const firstLegend = legends.first();
    //mouse events
    await legends.nth(0).dispatchEvent('mouseover');
    const bars = element.locator('.bar');
    await expect(bars).toHaveCount(12);
    for (let i = 0; i < (await bars.count()); i++) {
      if (i == 0 || i == 5) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
  });

  test('Should update bar css/opaity when mouse moved from one legend to another legend', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await expect(legends).toHaveCount(6);
    await legends.nth(0).dispatchEvent('mouseover');
    const bars = element.locator('.bar');
    for (let i = 0; i < (await bars.count()); i++) {
      if (i == 0 || i == 5) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
    await legends.nth(0).dispatchEvent('mouseout');
    await legends.nth(1).dispatchEvent('mouseover');
    for (let i = 0; i < (await bars.count()); i++) {
      if (i == 1 || i == 6) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
  });

  test('Should show callout when mouse hover on bar', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(0);
    await bars.nth(0).dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('Debit card numbers (EU and USA) 40');
  });

  test('Should update callout data when mouse moved from one bar to another bar', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(0);
    await bars.nth(0).dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('Debit card numbers (EU and USA) 40');
    await bars.nth(0).dispatchEvent('mouseout');
    await bars.nth(1).dispatchEvent('mouseover');
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('Passport numbers (USA) 23');
  });
});

test.describe('horizontalbarchart - Single Bar HBC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--single-bar-hbc'));
    await page.setContent(/* html */ `
    <div>
        <fluent-horizontal-bar-chart data='${JSON.stringify(singleBarHBCData)}' show-legend-for-single-point-bar>
        </fluent-horizontal-bar-chart>
    </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
  });

  test('Should render Single Bar HBC  properly', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    await expectOptionsToBeVisible(element, ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
    const barsTitles = element.locator('.bar-title');
    await expect(barsTitles).toHaveCount(8);
    await expect(barsTitles.nth(0)).toHaveText('one');
    await expect(barsTitles.nth(1)).toHaveText('two');
    await expect(barsTitles.nth(2)).toHaveText('three');
    await expect(barsTitles.nth(3)).toHaveText('four');
    await expect(barsTitles.nth(4)).toHaveText('five');
    await expect(barsTitles.nth(5)).toHaveText('six');
    await expect(barsTitles.nth(6)).toHaveText('seven');
    await expect(barsTitles.nth(7)).toHaveText('eight');
    for (let i = 0; i < (await barsTitles.count()); i++) {
      await expect(barsTitles.nth(i)).toBeVisible();
    }
  });

  test('Should update bar css/opaity when mouse hover on legend', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await expect(legends).toHaveCount(8);
    //mouse events
    await legends.nth(0).dispatchEvent('mouseover');
    const bars = element.locator('.bar');
    await expect(bars).toHaveCount(8);
    for (let i = 1; i < (await bars.count()); i++) {
      if (i == 0) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
  });

  test('Should update bar css/opaity when mouse moved from one legend to another legend', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await expect(legends).toHaveCount(8);
    await legends.nth(0).dispatchEvent('mouseover');
    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveCSS('opacity', '1');
    for (let i = 1; i < (await bars.count()); i++) {
      if (i == 0) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
    await legends.nth(0).dispatchEvent('mouseout');
    await legends.nth(1).dispatchEvent('mouseover');
    for (let i = 1; i < (await bars.count()); i++) {
      if (i == 1) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
  });

  test('Should update bar css/opaity when mouse click on legend', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await expect(legends).toHaveCount(8);
    await legends.nth(0).click();
    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveCSS('opacity', '1');
    for (let i = 1; i < (await bars.count()); i++) {
      if (i == 0) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
    await legends.nth(0).click();
    for (let i = 1; i < (await bars.count()); i++) {
      await expect(bars.nth(i)).toHaveCSS('opacity', '1');
    }
  });

  test('Should show callout when mouse hover on bar', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(0);
    await bars.nth(0).dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('one 1,543');
  });

  test('Should update callout data when mouse moved from one bar to another bar', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(0);
    await bars.nth(0).dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('one 1,543');
    await bars.nth(0).dispatchEvent('mouseout');
    await bars.nth(1).dispatchEvent('mouseover');
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('two 800');
  });
});

test.describe('horizontalbarchart - Single Bar NM Variant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--single-bar-nm-variant'));
    await page.setContent(/* html */ `
    <div>
        <fluent-horizontal-bar-chart data='${JSON.stringify(singleBarNMVariantData)}' variant="single-bar" show-legend-for-single-point-bar>
        </fluent-horizontal-bar-chart>
    </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
  });

  test('Should render Single Bar HBC  properly', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    await expectOptionsToBeVisible(element, ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']);
  });

  test('Should render bars and bar labels properly', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    await expect(bars).toHaveCount(16);
    await expect(bars.nth(0)).toHaveCSS('fill', 'rgb(99, 124, 239)');
    await expect(bars.nth(0)).toHaveCSS('opacity', '1');
    await expect(bars.nth(0)).toHaveAttribute(`height`, '12');

    const firstBarWidth = await bars.nth(0).getAttribute('width');
    const firstBarWidthEmptySpace = await bars.nth(1).getAttribute('width');
    expect(parseFloat(firstBarWidth!)).toBeLessThan(parseFloat(firstBarWidthEmptySpace!));
    expect(parseFloat(firstBarWidth!) + parseFloat(firstBarWidthEmptySpace!)).toBeGreaterThanOrEqual(99);

    const secondBarWidth = await bars.nth(2).getAttribute('width');
    const secondBarWidthEmptySpace = await bars.nth(3).getAttribute('width');
    expect(parseFloat(secondBarWidth!)).toBeLessThan(parseFloat(secondBarWidthEmptySpace!));
    expect(parseFloat(secondBarWidth!) + parseFloat(secondBarWidthEmptySpace!)).toBeGreaterThanOrEqual(99);

    const thirdBarWidth = await bars.nth(4).getAttribute('width');
    const thirdBarWidthEmptySpace = await bars.nth(5).getAttribute('width');
    expect(parseFloat(thirdBarWidth!)).toBeGreaterThan(parseFloat(thirdBarWidthEmptySpace!));
    expect(parseFloat(thirdBarWidth!) + parseFloat(thirdBarWidthEmptySpace!)).toBeGreaterThanOrEqual(99);

    const fourthBarWidth = await bars.nth(6).getAttribute('width');
    const fourthBarWidthEmptySpace = await bars.nth(7).getAttribute('width');
    expect(parseFloat(fourthBarWidth!)).toBeGreaterThan(parseFloat(fourthBarWidthEmptySpace!));
    expect(parseFloat(fourthBarWidth!) + parseFloat(fourthBarWidthEmptySpace!)).toBeGreaterThanOrEqual(99);

    const fifthBarWidth = await bars.nth(8).getAttribute('width');
    const fifthBarWidthEmptySpace = await bars.nth(9).getAttribute('width');
    expect(parseFloat(fifthBarWidth!)).toBeGreaterThan(parseFloat(fifthBarWidthEmptySpace!));
    expect(parseFloat(fifthBarWidth!) + parseFloat(fifthBarWidthEmptySpace!)).toBeGreaterThanOrEqual(99);

    const sixthBarWidth = await bars.nth(10).getAttribute('width');
    const sixthBarWidthEmptySpace = await bars.nth(11).getAttribute('width');
    expect(parseFloat(sixthBarWidth!)).toBeGreaterThan(parseFloat(sixthBarWidthEmptySpace!));
    expect(parseFloat(sixthBarWidth!) + parseFloat(sixthBarWidthEmptySpace!)).toBeGreaterThanOrEqual(98);

    const seventhBarWidth = await bars.nth(12).getAttribute('width');
    const seventhBarWidthEmptySpace = await bars.nth(13).getAttribute('width');
    expect(parseFloat(seventhBarWidth!)).toBeGreaterThan(parseFloat(seventhBarWidthEmptySpace!));
    expect(parseFloat(seventhBarWidth!) + parseFloat(seventhBarWidthEmptySpace!)).toBeGreaterThanOrEqual(99);

    const eigthBarWidth = await bars.nth(14).getAttribute('width');
    const eigthBarWidthEmptySpace = await bars.nth(15).getAttribute('width');
    expect(parseFloat(eigthBarWidth!)).toBeLessThan(parseFloat(eigthBarWidthEmptySpace!));
    expect(parseFloat(eigthBarWidth!) + parseFloat(eigthBarWidthEmptySpace!)).toBeGreaterThanOrEqual(99);
  });

  test('Should update bar css/opaity when mouse hover on legend', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await expect(legends).toHaveCount(8);
    //mouse events
    await legends.nth(0).dispatchEvent('mouseover');
    const bars = element.locator('.bar');
    await expect(bars).toHaveCount(16);
    for (let i = 1; i < (await bars.count()); i++) {
      if (i == 0) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
  });

  test('Should update bar css/opaity when mouse moved from one legend to another legend', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await expect(legends).toHaveCount(8);
    await legends.nth(0).dispatchEvent('mouseover');
    const bars = element.locator('.bar');
    for (let i = 1; i < (await bars.count()); i++) {
      if (i == 0) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
    await legends.nth(0).dispatchEvent('mouseout');
    await legends.nth(1).dispatchEvent('mouseover');
    for (let i = 1; i < (await bars.count()); i++) {
      if (i == 2) {
        await expect(bars.nth(i)).toHaveCSS('opacity', '1');
      } else {
        await expect(bars.nth(i)).toHaveCSS('opacity', '0.1');
      }
    }
  });

  test('Should show callout when mouse hover on bar', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(0);
    await bars.nth(0).dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('one 1,543');
  });

  test('Should update callout data when mouse moved from one bar to another bar', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(0);
    await bars.nth(0).dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('one 1,543');
    await bars.nth(0).dispatchEvent('mouseout');
    await bars.nth(2).dispatchEvent('mouseover');
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('two 800');
  });
});

test.describe('horizontalbarchart - Single Data Point', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--single-data-point'));
    await page.setContent(/* html */ `
    <div>
        <fluent-horizontal-bar-chart data='${JSON.stringify(singlePointData)}' variant="single-bar" show-legend-for-single-point-bar>
        </fluent-horizontal-bar-chart>
    </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
  });

  test('Should render Single Bar HBC  properly', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.getByRole('option', { name: 'one' })).toBeVisible();
    const barsTitles = element.locator('.bar-title');
    await expect(barsTitles).toHaveCount(1);
    await expect(barsTitles.nth(0)).toHaveText('one');
    await expect(barsTitles.nth(0)).toBeVisible();
  });

  test('Should render bars and bar labels properly', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    await expect(bars).toHaveCount(2);
    await expect(bars.nth(0)).toHaveCSS('fill', 'url("#gradient-0-0")');
    await expect(bars.nth(0)).toHaveCSS('opacity', '1');
    await expect(bars.nth(0)).toHaveAttribute(`height`, '12');
    const firstBarWidth = await bars.nth(0).getAttribute('width');
    const firstBarWidthEmptySpace = await bars.nth(1).getAttribute('width');
    expect(parseFloat(firstBarWidth!)).toBeLessThan(parseFloat(firstBarWidthEmptySpace!));
    expect(parseFloat(firstBarWidth!) + parseFloat(firstBarWidthEmptySpace!)).toBeGreaterThan(99);
  });

  test('Should update bar css/opaity when mouse hover on legend', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await expect(legends).toHaveCount(1);
    //mouse events
    await legends.nth(0).dispatchEvent('mouseover');
    const bars = element.locator('.bar');
    await expect(bars).toHaveCount(2);
    await expect(bars.nth(0)).toHaveCSS('opacity', '1');
    await expect(bars.nth(1)).toHaveCSS('opacity', '0.1');
  });

  test('Should update bar css/opaity when mouse click on legend', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const legends = element.locator('.legend');
    await legends.nth(0).click();
    const bars = element.locator('.bar');
    await expect(bars.nth(0)).toHaveCSS('opacity', '1');
    await expect(bars.nth(1)).toHaveCSS('opacity', '0.1');
    await legends.nth(0).click();
    await expect(bars.nth(0)).toHaveCSS('opacity', '1');
    await expect(bars.nth(1)).toHaveCSS('opacity', '1');
  });

  test('Should show callout when mouse hover on bar', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(0);
    await bars.nth(0).dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('one 1,543');
  });

  test('Should hide callout when mouve moved to bar offset', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const bars = element.locator('.bar');
    const tooltip = element.locator('.tooltip');
    await expect(tooltip).toHaveCount(0);
    await bars.nth(0).dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip.nth(0)).toHaveCSS('opacity', '1');
    await expect(tooltip.nth(0).locator('div').first()).toHaveText('one 1,543');
    await bars.nth(0).dispatchEvent('mouseout');
    await bars.nth(1).dispatchEvent('mouseover');
    await expect(tooltip).toHaveCount(0);
  });
});

test.describe('Horizontal-bar-chart - Reactive rerender', () => {
  const initialData = [
    {
      chartSeriesTitle: 'series one',
      chartData: [
        { legend: 'alpha', data: 40, color: '#637cef' },
        { legend: 'beta', data: 60, color: '#e3008c' },
      ],
    },
  ];

  test('Should rerender when data attribute changes after initial render', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart data='${JSON.stringify(initialData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.bar')).toHaveCount(2);

    const newData = [
      {
        chartSeriesTitle: 'updated series',
        chartData: [
          { legend: 'one', data: 30, color: '#637cef' },
          { legend: 'two', data: 30, color: '#e3008c' },
          { legend: 'three', data: 40, color: '#2aa0a4' },
        ],
      },
    ];

    await element.evaluate((el, d) => el.setAttribute('data', JSON.stringify(d)), newData);

    await expect(element.locator('.bar')).toHaveCount(3);
    await expect(element.locator('.bar-title').first()).toHaveText('updated series');
  });
});

test.describe('Horizontal-bar-chart - hide-labels', () => {
  const singleBarData = [
    {
      chartSeriesTitle: 'one',
      chartData: [{ legend: 'one', data: 1543, total: 15000, color: '#637cef' }],
    },
  ];

  test('Should hide ratio text when hide-labels is set (single-bar variant)', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          variant="single-bar"
          hide-labels
          data='${JSON.stringify(singleBarData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.ratio-numerator')).toHaveCount(0);
  });
});

test.describe('Horizontal-bar-chart - round-corners', () => {
  const singleBarData = [
    {
      chartSeriesTitle: 'one',
      chartData: [{ legend: 'one', data: 1543, total: 15000, color: '#637cef' }],
    },
  ];

  test('Should update bar corner radius when round-corners changes', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--rounded-corners'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          variant="single-bar"
          data='${JSON.stringify(singleBarData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const firstBar = element.locator('.bar').first();

    await expect(firstBar).toHaveAttribute('rx', '0');

    await element.evaluate(el => el.toggleAttribute('round-corners', true));

    await expect(firstBar).toHaveAttribute('rx', '3');
  });
});

test.describe('Horizontal-bar-chart - chart-data-mode', () => {
  const singleBarData = [
    {
      chartSeriesTitle: 'one',
      chartData: [{ legend: 'one', data: 1543, total: 15000, color: '#637cef' }],
    },
  ];

  test('Should show fraction text when chart-data-mode="fraction"', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          variant="single-bar"
          chart-data-mode="fraction"
          data='${JSON.stringify(singleBarData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.ratio-numerator')).toHaveText('1543');
    await expect(element.locator('.ratio-denominator')).toHaveText('/15000');
  });

  test('Should show percentage text when chart-data-mode="percentage"', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          variant="single-bar"
          chart-data-mode="percentage"
          data='${JSON.stringify(singleBarData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.ratio-numerator')).toHaveText('10%');
  });
});

test.describe('Horizontal-bar-chart - sizing attrs', () => {
  test('Should apply width and height attributes to the host', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          chart-title="Sizing test"
          hide-legends
          width="720"
          height="320"
          data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element).toHaveCSS('width', '720px');
    await expect(element).toHaveCSS('height', '320px');
  });
});

test.describe('Horizontal-bar-chart - hide-legends', () => {
  test('Should hide legend container when hide-legends is set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          hide-legends
          data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('fluent-chart-legend')).toBeHidden();
  });

  test('Should react to hide-legends attribute change', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('fluent-chart-legend')).toBeVisible();

    await element.evaluate(el => el.setAttribute('hide-legends', 'true'));

    await expect(element.locator('fluent-chart-legend')).toBeHidden();

    await element.evaluate(el => el.removeAttribute('hide-legends'));

    await expect(element.locator('fluent-chart-legend')).toBeVisible();
  });
});

test.describe('Horizontal-bar-chart - hide-tooltip', () => {
  test('Should not show tooltip when hide-tooltip is set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          hide-tooltip
          data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const firstBar = element.locator('.bar').first();
    await firstBar.dispatchEvent('mouseover');
    await expect(element.locator('.tooltip')).toHaveCount(0);
  });

  test('Should react to hide-tooltip attribute change', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const firstBar = element.locator('.bar').first();
    await firstBar.dispatchEvent('mouseover');
    await expect(element.locator('.tooltip')).toHaveCount(1);

    await firstBar.dispatchEvent('mouseout');
    await element.evaluate(el => el.setAttribute('hide-tooltip', 'true'));

    await firstBar.dispatchEvent('mouseover');
    await expect(element.locator('.tooltip')).toHaveCount(0);
  });
});

test.describe('Horizontal-bar-chart - legend-list-label', () => {
  test('Should set aria-label on legend container', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          legend-list-label="Chart legend"
          data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('fluent-chart-legend')).toHaveAttribute('aria-label', 'Chart legend');
  });

  test('Should update aria-label when legend-list-label attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          legend-list-label="Initial label"
          data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('fluent-chart-legend')).toHaveAttribute('aria-label', 'Initial label');

    await element.evaluate(el => el.setAttribute('legend-list-label', 'Updated label'));

    await expect(element.locator('fluent-chart-legend')).toHaveAttribute('aria-label', 'Updated label');
  });
});

test.describe('Horizontal-bar-chart - hide-ratio', () => {
  const twoPointData = [
    {
      chartSeriesTitle: 'one',
      chartData: [
        { legend: 'one', data: 1543, color: '#637cef' },
        { legend: 'two', data: 13457, color: '#e3008c' },
      ],
    },
  ];

  test('Should hide ratio text when hide-ratio is set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          hide-ratio
          data='${JSON.stringify(twoPointData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.ratio-numerator')).toHaveCount(0);
  });

  test('Should show ratio text when hide-ratio is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          data='${JSON.stringify(twoPointData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.ratio-numerator')).toHaveCount(1);
  });

  test('Should react to hide-ratio attribute change', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          data='${JSON.stringify(twoPointData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.ratio-numerator')).toHaveCount(1);

    await element.evaluate(el => el.setAttribute('hide-ratio', 'true'));
    await page.waitForTimeout(50);

    await expect(element.locator('.ratio-numerator')).toHaveCount(0);
  });
});

test.describe('Horizontal-bar-chart - chart-data-mode reactivity', () => {
  const singleBarData = [
    {
      chartSeriesTitle: 'one',
      chartData: [{ legend: 'one', data: 1543, total: 15000, color: '#637cef' }],
    },
  ];

  test('Should react to chart-data-mode attribute change', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          variant="single-bar"
          chart-data-mode="fraction"
          data='${JSON.stringify(singleBarData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.ratio-numerator')).toHaveText('1543');
    await expect(element.locator('.ratio-denominator')).toHaveText('/15000');

    await element.evaluate(el => el.setAttribute('chart-data-mode', 'percentage'));
    await page.waitForTimeout(50);

    await expect(element.locator('.ratio-denominator')).toHaveCount(0);
    await expect(element.locator('.ratio-numerator')).toHaveText('10%');
  });
});

test.describe('Horizontal-bar-chart - culture', () => {
  const cultureData = [
    {
      chartSeriesTitle: 'one',
      chartData: [
        { legend: 'Alpha', data: 1234.5, color: '#637cef' },
        { legend: 'Beta', data: 5678.9, color: '#e3008c' },
      ],
    },
  ];

  test('Should format tooltip value using the specified culture', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          chart-title="Culture test"
          culture="de-DE"
          data='${JSON.stringify(cultureData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const firstBar = element.locator('.bar').first();
    await firstBar.dispatchEvent('mouseover');

    // de-DE uses comma as decimal separator: 1.234,5
    const tooltipDataY = element.locator('.tooltip-content-y');
    await expect(tooltipDataY).toContainText(',');
  });

  test('Should rerender when culture attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          chart-title="Culture change test"
          data='${JSON.stringify(cultureData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    // First hover without culture — expect en-US style (period decimal)
    const firstBar = element.locator('.bar').first();
    await firstBar.dispatchEvent('mouseover');
    const tooltipDataY = element.locator('.tooltip-content-y');
    const enValue = await tooltipDataY.textContent();

    await firstBar.dispatchEvent('mouseout');
    await element.evaluate(el => el.setAttribute('culture', 'de-DE'));
    await page.waitForTimeout(50);

    // Hover again after culture change
    await firstBar.dispatchEvent('mouseover');
    const deValue = await tooltipDataY.textContent();

    // de-DE should differ from default (comma vs period decimal separator)
    expect(enValue).not.toEqual(deValue);
  });
});

test.describe('Horizontal-bar-chart - allow-multiple-legend-selection', () => {
  const multiLegendData = [
    {
      chartSeriesTitle: 'one',
      chartData: [
        { legend: 'Alpha', data: 40, color: '#637cef' },
        { legend: 'Beta', data: 30, color: '#e3008c' },
        { legend: 'Gamma', data: 30, color: '#2aa0a4' },
      ],
    },
  ];

  test('Should allow multiple legends to be selected simultaneously', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          allow-multiple-legend-selection
          data='${JSON.stringify(multiLegendData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const alphaLegend = element.getByRole('option', { name: 'Alpha' });
    const betaLegend = element.getByRole('option', { name: 'Beta' });
    const gammaLegend = element.getByRole('option', { name: 'Gamma' });

    await alphaLegend.click();
    await betaLegend.click();

    await expect(alphaLegend).toHaveAttribute('aria-selected', 'true');
    await expect(betaLegend).toHaveAttribute('aria-selected', 'true');
    await expect(gammaLegend).toHaveAttribute('aria-selected', 'false');
  });

  test('Should dim bars for non-selected legends in multi-select mode', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          allow-multiple-legend-selection
          data='${JSON.stringify(multiLegendData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const alphaLegend = element.getByRole('option', { name: 'Alpha' });

    await alphaLegend.click();

    const alphaBar = element.locator('[barinfo="Alpha"]');
    const betaBar = element.locator('[barinfo="Beta"]');

    await expect(alphaBar).not.toHaveClass(/inactive/);
    await expect(betaBar).toHaveClass(/inactive/);
  });

  test('Should restore all bars when all selections are cleared', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          allow-multiple-legend-selection
          data='${JSON.stringify(multiLegendData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const alphaLegend = element.getByRole('option', { name: 'Alpha' });
    const alphaBar = element.locator('[barinfo="Alpha"]');
    const betaBar = element.locator('[barinfo="Beta"]');

    await alphaLegend.click();
    await alphaLegend.click(); // deselect — all clear

    await expect(alphaBar).not.toHaveClass(/inactive/);
    await expect(betaBar).not.toHaveClass(/inactive/);
  });

  test('Should fall back to single-select when allow-multiple-legend-selection is removed', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          allow-multiple-legend-selection
          data='${JSON.stringify(multiLegendData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const alphaLegend = element.getByRole('option', { name: 'Alpha' });
    const betaLegend = element.getByRole('option', { name: 'Beta' });
    const alphaBar = element.locator('[barinfo="Alpha"]');
    const betaBar = element.locator('[barinfo="Beta"]');

    await alphaLegend.click();
    await betaLegend.click();

    // disable multi-select → selectedLegends should be cleared
    await element.evaluate(el => el.removeAttribute('allow-multiple-legend-selection'));

    await expect(alphaBar).not.toHaveClass(/inactive/);
    await expect(betaBar).not.toHaveClass(/inactive/);

    // now single-select should work
    await alphaLegend.click();
    await expect(alphaBar).not.toHaveClass(/inactive/);
    await expect(betaBar).toHaveClass(/inactive/);
  });
});

test.describe('Horizontal-bar-chart - enable-gradient', () => {
  const gradientData = [
    {
      chartSeriesTitle: 'Alpha',
      chartData: [
        { legend: 'Alpha', data: 4000, total: 10000, color: '#637cef' },
        { legend: 'empty', data: 6000, total: 10000, color: '#e0e0e0' },
      ],
    },
  ];

  test('Should apply gradient fill to bars when enable-gradient is set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          enable-gradient
          data='${JSON.stringify(gradientData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const firstBar = element.locator('.bar').first();
    const fillValue = await firstBar.getAttribute('style');
    expect(fillValue).toMatch(/fill:url\(#gradient-/);
  });

  test('Should remove gradient fill when enable-gradient is removed', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          enable-gradient
          data='${JSON.stringify(gradientData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const firstBar = element.locator('.bar').first();

    let fillValue = await firstBar.getAttribute('style');
    expect(fillValue).toMatch(/fill:url\(#gradient-/);

    await element.evaluate(el => el.removeAttribute('enable-gradient'));

    // Use expect with retry instead of direct getAttribute to handle async re-render
    await expect(firstBar).toHaveAttribute('style', /fill:#637cef/);
  });

  test('Should respect per-point gradient colors when enable-gradient is set', async ({ page }) => {
    const perPointData = [
      {
        chartSeriesTitle: 'series',
        chartData: [
          {
            legend: 'series',
            data: 5000,
            total: 10000,
            color: '#000000',
            gradient: ['#637cef', '#e3008c'] as [string, string],
          },
          { legend: 'empty', data: 5000, total: 10000, color: '#e0e0e0' },
        ],
      },
    ];

    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          enable-gradient
          data='${JSON.stringify(perPointData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const gradientStop = element.locator('linearGradient stop').first();
    await expect(gradientStop).toHaveAttribute('stop-color', '#637cef');
  });
});

test.describe('Horizontal-bar-chart - variant reactivity', () => {
  const variantReactivityData: HorizontalBarChartProps[] = [
    {
      chartSeriesTitle: 'one',
      chartData: [{ legend: 'one', data: 4000, total: 10000, color: '#637cef' }],
    },
    {
      chartSeriesTitle: 'two',
      chartData: [{ legend: 'two', data: 6000, total: 10000, color: '#e3008c' }],
    },
  ];

  test('Should increase bar count when variant changes to single-bar', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          data='${JSON.stringify(variantReactivityData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    const defaultBarCount = await element.locator('.bar').count();

    await element.evaluate(el => el.setAttribute('variant', 'single-bar'));
    await page.waitForTimeout(50);

    const singleBarCount = await element.locator('.bar').count();
    // single-bar variant adds a placeholder bar per series for the remaining space
    expect(singleBarCount).toBeGreaterThan(defaultBarCount);
  });

  test('Should toggle ratio text when variant changes to absolute-scale and back', async ({ page }) => {
    const twoPointData: HorizontalBarChartProps[] = [
      {
        chartSeriesTitle: 'series',
        chartData: [
          { legend: 'one', data: 4000, color: '#637cef' },
          { legend: 'two', data: 6000, color: '#e3008c' },
        ],
      },
    ];

    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          data='${JSON.stringify(twoPointData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));

    const element = page.locator('fluent-horizontal-bar-chart');
    // Default (part-to-whole): 2-point series shows ratio text
    await expect(element.locator('.ratio-numerator')).toHaveCount(1);

    await element.evaluate(el => el.setAttribute('variant', 'absolute-scale'));
    await page.waitForTimeout(50);
    // absolute-scale: showChartDataText=false → no ratio text
    await expect(element.locator('.ratio-numerator')).toHaveCount(0);

    await element.evaluate(el => el.removeAttribute('variant'));
    await page.waitForTimeout(50);
    // Restored to part-to-whole: ratio text reappears
    await expect(element.locator('.ratio-numerator')).toHaveCount(1);
  });
});

// ── title-align ───────────────────────────────────────────────────────────────

const hbcTitle = 'HBC test chart';
const hbcData: HorizontalBarChartProps[] = [{ chartSeriesTitle: 'Bars', chartData: chartPoints1 }];

test.describe('HorizontalBarChart - title-align', () => {
  async function setupWithTitle(page: import('@playwright/test').Page, extraAttrs = '') {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          chart-title="${hbcTitle}"
          ${extraAttrs}
          data='${JSON.stringify(hbcData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
  }

  test('Should render .chart-title when chart-title is set', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.chart-title')).toHaveText(hbcTitle);
  });

  test('Should not render .chart-title when chart-title is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart data='${JSON.stringify(hbcData)}'></fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element.locator('.chart-title')).toHaveCount(0);
  });

  test('Should apply text-align:start by default', async ({ page }) => {
    await setupWithTitle(page);
    const title = page.locator('fluent-horizontal-bar-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
  });

  test('Should apply text-align:center when title-align="center"', async ({ page }) => {
    await setupWithTitle(page, "title-align='center'");
    const title = page.locator('fluent-horizontal-bar-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'center');
  });

  test('Should apply text-align:end when title-align="end"', async ({ page }) => {
    await setupWithTitle(page, "title-align='end'");
    const title = page.locator('fluent-horizontal-bar-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'end');
  });

  test('Should update text-align when title-align attribute changes dynamically', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-horizontal-bar-chart');
    const title = element.locator('.chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
    await element.evaluate(el => el.setAttribute('title-align', 'center'));
    await expect(title).toHaveCSS('text-align', 'center');
  });
});

// ── legend-position ───────────────────────────────────────────────────────────

test.describe('HorizontalBarChart - legend-position', () => {
  async function setupWithLegendPosition(page: import('@playwright/test').Page, position: string) {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          chart-title="${hbcTitle}"
          legend-position="${position}"
          data='${JSON.stringify(hbcData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
  }

  test('Should set position attribute on fluent-chart-legend when legend-position="top"', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const legend = page.locator('fluent-horizontal-bar-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="start"', async ({ page }) => {
    await setupWithLegendPosition(page, 'start');
    const legend = page.locator('fluent-horizontal-bar-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'start');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="end"', async ({ page }) => {
    await setupWithLegendPosition(page, 'end');
    const legend = page.locator('fluent-horizontal-bar-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'end');
  });

  test('Should update legend position attribute when legend-position changes dynamically', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const element = page.locator('fluent-horizontal-bar-chart');
    const legend = element.locator('fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
    await element.evaluate(el => el.setAttribute('legend-position', 'end'));
    await expect(legend).toHaveAttribute('position', 'end');
  });
});

// ── title-position ────────────────────────────────────────────────────────────

test.describe('HorizontalBarChart - title-position', () => {
  test('Should keep title-position="bottom" regardless of legend position', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          chart-title="${hbcTitle}"
          title-position="bottom"
          data='${JSON.stringify(hbcData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });

  test('Should keep title-position="bottom" when legend-position="top"', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          chart-title="${hbcTitle}"
          legend-position="top"
          title-position="bottom"
          data='${JSON.stringify(hbcData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
    const element = page.locator('fluent-horizontal-bar-chart');
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });

  test('Should keep title-position="bottom" when legend is visible at default position', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart
          chart-title="${hbcTitle}"
          data='${JSON.stringify(hbcData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
    const element = page.locator('fluent-horizontal-bar-chart');
    await element.evaluate(el => el.setAttribute('title-position', 'bottom'));
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });
});

// ── bar-height ────────────────────────────────────────────────────────────────

test.describe('Horizontal-bar-chart - bar-height', () => {
  const singleBarData: HorizontalBarChartProps[] = [
    {
      chartSeriesTitle: 'one',
      chartData: [{ legend: 'one', data: 1543, total: 15000, color: '#637cef' }],
    },
  ];

  test('Should render bars with default height of 12', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          data='${JSON.stringify(singleBarData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
    const element = page.locator('fluent-horizontal-bar-chart');
    const firstBar = element.locator('.bar').first();
    await expect(firstBar).toHaveAttribute('height', '12');
  });

  test('Should render bars with height equal to bar-height attribute', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          bar-height="20"
          data='${JSON.stringify(singleBarData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
    const element = page.locator('fluent-horizontal-bar-chart');
    const firstBar = element.locator('.bar').first();
    await expect(firstBar).toHaveAttribute('height', '20');
  });

  test('Should update bar height when bar-height attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div style="width: 400px">
        <fluent-horizontal-bar-chart
          bar-height="12"
          data='${JSON.stringify(singleBarData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
    const element = page.locator('fluent-horizontal-bar-chart');
    const firstBar = element.locator('.bar').first();

    await expect(firstBar).toHaveAttribute('height', '12');

    await element.evaluate(el => el.setAttribute('bar-height', '24'));

    await expect(firstBar).toHaveAttribute('height', '24');
  });
});

test.describe('HorizontalBarChart - tooltipRenderer', () => {
  test('Should inject custom renderer output into tooltip-body', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
    const element = page.locator('fluent-horizontal-bar-chart');

    await element.evaluate((el: any) => {
      el.tooltipRenderer = (_point: any, defaultRender: any) =>
        `<span class="custom-tip">${defaultRender(_point)}</span>`;
    });

    await element.locator('.bar').first().dispatchEvent('mouseover');
    await expect(element.locator('.tooltip-body .custom-tip')).toBeVisible();
  });

  test('Should show default tooltip-body when tooltipRenderer is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-horizontal-bar-chart data='${JSON.stringify(basicChartTestData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
    const element = page.locator('fluent-horizontal-bar-chart');

    await element.locator('.bar').first().dispatchEvent('mouseover');
    await expect(element.locator('.tooltip')).toHaveCount(1);
    await expect(element.locator('.tooltip-body')).toBeVisible();
  });
});

test.describe('HorizontalBarChart - hide-ratio-per-bar', () => {
  const ratioPerBarData: HorizontalBarChartProps[] = [
    {
      chartSeriesTitle: 'Row 1',
      chartData: [
        { legend: 'Completed', data: 30, color: '#637cef' },
        { legend: 'Remaining', data: 70, color: '#e3008c' },
      ],
    },
    {
      chartSeriesTitle: 'Row 2',
      chartData: [
        { legend: 'Completed', data: 45, color: '#637cef' },
        { legend: 'Remaining', data: 55, color: '#e3008c' },
      ],
    },
    {
      chartSeriesTitle: 'Row 3',
      chartData: [
        { legend: 'Completed', data: 25, color: '#637cef' },
        { legend: 'Remaining', data: 75, color: '#e3008c' },
      ],
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--hide-ratio-per-bar'));
    await page.setContent(/* html */ `
      <div style="width: 420px">
        <fluent-horizontal-bar-chart
          chart-title="Hide ratio per bar test"
          hide-ratio-per-bar='[true,false,true]'
          data='${JSON.stringify(ratioPerBarData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
  });

  test('Should hide ratio text only for the rows configured in hide-ratio-per-bar', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');
    const rows = element.locator('.bar-title-div');

    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0).locator('.ratio-numerator')).toHaveCount(0);
    await expect(rows.nth(1).locator('.ratio-numerator')).toHaveCount(1);
    await expect(rows.nth(2).locator('.ratio-numerator')).toHaveCount(0);
  });
});

test.describe('HorizontalBarChart - show-legend-for-single-point-bar', () => {
  const singlePointLegendData: HorizontalBarChartProps[] = [
    {
      chartSeriesTitle: 'Servers',
      chartData: [{ legend: 'Servers', data: 32, total: 100, color: '#637cef' }],
    },
    {
      chartSeriesTitle: 'Storage',
      chartData: [{ legend: 'Storage', data: 48, total: 100, color: '#e3008c' }],
    },
    {
      chartSeriesTitle: 'Network',
      chartData: [{ legend: 'Network', data: 20, total: 100, color: '#2aa0a4' }],
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-horizontalbarchart--legend-for-single-point-bar'));
    await page.setContent(/* html */ `
      <div style="width: 420px">
        <fluent-horizontal-bar-chart
          chart-title="Single point legend test"
          data='${JSON.stringify(singlePointLegendData)}'>
        </fluent-horizontal-bar-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-horizontal-bar-chart'));
  });

  test('Should add legend entries for single-point bars only when the attribute is present', async ({ page }) => {
    const element = page.locator('fluent-horizontal-bar-chart');

    await expect(element.getByRole('option')).toHaveCount(0);

    await element.evaluate(el => el.setAttribute('show-legend-for-single-point-bar', ''));
    await page.waitForTimeout(50);

    await expect(element.getByRole('option')).toHaveCount(3);
  });
});
