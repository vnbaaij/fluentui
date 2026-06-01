import type { Meta, Story } from '../helpers.stories.js';
import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  visuallyHiddenStyle,
} from '../helpers.stories.js';
import { GanttChart as FluentGanttChart } from './gantt-chart.js';
import { DataVizPalette } from '../utils/chart-helpers.js';
import type { GanttChartDataPoint } from './gantt-chart.options.js';
import type { AxisCategoryOrder } from '../utils/chart-options.js';

// ── Sample data: Basic (mirrors GanttChartBasic React story) ─────────────────

const basicData: GanttChartDataPoint[] = [
  {
    x: { start: new Date('2009-01-01'), end: new Date('2009-02-28') },
    y: 'Job A',
    legend: 'Alex',
    color: DataVizPalette.color1,
  },
  {
    x: { start: new Date('2009-03-05'), end: new Date('2009-04-15') },
    y: 'Job B',
    legend: 'Alex',
    color: DataVizPalette.color1,
  },
  {
    x: { start: new Date('2009-02-20'), end: new Date('2009-05-30') },
    y: 'Job C',
    legend: 'Max',
    color: DataVizPalette.color2,
  },
];

// ── Sample data: Grouped (mirrors GanttChartGrouped React story) ──────────────

const groupedData: GanttChartDataPoint[] = [
  {
    x: { start: new Date('2017-01-01'), end: new Date('2017-02-02') },
    y: 'Job-1',
    legend: 'Complete',
    color: DataVizPalette.success,
  },
  {
    x: { start: new Date('2017-01-17'), end: new Date('2017-02-17') },
    y: 'Job-2',
    legend: 'Complete',
    color: DataVizPalette.success,
  },
  {
    x: { start: new Date('2017-01-14'), end: new Date('2017-03-14') },
    y: 'Job-4',
    legend: 'Complete',
    color: DataVizPalette.success,
  },
  {
    x: { start: new Date('2017-02-15'), end: new Date('2017-03-15') },
    y: 'Job-1',
    legend: 'Incomplete',
    color: DataVizPalette.warning,
  },
  {
    x: { start: new Date('2017-01-17'), end: new Date('2017-02-17') },
    y: 'Job-2',
    legend: 'Not Started',
    color: DataVizPalette.error,
  },
  {
    x: { start: new Date('2017-03-10'), end: new Date('2017-03-20') },
    y: 'Job-3',
    legend: 'Not Started',
    color: DataVizPalette.error,
  },
  {
    x: { start: new Date('2017-04-01'), end: new Date('2017-04-20') },
    y: 'Job-3',
    legend: 'Not Started',
    color: DataVizPalette.error,
  },
  {
    x: { start: new Date('2017-05-18'), end: new Date('2017-06-18') },
    y: 'Job-3',
    legend: 'Not Started',
    color: DataVizPalette.error,
  },
];

// ── Sample data: Numeric axis ─────────────────────────────────────────────────

const numericData: GanttChartDataPoint[] = [
  { x: { start: 0, end: 10 }, y: 'Task A', legend: 'Team Alpha', color: DataVizPalette.color1 },
  { x: { start: 5, end: 20 }, y: 'Task B', legend: 'Team Alpha', color: DataVizPalette.color1 },
  { x: { start: 12, end: 30 }, y: 'Task C', legend: 'Team Beta', color: DataVizPalette.color2 },
  { x: { start: 25, end: 45 }, y: 'Task D', legend: 'Team Beta', color: DataVizPalette.color2 },
  { x: { start: 40, end: 60 }, y: 'Task E', legend: 'Team Gamma', color: DataVizPalette.color3 },
];

// ── Category order options ────────────────────────────────────────────────────

const categoryOrderOptions: AxisCategoryOrder[] = [
  'default',
  'data',
  'category ascending',
  'category descending',
  'total ascending',
  'total descending',
  'min ascending',
  'min descending',
  'max ascending',
  'max descending',
  'sum ascending',
  'sum descending',
  'mean ascending',
  'mean descending',
  'median ascending',
  'median descending',
];

// ── Story meta ────────────────────────────────────────────────────────────────

export default {
  title: 'Components/GanttChart',
} as Meta<FluentGanttChart>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Basic: Story<FluentGanttChart> = () => {
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '350');
  return chart;
};;
Basic.parameters = { docs: { story: { height: '420px' } } };

export const StandardAttributes: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  let width = 600;
  let height = 350;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);

  const widthControl = createSliderField('Width', 'gantt-sa-width', width, 0, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'gantt-sa-height', height, 0, 1000, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'gantt-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'gantt-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'gantt-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Rounded Corners', 'gantt-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'gantt-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = {
  docs: {
    story: { height: '580px' },
  },
};

export const ChartAttributes: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '350');

  controls.appendChild(
    createSwitchField('Enable Gradient', 'gantt-ca-gradient', false, checked => {
      chart.toggleAttribute('enable-gradient', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
ChartAttributes.storyName = 'Chart Attributes';
ChartAttributes.parameters = {
  docs: {
    story: { height: '480px' },
  },
};

export const Grouped: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const srLabel = document.createElement('span');
  srLabel.setAttribute('style', visuallyHiddenStyle);
  srLabel.textContent = 'Chart controls';
  controls.appendChild(srLabel);

  let width = 600;
  let height = 350;
  let enableGradient = false;
  let roundCorners = false;
  let allowMultiple = false;

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = groupedData;
  chart.chartTitle = 'Gantt Chart';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);

  const widthControl = createSliderField('Width', 'gantt-grouped-width', width, 0, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  controls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'gantt-grouped-height', height, 0, 1000, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  controls.appendChild(heightControl.element);

  const switchRow = document.createElement('div');
  switchRow.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(switchRow);

  const gradientControl = createSwitchField('Enable Gradient', 'gantt-grouped-gradient', enableGradient, checked => {
    enableGradient = checked;
    chart.toggleAttribute('enable-gradient', checked);
  });
  switchRow.appendChild(gradientControl.element);

  const cornersControl = createSwitchField('Rounded Corners', 'gantt-grouped-corners', roundCorners, checked => {
    roundCorners = checked;
    chart.toggleAttribute('round-corners', checked);
  });
  switchRow.appendChild(cornersControl.element);

  const multiSelectControl = createSwitchField(
    'Select Multiple Legends',
    'gantt-grouped-multiselect',
    allowMultiple,
    checked => {
      allowMultiple = checked;
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    },
  );
  switchRow.appendChild(multiSelectControl.element);

  container.appendChild(chart);
  return container;
};

Grouped.parameters = {
  docs: {
    story: { height: '660px' },
  },
};

export const NumericAxis: Story<FluentGanttChart> = () => {
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = numericData;
  chart.chartTitle = 'Task Timeline (Numeric Axis)';
  chart.toggleAttribute('show-y-axis-labels', true);
  return chart;
};


NumericAxis.parameters = { docs: { story: { height: '420px' } } };
export const HideLegends: Story<FluentGanttChart> = () => {
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.toggleAttribute('hide-legends', true);
  return chart;
};


HideLegends.parameters = { docs: { story: { height: '420px' } } };
export const CategoryOrder: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  let yAxisCategoryOrder: AxisCategoryOrder = 'default';

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = groupedData;
  chart.chartTitle = 'Gantt Chart';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.toggleAttribute('hide-legends', true);
  chart.setAttribute('y-axis-category-order', yAxisCategoryOrder);

  const orderControl = createDropdownField(
    'Y-axis category order',
    'gantt-category-order',
    categoryOrderOptions,
    yAxisCategoryOrder,
    nextValue => {
      yAxisCategoryOrder = nextValue as AxisCategoryOrder;
      orderControl.setValue(nextValue);
      chart.setAttribute('y-axis-category-order', nextValue);
    },
  );
  controls.appendChild(orderControl.element);

  container.appendChild(chart);
  return container;
};


CategoryOrder.parameters = { docs: { story: { height: '480px' } } };
export const AxisTitles: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Project timeline with axis titles';
  chart.setAttribute('x-axis-title', 'Date');
  chart.setAttribute('y-axis-title', 'Job');
  chart.toggleAttribute('show-y-axis-labels', true);
  container.appendChild(chart);
  return container;
};


AxisTitles.parameters = { docs: { story: { height: '420px' } } };
export const TickFormat: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = numericData;
  chart.chartTitle = 'Tick format (.1f) on numeric x-axis';
  chart.setAttribute('x-axis-tick-format', '.1f');
  chart.toggleAttribute('show-y-axis-labels', true);
  container.appendChild(chart);
  return container;
};


TickFormat.parameters = { docs: { story: { height: '420px' } } };
export const TickPadding: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Custom tick padding = 14';
  chart.setAttribute('tick-padding', '14');
  chart.toggleAttribute('show-y-axis-labels', true);
  container.appendChild(chart);
  return container;
};


TickPadding.parameters = { docs: { story: { height: '420px' } } };
export const RotateXAxisLabels: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Rotated x-axis labels';
  chart.toggleAttribute('rotate-x-axis-labels', true);
  chart.toggleAttribute('show-y-axis-labels', true);
  container.appendChild(chart);
  return container;
};


RotateXAxisLabels.parameters = { docs: { story: { height: '420px' } } };
export const SupportNegativeData: Story<FluentGanttChart> = () => {
  const negativeNumericData: GanttChartDataPoint[] = [
    { x: { start: -10, end: 0 }, y: 5, legend: 'Past', color: DataVizPalette.color1 },
    { x: { start: -5, end: 10 }, y: 10, legend: 'Current', color: DataVizPalette.color2 },
    { x: { start: 0, end: 20 }, y: 15, legend: 'Future', color: DataVizPalette.color3 },
  ];
  const container = document.createElement('div');
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = negativeNumericData;
  chart.chartTitle = 'Negative numeric y-axis (support-negative-data)';
  chart.toggleAttribute('support-negative-data', true);
  container.appendChild(chart);
  return container;
};


SupportNegativeData.parameters = { docs: { story: { height: '420px' } } };
export const RoundedTicks: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = numericData;
  chart.chartTitle = 'Rounded/niced y-axis tick domain';
  chart.toggleAttribute('rounded-ticks', true);
  container.appendChild(chart);
  return container;
};


RoundedTicks.parameters = { docs: { story: { height: '420px' } } };
export const BarHeight: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  let barHeight = 24;

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart — custom bar height';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('bar-height', `${barHeight}`);

  const barHeightControl = createSliderField('Bar height', 'gantt-bar-height', barHeight, 4, 60, nextValue => {
    barHeight = nextValue;
    barHeightControl.setValue(nextValue);
    chart.setAttribute('bar-height', `${nextValue}`);
  });
  controls.appendChild(barHeightControl.element);

  container.appendChild(chart);
  return container;
};
BarHeight.parameters = { docs: { story: { height: '420px' } } };

export const TickValues: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = numericData;
  chart.chartTitle = 'Gantt Chart — explicit tick values';
  chart.tickValues = [0, 15, 30, 45, 60];
  container.appendChild(chart);

  return container;
};


TickValues.parameters = { docs: { story: { height: '480px' } } };
export const TickFormatLocale: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  const label = document.createElement('p');
  label.textContent =
    'tick-format is reserved for future d3-time-format support and currently has no visual effect. ' +
    'Use date-localize-options + culture to customise date axis labels via Intl.';
  label.setAttribute('style', 'font-style:italic;margin:0 0 8px;');
  container.appendChild(label);

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart — tick-format (placeholder)';
  chart.setAttribute('tick-format', '%m/%d');

  container.appendChild(chart);
  return container;
};


TickFormatLocale.parameters = { docs: { story: { height: '480px' } } };
export const StrokeWidth: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  let strokeWidth = 2;

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart — bar stroke width';
  chart.setAttribute('stroke-width', `${strokeWidth}`);

  const strokeControl = createSliderField('Stroke width', 'gantt-stroke-width', strokeWidth, 0, 8, nextValue => {
    strokeWidth = nextValue;
    strokeControl.setValue(nextValue);
    chart.setAttribute('stroke-width', `${nextValue}`);
  });
  controls.appendChild(strokeControl.element);

  container.appendChild(chart);
  return container;
};


StrokeWidth.parameters = { docs: { story: { height: '540px' } } };
export const ShowXAxisLabelsTooltip: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  let tooltipEnabled = true;

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart — x-axis label tooltips';
  // Use a long date format to ensure labels get truncated
  chart.setAttribute('tick-format', '%Y-%m-%d');
  chart.toggleAttribute('show-x-axis-labels-tooltip', tooltipEnabled);

  const tooltipControl = createSwitchField(
    'Show x-axis label tooltips',
    'gantt-x-axis-tooltip',
    tooltipEnabled,
    checked => {
      tooltipEnabled = checked;
      chart.toggleAttribute('show-x-axis-labels-tooltip', checked);
    },
  );
  controls.appendChild(tooltipControl.element);

  container.appendChild(chart);
  return container;
};


ShowXAxisLabelsTooltip.parameters = { docs: { story: { height: '520px' } } };
export const DateLocalizeOptions: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const localeOptions: Record<string, Intl.DateTimeFormatOptions> = {
    'Year + Month (long)': { year: 'numeric', month: 'long' },
    'Year + Month (short)': { year: 'numeric', month: 'short' },
    'Month + Day': { month: 'long', day: 'numeric' },
    'Year only': { year: 'numeric' },
  };
  const optionKeys = Object.keys(localeOptions);
  let selectedKey = optionKeys[0];

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart — date localize options';
  chart.dateLocalizeOptions = localeOptions[selectedKey];

  const optionsControl = createDropdownField(
    'Date format options',
    'gantt-date-localize-options',
    optionKeys,
    selectedKey,
    nextKey => {
      selectedKey = nextKey;
      chart.dateLocalizeOptions = localeOptions[nextKey];
    },
  );
  controls.appendChild(optionsControl.element);

  container.appendChild(chart);
  return container;
};


DateLocalizeOptions.parameters = { docs: { story: { height: '480px' } } };
export const TooltipRendererStory: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a bar — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt Chart — custom tooltipRenderer';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '350');
  chart.tooltipRenderer = (point, defaultRender) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding:8px;border-left:3px solid #637cef;background:#f3f6ff;';
    wrapper.innerHTML = `<strong>${point.legend ?? ''}</strong><br>${defaultRender(point)}`;
    return wrapper;
  };

  container.appendChild(chart);
  return container;
};
TooltipRendererStory.storyName = 'Tooltip Renderer';
TooltipRendererStory.parameters = { docs: { story: { height: '480px' } } };

const utcStoryData: GanttChartDataPoint[] = [
  {
    x: { start: new Date('2024-03-31T23:30:00Z'), end: new Date('2024-04-01T05:00:00Z') },
    y: 'Overnight import',
    legend: 'UTC series',
    color: DataVizPalette.color1,
  },
  {
    x: { start: new Date('2024-04-01T06:00:00Z'), end: new Date('2024-04-01T12:00:00Z') },
    y: 'Morning sync',
    legend: 'UTC series',
    color: DataVizPalette.color2,
  },
];

export const UseUTC: Story<FluentGanttChart> = () => {
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = utcStoryData;
  chart.chartTitle = 'Gantt Chart — UTC date ticks';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.toggleAttribute('use-utc', true);
  chart.setAttribute('tick-format', '%Y-%m-%d %H:%M');
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '350');
  return chart;
};
UseUTC.parameters = { docs: { story: { height: '420px' } } };

export const Culture: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = `Gantt chart culture example (${currentCulture})`;
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'gantt-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.chartTitle = `Gantt chart culture example (${currentCulture})`;
  });
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '470px' } } };

export const TitleAlign: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const alignments = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof alignments)[number] = 'start';

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt chart title alignment example';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '350');
  chart.setAttribute('title-align', currentAlign);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const alignControl = createDropdownField(
    'Title align',
    'gantt-title-align',
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

export const TitleAndLegendPositions: Story<FluentGanttChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const positions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentPosition: (typeof positions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Title and legend position example';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const posControl = createDropdownField(
    'Legend position',
    'gantt-legend-position',
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
    'gantt-title-position',
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

export const RTL: Story<FluentGanttChart> = () => {
  const div = document.createElement('div');
  div.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-gantt-chart') as FluentGanttChart;
  chart.data = basicData;
  chart.chartTitle = 'Gantt chart RTL example';
  chart.toggleAttribute('show-y-axis-labels', true);
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '350');
  div.appendChild(chart);
  return div;
};
RTL.parameters = { docs: { story: { height: '420px' } } };
