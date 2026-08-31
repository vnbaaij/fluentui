import {
  controlsRowStyle,
  createCheckboxField,
  createDropdownField,
  createFluentButton,
  createRadioGroupField,
  createSliderField,
  createSwitchField,
  createTextInputField,
  type Meta,
  type Story,
  visuallyHiddenStyle,
} from '../helpers.stories.js';
import { DataVizPalette } from '../utils/chart-helpers.js';
import { definition } from './vertical-bar-chart.definition.js';
import type { VerticalBarChartDataPoint } from './vertical-bar-chart.options.js';
import type { VerticalBarChart } from './vertical-bar-chart.js';

// ── Sample data ───────────────────────────────────────────────────────────────

const basicCalloutDate = new Date(2026, 3, 30);

const basicData: VerticalBarChartDataPoint[] = [
  {
    x: 0,
    y: 10000,
    legend: 'Oranges',
    color: 'dodgerblue',
    xAxisCalloutData: basicCalloutDate,
    yAxisCalloutData: '4%',
    lineData: { y: 7000, yAxisCalloutData: '3%' },
  },
  {
    x: 10000,
    y: 50000,
    legend: 'Dogs',
    color: 'midnightblue',
    xAxisCalloutData: basicCalloutDate,
    yAxisCalloutData: '21%',
    lineData: { y: 30000, yAxisCalloutData: '12%' },
  },
  {
    x: 25000,
    y: 30000,
    legend: 'Apples',
    color: 'darkblue',
    xAxisCalloutData: basicCalloutDate,
    yAxisCalloutData: '12%',
    lineData: { y: 3000, yAxisCalloutData: '1%' },
  },
  {
    x: 40000,
    y: 13000,
    legend: 'Bananas',
    color: 'blue',
    xAxisCalloutData: basicCalloutDate,
    yAxisCalloutData: '5%',
  },
  {
    x: 52000,
    y: 43000,
    legend: 'Giraffes',
    color: 'darkslateblue',
    xAxisCalloutData: basicCalloutDate,
    yAxisCalloutData: '18%',
    lineData: { y: 30000, yAxisCalloutData: '12%' },
  },
  {
    x: 68000,
    y: 30000,
    legend: 'Cats',
    color: 'royalblue',
    xAxisCalloutData: basicCalloutDate,
    yAxisCalloutData: '12%',
    lineData: { y: 5000, yAxisCalloutData: '2%' },
  },
  {
    x: 80000,
    y: 20000,
    legend: 'Elephants',
    color: 'slateblue',
    xAxisCalloutData: basicCalloutDate,
    yAxisCalloutData: '8%',
    lineData: { y: 16000, yAxisCalloutData: '7%' },
  },
  {
    x: 92000,
    y: 45000,
    legend: 'Monkeys',
    color: 'steelblue',
    xAxisCalloutData: basicCalloutDate,
    yAxisCalloutData: '19%',
    lineData: { y: 40000, yAxisCalloutData: '16%' },
  },
];

const attributesData: VerticalBarChartDataPoint[] = [
  { x: 0, y: 10000, legend: 'Oranges', lineData: { y: 7000 } },
  { x: 10000, y: 50000, legend: 'Dogs', lineData: { y: 30000 } },
  { x: 25000, y: 30000, legend: 'Apples', lineData: { y: 3000 } },
  { x: 40000, y: 13000, legend: 'Bananas' },
  { x: 52000, y: 43000, legend: 'Giraffes', lineData: { y: 30000 } },
  { x: 68000, y: 30000, legend: 'Cats', lineData: { y: 5000 } },
  { x: 80000, y: 20000, legend: 'Elephants', lineData: { y: 16000 } },
  { x: 92000, y: 45000, legend: 'Monkeys', lineData: { y: 40000 } },
];

const negativeData: VerticalBarChartDataPoint[] = [
  { x: 0, y: 10000, legend: 'Oranges', color: 'qualitative.1', lineData: { y: 7000 } },
  { x: 10000, y: -50000, legend: 'Dogs', color: 'qualitative.2', lineData: { y: -30000 } },
  { x: 25000, y: 30000, legend: 'Apples', color: 'qualitative.3', lineData: { y: 3000 } },
  { x: 40000, y: -13000, legend: 'Bananas', color: 'qualitative.6' },
  { x: 52000, y: 43000, legend: 'Giraffes', color: 'qualitative.11', lineData: { y: 30000 } },
  { x: 68000, y: -30000, legend: 'Cats', color: 'qualitative.2', lineData: { y: -5000 } },
  { x: 80000, y: 20000, legend: 'Elephants', color: 'qualitative.11', lineData: { y: 16000 } },
  { x: 92000, y: -45000, legend: 'Monkeys', color: 'qualitative.6', lineData: { y: -40000 } },
];

const reactStyleDefaultData: VerticalBarChartDataPoint[] = [
  { x: 0, y: 10000, legend: 'Oranges', color: 'dodgerblue', lineData: { y: 7000 } },
  { x: 10000, y: 50000, legend: 'Dogs', color: 'midnightblue', lineData: { y: 30000 } },
  { x: 25000, y: 30000, legend: 'Apples', color: 'darkblue', lineData: { y: 3000 } },
  { x: 40000, y: 13000, legend: 'Bananas', color: 'blue' },
  { x: 52000, y: 43000, legend: 'Giraffes', color: 'darkslateblue', lineData: { y: 30000 } },
  { x: 68000, y: 30000, legend: 'Cats', color: 'royalblue', lineData: { y: 5000 } },
  { x: 80000, y: 20000, legend: 'Elephants', color: 'slateblue', lineData: { y: 16000 } },
  { x: 92000, y: 45000, legend: 'Monkeys', color: 'steelblue', lineData: { y: 40000 } },
];

const reactStyleNegativeData: VerticalBarChartDataPoint[] = [
  { x: 0, y: 10000, legend: 'Oranges', color: 'qualitative.1', lineData: { y: 7000 } },
  { x: 10000, y: -50000, legend: 'Dogs', color: 'qualitative.2', lineData: { y: -30000 } },
  { x: 25000, y: 30000, legend: 'Apples', color: 'qualitative.3', lineData: { y: 3000 } },
  { x: 40000, y: -13000, legend: 'Bananas', color: 'qualitative.6' },
  { x: 52000, y: 43000, legend: 'Giraffes', color: 'qualitative.11', lineData: { y: 30000 } },
  { x: 68000, y: -30000, legend: 'Cats', color: 'qualitative.2', lineData: { y: -5000 } },
  { x: 80000, y: 20000, legend: 'Elephants', color: 'qualitative.11', lineData: { y: 16000 } },
  { x: 92000, y: -45000, legend: 'Monkeys', color: 'qualitative.6', lineData: { y: -40000 } },
];

const reactStyleAllNegativeData: VerticalBarChartDataPoint[] = [
  { x: 0, y: -10000, legend: 'Oranges', color: 'qualitative.1', lineData: { y: -7000 } },
  { x: 10000, y: -50000, legend: 'Dogs', color: 'qualitative.2', lineData: { y: -30000 } },
  { x: 25000, y: -30000, legend: 'Apples', color: 'qualitative.3', lineData: { y: -3000 } },
  { x: 40000, y: -13000, legend: 'Bananas', color: 'qualitative.6' },
  { x: 52000, y: -43000, legend: 'Giraffes', color: 'qualitative.11', lineData: { y: -30000 } },
  { x: 68000, y: -30000, legend: 'Cats', color: 'qualitative.2', lineData: { y: -5000 } },
  { x: 80000, y: -20000, legend: 'Elephants', color: 'qualitative.11', lineData: { y: -16000 } },
  { x: 92000, y: -45000, legend: 'Monkeys', color: 'qualitative.6', lineData: { y: -40000 } },
];

const axisTooltipData: VerticalBarChartDataPoint[] = [
  { x: 'Simple Text', y: 1000, color: 'dodgerblue' },
  { x: 'Showing all text here', y: 5000, color: 'midnightblue' },
  { x: 'Large data, showing all text by tooltip', y: 3000, color: 'darkblue' },
  { x: 'Data', y: 2000, color: 'deepskyblue' },
];

const rotateLabelsData: VerticalBarChartDataPoint[] = [
  { x: 'This is a medium long label. ', y: 3500, color: '#627CEF' },
  { x: 'This is a long label This is a long label', y: 2500, color: '#C19C00' },
  { x: 'This label is as long as the previous one', y: 1900, color: '#E650AF' },
  { x: 'A short label', y: 2800, color: '#0E7878' },
];

const responsiveData: VerticalBarChartDataPoint[] = [
  { x: 0, y: 10000, legend: 'Oranges', color: 'qualitative.1', lineData: { y: 7000 } },
  { x: 10000, y: 50000, legend: 'Dogs', color: 'qualitative.2', lineData: { y: 30000 } },
  { x: 25000, y: 30000, legend: 'Apples', color: 'qualitative.3', lineData: { y: 3000 } },
  { x: 40000, y: 13000, legend: 'Bananas', color: 'qualitative.6' },
  { x: 52000, y: 43000, legend: 'Giraffes', color: 'qualitative.11', lineData: { y: 30000 } },
  { x: 68000, y: 30000, legend: 'Cats', color: 'qualitative.2', lineData: { y: 5000 } },
  { x: 80000, y: 20000, legend: 'Elephants', color: 'qualitative.11', lineData: { y: 16000 } },
  { x: 92000, y: 45000, legend: 'Monkeys', color: 'qualitative.6', lineData: { y: 40000 } },
];

const secondaryYAxisData: VerticalBarChartDataPoint[] = [
  { x: 0, y: 10000, legend: 'Oranges', color: 'qualitative.1', lineData: { y: 7000, useSecondaryYScale: true } },
  { x: 10000, y: 50000, legend: 'Dogs', color: 'qualitative.2', lineData: { y: 30000, useSecondaryYScale: true } },
  { x: 25000, y: 30000, legend: 'Apples', color: 'qualitative.3', lineData: { y: 3000, useSecondaryYScale: true } },
  { x: 40000, y: 13000, legend: 'Bananas', color: 'qualitative.6' },
  { x: 52000, y: 43000, legend: 'Giraffes', color: 'qualitative.11', lineData: { y: 30000, useSecondaryYScale: true } },
  { x: 68000, y: 30000, legend: 'Cats', color: 'qualitative.4', lineData: { y: 5000, useSecondaryYScale: true } },
  {
    x: 80000,
    y: 20000,
    legend: 'Elephants',
    color: 'qualitative.11',
    lineData: { y: 16000, useSecondaryYScale: true },
  },
  { x: 92000, y: 45000, legend: 'Monkeys', color: 'qualitative.6', lineData: { y: 40000, useSecondaryYScale: true } },
];

const accessibilityData: VerticalBarChartDataPoint[] = [
  {
    x: 'One',
    y: 20,
    color: 'lightgreen',
    lineData: { y: 10, yAxisCalloutData: '12%' },
    callOutAccessibilityData: { ariaLabel: 'Bar series 1 of 4 one 12% 20' },
  },
  {
    x: 'Two',
    y: 48,
    color: 'green',
    lineData: { y: 28 },
    callOutAccessibilityData: { ariaLabel: 'Bar series 2 of 4 Two 28 48' },
  },
  {
    x: 'Three',
    y: 30,
    color: 'darkgreen',
    lineData: { y: 4 },
    callOutAccessibilityData: { ariaLabel: 'Bar series 3 of 4 Three 4 30' },
  },
  {
    x: 'Four',
    y: 40,
    color: 'forestgreen',
    lineData: { y: 28 },
    callOutAccessibilityData: { ariaLabel: 'Bar series 4 of 4 Four 28 40' },
  },
];

const basicTitle = 'Vertical bar chart basic example';

export default { title: 'Components/VerticalBarChart' } as Meta<VerticalBarChart>;

export const Basic: Story<VerticalBarChart> = () => {
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  return chart;
};
Basic.parameters = { docs: { story: { height: '470px' } } };

export const StandardAttributes: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');

  let width = 650;
  let height = 350;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'vbar-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'vbar-sa-height', height, 100, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'vbar-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'vbar-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'vbar-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'vbar-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'vbar-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '560px' } } };

export const ChartAttributes: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chartWrapper = document.createElement('div');
  chartWrapper.setAttribute('style', 'width: 800px; height: 400px; margin-top: 20px;');
  container.appendChild(chartWrapper);

  let showLine = false;
  let useSingleColor = false;
  let enableGradient = false;

  const createChart = () => {
    const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
    const singleColor = attributesData.find(point => point.color)?.color;

    chart.data = attributesData.map(point => {
      const color = useSingleColor ? singleColor ?? point.color : point.color;
      const nextPoint: VerticalBarChartDataPoint = { ...point, color };
      if (!showLine) {
        const { lineData: _lineData, ...rest } = nextPoint;
        return rest;
      }
      return nextPoint;
    });
    chart.chartTitle = 'Vertical bar chart custom accessibility example';
    chart.setAttribute('width', '800');
    chart.setAttribute('height', '400');
    chart.setAttribute('bar-width', '20');
    chart.setAttribute('line-legend-color', 'rgb(174, 140, 0)');
    chart.setAttribute('x-axis-title', 'Category');
    chart.setAttribute('y-axis-title', 'Value');
    chart.setAttribute('hide-legends', '');
    chart.toggleAttribute('enable-gradient', enableGradient);
    if (useSingleColor) {
      chart.setAttribute('use-single-color', '');
    } else {
      chart.removeAttribute('use-single-color');
    }
    return chart;
  };

  const renderChart = () => {
    chartWrapper.replaceChildren();
    chartWrapper.appendChild(createChart());
  };

  renderChart();

  controls.appendChild(
    createSwitchField('Show line', 'vbar-chart-attributes-show-line', false, checked => {
      showLine = checked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSwitchField('Use single color', 'vbar-chart-attributes-single-color', false, checked => {
      useSingleColor = checked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSwitchField('Enable gradient', 'vbar-chart-attributes-gradient', false, checked => {
      enableGradient = checked;
      renderChart();
    }).element,
  );

  return container;
};
ChartAttributes.parameters = { docs: { story: { height: '520px' } } };

export const SharedFeatures: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.chartTitle = 'Vertical bar chart shared features';
  chart.width = 760;
  chart.height = 400;
  chart.barWidth = 'auto';
  chart.maxBarWidth = 24;
  chart.colors = ['#0f6cbd', '#d13438', '#107c10'];
  chart.margins = { top: 56, right: 84, bottom: 60, left: 72 };
  chart.xAxisTitle = 'Category index';
  chart.yAxisTitle = 'Performance';
  chart.secondaryYAxisTitle = 'Growth index';
  chart.yScaleType = 'log';
  chart.secondaryYScaleType = 'log';
  chart.annotations = [
    {
      id: 'target',
      text: 'Target',
      coordinates: { type: 'data', x: 10, y: 70 },
      layout: { offsetY: -14 },
      connector: { strokeColor: 'colorNeutralStroke1', dashArray: '3 2' },
      accessibility: { ariaLabel: 'Target annotation at 70' },
    },
  ];
  chart.data = [
    {
      x: 1,
      y: 42,
      legend: 'North',
      barLabel: '42%',
      xAxisCalloutData: 'First quarter',
      yAxisCalloutData: '42 percent',
      lineData: { y: 10, useSecondaryYScale: true },
      callOutAccessibilityData: { ariaLabel: 'North, first quarter, 42 percent' },
      onClick: () => (chart.chartTitle = 'North selected'),
    },
    { x: 10, y: 70, legend: 'Central', lineData: { y: 100, useSecondaryYScale: true } },
    { x: 100, y: 58, legend: 'South', lineData: { y: 1000, useSecondaryYScale: true } },
  ];
  chart.xScaleType = 'log';
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createSwitchField('Show axis titles', 'vbar-shared-axis-titles', true, checked => {
      chart.xAxisTitle = checked ? 'Category index' : '';
      chart.yAxisTitle = checked ? 'Performance' : '';
      chart.secondaryYAxisTitle = checked ? 'Growth index' : '';
    }).element,
  );

  container.appendChild(chart);
  return container;
};
SharedFeatures.storyName = 'Shared Features';
SharedFeatures.parameters = { docs: { story: { height: '520px' } } };

export const CustomAccessibility: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chartWrapper = document.createElement('div');
  chartWrapper.setAttribute('style', 'width: 800px; height: 400px; margin-top: 20px;');
  container.appendChild(chartWrapper);

  let showLine = true;
  let useSingleColor = true;

  const createChart = () => {
    const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
    const singleColor = accessibilityData.find(point => point.color)?.color;

    chart.data = accessibilityData.map(point => {
      const color = useSingleColor ? singleColor ?? point.color : point.color;
      const nextPoint: VerticalBarChartDataPoint = { ...point, color };
      if (!showLine) {
        const { lineData: _lineData, ...rest } = nextPoint;
        return rest;
      }
      return nextPoint;
    });
    chart.chartTitle = 'Vertical bar chart custom accessibility example';
    chart.setAttribute('width', '800');
    chart.setAttribute('height', '400');
    chart.setAttribute('bar-width', '20');
    chart.setAttribute('line-legend-color', 'rgb(174, 140, 0)');
    chart.setAttribute('x-axis-title', 'Category');
    chart.setAttribute('y-axis-title', 'Value');
    chart.setAttribute('hide-legends', '');
    if (useSingleColor) {
      chart.setAttribute('use-single-color', '');
    } else {
      chart.removeAttribute('use-single-color');
    }
    return chart;
  };

  const renderChart = () => {
    chartWrapper.replaceChildren();
    chartWrapper.appendChild(createChart());
  };

  renderChart();

  controls.appendChild(
    createSwitchField('Show line', 'vbar-chart-attributes-show-line', true, checked => {
      showLine = checked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSwitchField('Use single color', 'vbar-chart-attributes-single-color', true, checked => {
      useSingleColor = checked;
      renderChart();
    }).element,
  );

  return container;
};
CustomAccessibility.parameters = { docs: { story: { height: '520px' } } };

export const DateAxis: Story<VerticalBarChart> = () => {
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  const points: VerticalBarChartDataPoint[] = [
    { x: new Date('2018/01/01'), y: 3500, color: '#627CEF' },
    { x: new Date('2018/03/01'), y: 2500, color: '#C19C00' },
    { x: new Date('2018/07/01'), y: 1900, color: '#E650AF' },
    { x: new Date('2018/10/01'), y: 2800, color: '#0E7878' },
    { x: new Date('2019/01/01'), y: 3800, color: '#0E7878' },
  ];
  chart.data = points;
  chart.chartTitle = 'Vertical bar chart Date axis example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('tick-format', '%b %Y');
  chart.setAttribute('culture', typeof window !== 'undefined' ? window.navigator.language : 'en-us');
  chart.setAttribute('hide-legends', '');
  chart.setAttribute('x-axis-title', 'Date');
  chart.setAttribute('y-axis-title', 'Values');
  chart.tickValues = [
    new Date('2018-01-01'),
    new Date('2018-03-01'),
    new Date('2018-07-01'),
    new Date('2018-10-01'),
    new Date('2019-01-01'),
  ];
  return chart;
};
DateAxis.parameters = { docs: { story: { height: '470px' } } };

export const AxisTooltip: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = axisTooltipData;
  chart.chartTitle = 'Vertical bar chart axis tooltip example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('bar-width', '16');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.setAttribute('hide-legends', '');
  container.appendChild(chart);

  let selectedOption: 'showTooltip' | 'wrapLabels' = 'showTooltip';

  const applyAxisLabelMode = () => {
    const shouldWrap = selectedOption === 'wrapLabels';
    chart.toggleAttribute('wrap-x-axis-labels', shouldWrap);
    chart.toggleAttribute('show-x-axis-labels-tooltip', !shouldWrap);
  };

  const createRadio = (value: 'showTooltip' | 'wrapLabels', label: string) => {
    const option = document.createElement('label');
    option.setAttribute('style', 'display:inline-flex;align-items:center;gap:8px;');

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'vbar-axis-label-mode';
    input.value = value;
    input.checked = selectedOption === value;
    input.addEventListener('change', () => {
      if (!input.checked) {
        return;
      }
      selectedOption = value;
      applyAxisLabelMode();
    });

    const text = document.createElement('span');
    text.textContent = label;

    option.appendChild(input);
    option.appendChild(text);
    return option;
  };

  controls.appendChild(createRadio('showTooltip', 'Show x-axis labels tooltip'));
  controls.appendChild(createRadio('wrapLabels', 'Wrap x-axis labels'));

  applyAxisLabelMode();

  return container;
};
AxisTooltip.parameters = { docs: { story: { height: '520px' } } };

export const RotateLabels: Story<VerticalBarChart> = () => {
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = rotateLabelsData;
  chart.chartTitle = 'Vertical bar chart rotated labels example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('bar-width', '16');
  chart.setAttribute('hide-legends', '');
  chart.setAttribute('rotate-x-axis-labels', '');
  return chart;
};
RotateLabels.parameters = { docs: { story: { height: '520px' } } };

export const Dynamic: Story<VerticalBarChart> = createDynamicStory;
Dynamic.parameters = { docs: { story: { height: '720px' } } };

export const NegativeValues: Story<VerticalBarChart> = () => {
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = negativeData;
  chart.chartTitle = 'Vertical bar chart with negative values';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('support-negative-data', '');
  chart.setAttribute('x-axis-title', 'Values of each category');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  return chart;
};
NegativeValues.parameters = { docs: { story: { height: '470px' } } };

export const AllNegative: Story<VerticalBarChart> = () => {
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = reactStyleAllNegativeData;
  chart.chartTitle = 'Vertical bar chart all negative example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('support-negative-data', '');
  chart.setAttribute('x-axis-title', 'Values of each category');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  return chart;
};
AllNegative.parameters = { docs: { story: { height: '470px' } } };

export const Responsive: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent = 'Resize the container horizontally to see the chart respond to available width.';
  container.appendChild(info);

  const responsiveHost = document.createElement('div');
  responsiveHost.setAttribute(
    'style',
    'width:700px; max-width:100%; min-width:0; resize:horizontal; overflow:auto; border:1px solid #ddd; padding:8px; box-sizing:border-box;',
  );
  container.appendChild(responsiveHost);

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = responsiveData;
  chart.setAttribute('line-legend-text', 'Line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  chart.setAttribute('style', 'width:100%; min-width:0;');
  responsiveHost.appendChild(chart);

  return container;
};
Responsive.parameters = { docs: { story: { height: '520px' } } };

export const SecondaryYAxis: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = secondaryYAxisData;
  chart.chartTitle = 'Vertical bar chart secondary y-axis example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  chart.setAttribute('hide-tick-overlap', '');
  chart.setAttribute('y-axis-title', 'Values of each category');
  chart.setAttribute('secondary-y-axis-title', 'Line values');
  chart.setAttribute('x-axis-title', 'Different categories of animals and fruits');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  let width = 700;
  let height = 300;

  controls.appendChild(
    createSliderField('Width', 'vbar-secondary-width', width, 200, 1000, nextValue => {
      width = nextValue;
      chart.setAttribute('width', `${width}`);
    }).element,
  );

  controls.appendChild(
    createSliderField('Height', 'vbar-secondary-height', height, 200, 1000, nextValue => {
      height = nextValue;
      chart.setAttribute('height', `${height}`);
    }).element,
  );

  return container;
};
SecondaryYAxis.parameters = { docs: { story: { height: '540px' } } };

export const TooltipRendererStory: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a bar — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart custom tooltipRenderer';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
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

export const Culture: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = `Vertical bar chart culture example (${currentCulture})`;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'vbar-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.chartTitle = `Vertical bar chart culture example (${currentCulture})`;
  });
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '470px' } } };

export const TitleAlign: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart title align example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'vbar-title-align', [...aligns], currentAlign, nextAlign => {
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

export const TitleAndLegendPositions: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart title and legend positions example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'vbar-title-position',
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
      'vbar-legend-position',
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

function createDynamicStory() {
  const colorPalettes = [
    [DataVizPalette.color1, DataVizPalette.color2, DataVizPalette.color3],
    [DataVizPalette.color4, DataVizPalette.color5, DataVizPalette.color6],
    [DataVizPalette.color7, DataVizPalette.color8, DataVizPalette.color9],
    [DataVizPalette.color10, DataVizPalette.color11, DataVizPalette.color12],
  ];
  type XAxisType = 'number' | 'date' | 'string';
  type BarWidthMode = 'default' | 'auto' | 'custom';

  let width = 650;
  let dataSize = 5;
  let xAxisType: XAxisType = 'number';
  let barWidthMode: BarWidthMode = 'default';
  let barWidth = 16;
  let maxBarWidth = 24;
  let xAxisInnerPaddingEnabled = false;
  let xAxisOuterPaddingEnabled = false;
  let xAxisInnerPadding = 0.67;
  let xAxisOuterPadding = 0;
  let colorIndex = 0;

  const randomY = () => Math.floor(Math.random() * 90) + 1;
  const getData = (size: number, axisType: XAxisType): VerticalBarChartDataPoint[] => {
    if (axisType === 'string') {
      return Array.from({ length: size }, (_, index) => ({ x: `Label ${index + 1}`, y: randomY() }));
    }

    const offsets = new Set<number>();
    while (offsets.size < size) {
      offsets.add(Math.floor(Math.random() * 75) + 1);
    }
    const date = new Date('2020-01-01');
    return Array.from(offsets, offset => ({
      x: axisType === 'date' ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset) : offset,
      y: randomY(),
    }));
  };

  let dynamicData = getData(dataSize, xAxisType);
  const container = document.createElement('div');
  const createControlsRow = (row: string) => {
    const controlsRow = document.createElement('div');
    controlsRow.setAttribute('data-controls-row', row);
    controlsRow.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
    container.appendChild(controlsRow);
    return controlsRow;
  };
  const widthControls = createControlsRow('width');
  const barWidthControls = createControlsRow('bar-width');
  const paddingControls = createControlsRow('x-axis-padding');
  const dataSizeControls = createControlsRow('data-size');
  const axisTypeControls = createControlsRow('axis-type');

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.chartTitle = 'Vertical bar chart dynamic example';
  chart.setAttribute('height', '350');
  chart.setAttribute('hide-legends', '');
  chart.setAttribute('hide-tick-overlap', '');
  chart.setAttribute('y-max-value', '100');
  chart.setAttribute('style', 'margin-top:20px;');

  const status = document.createElement('p');
  status.setAttribute('style', visuallyHiddenStyle);
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');

  const applyChartSettings = () => {
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('max-bar-width', `${maxBarWidth}`);
    if (barWidthMode === 'default') {
      chart.removeAttribute('bar-width');
    } else {
      chart.setAttribute('bar-width', barWidthMode === 'auto' ? 'auto' : `${barWidth}`);
    }
    if (xAxisInnerPaddingEnabled && xAxisType === 'string') {
      chart.setAttribute('x-axis-inner-padding', `${xAxisInnerPadding}`);
    } else {
      chart.removeAttribute('x-axis-inner-padding');
    }
    if (xAxisOuterPaddingEnabled && xAxisType === 'string') {
      chart.setAttribute('x-axis-outer-padding', `${xAxisOuterPadding}`);
    } else {
      chart.removeAttribute('x-axis-outer-padding');
    }
    chart.data = dynamicData.map((point, index) => ({
      ...point,
      color: colorPalettes[colorIndex][index % colorPalettes[colorIndex].length],
    }));
  };

  widthControls.appendChild(
    createSliderField('Width', 'vbar-dynamic-width', width, 200, 1000, nextValue => {
      width = nextValue;
      applyChartSettings();
    }).element,
  );

  const barWidthControl = createCheckboxField('Bar Width', 'vbar-dynamic-bar-width-mode', false, () => {
    barWidthMode = barWidthMode === 'default' ? 'auto' : barWidthMode === 'auto' ? 'custom' : 'default';
    syncBarWidthControl();
    applyChartSettings();
  });
  const barWidthCheckbox = barWidthControl.element.querySelector('fluent-checkbox') as HTMLInputElement;
  const barWidthValue = createTextInputField('Bar Width Value', 'vbar-dynamic-bar-width', `${barWidth}`, nextValue => {
    const parsedValue = Number(nextValue);
    if (Number.isFinite(parsedValue) && parsedValue >= 1) {
      barWidth = parsedValue;
      applyChartSettings();
    }
  });
  const barWidthInput = barWidthValue.element.querySelector('fluent-text-input')!;
  barWidthInput.setAttribute('type', 'number');
  barWidthInput.setAttribute('min', '1');
  barWidthInput.setAttribute('max', '300');
  const barWidthModeLabel = document.createElement('span');
  barWidthModeLabel.setAttribute('data-bar-width-value', '');
  const syncBarWidthControl = () => {
    barWidthCheckbox.checked = barWidthMode === 'custom';
    barWidthCheckbox.indeterminate = barWidthMode === 'auto';
    barWidthCheckbox.toggleAttribute('checked', barWidthCheckbox.checked);
    barWidthValue.element.toggleAttribute('hidden', barWidthMode !== 'custom');
    barWidthModeLabel.toggleAttribute('hidden', barWidthMode === 'custom');
    barWidthModeLabel.textContent = barWidthMode === 'auto' ? 'auto' : 'undifined';
    barWidthControl.element.setAttribute('data-mode', barWidthMode);
  };
  barWidthControls.appendChild(barWidthControl.element);
  barWidthControls.appendChild(barWidthValue.element);
  barWidthControls.appendChild(barWidthModeLabel);

  const maxBarWidthControl = createTextInputField(
    'Max Bar Width',
    'vbar-dynamic-max-bar-width',
    `${maxBarWidth}`,
    nextValue => {
      const parsedValue = Number(nextValue);
      if (Number.isFinite(parsedValue) && parsedValue >= 1) {
        maxBarWidth = parsedValue;
        applyChartSettings();
      }
    },
  );
  const maxBarWidthInput = maxBarWidthControl.element.querySelector('fluent-text-input')!;
  maxBarWidthInput.setAttribute('type', 'number');
  maxBarWidthInput.setAttribute('min', '1');
  maxBarWidthInput.setAttribute('max', '300');
  barWidthControls.appendChild(maxBarWidthControl.element);

  const innerPaddingToggle = createCheckboxField(
    'Enable X Axis Inner Padding',
    'vbar-dynamic-enable-inner-padding',
    xAxisInnerPaddingEnabled,
    checked => {
      xAxisInnerPaddingEnabled = checked;
      syncPaddingControls();
      applyChartSettings();
    },
  );
  paddingControls.appendChild(innerPaddingToggle.element);
  const innerPaddingSlider = createSliderField(
    'X Axis Inner Padding (x100)',
    'vbar-dynamic-inner-padding',
    Math.round(xAxisInnerPadding * 100),
    0,
    100,
    nextValue => {
      xAxisInnerPadding = nextValue / 100;
      applyChartSettings();
    },
  );
  paddingControls.appendChild(innerPaddingSlider.element);

  const outerPaddingToggle = createCheckboxField(
    'Enable X Axis Outer Padding',
    'vbar-dynamic-enable-outer-padding',
    xAxisOuterPaddingEnabled,
    checked => {
      xAxisOuterPaddingEnabled = checked;
      syncPaddingControls();
      applyChartSettings();
    },
  );
  paddingControls.appendChild(outerPaddingToggle.element);
  const outerPaddingSlider = createSliderField(
    'X Axis Outer Padding (x100)',
    'vbar-dynamic-outer-padding',
    Math.round(xAxisOuterPadding * 100),
    0,
    100,
    nextValue => {
      xAxisOuterPadding = nextValue / 100;
      applyChartSettings();
    },
  );
  paddingControls.appendChild(outerPaddingSlider.element);

  const syncPaddingControls = () => {
    const categorical = xAxisType === 'string';
    const innerPaddingCheckbox = innerPaddingToggle.element.querySelector('fluent-checkbox') as HTMLInputElement;
    const outerPaddingCheckbox = outerPaddingToggle.element.querySelector('fluent-checkbox') as HTMLInputElement;
    const innerPaddingInput = innerPaddingSlider.element.querySelector('fluent-slider') as HTMLInputElement;
    const outerPaddingInput = outerPaddingSlider.element.querySelector('fluent-slider') as HTMLInputElement;
    const innerPaddingDisabled = !categorical || !xAxisInnerPaddingEnabled;
    const outerPaddingDisabled = !categorical || !xAxisOuterPaddingEnabled;

    innerPaddingCheckbox.disabled = !categorical;
    innerPaddingCheckbox.toggleAttribute('disabled', !categorical);
    outerPaddingCheckbox.disabled = !categorical;
    outerPaddingCheckbox.toggleAttribute('disabled', !categorical);
    innerPaddingInput.disabled = innerPaddingDisabled;
    innerPaddingInput.toggleAttribute('disabled', innerPaddingDisabled);
    outerPaddingInput.disabled = outerPaddingDisabled;
    outerPaddingInput.toggleAttribute('disabled', outerPaddingDisabled);
  };

  dataSizeControls.appendChild(
    createSliderField('Data Size', 'vbar-dynamic-data-size', dataSize, 0, 50, nextValue => {
      dataSize = nextValue;
      dynamicData = getData(dataSize, xAxisType);
      applyChartSettings();
    }).element,
  );
  axisTypeControls.appendChild(
    createRadioGroupField(
      'X-Axis type',
      'vbar-dynamic-axis-type',
      [
        { label: 'Number', value: 'number' },
        { label: 'Date', value: 'date' },
        { label: 'String', value: 'string' },
      ],
      xAxisType,
      nextValue => {
        xAxisType = nextValue as XAxisType;
        dynamicData = getData(dataSize, xAxisType);
        syncPaddingControls();
        applyChartSettings();
      },
    ).element,
  );

  container.appendChild(chart);
  const buttons = document.createElement('div');
  buttons.setAttribute('style', 'display:flex;gap:8px;margin-top:12px;');
  buttons.appendChild(
    createFluentButton('Change Data', () => {
      dynamicData = getData(dataSize, xAxisType);
      applyChartSettings();
      status.textContent = 'Vertical bar chart data changed';
    }),
  );
  buttons.appendChild(
    createFluentButton('Change Color', () => {
      colorIndex = (colorIndex + 1) % colorPalettes.length;
      applyChartSettings();
      status.textContent = 'Vertical bar chart colors changed';
    }),
  );
  container.appendChild(buttons);
  container.appendChild(status);

  syncPaddingControls();
  syncBarWidthControl();
  applyChartSettings();
  return container;
}

export const RTL: Story<VerticalBarChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart RTL example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('line-legend-text', 'just line');
  chart.setAttribute('line-legend-color', 'brown');
  chart.setAttribute('line-border-width', '2');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '470px' } } };
