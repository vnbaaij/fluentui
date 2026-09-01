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

  test('Should render area series', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await expect(element.locator('.polar-area')).toHaveCount(2);
  });

  test('Should render axes and show a hollow marker tooltip at corner points', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await expect(element.locator('.polar-grid-outer')).toHaveCount(1);
    await expect(element.locator('.polar-radial-axis')).toHaveCount(1);
    await expect(element.locator('.polar-radial-tick-label')).toHaveCount(5);
    await expect(element.locator('.polar-radial-tick-label')).toHaveText(['0', '2', '4', '6', '8']);

    const marker = element.locator('.polar-marker').first();
    await expect(marker).toHaveAttribute('r', '6');
    await expect(marker).toHaveCSS('opacity', '0');
    await marker.hover();
    await expect(marker).toHaveClass(/active/);
    await expect(marker).toHaveCSS('fill', 'rgb(255, 255, 255)');
    await expect(marker).toHaveCSS('stroke-width', '2px');
    await expect(element.locator('.tooltip')).toBeVisible();
    await expect(element.locator('.tooltip-legend-text')).toHaveText('Speed');
    await expect(element.locator('.tooltip-content-y')).toHaveText('8');

    const paintOrder = await element
      .locator('.chart')
      .evaluate(svg => [...svg.children].map(child => child.getAttribute('class')));
    expect(paintOrder).toEqual(['polar-series-layer', 'polar-axis-layer', 'polar-marker-layer']);
  });

  test('Should apply shape, direction, hole, and axis options', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await expect(element.locator('circle.polar-grid-outer')).toHaveCount(1);

    await element.evaluate(chart => {
      chart.setAttribute('shape', 'polygon');
      chart.setAttribute('direction', 'clockwise');
      chart.setAttribute('hole', '0.25');
      chart.setAttribute(
        'radial-axis',
        JSON.stringify({ rangeStart: 0, rangeEnd: 10, tickValues: [0, 5, 10], tickText: ['low', 'mid', 'high'] }),
      );
      chart.setAttribute(
        'angular-axis',
        JSON.stringify({ tickValues: ['Agility', 'Power', 'Speed'], tickText: ['A', 'P', 'S'] }),
      );
    });

    await expect(element.locator('polygon.polar-grid-outer')).toHaveCount(1);
    await expect(element.locator('.polar-radial-tick-label')).toHaveText(['low', 'mid', 'high']);
    await expect(element.locator('.polar-axis-label')).toHaveText(['A', 'P', 'S']);

    const geometry = await element.locator('.chart').evaluate(svg => {
      const firstGrid = svg.querySelector('.polar-grid')!;
      const radialAxis = svg.querySelector('.polar-radial-axis')!;
      const viewBox = (svg as SVGSVGElement).viewBox.baseVal;
      const centerX = viewBox.width / 2;
      const centerY = viewBox.height / 2;
      const firstPoint = (firstGrid as SVGPolygonElement).points[0];
      return {
        firstGridDistance: Math.hypot(firstPoint.x - centerX, firstPoint.y - centerY),
        radialAxisX1: Number(radialAxis.getAttribute('x1')),
        radialAxisX2: Number(radialAxis.getAttribute('x2')),
      };
    });
    expect(geometry.firstGridDistance).toBeGreaterThan(0);
    expect(geometry.radialAxisX1).toBeCloseTo(geometry.radialAxisX2);
  });

  test('Should render area, line, and scatter series using categories from all series', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await element.evaluate(chart => {
      (chart as HTMLElement & { data: unknown }).data = [
        {
          type: 'areapolar',
          legend: 'Area',
          color: '#0078d4',
          data: [
            { theta: 'A', r: 3 },
            { theta: 'B', r: 6 },
            { theta: 'C', r: 9 },
          ],
        },
        {
          type: 'linepolar',
          legend: 'Line',
          color: '#d83b01',
          lineOptions: { strokeWidth: 5, strokeDasharray: '4 2', strokeLinecap: 'round' },
          data: [
            { theta: 'A', r: 8 },
            { theta: 'D', r: 4 },
          ],
        },
        {
          type: 'scatterpolar',
          legend: 'Scatter',
          data: [
            { theta: 'B', r: 5 },
            { theta: 'D', r: 7 },
          ],
        },
      ];
    });

    await expect(element.locator('.polar-area')).toHaveCount(1);
    await expect(element.locator('.polar-line')).toHaveCount(2);
    await expect(element.locator('.polar-axis-label')).toHaveText(['A', 'B', 'C', 'D']);
    const configuredLine = element.locator('.polar-line[data-legend="Line"]');
    await expect(configuredLine).toHaveAttribute('stroke-width', '5');
    await expect(configuredLine).toHaveAttribute('stroke-dasharray', '4 2');
    await expect(configuredLine).toHaveAttribute('stroke-linecap', 'round');
    await expect(element.locator('.polar-marker.always-visible[data-legend="Scatter"]')).toHaveCount(2);
  });

  test('Should render a true center hole for area series', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await element.evaluate(chart => chart.setAttribute('hole', '0.4'));

    const centerIsFilled = await element
      .locator('.polar-area')
      .first()
      .evaluate(path => (path as SVGGeometryElement).isPointInFill(new DOMPoint(0, 0)));
    expect(centerIsFilled).toBe(false);
  });

  test('Should support logarithmic radial scales and numeric angular values', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await element.evaluate(chart => {
      (chart as HTMLElement & { data: unknown }).data = [
        {
          type: 'scatterpolar',
          legend: 'Log',
          data: [
            { theta: 0, r: 1 },
            { theta: 90, r: 10 },
            { theta: 180, r: 100 },
          ],
        },
      ];
      chart.setAttribute('radial-axis', JSON.stringify({ scaleType: 'log', tickValues: [1, 10, 100] }));
      chart.setAttribute('angular-axis', JSON.stringify({ tickValues: [0, 90, 180, 270], unit: 'radians' }));
    });

    await expect(element.locator('.polar-axis-label')).toHaveText(['0π', '0.5π', '1π', '1.5π']);
    const radii = await element.locator('.polar-marker').evaluateAll(markers => {
      const axis = (markers[0] as SVGCircleElement).ownerSVGElement!.querySelector('.polar-radial-axis')!;
      const centerX = Number(axis.getAttribute('x1'));
      const centerY = Number(axis.getAttribute('y1'));
      return markers.map(marker =>
        Math.hypot(Number(marker.getAttribute('cx')) - centerX, Number(marker.getAttribute('cy')) - centerY),
      );
    });
    expect(radii[1]).toBeCloseTo(radii[2] / 2, 0);
  });

  test('Should support date and categorical radial scales', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await element.evaluate(chart => {
      const polarChart = chart as HTMLElement & { data: unknown; radialAxis: unknown; useUTC: boolean };
      const start = new Date('2024-01-01T00:00:00Z');
      const end = new Date('2025-01-01T00:00:00Z');
      polarChart.data = [
        {
          type: 'linepolar',
          legend: 'Dates',
          data: [
            { theta: 'A', r: start },
            { theta: 'B', r: end },
          ],
        },
      ];
      polarChart.radialAxis = { tickStep: 'M6', tick0: start, tickFormat: '%Y-%m' };
      polarChart.useUTC = true;
    });
    await expect(element.locator('.polar-radial-tick-label')).toHaveText(['2024-01', '2024-07', '2025-01']);

    await element.evaluate(chart => {
      const polarChart = chart as HTMLElement & { data: unknown; radialAxis: unknown };
      polarChart.data = [
        {
          type: 'scatterpolar',
          legend: 'Categories',
          data: [
            { theta: 'A', r: 'low' },
            { theta: 'B', r: 'medium' },
            { theta: 'C', r: 'high' },
          ],
        },
      ];
      polarChart.radialAxis = { categoryOrder: 'category ascending' };
    });
    await expect(element.locator('.polar-radial-tick-label')).toHaveText(['high', 'low', 'medium']);
  });

  test('Should apply point metadata and exclude inactive series from the roving index', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await element.evaluate(chart => {
      (window as Window & { polarPointClicked?: boolean }).polarPointClicked = false;
      (chart as HTMLElement & { data: unknown }).data = [
        {
          type: 'scatterpolar',
          legend: 'First',
          data: [{ theta: 'A', r: 2, text: 'Filtered' }],
        },
        {
          type: 'scatterpolar',
          legend: 'Second',
          data: [
            {
              theta: 'B',
              r: 4,
              color: '#ff0000',
              markerSize: 20,
              text: 'Peak',
              callOutAccessibilityData: { ariaLabel: 'Custom point' },
              onClick: () => ((window as Window & { polarPointClicked?: boolean }).polarPointClicked = true),
            },
          ],
        },
      ];
      (chart as HTMLElement & { handleLegendClick: (legend: string) => void }).handleLegendClick('Second');
    });

    const secondMarker = element.locator('.polar-marker[data-legend="Second"]');
    await expect(secondMarker).toHaveAttribute('fill', '#ff0000');
    await expect(secondMarker).toHaveAttribute('aria-label', 'Custom point');
    await expect(element.locator('.polar-point-text[data-legend="First"]')).toHaveCSS('opacity', '0.1');
    await expect(element.locator('.polar-point-text[data-legend="Second"]')).toHaveCSS('opacity', '1');
    await expect(element.locator('.polar-marker[tabindex="0"]')).toHaveCount(1);
    await expect(secondMarker).toHaveAttribute('tabindex', '0');
    await secondMarker.click();
    expect(await page.evaluate(() => (window as Window & { polarPointClicked?: boolean }).polarPointClicked)).toBe(
      true,
    );
  });

  test('Should localize numeric radial callouts and format angular units', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await element.evaluate(chart => {
      const polarChart = chart as HTMLElement & { data: unknown; angularAxis: unknown; culture: string };
      polarChart.data = [
        {
          type: 'scatterpolar',
          legend: 'Localized',
          data: [{ theta: 90, r: 1234.5 }],
        },
      ];
      polarChart.angularAxis = { unit: 'radians' };
      polarChart.culture = 'de-DE';
    });

    await element.locator('.polar-marker').hover();
    await expect(element.locator('.tooltip-legend-text')).toHaveText('0.5π');
    await expect(element.locator('.tooltip-content-y')).toHaveText('1.234,5');
  });

  test('Should show grouped values, markers, and a radial guide for an angular value', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await element.evaluate(chart => chart.setAttribute('enable-multi-value-callout', ''));
    await expect(element.locator('.polar-callout-surface')).toBeVisible();

    const firstMarker = element.locator('.polar-marker[data-legend="Series A"]').first();
    await firstMarker.focus();

    await expect(element.locator('.polar-callout-guide')).not.toHaveCSS('display', 'none');
    await expect(element.locator('.polar-callout-guide')).toHaveCSS('stroke-dasharray', '5px, 3px');
    await expect(element.locator('.polar-marker.active')).toHaveCount(2);
    await expect(element.locator('.tooltip-header')).toHaveText('Speed');
    await expect(element.locator('.tooltip-legend-text')).toHaveText(['Series A', 'Series B']);
    await expect(element.locator('.tooltip-content-y')).toHaveText(['8', '4']);
    await expect(element.locator('.live-region')).toHaveText('Speed, Series A: 8, Series B: 4');

    await element.evaluate(chart =>
      (chart as HTMLElement & { handleLegendClick: (legend: string) => void }).handleLegendClick('Series A'),
    );
    await expect(element.locator('.polar-marker.active')).toHaveCount(1);
    await expect(element.locator('.tooltip-legend-text')).toHaveText(['Series A']);
  });

  test('Should select the nearest numeric angular value from the grouped callout surface', async ({ page }) => {
    const element = page.locator('fluent-polar-chart');
    await element.evaluate(chart => {
      const polarChart = chart as HTMLElement & { data: unknown };
      polarChart.data = [
        {
          type: 'linepolar',
          legend: 'Numeric',
          data: [
            { theta: 0, r: 2 },
            { theta: 90, r: 4 },
            { theta: 180, r: 3 },
          ],
        },
      ];
      polarChart.setAttribute('enable-multi-value-callout', '');
    });

    const surface = element.locator('.polar-callout-surface');
    await expect(surface).toBeVisible();
    const bounds = await surface.boundingBox();
    await surface.hover({ position: { x: bounds!.width / 2, y: bounds!.height * 0.1 } });
    await expect(element.locator('.tooltip-header')).toHaveText('90°');
    await expect(element.locator('.tooltip-content-y')).toHaveText(['4']);
  });

  test('Should keep grouped callouts bounded, opposite lateral spokes, and clear of active points', async ({
    page,
  }) => {
    const element = page.locator('fluent-polar-chart');
    await element.evaluate(chart => {
      const polarChart = chart as HTMLElement & { data: unknown };
      polarChart.data = [
        {
          type: 'linepolar',
          legend: 'Values',
          data: [
            { theta: 0, r: 8 },
            { theta: 90, r: 8 },
            { theta: 180, r: 8 },
            { theta: 270, r: 8 },
          ],
        },
      ];
      polarChart.setAttribute('enable-multi-value-callout', '');
    });

    const surface = element.locator('.polar-callout-surface');
    await expect(surface).toBeVisible();
    const surfaceBounds = (await surface.boundingBox())!;
    const positions: Array<{
      theta: string;
      x: number;
      y: number;
      expectedSide?: 'left' | 'right';
    }> = [
      { theta: '0°', x: surfaceBounds.width * 0.9, y: surfaceBounds.height / 2, expectedSide: 'left' },
      { theta: '90°', x: surfaceBounds.width / 2, y: surfaceBounds.height * 0.1 },
      { theta: '180°', x: surfaceBounds.width * 0.1, y: surfaceBounds.height / 2, expectedSide: 'right' },
      { theta: '270°', x: surfaceBounds.width / 2, y: surfaceBounds.height * 0.9 },
    ];

    for (const position of positions) {
      await surface.hover({ position });
      await expect(element.locator('.tooltip-header')).toHaveText(position.theta);
      await expect(element.locator('.tooltip')).toBeVisible();
      const [hostBounds, tooltipBounds, markerBounds] = await Promise.all([
        element.boundingBox(),
        element.locator('.tooltip').boundingBox(),
        element.locator('.polar-marker.active').boundingBox(),
      ]);
      expect(tooltipBounds!.x).toBeGreaterThanOrEqual(hostBounds!.x);
      expect(tooltipBounds!.x + tooltipBounds!.width).toBeLessThanOrEqual(hostBounds!.x + hostBounds!.width);
      const originX = surfaceBounds.x + surfaceBounds.width / 2;
      const overlapsMarker =
        tooltipBounds!.x < markerBounds!.x + markerBounds!.width &&
        tooltipBounds!.x + tooltipBounds!.width > markerBounds!.x &&
        tooltipBounds!.y < markerBounds!.y + markerBounds!.height &&
        tooltipBounds!.y + tooltipBounds!.height > markerBounds!.y;
      expect(overlapsMarker).toBe(false);
      if (position.expectedSide === 'left') {
        expect(tooltipBounds!.x + tooltipBounds!.width / 2).toBeLessThan(markerBounds!.x);
        expect(originX - (tooltipBounds!.x + tooltipBounds!.width)).toBeLessThanOrEqual(20);
      } else if (position.expectedSide === 'right') {
        expect(tooltipBounds!.x + tooltipBounds!.width / 2).toBeGreaterThan(markerBounds!.x + markerBounds!.width);
        expect(tooltipBounds!.x - originX).toBeLessThanOrEqual(20);
      }
    }
  });

  test('Chart Attributes story should control shape, direction, and marker visibility', async ({ page }) => {
    await page.goto(fixtureURL('components-polarchart--show-markers'));
    const element = page.locator('fluent-polar-chart');
    const shapeDropdown = page.locator('#polar-shape');
    const directionDropdown = page.locator('#polar-direction');
    const showMarkersSwitch = page.locator('#polar-show-markers');
    const multiValueCalloutSwitch = page.locator('#polar-multi-value-callout');

    await expect(element.locator('circle.polar-grid-outer')).toHaveCount(1);
    await expect(element).not.toHaveAttribute('show-markers', '');
    await expect(element.locator('.polar-marker').first()).toHaveCSS('opacity', '0');

    await showMarkersSwitch.click();
    await expect(element).toHaveAttribute('show-markers', '');
    await expect(element.locator('.polar-marker').first()).toHaveCSS('opacity', '1');

    await shapeDropdown.evaluate(control => {
      (control as HTMLElement & { value: string }).value = 'polygon';
      control.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(element).toHaveAttribute('shape', 'polygon');
    await expect(element.locator('polygon.polar-grid-outer')).toHaveCount(1);

    await directionDropdown.evaluate(control => {
      (control as HTMLElement & { value: string }).value = 'clockwise';
      control.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(element).toHaveAttribute('direction', 'clockwise');
    const radialAxis = element.locator('.polar-radial-axis');
    await expect
      .poll(() => radialAxis.evaluate(axis => Number(axis.getAttribute('x1')) - Number(axis.getAttribute('x2'))))
      .toBeCloseTo(0);

    await multiValueCalloutSwitch.click();
    await expect(element).toHaveAttribute('enable-multi-value-callout', '');
  });

  test('New parity stories should demonstrate mixed series, advanced axes, and grouped callouts', async ({ page }) => {
    await page.goto(fixtureURL('components-polarchart--mixed-series'));
    let element = page.locator('fluent-polar-chart');
    await expect(element.locator('.polar-area')).toHaveCount(1);
    await expect(element.locator('.polar-line')).toHaveCount(2);
    await expect(element.locator('.polar-marker.always-visible[data-legend="Milestones"]')).toHaveCount(3);
    await expect(element.locator('.polar-point-text')).toHaveText('Release');

    await page.goto(fixtureURL('components-polarchart--numeric-and-logarithmic-axes'));
    element = page.locator('fluent-polar-chart');
    await expect(element.locator('.polar-axis-label')).toHaveText([
      '0π',
      '0.333333π',
      '0.666667π',
      '1π',
      '1.33333π',
      '1.66667π',
    ]);
    await expect(element.locator('.polar-radial-tick-label')).toHaveText(['1', '10', '100', '1k']);
    expect(await element.evaluate(chart => (chart as HTMLElement & { hole: number }).hole)).toBe(0.2);

    await page.goto(fixtureURL('components-polarchart--multi-value-callout'));
    element = page.locator('fluent-polar-chart');
    await expect(element.locator('.polar-callout-surface')).toBeVisible();
    await element.locator('.polar-marker').first().focus();
    await expect(element.locator('.tooltip-legend-text')).toHaveText(['Mike', 'Lily']);
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
    await expect(element.locator('.polar-area')).toHaveCount(1);
  });
});
