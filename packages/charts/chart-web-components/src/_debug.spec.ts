import { test } from '@playwright/test';
import { fixtureURL } from './helpers.tests.js';

test('check area-chart for errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(`PAGE ERROR: ${err.message}`);
  });

  await page.goto(fixtureURL('components-areachart--basic'));
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    const el = document.querySelector('fluent-area-chart');
    const cls = customElements.get('fluent-area-chart');
    return {
      defined: cls !== undefined,
      className: cls?.name ?? 'undefined',
      elFound: el !== null,
      elShadowMode: el?.shadowRoot ? el.shadowRoot.mode : 'no shadow',
      elFastController: typeof (el as any)?.$fastController,
      windowErrors: (window as any).__errors ?? [],
    };
  });

  console.log('Errors:', JSON.stringify(errors, null, 2));
  console.log('Area chart info:', JSON.stringify(info, null, 2));
});

test('check sankey-chart for errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(`PAGE ERROR: ${err.message}`);
  });

  await page.goto(fixtureURL('components-sankeychart--basic'));
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    const el = document.querySelector('fluent-sankey-chart');
    const cls = customElements.get('fluent-sankey-chart');
    return {
      defined: cls !== undefined,
      className: cls?.name ?? 'undefined',
      elFound: el !== null,
      elShadowMode: el?.shadowRoot ? el.shadowRoot.mode : 'no shadow',
      elFastController: typeof (el as any)?.$fastController,
    };
  });

  console.log('Sankey Errors:', JSON.stringify(errors, null, 2));
  console.log('Sankey chart info:', JSON.stringify(info, null, 2));
});

test('check polar-chart for errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(`PAGE ERROR: ${err.message}`);
  });

  await page.goto(fixtureURL('components-polarchart--basic'));
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    const el = document.querySelector('fluent-polar-chart');
    const cls = customElements.get('fluent-polar-chart');
    return {
      defined: cls !== undefined,
      className: cls?.name ?? 'undefined',
      elFound: el !== null,
      elShadowMode: el?.shadowRoot ? el.shadowRoot.mode : 'no shadow',
      elFastController: typeof (el as any)?.$fastController,
      nodeCount: el?.shadowRoot?.querySelectorAll('.sankey-node')?.length ?? -1,
      polarSeriesCount: el?.shadowRoot?.querySelectorAll('.polar-series')?.length ?? -1,
    };
  });

  console.log('Polar Errors:', JSON.stringify(errors, null, 2));
  console.log('Polar chart info:', JSON.stringify(info, null, 2));
});
