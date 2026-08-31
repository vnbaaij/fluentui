import { controlsRowStyle, createSliderField, createSwitchField, type Meta, type Story } from '../helpers.stories.js';
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
