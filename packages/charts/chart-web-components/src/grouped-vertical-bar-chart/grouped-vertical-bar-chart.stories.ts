import {
  controlsRowStyle,
  createRadioGroupField,
  createSliderField,
  createSwitchField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './grouped-vertical-bar-chart.definition.js';
import type { GroupedVerticalBarChartData } from './grouped-vertical-bar-chart.options.js';
import type { GroupedVerticalBarChart } from './grouped-vertical-bar-chart.js';

// ── Sample data ───────────────────────────────────────────────────────────────

const basicData: GroupedVerticalBarChartData[] = [
  {
    xAxisPoint: 'Jan - Mar',
    series: [
      { key: '2021', data: 24000, color: 'qualitative.3' },
      { key: '2022', data: 33000, color: 'qualitative.4' },
      { key: '2023', data: 44000, color: 'qualitative.5' },
      { key: '2024', data: 54000, color: 'qualitative.6' },
    ],
  },
  {
    xAxisPoint: 'Apr - Jun',
    series: [
      { key: '2021', data: 12000, color: 'qualitative.3' },
      { key: '2022', data: 33000, color: 'qualitative.4' },
      { key: '2023', data: 3000, color: 'qualitative.5' },
      { key: '2024', data: 9000, color: 'qualitative.6' },
    ],
  },
  {
    xAxisPoint: 'Jul - Sep',
    series: [
      { key: '2021', data: 10000, color: 'qualitative.3' },
      { key: '2022', data: 14000, color: 'qualitative.4' },
      { key: '2023', data: 50000, color: 'qualitative.5' },
      { key: '2024', data: 60000, color: 'qualitative.6' },
    ],
  },
  {
    xAxisPoint: 'Oct - Dec',
    series: [
      { key: '2021', data: 15000, color: 'qualitative.3' },
      { key: '2022', data: 33000, color: 'qualitative.4' },
      { key: '2023', data: 3000, color: 'qualitative.5' },
      { key: '2024', data: 6000, color: 'qualitative.6' },
    ],
  },
];

const negativeData: GroupedVerticalBarChartData[] = [
  {
    xAxisPoint: 'Jan - Mar',
    series: [
      { key: '2021', data: -24000, color: 'qualitative.3' },
      { key: '2022', data: 33000, color: 'qualitative.4' },
      { key: '2023', data: -44000, color: 'qualitative.5' },
      { key: '2024', data: 54000, color: 'qualitative.6' },
    ],
  },
  {
    xAxisPoint: 'Apr - Jun',
    series: [
      { key: '2021', data: 12000, color: 'qualitative.3' },
      { key: '2022', data: -33000, color: 'qualitative.4' },
      { key: '2023', data: 3000, color: 'qualitative.5' },
      { key: '2024', data: -9000, color: 'qualitative.6' },
    ],
  },
  {
    xAxisPoint: 'Jul - Sep',
    series: [
      { key: '2021', data: -10000, color: 'qualitative.3' },
      { key: '2022', data: 14000, color: 'qualitative.4' },
      { key: '2023', data: -50000, color: 'qualitative.5' },
      { key: '2024', data: 60000, color: 'qualitative.6' },
    ],
  },
  {
    xAxisPoint: 'Oct - Dec',
    series: [
      { key: '2021', data: 15000, color: 'qualitative.3' },
      { key: '2022', data: -33000, color: 'qualitative.4' },
      { key: '2023', data: 3000, color: 'qualitative.5' },
      { key: '2024', data: -6000, color: 'qualitative.6' },
    ],
  },
];

const basicTitle = 'Grouped Vertical Bar chart basic example';

export default { title: 'Components/GroupedVerticalBarChart' } as Meta<GroupedVerticalBarChart>;

export const Basic: Story<GroupedVerticalBarChart> = () => {
  const chart = document.createElement('fluent-grouped-vertical-bar-chart') as GroupedVerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  return chart;
};
Basic.parameters = { docs: { story: { height: '470px' } } };

export const StandardAttributes: Story<GroupedVerticalBarChart> = () => {
  const container = document.createElement('div');

  let width = 650;
  let height = 350;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-grouped-vertical-bar-chart') as GroupedVerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'gvbar-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'gvbar-sa-height', height, 100, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  const barWidthControl = createSliderField('Bar Width', 'gvbar-sa-bar-width', 0, 0, 40, nextValue => {
    barWidthControl.setValue(nextValue);
    if (nextValue === 0) {
      chart.removeAttribute('bar-width');
    } else {
      chart.setAttribute('bar-width', `${nextValue}`);
    }
  });
  sliderControls.appendChild(barWidthControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'gvbar-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'gvbar-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'gvbar-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'gvbar-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'gvbar-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '680px' } } };

export const ChartAttributes: Story<GroupedVerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-grouped-vertical-bar-chart') as GroupedVerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Grouped vertical bar chart attributes example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createSwitchField('Use single color', 'gvbar-chart-attributes-single-color', false, checked => {
      chart.toggleAttribute('use-single-color', checked);
    }).element,
  );

  controls.appendChild(
    createSwitchField('Enable gradient', 'gvbar-chart-attributes-gradient', false, checked => {
      chart.toggleAttribute('enable-gradient', checked);
    }).element,
  );

  controls.appendChild(
    createSwitchField('Group callout', 'gvbar-chart-attributes-group-callout', false, checked => {
      chart.toggleAttribute('is-callout-for-stack', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
ChartAttributes.storyName = 'Chart Attributes';
ChartAttributes.parameters = { docs: { story: { height: '520px' } } };

export const SharedFeatures: Story<GroupedVerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-grouped-vertical-bar-chart') as GroupedVerticalBarChart;
  chart.chartTitle = 'Grouped vertical bar chart shared features';
  chart.width = 760;
  chart.height = 420;
  chart.barWidth = 'auto';
  chart.maxBarWidth = 24;
  chart.colors = ['#0f6cbd', '#d13438', '#107c10'];
  chart.margins = { top: 56, right: 84, bottom: 60, left: 72 };
  chart.isCalloutForStack = true;
  chart.xAxisTitle = 'Quarter';
  chart.yAxisTitle = 'Performance';
  chart.secondaryYAxisTitle = 'Growth index';
  chart.yScaleType = 'log';
  chart.secondaryYScaleType = 'log';
  chart.annotations = [
    {
      text: 'Peak quarter',
      coordinates: { type: 'data', x: 'Q2', y: 70 },
      layout: { offsetY: -14 },
      connector: { dashArray: '3 2' },
    },
  ];
  chart.data = [
    {
      xAxisPoint: 'Q1',
      stackCallOutAccessibilityData: { ariaLabel: 'Q1 grouped results' },
      series: [
        {
          key: 'north-id',
          legend: 'North',
          data: 42,
          barLabel: '42%',
          xAxisCalloutData: 'First quarter',
          yAxisCalloutData: '42 percent',
          callOutAccessibilityData: { ariaLabel: 'North Q1, 42 percent' },
          onClick: () => (chart.chartTitle = 'North selected'),
        },
        { key: 'south-id', legend: 'South', data: 55 },
      ],
      lineData: [
        { legend: 'Growth', y: 10, useSecondaryYScale: true },
        { legend: 'Forecast', y: 30, useSecondaryYScale: true },
      ],
    },
    {
      xAxisPoint: 'Q2',
      series: [
        { key: 'north-id', legend: 'North', data: 70 },
        { key: 'south-id', legend: 'South', data: 48 },
      ],
      lineData: [
        { legend: 'Growth', y: 100, useSecondaryYScale: true },
        { legend: 'Forecast', y: 300, useSecondaryYScale: true },
      ],
    },
    {
      xAxisPoint: 'Q3',
      series: [
        { key: 'north-id', legend: 'North', data: 58 },
        { key: 'south-id', legend: 'South', data: 62 },
      ],
      lineData: [
        { legend: 'Growth', y: 1000, useSecondaryYScale: true },
        { legend: 'Forecast', y: 3000, useSecondaryYScale: true },
      ],
    },
  ];
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createSwitchField('Show axis titles', 'gvbar-shared-axis-titles', true, checked => {
      chart.xAxisTitle = checked ? 'Quarter' : '';
      chart.yAxisTitle = checked ? 'Performance' : '';
      chart.secondaryYAxisTitle = checked ? 'Growth index' : '';
    }).element,
  );

  container.appendChild(chart);
  return container;
};
SharedFeatures.storyName = 'Shared Features';
SharedFeatures.parameters = { docs: { story: { height: '540px' } } };

export const Line: Story<GroupedVerticalBarChart> = () => {
  const container = document.createElement('div');
  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const optionControls = document.createElement('div');
  optionControls.setAttribute('style', `margin-top:10px;${controlsRowStyle}`);
  container.appendChild(optionControls);

  const chart = document.createElement('fluent-grouped-vertical-bar-chart') as GroupedVerticalBarChart;
  chart.chartTitle = 'Grouped Vertical Bar chart line example';
  chart.width = 700;
  chart.height = 400;
  chart.supportNegativeData = true;
  chart.lineBorderWidth = 2;
  chart.data = [
    {
      xAxisPoint: 'Jan - Mar',
      series: [
        { key: '2022', legend: '2022', data: 33000, color: 'qualitative.3' },
        { key: '2023', legend: '2023', data: -44000, color: 'qualitative.4' },
        { key: '2024', legend: '2024', data: -54000, color: 'qualitative.5' },
        { key: '2021', legend: '2021', data: 24000, color: 'qualitative.6' },
      ],
      lineData: [
        { legend: 'From_Legacy_to_O365', y: -21600, color: 'qualitative.1' },
        { legend: 'All', y: 29700, color: 'qualitative.2' },
      ],
    },
    {
      xAxisPoint: 'Apr - Jun',
      series: [
        { key: '2022', legend: '2022', data: 33000, color: 'qualitative.3' },
        { key: '2023', legend: '2023', data: -3000, color: 'qualitative.4' },
        { key: '2024', legend: '2024', data: 9000, color: 'qualitative.5' },
        { key: '2021', legend: '2021', data: -12000, color: 'qualitative.6' },
      ],
      lineData: [
        { legend: 'From_Legacy_to_O365', y: 21812, color: 'qualitative.1' },
        { legend: 'All', y: -28400, color: 'qualitative.2' },
      ],
    },
    {
      xAxisPoint: 'Jul - Sep',
      series: [
        { key: '2022', legend: '2022', data: 14000, color: 'qualitative.3' },
        { key: '2023', legend: '2023', data: 50000, color: 'qualitative.4' },
        { key: '2024', legend: '2024', data: -60000, color: 'qualitative.5' },
        { key: '2021', legend: '2021', data: -10000, color: 'qualitative.6' },
      ],
      lineData: [
        { legend: 'From_Legacy_to_O365', y: -21712, color: 'qualitative.1' },
        { legend: 'All', y: 28200, color: 'qualitative.2' },
      ],
    },
    {
      xAxisPoint: 'Oct - Dec',
      series: [
        { key: '2022', legend: '2022', data: -33000, color: 'qualitative.3' },
        { key: '2023', legend: '2023', data: 3000, color: 'qualitative.4' },
        { key: '2024', legend: '2024', data: -6000, color: 'qualitative.5' },
        { key: '2021', legend: '2021', data: -15000, color: 'qualitative.6' },
      ],
      lineData: [
        { legend: 'From_Legacy_to_O365', y: 24800, color: 'qualitative.1' },
        { legend: 'All', y: -29400, color: 'qualitative.2' },
      ],
    },
  ];

  const widthControl = createSliderField('Change width', 'gvbar-line-width', 700, 200, 1000, value => {
    widthControl.setValue(value);
    chart.width = value;
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Change height', 'gvbar-line-height', 400, 200, 1000, value => {
    heightControl.setValue(value);
    chart.height = value;
  });
  sliderControls.appendChild(heightControl.element);

  optionControls.appendChild(
    createRadioGroupField(
      'Pick a callout variant',
      'gvbar-line-callout',
      [
        { label: 'Single Callout', value: 'single' },
        { label: 'Stack Callout', value: 'stack' },
      ],
      'single',
      value => {
        chart.isCalloutForStack = value === 'stack';
      },
    ).element,
  );

  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);
  return container;
};
Line.parameters = { docs: { story: { height: '660px' } } };

export const SecondaryYAxis: Story<GroupedVerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-grouped-vertical-bar-chart') as GroupedVerticalBarChart;
  chart.chartTitle = 'Grouped Vertical Bar chart secondary y-axis example';
  chart.width = 700;
  chart.height = 300;
  chart.barWidth = 16;
  chart.hideTickOverlap = true;
  chart.data = [
    {
      xAxisPoint: 'Jan - Mar',
      series: [
        { key: 'series1', data: 24000, color: 'qualitative.6', legend: '2021' },
        { key: 'series2', data: 54000, color: 'qualitative.5', legend: '2022', useSecondaryYScale: true },
      ],
    },
    {
      xAxisPoint: 'Apr - Jun',
      series: [
        { key: 'series1', data: 12000, color: 'qualitative.6', legend: '2021' },
        { key: 'series2', data: 9000, color: 'qualitative.5', legend: '2022', useSecondaryYScale: true },
      ],
    },
    {
      xAxisPoint: 'Jul - Sep',
      series: [
        { key: 'series1', data: 10000, color: 'qualitative.6', legend: '2021' },
        { key: 'series2', data: 60000, color: 'qualitative.5', legend: '2022', useSecondaryYScale: true },
      ],
    },
    {
      xAxisPoint: 'Oct - Dec',
      series: [
        { key: 'series1', data: 15000, color: 'qualitative.6', legend: '2021' },
        { key: 'series2', data: 6000, color: 'qualitative.5', legend: '2022', useSecondaryYScale: true },
      ],
    },
  ];

  const widthControl = createSliderField('Change width', 'gvbar-secondary-width', 700, 200, 1000, value => {
    widthControl.setValue(value);
    chart.width = value;
  });
  controls.appendChild(widthControl.element);

  const heightControl = createSliderField('Change height', 'gvbar-secondary-height', 300, 200, 1000, value => {
    heightControl.setValue(value);
    chart.height = value;
  });
  controls.appendChild(heightControl.element);

  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);
  return container;
};
SecondaryYAxis.storyName = 'Secondary Y Axis';
SecondaryYAxis.parameters = { docs: { story: { height: '480px' } } };

export const NegativeValues: Story<GroupedVerticalBarChart> = () => {
  const chart = document.createElement('fluent-grouped-vertical-bar-chart') as GroupedVerticalBarChart;
  chart.data = negativeData;
  chart.chartTitle = 'Grouped vertical bar chart with negative values';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '400');
  chart.setAttribute('support-negative-data', '');
  return chart;
};
NegativeValues.parameters = { docs: { story: { height: '520px' } } };
