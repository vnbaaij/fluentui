import {
  controlsRowStyle,
  createCheckboxField,
  createDropdownField,
  createFluentButton,
  createRadioGroupField,
  createSliderField,
  createSwitchField,
  type Meta,
  type Story,
  visuallyHiddenStyle,
} from '../helpers.stories.js';
import { definition } from './vertical-stacked-bar-chart.definition.js';
import type {
  VerticalStackedBarChartDataPoint,
  VerticalStackedBarChartProps,
} from './vertical-stacked-bar-chart.options.js';
import type { VerticalStackedBarChart } from './vertical-stacked-bar-chart.js';

// ── Sample data ───────────────────────────────────────────────────────────────
// Mirrors the React VerticalStackedBarDefault story's data, colors, and lineData.

const firstChartPoints: VerticalStackedBarChartDataPoint[] = [
  { legend: 'Metadata1', data: 40, color: 'qualitative.11' },
  { legend: 'Metadata2', data: 5, color: 'darkblue' },
  { legend: 'Metadata3', data: 20, color: 'qualitative.6' },
  { legend: 'Metadata4', data: 10, color: 'qualitative.4' },
  { legend: 'Metadata5', data: 23, color: 'qualitative.5' },
  { legend: 'Metadata6', data: 0.4, color: 'qualitative.6' },
  { legend: 'Metadata7', data: 0.5, color: 'qualitative.7' },
  { legend: 'Metadata8', data: 0.3, color: 'qualitative.8' },
  { legend: 'Metadata9', data: 0.7, color: 'qualitative.9' },
  { legend: 'Metadata10', data: 0.1, color: 'qualitative.10' },
];

const secondChartPoints: VerticalStackedBarChartDataPoint[] = [
  { legend: 'Metadata1', data: 30, color: 'qualitative.11' },
  { legend: 'Metadata2', data: 20, color: 'darkblue' },
  { legend: 'Metadata3', data: 40, color: 'qualitative.6' },
];

const thirdChartPoints: VerticalStackedBarChartDataPoint[] = [
  { legend: 'Metadata1', data: 44, color: 'qualitative.11' },
  { legend: 'Metadata2', data: 28, color: 'darkblue' },
  { legend: 'Metadata3', data: 30, color: 'qualitative.6' },
];

const fourthChartPoints: VerticalStackedBarChartDataPoint[] = [
  { legend: 'Metadata1', data: 88, color: 'qualitative.11' },
  { legend: 'Metadata2', data: 22, color: 'darkblue' },
  { legend: 'Metadata3', data: 30, color: 'qualitative.6' },
];

const basicData: VerticalStackedBarChartProps[] = [
  {
    xAxisPoint: 0,
    chartData: firstChartPoints,
    lineData: [
      { y: 42, legend: 'Supported Builds', color: 'qualitative.2' },
      { y: 10, legend: 'Recommended Builds', color: 'qualitative.17' },
    ],
  },
  {
    xAxisPoint: 20,
    chartData: secondChartPoints,
    lineData: [{ y: 33, legend: 'Supported Builds', color: 'qualitative.2' }],
  },
  {
    xAxisPoint: 40,
    chartData: thirdChartPoints,
    lineData: [
      { y: 60, legend: 'Supported Builds', color: 'qualitative.2' },
      { y: 20, legend: 'Recommended Builds', color: 'qualitative.17' },
    ],
  },
  {
    xAxisPoint: 60,
    chartData: firstChartPoints,
    lineData: [
      { y: 41, legend: 'Supported Builds', color: 'qualitative.2' },
      { y: 10, legend: 'Recommended Builds', color: 'qualitative.17' },
    ],
  },
  {
    xAxisPoint: 80,
    chartData: fourthChartPoints,
    lineData: [
      { y: 100, legend: 'Supported Builds', color: 'qualitative.2' },
      { y: 70, legend: 'Recommended Builds', color: 'qualitative.17' },
    ],
  },
  {
    xAxisPoint: 100,
    chartData: firstChartPoints,
  },
];

const basicTitle = 'Vertical stacked bar chart basic example';

const axisTooltipData: VerticalStackedBarChartProps[] = [
  {
    xAxisPoint: 'Simple Data',
    chartData: [
      { legend: 'Metadata1', data: 2, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 0.5, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 0, color: 'qualitative.3' },
    ],
  },
  {
    xAxisPoint: 'Long text will display all text',
    chartData: [
      { legend: 'Metadata1', data: 30, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 3, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 40, color: 'qualitative.3' },
    ],
  },
  {
    xAxisPoint: 'Data',
    chartData: [
      { legend: 'Metadata1', data: 10, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 60, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 30, color: 'qualitative.3' },
    ],
  },
  {
    xAxisPoint: 'Meta data',
    chartData: [
      { legend: 'Metadata1', data: 2, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 0.5, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 0, color: 'qualitative.3' },
    ],
  },
];

const dateAxisData: VerticalStackedBarChartProps[] = [
  {
    xAxisPoint: '03/2018',
    chartData: [
      { legend: 'meta data 1', data: 2, color: 'qualitative.8' },
      { legend: 'meta data 2', data: 0.5, color: 'qualitative.9' },
      { legend: 'meta data 3', data: 0, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: '05/2018',
    chartData: [
      { legend: 'meta data 1', data: 30, color: 'qualitative.8' },
      { legend: 'meta data 2', data: 3, color: 'qualitative.9' },
      { legend: 'meta data 3', data: 40, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: '07/2018',
    chartData: [
      { legend: 'meta data 1', data: 10, color: 'qualitative.8' },
      { legend: 'meta data 2', data: 60, color: 'qualitative.9' },
      { legend: 'meta data 3', data: 30, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: '09/2018',
    chartData: [
      { legend: 'meta data 1', data: 2, color: 'qualitative.8' },
      { legend: 'meta data 2', data: 0.5, color: 'qualitative.9' },
      { legend: 'meta data 3', data: 0, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: '11/2018',
    chartData: [
      { legend: 'meta data 1', data: 10, color: 'qualitative.8' },
      { legend: 'meta data 2', data: 60, color: 'qualitative.9' },
      { legend: 'meta data 3', data: 30, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: '02/2019',
    chartData: [
      { legend: 'meta data 1', data: 2, color: 'qualitative.8' },
      { legend: 'meta data 2', data: 0.5, color: 'qualitative.9' },
      { legend: 'meta data 3', data: 0, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: '05/2019',
    chartData: [
      { legend: 'meta data 1', data: 30, color: 'qualitative.8' },
      { legend: 'meta data 2', data: 3, color: 'qualitative.9' },
      { legend: 'meta data 3', data: 40, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: '07/2019',
    chartData: [
      { legend: 'meta data 1', data: 10, color: 'qualitative.8' },
      { legend: 'meta data 2', data: 60, color: 'qualitative.9' },
      { legend: 'meta data 3', data: 30, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: '09/2019',
    chartData: [
      { legend: 'meta data 1', data: 2, color: 'qualitative.8' },
      { legend: 'meta data 2', data: 0.5, color: 'qualitative.9' },
      { legend: 'meta data 3', data: 0, color: 'qualitative.10' },
    ],
  },
];

const negativeData: VerticalStackedBarChartProps[] = [
  {
    xAxisPoint: 0,
    chartData: [
      { legend: 'Metadata1', data: 40, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 5, color: 'qualitative.2' },
      { legend: 'Metadata3', data: -20, color: 'qualitative.3' },
    ],
  },
  {
    xAxisPoint: 20,
    chartData: [
      { legend: 'Metadata1', data: -30, color: 'qualitative.1' },
      { legend: 'Metadata2', data: -20, color: 'qualitative.2' },
      { legend: 'Metadata3', data: -40, color: 'qualitative.3' },
    ],
  },
  {
    xAxisPoint: 40,
    chartData: [
      { legend: 'Metadata1', data: 44, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 28, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 30, color: 'qualitative.3' },
    ],
  },
];

const secondaryYAxisData: VerticalStackedBarChartProps[] = [
  {
    xAxisPoint: 0,
    chartData: [
      { legend: 'Electronics', data: 120, color: 'qualitative.1' },
      { legend: 'Furniture', data: 80, color: 'qualitative.2' },
      { legend: 'Clothing', data: 150, color: 'qualitative.3' },
      { legend: 'Groceries', data: 200, color: 'qualitative.4' },
      { legend: 'Toys', data: 90, color: 'qualitative.5' },
    ],
  },
  {
    xAxisPoint: 20,
    chartData: [
      { legend: 'Electronics', data: 140, color: 'qualitative.1' },
      { legend: 'Furniture', data: 100, color: 'qualitative.2' },
      { legend: 'Clothing', data: 130, color: 'qualitative.3' },
      { legend: 'Groceries', data: 220, color: 'qualitative.4' },
      { legend: 'Toys', data: 110, color: 'qualitative.5' },
    ],
  },
  {
    xAxisPoint: 40,
    chartData: [
      { legend: 'Electronics', data: 160, color: 'qualitative.1' },
      { legend: 'Furniture', data: 120, color: 'qualitative.2' },
      { legend: 'Clothing', data: 140, color: 'qualitative.3' },
      { legend: 'Groceries', data: 250, color: 'qualitative.4' },
      { legend: 'Toys', data: 100, color: 'qualitative.5' },
    ],
  },
  {
    xAxisPoint: 60,
    chartData: [
      { legend: 'Electronics', data: 180, color: 'qualitative.1' },
      { legend: 'Furniture', data: 140, color: 'qualitative.2' },
      { legend: 'Clothing', data: 160, color: 'qualitative.3' },
      { legend: 'Groceries', data: 300, color: 'qualitative.4' },
      { legend: 'Toys', data: 120, color: 'qualitative.5' },
    ],
  },
];

const axisCategoryOrderOptions = [
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
] as const;

const buildAxisCategoryOrderData = (dataSize: number) => {
  const grouped = new Map<string, VerticalStackedBarChartProps>();
  for (let i = 0; i < dataSize; i++) {
    const value = Math.floor(Math.random() * 200) - 100;
    const xAxisPoint = `Label ${Math.floor(Math.random() * Math.max(i, 1)) + 1}`;
    const legendIdx = Math.floor(Math.random() * Math.max(i, 1));
    const item = grouped.get(xAxisPoint) ?? { xAxisPoint, chartData: [] };
    item.chartData.push({
      data: value,
      legend: `Legend ${legendIdx + 1}`,
      color: `qualitative.${(legendIdx % 20) + 1}`,
    });
    grouped.set(xAxisPoint, item);
  }

  const data = Array.from(grouped.values());
  let yMinValue = 0;
  let yMaxValue = 0;
  for (const point of data) {
    let positiveSum = 0;
    let negativeSum = 0;
    for (const bar of point.chartData) {
      if (bar.data >= 0) {
        positiveSum += bar.data;
      } else {
        negativeSum += bar.data;
      }
    }
    yMaxValue = Math.max(yMaxValue, positiveSum);
    yMinValue = Math.min(yMinValue, negativeSum);
  }

  return { data, yMinValue, yMaxValue };
};

export default { title: 'Components/VerticalStackedBarChart' } as Meta<VerticalStackedBarChart>;

export const Basic: Story<VerticalStackedBarChart> = () => {
  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Variation of number of sales');
  chart.setAttribute('rounded-ticks', '');
  return chart;
};
Basic.parameters = { docs: { story: { height: '470px' } } };

export const StandardAttributes: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  let width = 650;
  let height = 350;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'vsbar-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'vsbar-sa-height', height, 100, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'vsbar-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'vsbar-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'vsbar-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'vsbar-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'vsbar-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '560px' } } };

export const ChartAttributes: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart chart attributes example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.setAttribute('bar-gap-max', '2');

  const barGapMaxControl = createSliderField('Bar Gap Max', 'vsbar-ca-bar-gap-max', 2, 0, 20, nextValue => {
    barGapMaxControl.setValue(nextValue);
    chart.setAttribute('bar-gap-max', `${nextValue}`);
  });
  sliderControls.appendChild(barGapMaxControl.element);

  const barWidthControl = createSliderField('Bar Width', 'vsbar-ca-bar-width', 16, 0, 60, nextValue => {
    barWidthControl.setValue(nextValue);
    if (nextValue === 0) {
      chart.removeAttribute('bar-width');
    } else {
      chart.setAttribute('bar-width', `${nextValue}`);
    }
  });
  sliderControls.appendChild(barWidthControl.element);

  toggleControls.appendChild(
    createSwitchField('Enable Gradient', 'vsbar-ca-enable-gradient', false, checked => {
      chart.toggleAttribute('enable-gradient', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
ChartAttributes.storyName = 'Chart Attributes';
ChartAttributes.parameters = { docs: { story: { height: '560px' } } };

export const TooltipRendererStory: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a stack segment — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart custom tooltipRenderer';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
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

export const Culture: Story<VerticalStackedBarChart> = () => {
  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart culture example (de-DE)';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('culture', 'de-DE');
  return chart;
};
Culture.parameters = { docs: { story: { height: '470px' } } };

export const TitleAlign: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart title align example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'vsbar-title-align', [...aligns], currentAlign, nextAlign => {
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

export const TitleAndLegendPositions: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart title and legend positions example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'vsbar-title-position',
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
      'vsbar-legend-position',
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

export const RTL: Story<VerticalStackedBarChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart RTL example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '470px' } } };

export const AxisTooltip: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = axisTooltipData;
  chart.chartTitle = 'Vertical stacked bar chart axis tooltip example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('bar-width', '16');
  chart.setAttribute('bar-gap-max', '2');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  let width = 650;
  let height = 350;
  let barWidthEnabled = true;
  let barWidth = 16;
  let xAxisInnerPaddingEnabled = false;
  let xAxisOuterPaddingEnabled = false;
  let xAxisInnerPadding = 0.67;
  let xAxisOuterPadding = 0;
  let selectedOption: 'showTooltip' | 'wrapLabels' = 'showTooltip';

  const syncChartSettings = () => {
    if (barWidthEnabled) {
      chart.setAttribute('bar-width', `${barWidth}`);
    } else {
      chart.removeAttribute('bar-width');
    }

    if (xAxisInnerPaddingEnabled) {
      chart.setAttribute('x-axis-inner-padding', `${xAxisInnerPadding}`);
    } else {
      chart.removeAttribute('x-axis-inner-padding');
    }

    if (xAxisOuterPaddingEnabled) {
      chart.setAttribute('x-axis-outer-padding', `${xAxisOuterPadding}`);
    } else {
      chart.removeAttribute('x-axis-outer-padding');
    }

    const shouldWrap = selectedOption === 'wrapLabels';
    chart.toggleAttribute('wrap-x-axis-labels', shouldWrap);
    chart.toggleAttribute('show-x-axis-labels-tooltip', !shouldWrap);
  };

  controls.appendChild(
    createSliderField('Width', 'vsbar-axis-tooltip-width', width, 200, 1000, nextValue => {
      width = nextValue;
      chart.setAttribute('width', `${nextValue}`);
    }).element,
  );
  controls.appendChild(
    createSliderField('Height', 'vsbar-axis-tooltip-height', height, 200, 1000, nextValue => {
      height = nextValue;
      chart.setAttribute('height', `${nextValue}`);
    }).element,
  );
  controls.appendChild(
    createCheckboxField('Enable Bar Width', 'vsbar-axis-tooltip-enable-bar-width', barWidthEnabled, checked => {
      barWidthEnabled = checked;
      syncChartSettings();
    }).element,
  );
  controls.appendChild(
    createSliderField('Bar Width', 'vsbar-axis-tooltip-bar-width', barWidth, 1, 100, nextValue => {
      barWidth = nextValue;
      syncChartSettings();
    }).element,
  );
  controls.appendChild(
    createCheckboxField(
      'Enable X Axis Inner Padding',
      'vsbar-axis-tooltip-enable-inner-padding',
      xAxisInnerPaddingEnabled,
      checked => {
        xAxisInnerPaddingEnabled = checked;
        syncChartSettings();
      },
    ).element,
  );
  controls.appendChild(
    createSliderField(
      'X Axis Inner Padding (x100)',
      'vsbar-axis-tooltip-inner-padding',
      Math.round(xAxisInnerPadding * 100),
      0,
      100,
      nextValue => {
        xAxisInnerPadding = nextValue / 100;
        syncChartSettings();
      },
    ).element,
  );
  controls.appendChild(
    createCheckboxField(
      'Enable X Axis Outer Padding',
      'vsbar-axis-tooltip-enable-outer-padding',
      xAxisOuterPaddingEnabled,
      checked => {
        xAxisOuterPaddingEnabled = checked;
        syncChartSettings();
      },
    ).element,
  );
  controls.appendChild(
    createSliderField(
      'X Axis Outer Padding (x100)',
      'vsbar-axis-tooltip-outer-padding',
      Math.round(xAxisOuterPadding * 100),
      0,
      100,
      nextValue => {
        xAxisOuterPadding = nextValue / 100;
        syncChartSettings();
      },
    ).element,
  );
  controls.appendChild(
    createRadioGroupField(
      'X Axis Tick Labels',
      'vsbar-axis-tooltip-mode',
      [
        { label: 'Show tooltip at x-axis ticks', value: 'showTooltip' },
        { label: 'Wrap x-axis ticks', value: 'wrapLabels' },
      ],
      selectedOption,
      nextValue => {
        selectedOption = nextValue as 'showTooltip' | 'wrapLabels';
        syncChartSettings();
      },
    ).element,
  );
  controls.appendChild(
    createSwitchField('Round corners', 'vsbar-axis-tooltip-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  syncChartSettings();
  return container;
};
AxisTooltip.storyName = 'Axis Tooltip';
AxisTooltip.parameters = { docs: { story: { height: '620px' } } };

export const Callout: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'WC VerticalStackedBarChart currently supports per-segment tooltips. This story ports the React callout variants using the shared tooltip renderer.';
  container.appendChild(info);

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart callout example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('bar-gap-max', '2');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  let selectedCallout: 'singleCallout' | 'MultiCallout' | 'singleCustomCallout' | 'MultiCustomCallout' = 'MultiCallout';

  const applyCalloutMode = () => {
    if (selectedCallout === 'singleCustomCallout' || selectedCallout === 'MultiCustomCallout') {
      chart.tooltipRenderer = (point, defaultRender) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding:8px;border-left:3px solid #637cef;background:#f3f6ff;';
        wrapper.innerHTML = defaultRender(point);
        return wrapper;
      };
    } else {
      chart.tooltipRenderer = undefined;
    }
  };

  controls.appendChild(
    createRadioGroupField(
      'Callout variant',
      'vsbar-callout-mode',
      [
        { label: 'Single callout', value: 'singleCallout' },
        { label: 'Stack callout', value: 'MultiCallout' },
        { label: 'Single custom callout', value: 'singleCustomCallout' },
        { label: 'Stack custom callout', value: 'MultiCustomCallout' },
      ],
      selectedCallout,
      nextValue => {
        selectedCallout = nextValue as 'singleCallout' | 'MultiCallout' | 'singleCustomCallout' | 'MultiCustomCallout';
        applyCalloutMode();
      },
    ).element,
  );

  controls.appendChild(
    createSwitchField('Hide tooltip', 'vsbar-callout-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  applyCalloutMode();
  return container;
};
Callout.parameters = { docs: { story: { height: '560px' } } };

export const CustomAccessibility: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Port of the React custom accessibility scenario. The chart is given an explicit aria-label and legend focus support can be validated with keyboard navigation.';
  container.appendChild(info);

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart custom accessibility example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('bar-gap-max', '2');
  chart.setAttribute('aria-label', 'Vertical stacked bar chart custom accessibility example');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createSwitchField('Hide labels', 'vsbar-custom-a11y-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );
  controls.appendChild(
    createSwitchField('Round corners', 'vsbar-custom-a11y-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );
  controls.appendChild(
    createSwitchField('Multiple legend selection', 'vsbar-custom-a11y-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  return container;
};
CustomAccessibility.parameters = { docs: { story: { height: '560px' } } };

export const DateAxis: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = dateAxisData;
  chart.chartTitle = 'Vertical stacked bar chart date axis example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('bar-gap-max', '2');
  chart.setAttribute('x-axis-title', 'Month');
  chart.setAttribute('y-axis-title', 'Values');
  chart.setAttribute('hide-legends', '');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createSliderField('Bar Gap Max', 'vsbar-date-axis-bar-gap-max', 2, 0, 10, nextValue => {
      chart.setAttribute('bar-gap-max', `${nextValue}`);
    }).element,
  );
  controls.appendChild(
    createSliderField('Bar Width', 'vsbar-date-axis-bar-width', 0, 0, 50, nextValue => {
      if (nextValue === 0) {
        chart.removeAttribute('bar-width');
      } else {
        chart.setAttribute('bar-width', `${nextValue}`);
      }
    }).element,
  );

  return container;
};
DateAxis.parameters = { docs: { story: { height: '560px' } } };

export const Negative: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');
  const info = document.createElement('p');
  info.textContent =
    'Port of the React negative-values scenario. In the current WC implementation, negative stack segments are clamped during rendering.';
  container.appendChild(info);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = negativeData;
  chart.chartTitle = 'Vertical stacked bar chart negative example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('bar-gap-max', '2');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  return container;
};
Negative.parameters = { docs: { story: { height: '520px' } } };

export const SecondaryYAxis: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Port of the React secondary y-axis scenario. The current WC VerticalStackedBarChart renders a single y-axis and this story mirrors the dataset and layout controls.';
  container.appendChild(info);

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = secondaryYAxisData;
  chart.chartTitle = 'Vertical stacked bar chart secondary y-axis example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('bar-gap-max', '2');
  chart.setAttribute('hide-tick-overlap', '');
  chart.setAttribute('x-axis-title', 'Number of days');
  chart.setAttribute('y-axis-title', 'Variation of number of sales');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createSliderField('Width', 'vsbar-secondary-y-width', 700, 200, 1000, nextValue => {
      chart.setAttribute('width', `${nextValue}`);
    }).element,
  );
  controls.appendChild(
    createSliderField('Height', 'vsbar-secondary-y-height', 300, 200, 1000, nextValue => {
      chart.setAttribute('height', `${nextValue}`);
    }).element,
  );

  return container;
};
SecondaryYAxis.storyName = 'Secondary Y Axis';
SecondaryYAxis.parameters = { docs: { story: { height: '560px' } } };

export const AxisCategoryOrder: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const actions = document.createElement('div');
  actions.setAttribute('style', 'margin-top:16px;display:flex;align-items:center;gap:12px;');
  container.appendChild(actions);

  const status = document.createElement('p');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  status.setAttribute('style', visuallyHiddenStyle);
  actions.appendChild(status);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.chartTitle = 'Vertical stacked bar chart axis category order example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('hide-legends', '');
  chart.setAttribute('hide-tick-overlap', '');
  chart.setAttribute('bar-gap-max', '2');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  let width = 650;
  let height = 350;
  let dataSize = 5;
  let xAxisCategoryOrder: (typeof axisCategoryOrderOptions)[number] = 'default';
  let currentData = buildAxisCategoryOrderData(dataSize);

  const render = () => {
    chart.data = currentData.data;
    chart.setAttribute('x-axis-category-order', xAxisCategoryOrder);
    chart.setAttribute('y-min-value', `${currentData.yMinValue}`);
    chart.setAttribute('y-max-value', `${currentData.yMaxValue}`);
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);
  };

  const refreshData = () => {
    currentData = buildAxisCategoryOrderData(dataSize);
    render();
    status.textContent = 'Vertical stacked bar chart axis-category-order data changed';
  };

  controls.appendChild(
    createSliderField('Width', 'vsbar-axis-order-width', width, 200, 1000, nextValue => {
      width = nextValue;
      render();
    }).element,
  );
  controls.appendChild(
    createSliderField('Height', 'vsbar-axis-order-height', height, 200, 1000, nextValue => {
      height = nextValue;
      render();
    }).element,
  );
  controls.appendChild(
    createSliderField('Data Size', 'vsbar-axis-order-size', dataSize, 0, 50, nextValue => {
      dataSize = nextValue;
      refreshData();
    }).element,
  );
  controls.appendChild(
    createDropdownField(
      'xAxisCategoryOrder',
      'vsbar-axis-order-dropdown',
      [...axisCategoryOrderOptions],
      xAxisCategoryOrder,
      nextValue => {
        xAxisCategoryOrder = nextValue as (typeof axisCategoryOrderOptions)[number];
        render();
      },
    ).element,
  );

  actions.appendChild(
    createFluentButton('Change data', () => {
      refreshData();
    }),
  );

  render();
  return container;
};
AxisCategoryOrder.storyName = 'Axis Category Order';
AxisCategoryOrder.parameters = { docs: { story: { height: '620px' } } };
