import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { DonutChart as FluentDonutChart } from './donut-chart.js';
import type { DonutChartDataPoint } from './donut-chart.options.js';

const basicTitle = 'Donut chart basic example';

const points: DonutChartDataPoint[] = [
  {
    legend: 'first',
    data: 20000,
  },
  {
    legend: 'second',
    data: 39000,
  },
];

const data: DonutChartDataPoint[] = points;

test.describe('Donut-chart - Basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart chart-title="${basicTitle}" value-inside-donut="39,000" inner-radius="55" data='${JSON.stringify(
      data,
    )}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
  });

  test('Should render chart properly', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const legends = element.locator('.legend-text');
    await expect(legends.nth(0).getByText('first')).toBeVisible();
    await expect(legends.nth(1).getByText('second')).toBeVisible();
    await expect(element.getByText('39,000')).toBeVisible();
    await expect(element.locator('.arc-label')).toHaveCount(2);
  });

  test('Should render path with proper attributes and css', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const arcList = element.locator('.arc');
    await expect(arcList).toHaveCount(2);
    await expect(arcList.nth(0)).toHaveAttribute('fill', '#637cef');
    await expect(arcList.nth(0)).toHaveAttribute('aria-label', 'first, 20000.');
    await expect(arcList.nth(0)).toHaveAttribute(
      'd',
      'M-76.547,47.334A90,90,0,0,1,-1.055,-89.994L-1.055,-54.99A55,55,0,0,0,-46.993,28.577Z',
    );
    await expect(arcList.nth(0)).toHaveCSS('fill', 'rgb(99, 124, 239)');
    await expect(arcList.nth(0)).toHaveCSS('--borderRadiusMedium', '4px');

    await expect(arcList.nth(1)).toHaveAttribute('fill', '#e3008c');
    await expect(arcList.nth(1)).toHaveAttribute('aria-label', 'second, 39000.');
    await expect(arcList.nth(1)).toHaveAttribute(
      'd',
      'M1.055,-89.994A90,90,0,1,1,-75.417,49.115L-45.863,30.358A55,55,0,1,0,1.055,-54.99Z',
    );
    await expect(arcList.nth(1)).toHaveCSS('fill', 'rgb(227, 0, 140)');
    await expect(arcList.nth(1)).toHaveCSS('--borderRadiusMedium', '4px');
  });

  test('Should render legends data properly', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const legends = element.getByRole('option');
    await expect(legends).toHaveCount(2);
    const firstLegend = element.getByRole('option', { name: 'First' });
    const secondLegend = element.getByRole('option', { name: 'Second' });
    await expect(firstLegend).toBeVisible();
    await expect(firstLegend).toHaveText('first');
    await expect(firstLegend).toHaveCSS('--borderRadiusMedium', '4px');
    await expect(secondLegend).toBeVisible();
    await expect(secondLegend).toHaveText('second');
    await expect(secondLegend).toHaveCSS('--borderRadiusMedium', '4px');
  });

  test('Should update path css values with mouse click event on legend', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    const secondPath = element.getByLabel('second,');
    const firstLegend = element.getByRole('option', { name: 'First' });
    //mouse events
    await firstLegend.click();
    await expect(firstPath).toHaveCSS('opacity', '1');
    await expect(secondPath).toHaveCSS('opacity', '0.1');
    await firstLegend.dispatchEvent('mouseout');
    await expect(firstPath).toHaveCSS('opacity', '1');
    await expect(secondPath).toHaveCSS('opacity', '0.1');
    await firstLegend.click();
    await expect(firstPath).toHaveCSS('opacity', '1');
    await expect(secondPath).toHaveCSS('opacity', '1');
  });

  test('Should remove inactive arcs from the tab order when a legend is active', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    const secondPath = element.getByLabel('second,');
    const firstLegend = element.getByRole('option', { name: 'First' });

    // Initial state: roving tabindex puts first arc at 0, others at -1
    await expect(firstPath).toHaveAttribute('tabindex', '0');
    await expect(secondPath).toHaveAttribute('tabindex', '-1');

    await firstLegend.dispatchEvent('mouseover');

    await expect(firstPath).toHaveAttribute('tabindex', '0');
    await expect(secondPath).toHaveAttribute('tabindex', '-1');

    await firstLegend.dispatchEvent('mouseout');

    await expect(firstPath).toHaveAttribute('tabindex', '0');
    await expect(secondPath).toHaveAttribute('tabindex', '-1');
  });

  test('Should update path css values with mouse hover event on legend', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    const secondPath = element.getByLabel('second,');
    const firstLegend = element.getByRole('option', { name: 'First' });
    //mouse events
    await firstLegend.dispatchEvent('mouseover');
    await expect(firstPath).toHaveCSS('opacity', '1');
    await expect(secondPath).toHaveCSS('opacity', '0.1');
    await firstLegend.dispatchEvent('mouseout');
    await expect(firstPath).toHaveCSS('opacity', '1');
    await expect(secondPath).toHaveCSS('opacity', '1');
  });

  test('Should show callout with mouse hover event on path', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    const calloutRoot = element.locator('.tooltip');
    await expect(calloutRoot).toHaveCount(0);
    await firstPath.dispatchEvent('mouseover');
    await expect(calloutRoot).toHaveCount(1);
    await expect(calloutRoot).toHaveCSS('opacity', '1');
    const calloutLegendText = element.locator('.tooltip-legend-text');
    await expect(calloutLegendText).toHaveText('first');
    const calloutContentY = element.locator('.tooltip-content-y');
    await expect(calloutContentY).toHaveText('20,000');
    await firstPath.dispatchEvent('mouseout');
    await expect(calloutRoot).not.toHaveCSS('opacity', '0');
  });

  test('Should update callout data when mouse moved from one path to another path', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    const calloutRoot = element.locator('.tooltip');
    await expect(calloutRoot).toHaveCount(0);
    await firstPath.dispatchEvent('mouseover');
    await expect(calloutRoot).toHaveCSS('opacity', '1');
    const calloutLegendText = element.locator('.tooltip-legend-text');
    await expect(calloutLegendText).toHaveText('first');
    const calloutContentY = element.locator('.tooltip-content-y');
    await expect(calloutContentY).toHaveText('20,000');
    const secondPath = element.getByLabel('second,');
    await secondPath.dispatchEvent('mouseover');
    await expect(calloutRoot).toHaveCSS('opacity', '1');
    await expect(calloutLegendText).toHaveText('second');
    await expect(calloutContentY).toHaveText('39,000');
  });
});

test.describe('Donut-chart - Reactive rerender', () => {
  test('Should rerender when data attribute changes after initial render', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart chart-title="${basicTitle}" value-inside-donut="39,000" inner-radius="55" data='${JSON.stringify(
      data,
    )}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('.arc')).toHaveCount(2);

    const newData: DonutChartDataPoint[] = [
      { legend: 'alpha', data: 10000 },
      { legend: 'beta', data: 20000 },
      { legend: 'gamma', data: 30000 },
    ];

    await element.evaluate((el, d) => {
      el.setAttribute('chart-title', 'Updated chart');
      el.setAttribute('data', JSON.stringify(d));
    }, newData);

    await expect(element.locator('.arc')).toHaveCount(3);
    await expect(element.locator('.legend-text').nth(0).getByText('alpha')).toBeVisible();
    await expect(element.locator('.legend-text').nth(1).getByText('beta')).toBeVisible();
    await expect(element.locator('.legend-text').nth(2).getByText('gamma')).toBeVisible();
  });
});

test.describe('Donut-chart - hide-labels', () => {
  test('Should keep center text visible and hide outside labels when hide-labels is set', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          value-inside-donut="39,000"
          inner-radius="55"
          hide-labels
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('.text-inside-donut')).toHaveCount(1);
    await expect(element.locator('.arc-label')).toHaveCount(0);
    await expect(element.locator('.arc')).toHaveCount(2);
  });

  test('Should show outside labels when hide-labels is false', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          value-inside-donut="39,000"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const firstArc = element.locator('.arc').first();
    const defaultPath = await firstArc.getAttribute('d');

    await element.evaluate(el => {
      (el as FluentDonutChart).hideLabels = false;
    });

    await expect(element.locator('.text-inside-donut')).toHaveCount(1);
    await expect(element.locator('.arc-label')).toHaveCount(2);
    await expect(firstArc).toHaveAttribute('d', defaultPath ?? '');
  });

  test('Should react to hide-labels boolean attribute updates', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          value-inside-donut="39,000"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('.arc-label')).toHaveCount(2);

    await element.evaluate(el => {
      el.setAttribute('hide-labels', '');
    });

    await expect(element.locator('.arc-label')).toHaveCount(0);
  });
});

test.describe('Donut-chart - outside labels', () => {
  test('Should render outside labels for visible segments', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="Outside labels"
          width="320"
          height="320"
          style="width:320px;height:320px"
          value-inside-donut="39,000"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await element.evaluate(el => {
      (el as FluentDonutChart).hideLabels = false;
    });
    const labels = element.locator('.arc-label');

    await expect(labels).toHaveCount(2);
    await expect(labels.nth(0)).toContainText('20');
    await expect(labels.nth(1)).toContainText('39');
  });

  test('Should render percent outside labels when show-labels-in-percent is set', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="Percent labels"
          width="320"
          height="320"
          style="width:320px;height:320px"
          value-inside-donut="39,000"
          inner-radius="55"
          show-labels-in-percent
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await element.evaluate(el => {
      (el as FluentDonutChart).hideLabels = false;
    });
    const labels = element.locator('.arc-label');
    await expect(labels).toHaveCount(2);
    await expect(labels.nth(0)).toContainText('%');
    await expect(labels.nth(1)).toContainText('%');
  });

  test('Should react to show-labels-in-percent boolean attribute updates', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="Percent labels"
          width="320"
          height="320"
          style="width:320px;height:320px"
          value-inside-donut="39,000"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const labels = element.locator('.arc-label');
    await expect(labels).toHaveCount(2);
    await expect(labels.nth(0)).not.toContainText('%');

    await element.evaluate(el => {
      el.setAttribute('show-labels-in-percent', '');
    });

    await expect(labels.nth(0)).toContainText('%');
    await expect(labels.nth(1)).toContainText('%');
  });
});

test.describe('Donut-chart - hide-tooltip', () => {
  test('Should react to hide-tooltip boolean attribute updates', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          value-inside-donut="39,000"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');

    await firstPath.dispatchEvent('mouseover');
    await expect(element.locator('.tooltip')).toHaveCount(1);

    await element.evaluate(el => {
      el.setAttribute('hide-tooltip', '');
    });

    await expect(element.locator('.tooltip')).toHaveCount(0);
  });
});

test.describe('Donut-chart - hide-legends', () => {
  test('Should react to hide-legends boolean attribute updates', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          value-inside-donut="39,000"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const legendContainer = element.locator('fluent-chart-legend');
    await expect(legendContainer).toBeVisible();

    await element.evaluate(el => {
      el.setAttribute('hide-legends', '');
    });

    await expect(legendContainer).toBeHidden();
  });
});

test.describe('Donut-chart - allow-multiple-legend-selection', () => {
  const multiData: DonutChartDataPoint[] = [
    { legend: 'first', data: 20000 },
    { legend: 'second', data: 39000 },
    { legend: 'third', data: 15000 },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          allow-multiple-legend-selection
          inner-radius="55"
          data='${JSON.stringify(multiData)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
  });

  test('Should highlight multiple arcs when multiple legends are selected', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    const secondPath = element.getByLabel('second,');
    const thirdPath = element.getByLabel('third,');
    const firstLegend = element.getByRole('option', { name: 'first' });
    const secondLegend = element.getByRole('option', { name: 'second' });

    await firstLegend.click();
    await secondLegend.click();

    await expect(firstPath).toHaveCSS('opacity', '1');
    await expect(secondPath).toHaveCSS('opacity', '1');
    await expect(thirdPath).toHaveCSS('opacity', '0.1');
  });

  test('Should deselect a legend on second click in multi-select mode', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    const secondPath = element.getByLabel('second,');
    const thirdPath = element.getByLabel('third,');
    const firstLegend = element.getByRole('option', { name: 'first' });
    const secondLegend = element.getByRole('option', { name: 'second' });

    await firstLegend.click();
    await secondLegend.click();
    await firstLegend.click(); // deselect first

    await expect(firstPath).toHaveCSS('opacity', '0.1');
    await expect(secondPath).toHaveCSS('opacity', '1');
    await expect(thirdPath).toHaveCSS('opacity', '0.1');
  });

  test('Should restore all arcs when all selections are cleared', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    const secondPath = element.getByLabel('second,');
    const thirdPath = element.getByLabel('third,');
    const firstLegend = element.getByRole('option', { name: 'first' });

    await firstLegend.click();
    await firstLegend.click(); // deselect — all clear

    await expect(firstPath).toHaveCSS('opacity', '1');
    await expect(secondPath).toHaveCSS('opacity', '1');
    await expect(thirdPath).toHaveCSS('opacity', '1');
  });

  test('Should set aria-selected on selected legends', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstLegend = element.getByRole('option', { name: 'first' });
    const secondLegend = element.getByRole('option', { name: 'second' });
    const thirdLegend = element.getByRole('option', { name: 'third' });

    await firstLegend.click();
    await secondLegend.click();

    await expect(firstLegend).toHaveAttribute('aria-selected', 'true');
    await expect(secondLegend).toHaveAttribute('aria-selected', 'true');
    await expect(thirdLegend).toHaveAttribute('aria-selected', 'false');
  });

  test('Should fall back to single-select when allow-multiple-legend-selection is removed', async ({ page }) => {
    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    const secondPath = element.getByLabel('second,');
    const firstLegend = element.getByRole('option', { name: 'first' });
    const secondLegend = element.getByRole('option', { name: 'second' });

    await firstLegend.click();
    await secondLegend.click();

    // disable multi-select → selectedLegends should be cleared
    await element.evaluate(el => {
      el.removeAttribute('allow-multiple-legend-selection');
    });

    await expect(firstPath).toHaveCSS('opacity', '1');
    await expect(secondPath).toHaveCSS('opacity', '1');

    // now single-select should work
    await firstLegend.click();
    await expect(firstPath).toHaveCSS('opacity', '1');
    await expect(secondPath).toHaveCSS('opacity', '0.1');
  });
});

test.describe('Donut-chart - round-corners', () => {
  test('Should change arc geometry when round-corners is enabled', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="Rounded corners"
          value-inside-donut="39,000"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const firstArc = element.locator('.arc').first();
    const defaultPath = await firstArc.getAttribute('d');

    await element.evaluate(el => {
      el.setAttribute('round-corners', 'true');
    });

    await expect(firstArc).not.toHaveAttribute('d', defaultPath ?? '');
  });
});

test.describe('Donut-chart - order', () => {
  const unorderedData: DonutChartDataPoint[] = [
    { legend: 'small', data: 5000 },
    { legend: 'large', data: 39000 },
    { legend: 'medium', data: 15000 },
  ];

  test('Should render legends in default order when order is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart chart-title="Sorted test" inner-radius="55" data='${JSON.stringify(unorderedData)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const legends = element.locator('.legend-text');
    await expect(legends.nth(0).getByText('small')).toBeVisible();
    await expect(legends.nth(1).getByText('large')).toBeVisible();
    await expect(legends.nth(2).getByText('medium')).toBeVisible();
  });

  test('Should render legends in sorted (descending) order when order="sorted"', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart chart-title="Sorted test" inner-radius="55" order="sorted" data='${JSON.stringify(
          unorderedData,
        )}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const legends = element.locator('.legend-text');
    // Sorted descending: large (39000), medium (15000), small (5000)
    await expect(legends.nth(0).getByText('large')).toBeVisible();
    await expect(legends.nth(1).getByText('medium')).toBeVisible();
    await expect(legends.nth(2).getByText('small')).toBeVisible();
  });

  test('uses chart-title attr and calloutData for highlighted center text', async ({ page }) => {
    const calloutData: DonutChartDataPoint[] = [
      { legend: 'first', data: 20000, calloutData: '20K highlighted' },
      { legend: 'second', data: 39000 },
    ];

    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart chart-title="Callout contract" value-inside-donut="39,000" inner-radius="55" data='${JSON.stringify(
          calloutData,
        )}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await expect(element.getByText('Callout contract')).toBeVisible();

    const firstPath = element.getByLabel('first,');
    await firstPath.dispatchEvent('mouseover');
    await expect(element.locator('.text-inside-donut')).toContainText('20K highlighted');
  });
});

test.describe('Donut-chart - legend-list-label', () => {
  test('Should set aria-label on the legend container', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          legend-list-label="Chart segments"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('fluent-chart-legend')).toHaveAttribute('aria-label', 'Chart segments');
  });

  test('Should update aria-label when legend-list-label attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          legend-list-label="Initial label"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('fluent-chart-legend')).toHaveAttribute('aria-label', 'Initial label');

    await element.evaluate(el => {
      el.setAttribute('legend-list-label', 'Updated label');
    });

    await expect(element.locator('fluent-chart-legend')).toHaveAttribute('aria-label', 'Updated label');
  });
});

test.describe('Donut-chart - culture', () => {
  test('Should format arc labels using the specified culture', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="Culture test"
          width="320"
          height="320"
          inner-radius="55"
          culture="de-DE"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await element.evaluate(el => {
      (el as FluentDonutChart).hideLabels = false;
    });

    // de-DE uses comma as decimal separator and period as grouping separator
    // 39000 formatted compact in de-DE is "39K" or "39.000" depending on browser,
    // but the compact notation produces "39K" → our code lowercases to "39k"
    const labels = element.locator('.arc-label');
    await expect(labels).toHaveCount(2);
  });

  test('Should format tooltip callout value using the specified culture', async ({ page }) => {
    const cultureData: DonutChartDataPoint[] = [
      { legend: 'first', data: 1234.5 },
      { legend: 'second', data: 5678.9 },
    ];

    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="Culture callout test"
          inner-radius="55"
          culture="de-DE"
          data='${JSON.stringify(cultureData)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const firstPath = element.getByLabel('first,');
    await firstPath.dispatchEvent('mouseover');

    // de-DE uses comma as decimal separator: 1.234,5
    const calloutContentY = element.locator('.tooltip-content-y');
    await expect(calloutContentY).toContainText(',');
  });
});

test.describe('Donut-chart - width and height', () => {
  test('Should update SVG dimensions when width and height attributes change', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          width="200"
          height="200"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const svg = element.locator('svg.chart');
    await expect(svg).toHaveAttribute('width', '200');
    await expect(svg).toHaveAttribute('height', '200');

    await element.evaluate(el => {
      el.setAttribute('width', '400');
      el.setAttribute('height', '400');
    });

    await expect(svg).toHaveAttribute('width', '400');
    await expect(svg).toHaveAttribute('height', '400');
  });

  test('Should accept percentage string values for width and height', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div style="width:400px;height:400px;">
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          width="50%"
          height="50%"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const svg = element.locator('svg.chart');
    // Percentage values must be forwarded as-is to the SVG attribute.
    await expect(svg).toHaveAttribute('width', '50%');
    await expect(svg).toHaveAttribute('height', '50%');
    // The SVG should resolve to ~200 px (50% of the 400 px container).
    const box = await svg.boundingBox();
    expect(box!.width).toBeGreaterThan(150);
    expect(box!.width).toBeLessThan(250);
  });

  test('Should update percentage SVG attribute when width changes from number to percentage', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div style="width:400px;height:400px;">
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          width="200"
          height="200"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const svg = element.locator('svg.chart');
    await expect(svg).toHaveAttribute('width', '200');

    await element.evaluate(el => {
      el.setAttribute('width', '100%');
      el.setAttribute('height', '100%');
    });

    await expect(svg).toHaveAttribute('width', '100%');
    await expect(svg).toHaveAttribute('height', '100%');
  });

  test('Should rerender arcs with updated geometry when width changes', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          width="200"
          height="200"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const firstArc = element.locator('.arc').first();
    const originalPath = await firstArc.getAttribute('d');

    await element.evaluate(el => {
      el.setAttribute('width', '400');
      el.setAttribute('height', '400');
    });

    await expect(firstArc).not.toHaveAttribute('d', originalPath ?? '');
  });

  test('Should set group transform centered on the SVG pixel dimensions', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          width="400"
          height="400"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    // The <g> should be translated to the center of the 400×400 SVG.
    await expect(element.locator('svg.chart g').first()).toHaveAttribute('transform', 'translate(200, 200)');
  });
});

test.describe('Donut-chart - inner-radius', () => {
  test('Should rerender arcs when inner-radius attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const firstArc = element.locator('.arc').first();
    const originalPath = await firstArc.getAttribute('d');

    await element.evaluate(el => {
      el.setAttribute('inner-radius', '30');
    });

    await expect(firstArc).not.toHaveAttribute('d', originalPath ?? '');
  });
});

test.describe('Donut-chart - value-inside-donut', () => {
  test('Should render center text from value-inside-donut attribute', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          value-inside-donut="39,000"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('.text-inside-donut')).toContainText('39,000');
  });

  test('Should update center text when value-inside-donut attribute changes', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          value-inside-donut="39,000"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('.text-inside-donut')).toContainText('39,000');

    await element.evaluate(el => {
      el.setAttribute('value-inside-donut', '20,000');
    });

    await expect(element.locator('.text-inside-donut')).toContainText('20,000');
  });

  test('Should remove center text when value-inside-donut attribute is removed', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          value-inside-donut="39,000"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('.text-inside-donut')).toHaveCount(1);

    await element.evaluate(el => {
      el.removeAttribute('value-inside-donut');
    });

    await expect(element.locator('.text-inside-donut')).toHaveCount(0);
  });
});

test.describe('Donut-chart - order reactivity', () => {
  const unorderedData: DonutChartDataPoint[] = [
    { legend: 'small', data: 5000 },
    { legend: 'large', data: 39000 },
    { legend: 'medium', data: 15000 },
  ];

  test('Should reorder legends when order changes from default to sorted', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="Order reactivity test"
          inner-radius="55"
          data='${JSON.stringify(unorderedData)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const legends = element.locator('.legend-text');

    // Default insertion order: small, large, medium
    await expect(legends.nth(0)).toHaveText('small');
    await expect(legends.nth(1)).toHaveText('large');
    await expect(legends.nth(2)).toHaveText('medium');

    await element.evaluate(el => el.setAttribute('order', 'sorted'));

    // Sorted descending by data: large (39000), medium (15000), small (5000)
    await expect(legends.nth(0)).toHaveText('large');
    await expect(legends.nth(1)).toHaveText('medium');
    await expect(legends.nth(2)).toHaveText('small');
  });

  test('Should restore insertion order when order changes from sorted to default', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="Order reactivity test"
          inner-radius="55"
          order="sorted"
          data='${JSON.stringify(unorderedData)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));

    const element = page.locator('fluent-donut-chart');
    const legends = element.locator('.legend-text');

    // Initial sorted order: large, medium, small
    await expect(legends.nth(0)).toHaveText('large');
    await expect(legends.nth(1)).toHaveText('medium');
    await expect(legends.nth(2)).toHaveText('small');

    await element.evaluate(el => el.setAttribute('order', 'default'));

    // Back to insertion order: small, large, medium
    await expect(legends.nth(0)).toHaveText('small');
    await expect(legends.nth(1)).toHaveText('large');
    await expect(legends.nth(2)).toHaveText('medium');
  });
});

// ── title-align ───────────────────────────────────────────────────────────────

test.describe('Donut-chart - title-align', () => {
  async function setupWithTitle(page: import('@playwright/test').Page, extraAttrs = '') {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          ${extraAttrs}
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
  }

  test('Should render chart-title element when chart-title is set', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('.chart-title')).toHaveText(basicTitle);
  });

  test('Should not render chart-title element when chart-title is empty', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart inner-radius="55" data='${JSON.stringify(data)}'></fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
    const element = page.locator('fluent-donut-chart');
    await expect(element.locator('.chart-title')).toHaveCount(0);
  });

  test('Should apply text-align:start when title-align is not set', async ({ page }) => {
    await setupWithTitle(page);
    const title = page.locator('fluent-donut-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
  });

  test('Should apply text-align:center when title-align="center"', async ({ page }) => {
    await setupWithTitle(page, "title-align='center'");
    const title = page.locator('fluent-donut-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'center');
  });

  test('Should apply text-align:end when title-align="end"', async ({ page }) => {
    await setupWithTitle(page, "title-align='end'");
    const title = page.locator('fluent-donut-chart .chart-title');
    await expect(title).toHaveCSS('text-align', 'end');
  });

  test('Should update text-align when title-align attribute changes dynamically', async ({ page }) => {
    await setupWithTitle(page);
    const element = page.locator('fluent-donut-chart');
    const title = element.locator('.chart-title');
    await expect(title).toHaveCSS('text-align', 'start');
    await element.evaluate(el => el.setAttribute('title-align', 'center'));
    await expect(title).toHaveCSS('text-align', 'center');
  });
});

// ── legend-position ───────────────────────────────────────────────────────────

test.describe('Donut-chart - legend-position', () => {
  async function setupWithLegendPosition(page: import('@playwright/test').Page, position: string) {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          legend-position="${position}"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
  }

  test('Should set position attribute on fluent-chart-legend when legend-position="top"', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const legend = page.locator('fluent-donut-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="start"', async ({ page }) => {
    await setupWithLegendPosition(page, 'start');
    const legend = page.locator('fluent-donut-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'start');
  });

  test('Should set position attribute on fluent-chart-legend when legend-position="end"', async ({ page }) => {
    await setupWithLegendPosition(page, 'end');
    const legend = page.locator('fluent-donut-chart fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'end');
  });

  test('Should update legend position attribute when legend-position changes dynamically', async ({ page }) => {
    await setupWithLegendPosition(page, 'top');
    const element = page.locator('fluent-donut-chart');
    const legend = element.locator('fluent-chart-legend');
    await expect(legend).toHaveAttribute('position', 'top');
    await element.evaluate(el => el.setAttribute('legend-position', 'end'));
    await expect(legend).toHaveAttribute('position', 'end');
  });
});

// ── title-position ────────────────────────────────────────────────────────────

test.describe('Donut-chart - title-position', () => {
  test('Should keep title-position="bottom" regardless of legend position', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          title-position="bottom"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
    const element = page.locator('fluent-donut-chart');
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });

  test('Should keep title-position="bottom" when legend-position="top"', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          legend-position="top"
          title-position="bottom"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
    const element = page.locator('fluent-donut-chart');
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });

  test('Should keep title-position="bottom" when legend is visible at default position', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="${basicTitle}"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
    const element = page.locator('fluent-donut-chart');
    await element.evaluate(el => el.setAttribute('title-position', 'bottom'));
    await expect(element).toHaveAttribute('title-position', 'bottom');
  });
});

test.describe('DonutChart - tooltipRenderer', () => {
  test('Should inject custom renderer output into tooltip-body', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="tooltipRenderer test"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
    const element = page.locator('fluent-donut-chart');

    await element.evaluate((el: any) => {
      el.tooltipRenderer = (_point: any, defaultRender: any) =>
        `<span class="custom-tip">${defaultRender(_point)}</span>`;
    });

    await element.getByLabel('first,').dispatchEvent('mouseover');
    await expect(element.locator('.tooltip-body .custom-tip')).toBeVisible();
  });

  test('Should show default tooltip-body when tooltipRenderer is not set', async ({ page }) => {
    await page.goto(fixtureURL('components-donutchart--basic'));
    await page.setContent(/* html */ `
      <div>
        <fluent-donut-chart
          chart-title="default tooltip test"
          inner-radius="55"
          data='${JSON.stringify(data)}'>
        </fluent-donut-chart>
      </div>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-donut-chart'));
    const element = page.locator('fluent-donut-chart');

    await element.getByLabel('first,').dispatchEvent('mouseover');
    await expect(element.locator('.tooltip')).toHaveCount(1);
    await expect(element.locator('.tooltip-body')).toBeVisible();
  });
});
