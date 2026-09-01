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
    await expect(element.locator('.sankey-node').first()).toHaveAttribute('width', '124');
    await expect(element.locator('.sankey-node-name')).toHaveText(['A', 'B', 'C']);
    await expect(element.locator('.sankey-node-value')).toHaveText(['15', '10', '5']);

    const labelsAreInsideNodes = await element.locator('.sankey-node').evaluateAll(nodes => {
      const labels = Array.from(nodes[0].parentElement?.querySelectorAll<SVGTextElement>('.sankey-node-label') ?? []);
      return nodes.every((node, index) => {
        const label = labels[index];
        if (!label) {
          return false;
        }
        const nodeBounds = node.getBoundingClientRect();
        const labelBounds = label.getBoundingClientRect();
        return (
          labelBounds.left >= nodeBounds.left &&
          labelBounds.right <= nodeBounds.right &&
          labelBounds.top >= nodeBounds.top &&
          labelBounds.bottom <= nodeBounds.bottom
        );
      });
    });
    expect(labelsAreInsideNodes).toBe(true);
  });

  test('Should use one roving tab stop across links and nodes', async ({ page }) => {
    const element = page.locator('fluent-sankey-chart');
    const links = element.locator('.sankey-link');
    const nodes = element.locator('.sankey-node');

    await expect(links.first()).toHaveAttribute('tabindex', '0');
    await expect(links.nth(1)).toHaveAttribute('tabindex', '-1');
    await expect(nodes.first()).toHaveAttribute('tabindex', '-1');
    await expect(links.first()).toHaveAttribute('role', 'img');
    await expect(links.first()).toHaveAttribute('aria-label', 'A to B, 10');

    await links.first().focus();
    await expect(element.locator('.tooltip')).toBeVisible();
    await expect(links.first()).toHaveCSS('outline-style', 'none');
    const outerFocusPath = links.first().locator('xpath=preceding-sibling::*[2]');
    const innerFocusPath = links.first().locator('xpath=preceding-sibling::*[1]');
    await expect(outerFocusPath).toHaveClass(/sankey-link-focus-outline/);
    await expect(innerFocusPath).toHaveClass(/sankey-link-focus-outline/);
    await expect(outerFocusPath).toHaveCSS('opacity', '1');
    await expect(innerFocusPath).toHaveCSS('opacity', '1');
    const focusedPathData = await links.first().getAttribute('d');
    expect(focusedPathData).not.toBeNull();
    await expect(outerFocusPath).toHaveAttribute('d', focusedPathData!);
    await expect(innerFocusPath).toHaveAttribute('d', focusedPathData!);
    await links.first().press('ArrowLeft');
    await expect(nodes.last()).toBeFocused();
    await nodes.last().press('ArrowRight');
    await expect(links.first()).toBeFocused();

    await links.first().press('ArrowRight');
    await expect(links.nth(1)).toBeFocused();
    await expect(links.first()).toHaveAttribute('tabindex', '-1');
    await expect(links.nth(1)).toHaveAttribute('tabindex', '0');

    await links.nth(1).press('ArrowDown');
    await expect(nodes.first()).toBeFocused();
    await expect(nodes.first()).toHaveAttribute('tabindex', '0');
  });

  test('Basic story should use the React data and size', async ({ page }) => {
    await page.goto(fixtureURL('components-sankeychart--basic'));
    const element = page.locator('fluent-sankey-chart');

    await expect(element).toHaveAttribute('width', '820');
    await expect(element).toHaveAttribute('height', '412');
    const storyData = await element.evaluate(chart => (chart as HTMLElement & { data: SankeyChartData }).data);
    expect(storyData.links).toEqual([
      { source: 0, target: 2, value: 2 },
      { source: 1, target: 2, value: 2 },
      { source: 1, target: 3, value: 2 },
      { source: 0, target: 4, value: 2 },
      { source: 2, target: 3, value: 2 },
      { source: 2, target: 4, value: 2 },
      { source: 3, target: 4, value: 4 },
      { source: 3, target: 5, value: 4 },
    ]);
  });

  test('Inbox story should use React data and call out nodes too small for labels', async ({ page }) => {
    await page.goto(fixtureURL('components-sankeychart--inbox'));
    const element = page.locator('fluent-sankey-chart');

    const storyData = await element.evaluate(chart => (chart as HTMLElement & { data: SankeyChartData }).data);
    expect(storyData.nodes.map(node => node.name)).toEqual([
      '192.168.42.72',
      '172.152.48.13',
      '124.360.55.1',
      '192.564.10.2',
      '124.124.50.1',
      '172.630.89.4',
      'inbox',
      'Junk Folder',
      'Deleted Folder',
      'Clicked',
      'Opened',
      ' No further action  required',
    ]);
    expect(storyData.nodes.map(node => node.color)).toEqual([
      ...Array(6).fill('qualitative.2'),
      ...Array(3).fill('qualitative.7'),
      ...Array(3).fill('qualitative.8'),
    ]);
    expect(storyData.links).toEqual([
      { source: 0, target: 6, value: 80 },
      { source: 1, target: 6, value: 50 },
      { source: 1, target: 7, value: 28 },
      { source: 2, target: 7, value: 14 },
      { source: 3, target: 7, value: 7 },
      { source: 3, target: 8, value: 20 },
      { source: 4, target: 7, value: 10 },
      { source: 5, target: 7, value: 10 },
      { source: 6, target: 9, value: 30 },
      { source: 6, target: 10, value: 55 },
      { source: 7, target: 11, value: 60 },
      { source: 8, target: 11, value: 2 },
    ]);

    const smallNodeIndex = await element
      .locator('.sankey-node')
      .evaluateAll(nodes => nodes.findIndex(node => Number(node.getAttribute('height')) <= 24));
    expect(smallNodeIndex).toBeGreaterThanOrEqual(0);
    const smallNode = element.locator('.sankey-node').nth(smallNodeIndex);
    const expectedName = await smallNode.getAttribute('data-legend');
    const expectedValue = (await smallNode.getAttribute('aria-label'))!.slice(expectedName!.length + 2);
    await expect(element.locator('.sankey-node-label').nth(smallNodeIndex)).toBeEmpty();

    await smallNode.hover();
    await expect(element.locator('.tooltip')).toBeVisible();
    await expect(element.locator('.tooltip-legend-text')).toHaveText(expectedName!);
    await expect(element.locator('.tooltip-content-y')).toHaveText(expectedValue);
    const [chartBounds, tooltipBounds] = await Promise.all([
      element.boundingBox(),
      element.locator('.tooltip').boundingBox(),
    ]);
    expect(tooltipBounds!.x).toBeGreaterThanOrEqual(chartBounds!.x);
    expect(tooltipBounds!.x + tooltipBounds!.width).toBeLessThanOrEqual(chartBounds!.x + chartBounds!.width);
    expect(tooltipBounds!.y).toBeGreaterThanOrEqual(chartBounds!.y);
    expect(tooltipBounds!.y + tooltipBounds!.height).toBeLessThanOrEqual(chartBounds!.y + chartBounds!.height);

    await page.mouse.move(0, 0);
    await expect(element.locator('.tooltip')).toHaveCount(0);
  });

  test('Rebalance story should switch between the React data sources', async ({ page }) => {
    await page.goto(fixtureURL('components-sankeychart--rebalance'));
    const element = page.locator('fluent-sankey-chart');
    const dataSource = page.locator('#sankey-rebalance-data-source');

    await expect(element).toHaveAttribute('width', '820');
    await expect(element).toHaveAttribute('height', '400');
    await expect(dataSource).toHaveJSProperty('checked', true);
    await expect(page.getByText('Data Source: simple', { exact: true })).toBeVisible();
    await expect(element.locator('.sankey-node')).toHaveCount(4);
    await expect(element.locator('.sankey-link')).toHaveCount(4);
    await expect(
      element.locator('.sankey-node').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-legend'))),
    ).resolves.toEqual(['Large Source', 'Tiny Source', 'Large Target', 'Tiny Target']);
    const tinyNodeHeights = await element
      .locator('.sankey-node[data-legend^="Tiny"]')
      .evaluateAll(nodes => nodes.map(node => Number(node.getAttribute('height'))));
    expect(tinyNodeHeights).toHaveLength(2);
    tinyNodeHeights.forEach(height => expect(height).toBeGreaterThanOrEqual(2));

    await dataSource.evaluate(control => {
      const switchControl = control as HTMLElement & { checked: boolean };
      switchControl.checked = false;
      switchControl.dispatchEvent(new Event('change'));
    });

    await expect(page.getByText('Data Source: complex', { exact: true })).toBeVisible();
    await expect(element.locator('.sankey-node')).toHaveCount(43);
    await expect(element.locator('.sankey-node').first()).toHaveAttribute('data-legend', 'Location 1');
    await expect(element.locator('.sankey-node').last()).toHaveAttribute(
      'data-legend',
      'All conditional access controls satisfied',
    );
    const nodeGaps = await element.locator('.sankey-node').evaluateAll(nodes => {
      const columns = new Map<number, Array<{ y: number; height: number }>>();
      nodes.forEach(node => {
        const x = Number(node.getAttribute('x'));
        const column = columns.get(x) ?? [];
        column.push({ y: Number(node.getAttribute('y')), height: Number(node.getAttribute('height')) });
        columns.set(x, column);
      });
      return Array.from(columns.values()).flatMap(column => {
        column.sort((first, second) => first.y - second.y);
        return column.slice(1).map((node, index) => node.y - (column[index].y + column[index].height));
      });
    });
    expect(nodeGaps.length).toBeGreaterThan(0);
    expect(Math.round(Math.max(...nodeGaps))).toBeLessThanOrEqual(8);

    await dataSource.evaluate(control => {
      const switchControl = control as HTMLElement & { checked: boolean };
      switchControl.checked = true;
      switchControl.dispatchEvent(new Event('change'));
    });
    await expect(element.locator('.sankey-node')).toHaveCount(4);
  });

  test('Responsive story should use the React data and resize with its container', async ({ page }) => {
    await page.goto(fixtureURL('components-sankeychart--responsive'));
    const responsiveHost = page.locator('#sankey-responsive-container');
    const element = responsiveHost.locator('fluent-sankey-chart');
    const svg = element.locator('svg.chart');

    await expect(element.locator('.sankey-node')).toHaveCount(6);
    await expect(element.locator('.sankey-link')).toHaveCount(8);
    await expect(element.locator('.sankey-node').first()).toHaveAttribute('data-legend', 'node0');
    await expect(element.locator('.sankey-node').last()).toHaveAttribute('data-legend', 'node5');

    const initialWidth = Number(await svg.getAttribute('width'));
    const initialHeight = await svg.getAttribute('height');
    await responsiveHost.evaluate(host => {
      host.style.width = '480px';
    });

    await expect.poll(async () => Number(await svg.getAttribute('width'))).toBeLessThan(initialWidth);
    await expect(element).toHaveAttribute('height', '412');
    await expect(svg).toHaveAttribute('height', initialHeight!);
  });

  test('Should render link paths', async ({ page }) => {
    const element = page.locator('fluent-sankey-chart');
    await expect(element.locator('.sankey-link')).toHaveCount(data.links.length);
    await expect(element.locator('.sankey-link').first()).toHaveCSS('stroke-opacity', '0.3');
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
