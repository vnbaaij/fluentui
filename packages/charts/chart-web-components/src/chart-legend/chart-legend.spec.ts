import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { ChartLegend as FluentChartLegend } from './chart-legend.js';

const items = [
  { legend: 'Apples', color: '#637cef' },
  { legend: 'Oranges', color: '#e3008c' },
  { legend: 'Bananas', color: '#00b7c3' },
];

const itemsJSON = JSON.stringify(items);

async function setup(page: import('@playwright/test').Page, extraAttrs = '') {
  await page.goto(fixtureURL('components-chartlegend--basic'));
  await page.setContent(/* html */ `
    <div>
      <fluent-chart-legend
        label="Chart legend"
        ${extraAttrs}
      ></fluent-chart-legend>
    </div>
  `);
  await page.waitForFunction(() => customElements.whenDefined('fluent-chart-legend'));
  // Set items imperatively so they are not serialised into HTML
  await page.evaluate(items => {
    (document.querySelector('fluent-chart-legend') as any).items = items;
  }, items);
}

// ── Rendering ────────────────────────────────────────────────────────────────

test.describe('ChartLegend - rendering', () => {
  test('Should render one button per item', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await expect(element.getByRole('option')).toHaveCount(3);
  });

  test('Should render legend text inside each button', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await expect(element.getByRole('option', { name: 'Apples' })).toBeVisible();
    await expect(element.getByRole('option', { name: 'Oranges' })).toBeVisible();
    await expect(element.getByRole('option', { name: 'Bananas' })).toBeVisible();
  });

  test('Should set aria-setsize and aria-posinset on each button', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    const buttons = element.getByRole('option');
    await expect(buttons.nth(0)).toHaveAttribute('aria-setsize', '3');
    await expect(buttons.nth(0)).toHaveAttribute('aria-posinset', '1');
    await expect(buttons.nth(2)).toHaveAttribute('aria-posinset', '3');
  });
});

// ── Accessibility ────────────────────────────────────────────────────────────

test.describe('ChartLegend - aria-label', () => {
  test('Should set aria-label on the host element', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await expect(element).toHaveAttribute('aria-label', 'Chart legend');
  });

  test('Should update aria-label when label attribute changes', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await element.evaluate(el => el.setAttribute('label', 'Updated label'));
    await expect(element).toHaveAttribute('aria-label', 'Updated label');
  });
});

// ── Visibility ───────────────────────────────────────────────────────────────

test.describe('ChartLegend - hidden', () => {
  test('Should be hidden when hidden attribute is present', async ({ page }) => {
    await setup(page, 'hidden');
    await expect(page.locator('fluent-chart-legend')).toBeHidden();
  });

  test('Should become visible when hidden attribute is removed', async ({ page }) => {
    await setup(page, 'hidden');
    const element = page.locator('fluent-chart-legend');
    await element.evaluate(el => el.removeAttribute('hidden'));
    await expect(element).toBeVisible();
  });
});

// ── Highlighted state ────────────────────────────────────────────────────────

test.describe('ChartLegend - highlighted', () => {
  test('All buttons should have no inactive class when highlighted is empty', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    const buttons = element.getByRole('option');
    await expect(buttons.nth(0)).not.toHaveClass(/inactive/);
    await expect(buttons.nth(1)).not.toHaveClass(/inactive/);
    await expect(buttons.nth(2)).not.toHaveClass(/inactive/);
  });

  test('Non-highlighted buttons should get inactive class', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await element.evaluate(el => {
      (el as FluentChartLegend).highlighted = ['Apples'];
    });
    const apples = element.getByRole('option', { name: 'Apples' });
    const oranges = element.getByRole('option', { name: 'Oranges' });
    await expect(apples).not.toHaveClass(/inactive/);
    await expect(oranges).toHaveClass(/inactive/);
  });

  test('Highlighted button should have aria-selected true', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await element.evaluate(el => {
      (el as FluentChartLegend).highlighted = ['Oranges'];
    });
    await expect(element.getByRole('option', { name: 'Oranges' })).toHaveAttribute('aria-selected', 'true');
    await expect(element.getByRole('option', { name: 'Apples' })).toHaveAttribute('aria-selected', 'false');
  });

  test('Clearing highlighted should remove all inactive classes', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await element.evaluate(el => {
      (el as FluentChartLegend).highlighted = ['Apples'];
    });
    await element.evaluate(el => {
      (el as FluentChartLegend).highlighted = [];
    });
    await expect(element.getByRole('option', { name: 'Oranges' })).not.toHaveClass(/inactive/);
  });
});

// ── Position ─────────────────────────────────────────────────────────────────

test.describe('ChartLegend - position', () => {
  test('Should reflect position attribute on host element', async ({ page }) => {
    await setup(page, "position='start'");
    const element = page.locator('fluent-chart-legend');
    await expect(element).toHaveAttribute('position', 'start');
  });

  test('Should update position attribute dynamically', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await element.evaluate(el => el.setAttribute('position', 'end'));
    await expect(element).toHaveAttribute('position', 'end');
  });

  test('Should have no position attribute by default', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await expect(element).not.toHaveAttribute('position');
  });
});


test.describe('ChartLegend - events', () => {
  test('Should emit legend-click with legend title on button click', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await element.evaluate(el => {
      (el as any).__lastLegendClick = null;
      el.addEventListener('legend-click', (e: Event) => {
        (el as any).__lastLegendClick = (e as CustomEvent<string>).detail;
      });
    });
    await element.getByRole('option', { name: 'Oranges' }).click();
    const detail = await element.evaluate(el => (el as any).__lastLegendClick);
    expect(detail).toBe('Oranges');
  });

  test('Should emit legend-mouseover on button mouseover', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await element.evaluate(el => {
      (el as any).__lastMouseover = null;
      el.addEventListener('legend-mouseover', (e: Event) => {
        (el as any).__lastMouseover = (e as CustomEvent<string>).detail;
      });
    });
    await element.getByRole('option', { name: 'Bananas' }).dispatchEvent('mouseover');
    const detail = await element.evaluate(el => (el as any).__lastMouseover);
    expect(detail).toBe('Bananas');
  });

  test('Should emit legend-mouseout on button mouseout', async ({ page }) => {
    await setup(page);
    const element = page.locator('fluent-chart-legend');
    await element.evaluate(el => {
      (el as any).__mouseoutFired = false;
      el.addEventListener('legend-mouseout', () => {
        (el as any).__mouseoutFired = true;
      });
    });
    await element.getByRole('option', { name: 'Apples' }).dispatchEvent('mouseout');
    const fired = await element.evaluate(el => (el as any).__mouseoutFired);
    expect(fired).toBe(true);
  });
});
