import { test } from '@playwright/test';
import { expect, fixtureURL } from '../helpers.tests.js';
import type { LineChartSeries } from './line-chart.options.js';

const data: LineChartSeries[] = [
  {
    legend: 'Series A',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
      { x: 2, y: 15 },
    ],
  },
  {
    legend: 'Series B',
    data: [
      { x: 0, y: 5 },
      { x: 1, y: 12 },
      { x: 2, y: 18 },
    ],
  },
];

test.describe('LineChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(fixtureURL('components-linechart--basic'));
    await page.setContent(/* html */ `
      <fluent-line-chart data='${JSON.stringify(data)}' width='600' height='300'></fluent-line-chart>
    `);
    await page.waitForFunction(() => customElements.whenDefined('fluent-line-chart'));
  });

  test('Should render line paths', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await expect(element.locator('.line-path')).toHaveCount(2);
  });

  test('Should show a hollow point marker for a single callout', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(chart => chart.setAttribute('show-markers', ''));
    const markers = element.locator('.line-marker[data-legend="Series A"]');
    await expect(markers).toHaveCount(3);

    await markers.nth(1).dispatchEvent('mouseenter');

    const hoverDot = element.locator('.single-hover-dot');
    await expect(hoverDot).toBeVisible();
    await expect(hoverDot).toHaveAttribute('r', '6');
    await expect(hoverDot).toHaveAttribute('fill', '#fff');
    await expect(hoverDot).toHaveAttribute('stroke-width', '2');
    await expect(hoverDot).toHaveAttribute('data-legend', 'Series A');
    await expect(element.locator('.tooltip')).toHaveCSS('transform', 'none');
    await expect(element.locator('.tooltip-info')).toHaveCount(1);
    await expect(element.locator('.hover-dot:visible')).toHaveCount(1);
    const hoverLine = element.locator('.hover-line');
    await expect(hoverLine).not.toHaveCSS('display', 'none');
    expect(
      await element.evaluate(chart => {
        const root = chart.shadowRoot!;
        return Boolean(
          root.querySelector('.hover-line')!.compareDocumentPosition(root.querySelector('.single-hover-dot')!) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        );
      }),
    ).toBe(true);
    await expect
      .poll(() =>
        element.evaluate(chart => {
          const root = chart.shadowRoot!;
          const tooltip = root.querySelector('.tooltip');
          const dot = root.querySelector('.single-hover-dot');
          if (!tooltip || !dot) {
            return false;
          }
          const tooltipRect = tooltip.getBoundingClientRect();
          const dotRect = dot.getBoundingClientRect();
          return tooltipRect.left >= dotRect.right + 7;
        }),
      )
      .toBe(true);

    await markers.nth(1).dispatchEvent('mouseleave');
    await expect(hoverDot).toBeVisible();
    await expect(hoverLine).not.toHaveCSS('display', 'none');
    await element.locator('svg').dispatchEvent('mouseleave');
    await expect(hoverDot).toBeHidden();
    await expect(hoverLine).toHaveCSS('display', 'none');

    await markers.first().dispatchEvent('mouseenter');
    await expect
      .poll(() =>
        element.evaluate(chart => {
          const root = chart.shadowRoot!;
          const tooltip = root.querySelector('.tooltip');
          const dot = root.querySelector('.single-hover-dot');
          if (!tooltip || !dot) {
            return false;
          }
          const tooltipRect = tooltip.getBoundingClientRect();
          const dotRect = dot.getBoundingClientRect();
          return tooltipRect.top >= dotRect.bottom + 7;
        }),
      )
      .toBe(true);
    await markers.first().dispatchEvent('mouseleave');

    await markers.last().dispatchEvent('mouseenter');
    await expect
      .poll(() =>
        element.evaluate(chart => {
          const root = chart.shadowRoot!;
          const tooltip = root.querySelector('.tooltip');
          const dot = root.querySelector('.single-hover-dot');
          if (!tooltip || !dot) {
            return false;
          }
          const tooltipRect = tooltip.getBoundingClientRect();
          const dotRect = dot.getBoundingClientRect();
          return tooltipRect.right <= dotRect.left - 7;
        }),
      )
      .toBe(true);
  });

  test('Basic should show gridlines, its isolated point, and React-compatible y-axis bounds', async ({ page }) => {
    await page.goto(fixtureURL('components-linechart--basic'));
    const element = page.locator('fluent-line-chart');

    await expect(element.locator('.axis-grid-line').first()).toHaveCSS('stroke-width', '1px');
    await expect(element.locator('.line-path').first()).toHaveAttribute('stroke-width', '4');
    await expect(element.locator('.line-border')).toHaveCount(3);
    await expect(element.locator('.line-border').first()).toHaveAttribute('stroke-width', '8');
    await expect(element.locator('.line-border').first()).toHaveAttribute(
      'stroke',
      'var(--colorNeutralBackground1, #fff)',
    );
    await expect(element.locator('.line-marker[data-legend="single point"]')).toHaveCount(1);
    await expect(element.locator('.axis-text').filter({ hasText: 'Mar 4' })).toHaveCount(1);
    await expect(element.locator('.y-axis')).toHaveAttribute('transform', 'translate(60, 40)');
    await expect(element.locator('.y-axis-text').first()).toHaveAttribute('x', '-12');
    await expect(element.locator('.y-axis-text').first()).toHaveText('200');
    await expect(element.locator('.y-axis-text').last()).toHaveText('304k');
    expect(
      await element.evaluate(chart => ({
        min: (chart as HTMLElement & { yMinValue: string }).yMinValue,
        max: (chart as HTMLElement & { yMaxValue: string }).yMaxValue,
      })),
    ).toEqual({ min: '200', max: '301' });
  });

  test('Should extend the React-style linear y-axis domain with configured values', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    const defaultTickValues = await element
      .locator('.y-axis-text')
      .evaluateAll(ticks => ticks.map(tick => Number(tick.textContent?.replaceAll(',', ''))));
    expect(Math.min(...defaultTickValues)).toBe(0);

    await element.evaluate(chart => {
      chart.setAttribute('y-min-value', '2');
      chart.setAttribute('y-max-value', '8');
    });

    const tickValues = await element
      .locator('.y-axis-text')
      .evaluateAll(ticks => ticks.map(tick => Number(tick.textContent?.replaceAll(',', ''))));
    expect(Math.min(...tickValues)).toBe(2);
    expect(Math.max(...tickValues)).toBeGreaterThanOrEqual(20);
  });

  test('Chart Attributes should control point shapes, axis titles, UTC, and callout modes', async ({ page }) => {
    await page.goto(fixtureURL('components-linechart--chart-attributes'));
    const element = page.locator('fluent-line-chart');

    await expect(page.locator('label[for="line-multiple-shapes"]')).toHaveText('Multiple shapes');
    await page.locator('#line-multiple-shapes').click();
    await expect
      .poll(() =>
        element
          .locator('.line-marker')
          .evaluateAll(markers => new Set(markers.map(marker => marker.getAttribute('data-shape'))).size),
      )
      .toBe(3);

    await page.locator('#line-show-axis-titles').click();
    await expect(element.locator('.x-axis-title, .y-axis-title')).toHaveCount(0);

    await page.locator('#line-use-utc').click();
    expect(await element.evaluate(chart => (chart as HTMLElement & { useUTC: boolean }).useUTC)).toBe(false);

    const singleLine = element.locator('.line-path[data-legend="From_Legacy_to_O365"]');
    const singleLineBox = await singleLine.boundingBox();
    await singleLine.dispatchEvent('mousemove', {
      clientX: (singleLineBox?.x ?? 0) + (singleLineBox?.width ?? 0) / 2,
      clientY: (singleLineBox?.y ?? 0) + (singleLineBox?.height ?? 0) / 2,
    });
    await expect(element.locator('.tooltip-info')).toHaveCount(1);
    await expect(element.locator('.hover-line')).not.toHaveCSS('display', 'none');
    const singleGuidePosition = await element.evaluate(chart => {
      const root = chart.shadowRoot!;
      const guideline = root.querySelector('.hover-line')!;
      const hoverDot = root.querySelector('.single-hover-dot')!;
      const axisTransform = root.querySelector('.x-axis')!.getAttribute('transform') ?? '';
      return {
        lineX: Number(guideline.getAttribute('x1')),
        lineStart: Number(guideline.getAttribute('y1')),
        lineEnd: Number(guideline.getAttribute('y2')),
        dotX: Number(hoverDot.getAttribute('cx')),
        dotY: Number(hoverDot.getAttribute('cy')),
        axisY: Number(axisTransform.match(/,\s*([\d.]+)\)/)?.[1]),
      };
    });
    expect(singleGuidePosition.lineEnd).toBe(singleGuidePosition.axisY);
    expect(singleGuidePosition.lineX).toBeGreaterThan(singleGuidePosition.dotX);
    expect(singleGuidePosition.lineStart).toBeGreaterThan(singleGuidePosition.dotY);

    await page.locator('fluent-radio[value="stack"]').click();
    await expect(element.locator('.callout-overlay')).toHaveCount(1);
    const overlay = element.locator('.callout-overlay');
    const overlayBox = await overlay.boundingBox();
    await overlay.dispatchEvent('mousemove', {
      clientX: (overlayBox?.x ?? 0) + 1,
      clientY: (overlayBox?.y ?? 0) + 1,
    });
    await expect(element.locator('.tooltip-info')).toHaveCount(2);
    await expect(element.locator('.hover-dot:visible')).toHaveCount(2);
    await expect(element.locator('.hover-dot:visible').first()).toHaveAttribute('fill', '#fff');
    await expect(element.locator('.hover-line')).toHaveCSS('stroke-dasharray', '5px, 3px');
    await expect(element.locator('.hover-line')).not.toHaveCSS('display', 'none');
    expect(
      await element.evaluate(chart => {
        const root = chart.shadowRoot!;
        const visibleHoverDot = Array.from(root.querySelectorAll<SVGElement>('.hover-dot')).find(
          dot => dot.style.display !== 'none',
        )!;
        return Boolean(
          root.querySelector('.hover-line')!.compareDocumentPosition(visibleHoverDot) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        );
      }),
    ).toBe(true);
    expect(
      await element.evaluate(chart => {
        const root = chart.shadowRoot!;
        const lineEnd = Number(root.querySelector('.hover-line')!.getAttribute('y2'));
        const axisTransform = root.querySelector('.x-axis')!.getAttribute('transform') ?? '';
        return { lineEnd, axisY: Number(axisTransform.match(/,\s*([\d.]+)\)/)?.[1]) };
      }),
    ).toEqual({ lineEnd: 250, axisY: 250 });
    await expect(element.locator('.tooltip')).toHaveCSS('transform', 'none');
    await expect
      .poll(() =>
        element.evaluate(chart => {
          const tooltipRect = chart.shadowRoot!.querySelector('.tooltip')!.getBoundingClientRect();
          const guideRect = chart.shadowRoot!.querySelector('.hover-line')!.getBoundingClientRect();
          return tooltipRect.left >= guideRect.left + 14 || tooltipRect.right <= guideRect.left - 14;
        }),
      )
      .toBe(true);

    await page.locator('fluent-radio[value="single"]').click();
    await expect(element.locator('.callout-overlay')).toHaveCount(0);
    await expect(element.locator('.hover-line')).toHaveCount(1);
    await expect(element.locator('.hover-line')).toBeHidden();
    await expect(element.locator('.hover-dot')).toHaveCount(1);
    await expect(element.locator('.single-hover-dot')).toBeHidden();
  });

  test('Should expose the additional story set after Chart Attributes', async ({ page }) => {
    const stories = [
      { id: 'multiple', selector: '.line-path', count: 12 },
      { id: 'custom-locale-date-axis', selector: '.line-path', count: 2 },
      { id: 'events', selector: '.event-annotation-line', count: 3 },
      { id: 'gaps', selector: '.line-path[data-legend="Normal Data"]', count: 4 },
      { id: 'large-data', selector: '.line-path', count: 3 },
      { id: 'negative', selector: '.line-path', count: 3 },
      { id: 'all-negative', selector: '.line-path', count: 3 },
      { id: 'secondary-y-axis', selector: '.y-axis-secondary', count: 1 },
      { id: 'log-axis-example', selector: '.line-path', count: 2 },
      { id: 'annotations-example', selector: '.chart-annotation', count: 4 },
    ];

    for (const story of stories) {
      await page.goto(fixtureURL(`components-linechart--${story.id}`));
      const element = page.locator('fluent-line-chart');
      await expect(element.locator(story.selector)).toHaveCount(story.count);
      await expect(page.locator('fluent-slider + output')).toHaveCount(2);
      expect(
        await page.locator('.slider-input').evaluateAll(inputRows =>
          inputRows.every(inputRow => {
            const sliderBounds = inputRow.querySelector('fluent-slider')!.getBoundingClientRect();
            const valueBounds = inputRow.querySelector('output')!.getBoundingClientRect();
            return valueBounds.left >= sliderBounds.right && valueBounds.top < sliderBounds.bottom;
          }),
        ),
      ).toBe(true);

      if (story.id === 'multiple') {
        await expect(page.locator('.line-multiple-size-controls .slider-input')).toHaveCount(2);
        await expect(page.locator('#line-multiple-width + output')).toHaveText('700');
        await expect(page.locator('#line-multiple-height + output')).toHaveText('300');
        await expect(page.locator('.line-multiple-shape-controls > fluent-field')).toHaveCount(1);
        await expect(page.locator('.line-multiple-callout-controls > fluent-field')).toHaveCount(1);
        const rowBounds = await page
          .locator('.line-multiple-size-controls, .line-multiple-shape-controls, .line-multiple-callout-controls')
          .evaluateAll(rows => rows.map(row => row.getBoundingClientRect().toJSON()));
        expect(rowBounds[1].top - rowBounds[0].bottom).toBeGreaterThanOrEqual(16);
        expect(rowBounds[2].top - rowBounds[1].bottom).toBeGreaterThanOrEqual(16);
        await expect(element.locator('.color-fill-bar')).toHaveCount(3);
        await expect(element.locator('pattern')).toHaveCount(1);
        expect(
          await element
            .locator('.legend-text')
            .evaluateAll(labels => new Set(labels.map(label => label.textContent)).size),
        ).toBe(14);
        expect(
          await element
            .locator('.line-marker')
            .evaluateAll(markers => new Set(markers.map(marker => marker.getAttribute('data-shape'))).size),
        ).toBe(8);
        expect(
          await element
            .locator('.legend-shape')
            .evaluateAll(shapes => new Set(shapes.map(shape => shape.getAttribute('data-shape'))).size),
        ).toBe(8);
        expect(
          await element.evaluate(chart => {
            const lineChart = chart as HTMLElement & {
              handleLegendClick: (legend: string) => void;
              legends: Array<{ legend: string }>;
              selectedLegends: string[];
            };
            lineChart.legends.forEach(item => lineChart.handleLegendClick(item.legend));
            return lineChart.selectedLegends;
          }),
        ).toEqual([]);
        const firstLegend = element.getByRole('option', { name: 'First', exact: true });
        await firstLegend.click();
        expect(await element.evaluate(chart => (chart as any).selectedLegends)).toEqual(['First']);
        await firstLegend.press('Space');
        expect(await element.evaluate(chart => (chart as any).selectedLegends)).toEqual([]);
        const markerWidths = await element.locator('.line-marker').evaluateAll(markers => {
          const widthsByShape = new Map<string, number>();
          markers.forEach(marker => {
            const shape = marker.getAttribute('data-shape') ?? '';
            if (!widthsByShape.has(shape)) {
              widthsByShape.set(shape, (marker as SVGGraphicsElement).getBBox().width);
            }
          });
          return Object.fromEntries(widthsByShape);
        });
        const circleWidth = markerWidths.circle;
        expect(circleWidth).toBeCloseTo(12, 5);
        Object.values(markerWidths).forEach(width => {
          expect(width).toBeGreaterThanOrEqual(circleWidth * 0.99);
          expect(width).toBeLessThanOrEqual(circleWidth * 1.2);
        });

        const overlay = element.locator('.callout-overlay');
        await expect(overlay).toHaveCount(1);
        await page.locator('fluent-radio[value="single"]').click();
        await expect(overlay).toHaveCount(0);
        await page.locator('fluent-radio[value="stack"]').click();
        await expect(overlay).toHaveCount(1);
        const overlayBox = await overlay.boundingBox();
        await overlay.dispatchEvent('mousemove', {
          clientX: (overlayBox?.x ?? 0) + 1,
          clientY: (overlayBox?.y ?? 0) + 1,
        });
        await expect(element.locator('.tooltip-info')).toHaveCount(12);
        await expect(element.locator('.hover-dot:visible')).toHaveCount(12);
        expect(
          await element.evaluate(chart => {
            const root = chart.shadowRoot!;
            const shapesByLegend = new Map(
              [...root.querySelectorAll<SVGElement>('.line-marker')].map(marker => [
                marker.dataset.legend,
                marker.dataset.shape,
              ]),
            );
            const hoverMarkers = [...root.querySelectorAll<SVGElement>('.hover-dot')].filter(
              marker => marker.style.display !== 'none',
            );
            return {
              arePaths: hoverMarkers.every(marker => marker.tagName === 'path'),
              areHollow: hoverMarkers.every(marker => marker.getAttribute('fill') === '#fff'),
              matchSeries: hoverMarkers.every(
                marker => shapesByLegend.get(marker.dataset.legend) === marker.dataset.shape,
              ),
              shapeCount: new Set(hoverMarkers.map(marker => marker.dataset.shape)).size,
            };
          }),
        ).toEqual({ arePaths: true, areHollow: true, matchSeries: true, shapeCount: 8 });
      }

      if (story.id === 'events') {
        await expect(page.locator('label[for="line-events-color"]')).toHaveText(
          'Use Custom Color for Event Annotation',
        );
        const sizeBounds = await page.locator('.line-events-size-controls').boundingBox();
        const shapeBounds = await page.locator('.line-events-shape-controls').boundingBox();
        const colorBounds = await page.locator('.line-events-color-controls').boundingBox();
        expect(shapeBounds!.y - (sizeBounds!.y + sizeBounds!.height)).toBeGreaterThanOrEqual(16);
        expect(colorBounds!.y - (shapeBounds!.y + shapeBounds!.height)).toBeGreaterThanOrEqual(16);
        await expect(page.locator('.line-events-shape-controls > fluent-field')).toHaveCount(1);
        const labels = element.locator('.event-annotation-label');
        await expect(labels).toHaveCount(3);
        expect(await labels.allTextContents()).toEqual(['3 events', 'event 4', 'event 5']);
        await expect(labels.first()).toHaveAttribute('data-label-width', '50');
        await expect(labels.first()).toHaveAttribute('role', 'button');
        await expect(element.locator('.event-annotation-line').first()).toHaveAttribute(
          'stroke',
          'var(--colorNeutralForeground1)',
        );
        const eventLabelStyle = await labels.first().evaluate(label => {
          const style = getComputedStyle(label);
          return { fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight };
        });
        const legendLabelStyle = await element
          .locator('.legend-text')
          .first()
          .evaluate(label => {
            const style = getComputedStyle(label);
            return { fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight };
          });
        expect(eventLabelStyle).toEqual(legendLabelStyle);
        expect(
          await element.evaluate(chart => {
            const root = chart.shadowRoot!;
            const line = root.querySelector('.event-annotation-line')!;
            const label = root.querySelector('.event-annotation-label')!;
            const axisTransform = root.querySelector('.x-axis')!.getAttribute('transform') ?? '';
            const plotTop = Number(
              root
                .querySelector('.y-axis')!
                .getAttribute('transform')
                ?.match(/,\s*([\d.]+)\)/)?.[1],
            );
            return {
              lineEnd: Number(line.getAttribute('y2')),
              axisY: Number(axisTransform.match(/,\s*([\d.]+)\)/)?.[1]),
              labelY: Number(label.getAttribute('y')),
              plotTop,
            };
          }),
        ).toEqual({ lineEnd: 250, axisY: 250, labelY: 38, plotTop: 58 });

        await page.locator('input[aria-label="Event annotation color"]').evaluate(input => {
          const colorInput = input as HTMLInputElement;
          colorInput.value = '#ff0000';
          colorInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await expect(element.locator('.event-annotation-line').first()).toHaveAttribute('stroke', '#ff0000');
        await expect(labels.first()).toHaveAttribute('fill', '#ff0000');
      }
    }
  });

  test('Custom Locale should update date labels and expose point and line click callbacks', async ({ page }) => {
    await page.goto(fixtureURL('components-linechart--custom-locale-date-axis'));
    const element = page.locator('fluent-line-chart');
    const labels = element.locator('.x-axis .tick text');
    const italianLabels = await labels.allTextContents();

    await expect(page.locator('.line-locale-size-controls .slider-input')).toHaveCount(2);
    await expect(page.locator('#line-locale-width + output')).toHaveText('700');
    await expect(page.locator('#line-locale-height + output')).toHaveText('300');
    await expect(page.locator('.line-locale-option-controls > fluent-field')).toHaveCount(2);
    const layoutBounds = await page
      .locator('.line-locale-size-controls, .line-locale-option-controls, fluent-line-chart')
      .evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON()));
    expect(layoutBounds[1].top - layoutBounds[0].bottom).toBeGreaterThanOrEqual(16);
    expect(layoutBounds[2].top - layoutBounds[1].bottom).toBeGreaterThanOrEqual(16);

    await page.locator('#line-locale-culture').evaluate(dropdown => {
      const cultureDropdown = dropdown as HTMLElement & { value: string };
      cultureDropdown.value = 'en-US';
      cultureDropdown.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect.poll(() => labels.allTextContents()).not.toEqual(italianLabels);
    expect(await element.evaluate(chart => (chart as HTMLElement & { culture: string }).culture)).toBe('en-US');

    const pointTargets = element.locator('.line-marker-hit-area[data-legend="From_Legacy_to_O365"]');
    await expect(pointTargets).toHaveCount(7);
    await expect(element.locator('.line-marker[data-legend="From_Legacy_to_O365"]')).toHaveCount(0);
    await pointTargets.nth(1).dispatchEvent('click');
    await expect(page.locator('output[aria-live="polite"]')).toHaveText('Clicked data point 218123');
    await expect(pointTargets.nth(1)).toBeFocused();
    await expect(pointTargets.nth(1)).toHaveAttribute('tabindex', '0');
    await expect(pointTargets.first()).toHaveAttribute('tabindex', '-1');

    await element.locator('.line-path[data-legend="From_Legacy_to_O365"]').dispatchEvent('click');
    await expect(page.locator('output[aria-live="polite"]')).toHaveText('Clicked line From_Legacy_to_O365');
  });

  test('Should reverse x-axis data order in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-line-chart data='${JSON.stringify(data)}' width='600' height='300' show-markers></fluent-line-chart>
      </div>
    `);
    const element = page.locator('fluent-line-chart');

    const markers = element.locator('.line-marker');
    await expect(markers).toHaveCount(6);
    expect(Number(await markers.first().getAttribute('cx'))).toBeGreaterThan(
      Number(await markers.nth(2).getAttribute('cx')),
    );
  });

  test('Should use roving keyboard navigation for datapoints', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    const points = element.locator('.data-point-focus-target');

    await expect(points).toHaveCount(6);
    await expect(points.first()).toHaveAttribute('tabindex', '0');
    await expect(points.nth(1)).toHaveAttribute('tabindex', '-1');

    await points.first().focus();
    await expect(element.locator('.tooltip')).toBeVisible();
    await points.first().press('ArrowRight');

    await expect(points.first()).toHaveAttribute('tabindex', '-1');
    await expect(points.nth(1)).toHaveAttribute('tabindex', '0');
    await expect(points.nth(1)).toBeFocused();
    await expect(element.locator('.tooltip')).toBeVisible();
  });

  test('Should focus a datapoint clicked in the middle of a line', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    const points = element.locator('.data-point-focus-target[data-legend="Series A"]');

    await points.nth(1).click();

    await expect(points.nth(1)).toBeFocused();
    await expect(points.nth(1)).toHaveAttribute('tabindex', '0');
    await expect(points.first()).toHaveAttribute('tabindex', '-1');
  });

  test('Should move focus vertically between datapoints with the same x value', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    const points = element.locator('.data-point-focus-target');
    const firstXPoints = element.locator('.data-point-focus-target[data-x-key="0"]');

    await expect(firstXPoints).toHaveCount(2);
    const orderedIndexes = await points.evaluateAll(elements =>
      elements
        .map((point, index) => ({
          index,
          xKey: point.getAttribute('data-x-key'),
          cy: Number(point.getAttribute('cy')),
        }))
        .filter(point => point.xKey === '0')
        .sort((left, right) => left.cy - right.cy)
        .map(point => point.index),
    );
    const topPoint = points.nth(orderedIndexes[0]);
    const bottomPoint = points.nth(orderedIndexes[1]);

    await bottomPoint.focus();
    await bottomPoint.press('ArrowUp');
    await expect(topPoint).toHaveAttribute('tabindex', '0');
    await expect(topPoint).toBeFocused();
    await topPoint.press('ArrowDown');
    await expect(bottomPoint).toHaveAttribute('tabindex', '0');
    await expect(bottomPoint).toBeFocused();
  });

  test('RTL story should format tooltip dates like Basic', async ({ page }) => {
    const readFirstTooltipHeader = async (storyId: string): Promise<string> => {
      await page.goto(fixtureURL(`components-linechart--${storyId}`));
      const element = page.locator('fluent-line-chart');
      await element.evaluate(chart => ((chart as HTMLElement & { showMarkers: boolean }).showMarkers = true));
      await expect(element.locator('.line-marker')).toHaveCount(17);
      await element.locator('.line-marker').first().dispatchEvent('mouseenter');
      return element.locator('.tooltip-header').innerText();
    };

    const basicHeader = await readFirstTooltipHeader('basic');
    expect(await readFirstTooltipHeader('rtl')).toBe(basicHeader);
  });

  test('Should render shared gridlines and annotations with custom Cartesian margins', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & {
        margins: { top: number; right: number; bottom: number; left: number };
        annotations: Array<{ text: string; coordinates: { type: 'data'; x: number; y: number } }>;
      };
      chart.margins = { top: 30, right: 40, bottom: 50, left: 80 };
      chart.annotations = [{ text: 'Line target', coordinates: { type: 'data', x: 1, y: 20 } }];
    });

    expect(await element.locator('.axis-grid-line').count()).toBeGreaterThan(0);
    await expect(element.locator('.annotation-layer')).toHaveAttribute('transform', 'translate(80, 30)');
    await expect(element.locator('.chart-annotation-text')).toHaveText('Line target');
  });

  test('Should render markers when show-markers set', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => node.setAttribute('show-markers', ''));
    await expect(element.locator('.line-marker')).toHaveCount(6);
  });

  test('Should honor logarithmic x and y scales', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => {
      const chart = node as HTMLElement & {
        data: LineChartSeries[];
        xScaleType: 'log';
        yScaleType: 'log';
        showMarkers: boolean;
      };
      chart.data = [
        {
          legend: 'Log series',
          data: [
            { x: 1, y: 1 },
            { x: 10, y: 10 },
            { x: 100, y: 100 },
          ],
        },
      ];
      chart.xScaleType = 'log';
      chart.yScaleType = 'log';
      chart.showMarkers = true;
    });

    await expect(element.locator('.line-marker')).toHaveCount(3);
    const positions = await element.locator('.line-marker').evaluateAll(markers =>
      markers.map(marker => ({
        x: Number(marker.getAttribute('cx')),
        y: Number(marker.getAttribute('cy')),
      })),
    );
    expect(positions[1].x).toBeCloseTo((positions[0].x + positions[2].x) / 2, 5);
    expect(positions[1].y).toBeCloseTo((positions[0].y + positions[2].y) / 2, 5);
  });

  test('Should render configured gaps and per-series line styles', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-line-chart
        width="600"
        height="300"
        data='${JSON.stringify([
          {
            legend: 'Gapped',
            lineOptions: { strokeDasharray: '5 3', strokeWidth: 2 },
            gaps: [{ startIndex: 1, endIndex: 2 }],
            data: [
              { x: 0, y: 10 },
              { x: 1, y: 20 },
              { x: 2, y: 15 },
              { x: 3, y: 25 },
            ],
          },
        ])}'
      ></fluent-line-chart>
    `);

    const paths = page.locator('fluent-line-chart').locator('.line-path[data-legend="Gapped"]');
    await expect(paths).toHaveCount(2);
    await expect(paths.first()).toHaveAttribute('stroke-dasharray', '5 3');
    await expect(paths.first()).toHaveAttribute('stroke-width', '2');
  });

  test('Should render independently scaled secondary y-axis series', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-line-chart
        width="600"
        height="300"
        data='${JSON.stringify([
          {
            legend: 'Primary',
            data: [
              { x: 0, y: 1000 },
              { x: 1, y: 2000 },
            ],
          },
          {
            legend: 'Secondary',
            useSecondaryYScale: true,
            data: [
              { x: 0, y: 10 },
              { x: 1, y: 20 },
            ],
          },
        ])}'
      ></fluent-line-chart>
    `);

    const element = page.locator('fluent-line-chart');
    await expect(element.locator('.y-axis-secondary')).toHaveCount(1);
    const secondaryPath = element.locator('.line-path[data-legend="Secondary"]');
    const primaryPath = element.locator('.line-path[data-legend="Primary"]');
    expect(await secondaryPath.getAttribute('d')).toBe(await primaryPath.getAttribute('d'));
  });

  test('Should render annotations against LineChart data coordinates', async ({ page }) => {
    await page.setContent(/* html */ `
      <fluent-line-chart
        width="600"
        height="300"
        data='${JSON.stringify([
          {
            legend: 'Series',
            data: [
              { x: 0, y: 10 },
              { x: 1, y: 20 },
            ],
          },
        ])}'
        annotations='${JSON.stringify([
          {
            id: 'milestone',
            text: 'Milestone',
            coordinates: { type: 'data', x: 1, y: 20 },
            connector: { strokeWidth: 2 },
            layout: { offsetX: -20, offsetY: 30 },
          },
        ])}'
      ></fluent-line-chart>
    `);

    const annotation = page.locator('fluent-line-chart').locator('.chart-annotation[data-annotation-id="milestone"]');
    await expect(annotation).toHaveCount(1);
    await expect(annotation.locator('.chart-annotation-text')).toHaveText('Milestone');
    await expect(annotation.locator('.chart-annotation-connector')).toHaveAttribute('stroke-width', '2');
  });

  test('Should render legend items', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await expect(element.locator('.legend-text')).toHaveCount(2);
  });

  test('Should toggle rounded class on legend swatches when round-corners changes', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    const legendCount = await element.locator('.legend-text').count();

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await element.evaluate(el => {
      el.toggleAttribute('round-corners', true);
    });

    await expect(element.locator('.legend-rect.rounded')).toHaveCount(legendCount);
  });

  test('Should not round legend items when multiple shapes are enabled', async ({ page }) => {
    await page.goto(fixtureURL('components-linechart--multiple'));
    const element = page.locator('fluent-line-chart');

    await element.evaluate(el => el.toggleAttribute('round-corners', true));

    await expect(element.locator('.legend-shape')).not.toHaveCount(0);
    await expect(element.locator('.legend-rect')).not.toHaveCount(0);
    await expect(element.locator('.legend-rect.rounded')).toHaveCount(0);

    await page.locator('#line-multiple-shapes').click();
    await expect(element.locator('.legend-shape')).toHaveCount(0);
    await expect(element.locator('.legend-rect.rounded')).not.toHaveCount(0);
  });

  test('Should re-render on data change', async ({ page }) => {
    const element = page.locator('fluent-line-chart');
    await element.evaluate(node => {
      (node as HTMLElement & { data: LineChartSeries[] }).data = [
        {
          legend: 'Only Series',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 12 },
          ],
        },
      ];
    });
    await expect(element.locator('.line-path')).toHaveCount(1);
  });

  test('Should render primary y-axis on right in RTL', async ({ page }) => {
    await page.setContent(/* html */ `
      <div dir="rtl">
        <fluent-line-chart data='${JSON.stringify(data)}' width='600' height='300'></fluent-line-chart>
      </div>
    `);
    const element = page.locator('fluent-line-chart');
    await expect(element.locator('.y-axis .axis-tick-line').first()).toHaveAttribute('x2', '6');
  });
});
