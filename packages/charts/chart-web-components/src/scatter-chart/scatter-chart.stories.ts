import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './scatter-chart.definition.js';
import type { ScatterChartSeries } from './scatter-chart.options.js';
import type { ScatterChart } from './scatter-chart.js';

// ── Sample data ───────────────────────────────────────────────────────────────

const basicData: ScatterChartSeries[] = [
  {
    legend: 'Phase 1',
    color: 'qualitative.3',
    data: [
      { x: 10, y: 50000, markerSize: 12 },
      { x: 20, y: 75000, markerSize: 15 },
      { x: 30, y: 90000, markerSize: 18 },
      { x: 40, y: 120000, markerSize: 22 },
      { x: 50, y: 150000, markerSize: 25 },
    ],
  },
  {
    legend: 'Phase 2',
    color: 'qualitative.4',
    data: [
      { x: 60, y: 180000, markerSize: 28 },
      { x: 70, y: 200000, markerSize: 30 },
      { x: 80, y: 220000, markerSize: 32 },
      { x: 90, y: 250000, markerSize: 35 },
      { x: 100, y: 300000, markerSize: 40 },
    ],
  },
  {
    legend: 'Milestone',
    color: 'qualitative.5',
    data: [{ x: 75, y: 250000, markerSize: 50 }],
  },
];

const basicTitle = 'Project Revenue and Transactions Over Time';

const dateData: ScatterChartSeries[] = [
  {
    legend: 'Website Traffic',
    color: 'qualitative.3',
    data: [
      { x: new Date('2023-03-01T00:00:00.000Z'), y: 5000, markerSize: 15 },
      { x: new Date('2023-03-02T00:00:00.000Z'), y: 7000, markerSize: 20 },
      { x: new Date('2023-03-03T00:00:00.000Z'), y: 6500, markerSize: 18 },
      { x: new Date('2023-03-04T00:00:00.000Z'), y: 8000, markerSize: 25 },
      { x: new Date('2023-03-05T00:00:00.000Z'), y: 9000, markerSize: 30 },
      { x: new Date('2023-03-06T00:00:00.000Z'), y: 8500, markerSize: 28 },
      { x: new Date('2023-03-07T00:00:00.000Z'), y: 9500, markerSize: 35 },
    ],
  },
  {
    legend: 'Sales Performance',
    color: 'qualitative.4',
    data: [
      { x: new Date('2023-03-01T00:00:00.000Z'), y: 2000, markerSize: 10 },
      { x: new Date('2023-03-02T00:00:00.000Z'), y: 3000, markerSize: 15 },
      { x: new Date('2023-03-03T00:00:00.000Z'), y: 2500, markerSize: 12 },
      { x: new Date('2023-03-04T00:00:00.000Z'), y: 4000, markerSize: 20 },
      { x: new Date('2023-03-05T00:00:00.000Z'), y: 4500, markerSize: 22 },
      { x: new Date('2023-03-06T00:00:00.000Z'), y: 4200, markerSize: 18 },
      { x: new Date('2023-03-07T00:00:00.000Z'), y: 5000, markerSize: 25 },
    ],
  },
  {
    legend: 'Promotional Campaign',
    color: 'qualitative.5',
    data: [{ x: new Date('2023-03-05T12:00:00.000Z'), y: 6000, markerSize: 40 }],
  },
];

const stringData: ScatterChartSeries[] = [
  {
    legend: 'Region 1',
    color: 'qualitative.3',
    data: [
      { x: 'Electronics', y: 50000, markerSize: 25 },
      { x: 'Furniture', y: 30000, markerSize: 20 },
      { x: 'Clothing', y: 20000, markerSize: 15 },
      { x: 'Toys', y: 15000, markerSize: 10 },
      { x: 'Books', y: 10000, markerSize: 8 },
    ],
  },
  {
    legend: 'Region 2',
    color: 'qualitative.4',
    data: [
      { x: 'Electronics', y: 60000, markerSize: 30 },
      { x: 'Furniture', y: 25000, markerSize: 18 },
      { x: 'Clothing', y: 22000, markerSize: 16 },
      { x: 'Toys', y: 12000, markerSize: 12 },
      { x: 'Books', y: 8000, markerSize: 6 },
    ],
  },
];

const logData: ScatterChartSeries[] = [
  {
    legend: 'Trace 1',
    color: 'qualitative.1',
    data: [
      { x: 1.2589254117941673, y: 2.4236435587418756, markerSize: 7 },
      { x: 2.39095514427051, y: 3.209069828287282, markerSize: 8 },
      { x: 4.540909610972476, y: 6.700279261114452, markerSize: 13 },
      { x: 8.624109968952766, y: 15.657933357041166, markerSize: 6 },
      { x: 16.378937069540648, y: 26.410125335101004, markerSize: 8 },
      { x: 31.10692935198609, y: 21.628233443544943, markerSize: 8 },
      { x: 59.078379115879464, y: 71.08357068207286, markerSize: 8 },
      { x: 112.20184543019641, y: 95.45928375106901, markerSize: 12 },
      { x: 213.09410153667977, y: 175.17899348200768, markerSize: 5 },
      { x: 404.70899507597613, y: 367.05817591616454, markerSize: 6 },
      { x: 768.6246100397738, y: 616.3133732775369, markerSize: 14 },
      { x: 1459.7743028861687, y: 1533.9498528438594, markerSize: 14 },
      { x: 2772.4079967417756, y: 2371.497871143982, markerSize: 5 },
      { x: 5265.366081044865, y: 3617.6579249480537, markerSize: 9 },
      { x: 10000, y: 7149.749744738273, markerSize: 12 },
    ],
  },
  {
    legend: 'Trace 2',
    color: 'warning',
    data: [
      { x: 3.1622776601683795, y: 2.1949926582336188, markerSize: 13 },
      { x: 6.1054022965853285, y: 4.772119103737707, markerSize: 16 },
      { x: 11.787686347935873, y: 5.594480133444149, markerSize: 17 },
      { x: 22.758459260747887, y: 22.975394675590913, markerSize: 21 },
      { x: 43.939705607607905, y: 14.632760823223153, markerSize: 24 },
      { x: 84.83428982440716, y: 49.97794497098575, markerSize: 12 },
      { x: 163.78937069540646, y: 88.37494969641493, markerSize: 21 },
      { x: 316.22776601683796, y: 259.59923251477073, markerSize: 10 },
      { x: 610.5402296585327, y: 486.6059651967493, markerSize: 24 },
      { x: 1178.7686347935867, y: 671.2364692543704, markerSize: 13 },
      { x: 2275.8459260747863, y: 1356.3898150565117, markerSize: 15 },
      { x: 4393.97056076079, y: 1697.3956575634736, markerSize: 22 },
      { x: 8483.428982440717, y: 1782.902150290326, markerSize: 19 },
      { x: 16378.937069540612, y: 7474.040318615067, markerSize: 20 },
      { x: 31622.776601683792, y: 16592.321174954774, markerSize: 14 },
    ],
  },
];

const xAxisTicks = Array.from({ length: 12 }, (_, index) => index * 10);
const yAxisTicks = [0, 81250, 162500, 243750, 325000];

const applyReactExampleData = (chart: ScatterChart): void => {
  chart.data = basicData;
  chart.xMinValue = 0;
  chart.xMaxValue = 110;
  chart.yMinValue = 0;
  chart.yMaxValue = 325000;
  chart.tickValues = xAxisTicks;
  chart.yAxisTickValues = yAxisTicks;
};

export default { title: 'Components/ScatterChart' } as Meta<ScatterChart>;

export const Basic: Story<ScatterChart> = () => {
  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  applyReactExampleData(chart);
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('x-axis-title', 'Days since project start');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
  return chart;
};
Basic.parameters = { docs: { story: { height: '470px' } } };

export const StandardAttributes: Story<ScatterChart> = () => {
  const container = document.createElement('div');

  let width = 650;
  let height = 350;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  applyReactExampleData(chart);
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('x-axis-title', 'Days since project start');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'scatter-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'scatter-sa-height', height, 100, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'scatter-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'scatter-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'scatter-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'scatter-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '560px' } } };

const createScatterExample = (
  data: ScatterChartSeries[],
  title: string,
  description: string,
  xAxisTitle: string,
  yAxisTitle: string,
  idPrefix: string,
  width = 650,
  height = 350,
): HTMLDivElement => {
  const container = document.createElement('div');
  const intro = document.createElement('p');
  intro.textContent = description;
  container.appendChild(intro);

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  chart.data = data;
  chart.chartTitle = title;
  chart.width = width;
  chart.height = height;
  chart.xAxisTitle = xAxisTitle;
  chart.yAxisTitle = yAxisTitle;

  const widthControl = createSliderField('Width', `${idPrefix}-width`, width, 200, 1000, value => {
    widthControl.setValue(value);
    chart.width = value;
  });
  const heightControl = createSliderField('Height', `${idPrefix}-height`, height, 200, 1000, value => {
    heightControl.setValue(value);
    chart.height = value;
  });
  controls.append(widthControl.element, heightControl.element);
  container.appendChild(chart);
  return container;
};

export const ScatterChartDate: Story<ScatterChart> = () => {
  const container = createScatterExample(
    dateData,
    'Website Traffic and Sales Performance',
    'Scatter chart date x example.',
    'Date',
    'Number of visitors',
    'scatter-date',
  );
  const chart = container.querySelector('fluent-scatter-chart') as ScatterChart;
  chart.useUTC = true;
  return container;
};
ScatterChartDate.storyName = 'Date based';
ScatterChartDate.parameters = { docs: { story: { height: '520px' } } };

export const ScatterChartString: Story<ScatterChart> = () =>
  createScatterExample(
    stringData,
    'Sales Performance by Category',
    'Scatter chart string x example.',
    'Product Category',
    'Revenue in dollars',
    'scatter-string',
  );
ScatterChartString.storyName = 'String based';
ScatterChartString.parameters = { docs: { story: { height: '520px' } } };

export const ScatterChartLogAxisExample: Story<ScatterChart> = () => {
  const container = createScatterExample(logData, 'Scatter Chart', '', '', '', 'scatter-log', 700, 300);
  const chart = container.querySelector('fluent-scatter-chart') as ScatterChart;
  chart.xScaleType = 'log';
  chart.yScaleType = 'log';
  chart.hideTickOverlap = true;

  const scaleControls = document.createElement('div');
  scaleControls.setAttribute('style', controlsRowStyle);
  scaleControls.append(
    createDropdownField('xScaleType', 'scatter-log-x-scale', ['default', 'log'], 'log', value => {
      chart.xScaleType = value as ScatterChart['xScaleType'];
    }).element,
    createDropdownField('yScaleType', 'scatter-log-y-scale', ['default', 'log'], 'log', value => {
      chart.yScaleType = value as ScatterChart['yScaleType'];
    }).element,
  );
  container.insertBefore(scaleControls, chart);
  return container;
};
ScatterChartLogAxisExample.storyName = 'Log Axis';
ScatterChartLogAxisExample.parameters = { docs: { story: { height: '500px' } } };

export const TooltipRendererStory: Story<ScatterChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a bubble — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  applyReactExampleData(chart);
  chart.chartTitle = 'Scatter chart custom tooltipRenderer';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('x-axis-title', 'Days since project start');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
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
TooltipRendererStory.parameters = { docs: { story: { height: '470px' } } };

export const Culture: Story<ScatterChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  applyReactExampleData(chart);
  chart.chartTitle = `Scatter chart culture example (${currentCulture})`;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('x-axis-title', 'Days since project start');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField(
    'Culture',
    'scatter-culture',
    [...cultures],
    currentCulture,
    nextCulture => {
      currentCulture = nextCulture;
      chart.setAttribute('culture', currentCulture);
      chart.chartTitle = `Scatter chart culture example (${currentCulture})`;
    },
  );
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '470px' } } };

export const TitleAlign: Story<ScatterChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  applyReactExampleData(chart);
  chart.chartTitle = 'Scatter chart title align example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'scatter-title-align', [...aligns], currentAlign, nextAlign => {
      currentAlign = nextAlign as (typeof aligns)[number];
      if (currentAlign === 'start') {
        chart.removeAttribute('title-align');
      } else {
        chart.setAttribute('title-align', currentAlign);
      }
    }).element,
  );

  return container;
};
TitleAlign.parameters = { docs: { story: { height: '470px' } } };

export const TitleAndLegendPositions: Story<ScatterChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  applyReactExampleData(chart);
  chart.chartTitle = 'Scatter chart title and legend positions example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'scatter-title-position',
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
    ).element,
  );
  controls.appendChild(
    createDropdownField(
      'Legend position',
      'scatter-legend-position',
      [...legendPositions],
      currentLegendPosition,
      nextLegendPosition => {
        currentLegendPosition = nextLegendPosition as (typeof legendPositions)[number];
        if (currentLegendPosition === 'bottom') {
          chart.removeAttribute('legend-position');
        } else {
          chart.setAttribute('legend-position', currentLegendPosition);
        }
      },
    ).element,
  );

  return container;
};
TitleAndLegendPositions.parameters = { docs: { story: { height: '470px' } } };

export const RTL: Story<ScatterChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  applyReactExampleData(chart);
  chart.chartTitle = 'Scatter chart RTL example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '470px' } } };
