import { html } from '@microsoft/fast-element';
import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  type Meta,
  renderComponent,
  type Story,
  type StoryArgs,
} from '../helpers.stories.js';
import { definition } from './area-chart.definition.js';
import type { AreaChartDataPoint, AreaChartSeries } from './area-chart.options.js';
import type { AreaChart } from './area-chart.js';

// ── Sample data ───────────────────────────────────────────────────────────────

const chart1Points: AreaChartDataPoint[] = [
  { x: 20, y: 7000, xAxisCalloutData: new Date(2026, 0, 1), yAxisCalloutData: '35%' },
  { x: 25, y: 9000, xAxisCalloutData: new Date(2026, 0, 15), yAxisCalloutData: '45%' },
  { x: 30, y: 13000, xAxisCalloutData: new Date(2026, 0, 28), yAxisCalloutData: '65%' },
  { x: 35, y: 15000, xAxisCalloutData: new Date(2026, 1, 1), yAxisCalloutData: '75%' },
  { x: 40, y: 11000, xAxisCalloutData: new Date(2026, 2, 1), yAxisCalloutData: '55%' },
  { x: 45, y: 8760, xAxisCalloutData: new Date(2026, 2, 15), yAxisCalloutData: '43%' },
  { x: 50, y: 3500, xAxisCalloutData: new Date(2026, 2, 28), yAxisCalloutData: '18%' },
  { x: 55, y: 20000, xAxisCalloutData: new Date(2026, 3, 4), yAxisCalloutData: '100%' },
  { x: 60, y: 17000, xAxisCalloutData: new Date(2026, 3, 15), yAxisCalloutData: '85%' },
  { x: 65, y: 1000, xAxisCalloutData: new Date(2026, 4, 5), yAxisCalloutData: '5%' },
  { x: 70, y: 12000, xAxisCalloutData: new Date(2026, 5, 1), yAxisCalloutData: '60%' },
  { x: 75, y: 6876, xAxisCalloutData: new Date(2026, 0, 15), yAxisCalloutData: '34%' },
  { x: 80, y: 12000, xAxisCalloutData: new Date(2026, 3, 30), yAxisCalloutData: '60%' },
  { x: 85, y: 7000, xAxisCalloutData: new Date(2026, 4, 4), yAxisCalloutData: '35%' },
  { x: 90, y: 10000, xAxisCalloutData: new Date(2026, 5, 1), yAxisCalloutData: '50%' },
];

const basicData: AreaChartSeries[] = [
  { legend: 'legend1', data: chart1Points },
  { legend: 'legend2', data: chart1Points.map(point => ({ ...point, y: point.y + 5000 })) },
  { legend: 'legend3', data: chart1Points.map(point => ({ ...point, y: point.y + 7000 })) },
];

const multipleData: AreaChartSeries[] = [
  {
    legend: 'legend1',
    color: 'qualitative.4',
    data: [
      { x: 20, y: 9 },
      { x: 25, y: 14 },
      { x: 30, y: 14 },
      { x: 35, y: 23 },
      { x: 40, y: 20 },
      { x: 45, y: 31 },
      { x: 50, y: 29 },
      { x: 55, y: 27 },
      { x: 60, y: 37 },
      { x: 65, y: 51 },
    ],
  },
  {
    legend: 'legend2',
    color: 'qualitative.5',
    data: [
      { x: 20, y: 21 },
      { x: 25, y: 25 },
      { x: 30, y: 10 },
      { x: 35, y: 10 },
      { x: 40, y: 14 },
      { x: 45, y: 18 },
      { x: 50, y: 9 },
      { x: 55, y: 23 },
      { x: 60, y: 7 },
      { x: 65, y: 55 },
    ],
  },
  {
    legend: 'legend3',
    color: 'qualitative.6',
    data: [
      { x: 20, y: 30 },
      { x: 25, y: 35 },
      { x: 30, y: 33 },
      { x: 35, y: 40 },
      { x: 40, y: 10 },
      { x: 45, y: 40 },
      { x: 50, y: 34 },
      { x: 55, y: 40 },
      { x: 60, y: 60 },
      { x: 65, y: 40 },
    ],
  },
];

// Single series with mixed positive/negative y values (mirrors React AreaChartNegative)
const negativeData: AreaChartSeries[] = [
  {
    legend: 'legend1',
    data: [
      { x: 20, y: 7000 },
      { x: 25, y: -9000 },
      { x: 30, y: 13000 },
      { x: 35, y: -15000 },
      { x: 40, y: 11000 },
      { x: 45, y: -8760 },
      { x: 50, y: 3500 },
      { x: 55, y: -20000 },
      { x: 60, y: 17000 },
      { x: 65, y: -1000 },
      { x: 70, y: 12000 },
      { x: 75, y: -6876 },
      { x: 80, y: 12000 },
      { x: 85, y: -7000 },
      { x: 90, y: 10000 },
    ],
  },
];

// Three series with all-negative y values (mirrors React AreaChartAllNegative)
const allNegativeData: AreaChartSeries[] = [
  {
    legend: 'legend1',
    color: 'qualitative.4',
    data: [
      { x: 20, y: -9 },
      { x: 25, y: -14 },
      { x: 30, y: -14 },
      { x: 35, y: -23 },
      { x: 40, y: -20 },
      { x: 45, y: -31 },
      { x: 50, y: -29 },
      { x: 55, y: -27 },
      { x: 60, y: -37 },
      { x: 65, y: -51 },
    ],
  },
  {
    legend: 'legend2',
    color: 'qualitative.5',
    data: [
      { x: 20, y: -21 },
      { x: 25, y: -25 },
      { x: 30, y: -10 },
      { x: 35, y: -10 },
      { x: 40, y: -14 },
      { x: 45, y: -18 },
      { x: 50, y: -9 },
      { x: 55, y: -23 },
      { x: 60, y: -7 },
      { x: 65, y: -55 },
    ],
  },
  {
    legend: 'legend3',
    color: 'qualitative.6',
    data: [
      { x: 20, y: -30 },
      { x: 25, y: -35 },
      { x: 30, y: -33 },
      { x: 35, y: -40 },
      { x: 40, y: -10 },
      { x: 45, y: -40 },
      { x: 50, y: -34 },
      { x: 55, y: -40 },
      { x: 60, y: -60 },
      { x: 65, y: -40 },
    ],
  },
];

// Three series with mixed positive/negative y values (mirrors React AreaChartMultipleNegative)
const multipleNegativeData: AreaChartSeries[] = [
  {
    legend: 'legend1',
    color: 'qualitative.4',
    data: [
      { x: 20, y: -9 },
      { x: 25, y: 14 },
      { x: 30, y: -14 },
      { x: 35, y: 23 },
      { x: 40, y: -20 },
      { x: 45, y: 31 },
      { x: 50, y: -29 },
      { x: 55, y: 27 },
      { x: 60, y: -37 },
      { x: 65, y: 51 },
    ],
  },
  {
    legend: 'legend2',
    color: 'qualitative.5',
    data: [
      { x: 20, y: 21 },
      { x: 25, y: -25 },
      { x: 30, y: 10 },
      { x: 35, y: -10 },
      { x: 40, y: 14 },
      { x: 45, y: -18 },
      { x: 50, y: 9 },
      { x: 55, y: -23 },
      { x: 60, y: 7 },
      { x: 65, y: -55 },
    ],
  },
  {
    legend: 'legend3',
    color: 'qualitative.6',
    data: [
      { x: 20, y: 30 },
      { x: 25, y: 35 },
      { x: 30, y: -33 },
      { x: 35, y: 40 },
      { x: 40, y: 10 },
      { x: 45, y: -40 },
      { x: 50, y: 34 },
      { x: 55, y: 40 },
      { x: 60, y: -60 },
      { x: 65, y: 40 },
    ],
  },
];

// Five data points per series with qualitative.8/9/10 colors (mirrors React AreaChartCustomAccessibility)
const customAccessibilityData: AreaChartSeries[] = [
  {
    legend: 'First',
    color: 'qualitative.8',
    data: [
      {
        x: 20,
        y: 9,
        xAxisCalloutAccessibilityData: { ariaLabel: 'x-Axis 20' },
        callOutAccessibilityData: { ariaLabel: 'Point 1 of 5 in First series. X value 20 Y value $9' },
      },
      {
        x: 40,
        y: 20,
        xAxisCalloutAccessibilityData: { ariaLabel: 'x-Axis 40' },
        callOutAccessibilityData: { ariaLabel: 'Point 2 of 5 in First series. X value 40 Y value $20' },
      },
      {
        x: 55,
        y: 27,
        xAxisCalloutAccessibilityData: { ariaLabel: 'x-Axis 55' },
        callOutAccessibilityData: { ariaLabel: 'Point 3 of 5 in First series. X value 55 Y value $27' },
      },
      {
        x: 60,
        y: 37,
        xAxisCalloutAccessibilityData: { ariaLabel: 'x-Axis 60' },
        callOutAccessibilityData: { ariaLabel: 'Point 4 of 5 in First series. X value 60 Y value $37' },
      },
      {
        x: 65,
        y: 51,
        xAxisCalloutAccessibilityData: { ariaLabel: 'x-Axis 65' },
        callOutAccessibilityData: { ariaLabel: 'Point 5 of 5 in First series. X value 65 Y value $51' },
      },
    ],
  },
  {
    legend: 'Second',
    color: 'qualitative.9',
    data: [
      {
        x: 20,
        y: 21,
        callOutAccessibilityData: {
          ariaLabel: 'First of 5 points in Second series. X coordinate is 20 and Y coordinate is $21',
        },
      },
      {
        x: 40,
        y: 25,
        callOutAccessibilityData: {
          ariaLabel: 'Second of 5 points in Second series. X coordinate is 40 and Y coordinate is $25',
        },
      },
      {
        x: 55,
        y: 23,
        callOutAccessibilityData: {
          ariaLabel: 'Third of 5 points in Second series. X coordinate is 55 and Y coordinate is $23',
        },
      },
      {
        x: 60,
        y: 7,
        callOutAccessibilityData: {
          ariaLabel: 'Fourth of 5 points in Second series. X coordinate is 60 and Y coordinate is $7',
        },
      },
      {
        x: 65,
        y: 55,
        callOutAccessibilityData: {
          ariaLabel: 'Fifth of 5 points in Second series. X coordinate is 65 and Y coordinate is $55',
        },
      },
    ],
  },
  {
    legend: 'Third',
    color: 'qualitative.10',
    data: [
      {
        x: 20,
        y: 30,
        callOutAccessibilityData: {
          ariaLabel: 'First of 5 points in Third series. X coordinate is 20 and Y coordinate is $30',
        },
      },
      {
        x: 40,
        y: 35,
        callOutAccessibilityData: {
          ariaLabel: 'Second of 5 points in Third series. X coordinate is 40 and Y coordinate is $35',
        },
      },
      {
        x: 55,
        y: 33,
        callOutAccessibilityData: {
          ariaLabel: 'Third of 5 points in Third series. X coordinate is 55 and Y coordinate is $33',
        },
      },
      {
        x: 60,
        y: 40,
        callOutAccessibilityData: {
          ariaLabel: 'Fourth of 5 points in Third series. X coordinate is 60 and Y coordinate is $40',
        },
      },
      {
        x: 65,
        y: 10,
        callOutAccessibilityData: {
          ariaLabel: 'Fifth of 5 points in Third series. X coordinate is 65 and Y coordinate is $10',
        },
      },
    ],
  },
];

const basicTitle = 'Area chart basic example';

export default { title: 'Components/AreaChart' } as Meta<AreaChart>;

export const Basic: Story<AreaChart> = () => {
  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Variation of stock market prices');
  return chart;
};
Basic.parameters = { docs: { story: { height: '420px' } } };

export const StandardAttributes: Story<AreaChart> = () => {
  const container = document.createElement('div');

  let width = 700;
  let height = 300;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Variation of stock market prices');
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'area-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'area-sa-height', height, 100, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'area-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'area-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'area-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'area-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'area-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '540px' } } };

export const Multiple: Story<AreaChart> = () => {
  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = multipleData;
  chart.chartTitle = 'Area chart multiple example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  return chart;
};
Multiple.parameters = { docs: { story: { height: '420px' } } };

export const EnableGradient: Story<AreaChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = basicData;
  chart.chartTitle = 'Area chart chart attributes example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Variation of stock market prices');
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createSwitchField('Enable Gradient', 'area-ca-enable-gradient', false, checked => {
      chart.toggleAttribute('enable-gradient', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
EnableGradient.storyName = 'Gradient';
EnableGradient.parameters = { docs: { story: { height: '420px' } } };

export const TooltipRendererStory: Story<AreaChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a point — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = basicData;
  chart.chartTitle = 'Area chart custom tooltipRenderer';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Variation of stock market prices');
  chart.tooltipRenderer = (_point, defaultRender) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding:8px;border-left:3px solid #637cef;background:#f3f6ff;';
    wrapper.innerHTML = defaultRender(_point);
    return wrapper;
  };

  container.appendChild(chart);
  return container;
};
TooltipRendererStory.storyName = 'Tooltip Renderer';
TooltipRendererStory.parameters = { docs: { story: { height: '420px' } } };

export const CustomAccessibility: Story<AreaChart> = () => {
  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = customAccessibilityData;
  chart.chartTitle = 'Area chart Custom Accessibility example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('y-axis-tick-format', '$,');
  return chart;
};
CustomAccessibility.storyName = 'Custom Accessibility';
CustomAccessibility.parameters = { docs: { story: { height: '420px' } } };

export const Negative: Story<AreaChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let showAxisTitles = true;

  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = negativeData;
  chart.chartTitle = 'Area chart Negative y example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Variation of stock market prices');

  controls.appendChild(
    createSwitchField('Hide Axis titles', 'area-negative-axis-titles', showAxisTitles, checked => {
      showAxisTitles = checked;
      if (showAxisTitles) {
        chart.setAttribute('x-axis-title', 'Number of days');
        chart.setAttribute('y-axis-title', 'Variation of stock market prices');
      } else {
        chart.removeAttribute('x-axis-title');
        chart.removeAttribute('y-axis-title');
      }
    }).element,
  );

  container.appendChild(chart);
  return container;
};
Negative.storyName = 'Negative Y Values';
Negative.parameters = { docs: { story: { height: '420px' } } };

export const MultipleNegative: Story<AreaChart> = () => {
  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = multipleNegativeData;
  chart.chartTitle = 'Area chart multiple negative y example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('y-axis-tick-format', '$,');
  return chart;
};
MultipleNegative.storyName = 'Multiple Series Negative Y Values';
MultipleNegative.parameters = { docs: { story: { height: '420px' } } };

export const AllNegative: Story<AreaChart> = () => {
  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = allNegativeData;
  chart.chartTitle = 'Area chart multiple all negative y example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('y-min-value', '-200');
  chart.setAttribute('y-axis-tick-format', '$,');
  return chart;
};
AllNegative.storyName = 'All Negative Y Values';
AllNegative.parameters = { docs: { story: { height: '420px' } } };

/** Non-stacked mode: each series fills independently from y=0 (equivalent to React's mode="tozeroy"). */
export const ZeroY: Story<AreaChart> = () => {
  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = basicData;
  chart.chartTitle = 'Area chart – non-stacked (zero Y baseline)';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Variation of stock market prices');
  chart.setAttribute('mode', 'tozeroy');
  return chart;
};
ZeroY.storyName = 'Zero Y (Non-stacked)';
ZeroY.parameters = { docs: { story: { height: '420px' } } };

// Secondary Y axis data: same x-values, second series has a different magnitude (mirrors React AreaChartSecondaryYAxis)
const secondaryYAxisData: AreaChartSeries[] = [
  {
    legend: 'Prices',
    data: chart1Points,
  },
  {
    legend: 'Gains',
    useSecondaryYScale: true,
    data: chart1Points.map(p => ({ x: p.x, y: Math.round(p.y * 0.02 + 100) })),
  },
];

export const SecondaryYAxis: Story<AreaChart> = () => {
  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = secondaryYAxisData;
  chart.chartTitle = 'Area chart with secondary Y axis';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Prices');
  chart.setAttribute('secondary-y-axis-title', 'Gains');
  chart.setAttribute('mode', 'tozeroy');
  return chart;
};
SecondaryYAxis.storyName = 'Secondary Y Axis';
SecondaryYAxis.parameters = { docs: { story: { height: '420px' } } };

export const Culture: Story<AreaChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = basicData;
  chart.chartTitle = `Area chart culture example (${currentCulture})`;
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Variation of stock market prices');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'area-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.chartTitle = `Area chart culture example (${currentCulture})`;
  });
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '470px' } } };

export const TitleAlign: Story<AreaChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const alignments = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof alignments)[number] = 'start';

  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = basicData;
  chart.chartTitle = 'Area chart title alignment example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('title-align', currentAlign);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const alignControl = createDropdownField(
    'Title align',
    'area-title-align',
    [...alignments],
    currentAlign,
    nextAlign => {
      currentAlign = nextAlign as (typeof alignments)[number];
      chart.setAttribute('title-align', currentAlign);
    },
  );
  controls.appendChild(alignControl.element);

  return container;
};
TitleAlign.parameters = { docs: { story: { height: '470px' } } };

export const TitleAndLegendPositions: Story<AreaChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const positions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentPosition: (typeof positions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-area-chart') as AreaChart;
  chart.data = basicData;
  chart.chartTitle = 'Title and legend position example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const posControl = createDropdownField(
    'Legend position',
    'area-legend-position',
    [...positions],
    currentPosition,
    nextPosition => {
      currentPosition = nextPosition as (typeof positions)[number];
      if (currentPosition === 'bottom') {
        chart.removeAttribute('legend-position');
      } else {
        chart.setAttribute('legend-position', currentPosition);
      }
    },
  );

  const titlePosControl = createDropdownField(
    'Title position',
    'area-title-position',
    [...titlePositions],
    currentTitlePosition,
    nextTitlePosition => {
      currentTitlePosition = nextTitlePosition as (typeof titlePositions)[number];
      if (currentTitlePosition === 'top') {
        chart.removeAttribute('title-position');
      } else {
        chart.setAttribute('title-position', currentTitlePosition);
      }
    },
  );
  controls.appendChild(titlePosControl.element);
  controls.appendChild(posControl.element);

  return container;
};
TitleAndLegendPositions.parameters = { docs: { story: { height: '470px' } } };

export const RTL: Story<AreaChart> = renderComponent(html<StoryArgs<AreaChart>>`
  <div dir="rtl">
    <fluent-area-chart
      chart-title="Area chart RTL example"
      data="${JSON.stringify(basicData)}"
      width="700"
      height="300"
      x-axis-title="Number of days"
      y-axis-title="Variation of stock market prices"
    >
    </fluent-area-chart>
  </div>
`);
RTL.parameters = { docs: { story: { height: '420px' } } };
