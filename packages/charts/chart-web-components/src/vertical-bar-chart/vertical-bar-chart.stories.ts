import { FluentDesignSystem } from '@fluentui/web-components';
import { definition as chartLegendDefinition } from '../chart-legend/chart-legend.definition.js';
import {
  controlsRowStyle,
  createSliderField,
  createSwitchField,
  ensureDefinition,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './vertical-bar-chart.definition.js';
import type { VerticalBarChartDataPoint } from './vertical-bar-chart.options.js';
import type { VerticalBarChart } from './vertical-bar-chart.js';

ensureDefinition('fluent-chart-legend', () => chartLegendDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-vertical-bar-chart', () => definition.define(FluentDesignSystem.registry));

// ── Sample data ───────────────────────────────────────────────────────────────

const basicData: VerticalBarChartDataPoint[] = [
  { x: 0, y: 10000, legend: 'Oranges', color: 'dodgerblue' },
  { x: 10000, y: 50000, legend: 'Dogs', color: 'midnightblue' },
  { x: 25000, y: 30000, legend: 'Apples', color: 'darkblue' },
  { x: 40000, y: 13000, legend: 'Bananas', color: 'blue' },
  { x: 52000, y: 43000, legend: 'Giraffes', color: 'darkslateblue' },
  { x: 68000, y: 30000, legend: 'Cats', color: 'royalblue' },
  { x: 80000, y: 20000, legend: 'Elephants', color: 'slateblue' },
  { x: 92000, y: 45000, legend: 'Monkeys', color: 'steelblue' },
];

const negativeData: VerticalBarChartDataPoint[] = [
  { x: 0, y: 10000, legend: 'Oranges', color: 'qualitative.1' },
  { x: 10000, y: -50000, legend: 'Dogs', color: 'qualitative.2' },
  { x: 25000, y: 30000, legend: 'Apples', color: 'qualitative.3' },
  { x: 40000, y: -13000, legend: 'Bananas', color: 'qualitative.6' },
  { x: 52000, y: 43000, legend: 'Giraffes', color: 'qualitative.11' },
  { x: 68000, y: -30000, legend: 'Cats', color: 'qualitative.2' },
  { x: 80000, y: 20000, legend: 'Elephants', color: 'qualitative.11' },
  { x: 92000, y: -45000, legend: 'Monkeys', color: 'qualitative.6' },
];

const basicTitle = 'Vertical bar chart basic example';

export default { title: 'Components/VerticalBarChart' } as Meta<VerticalBarChart>;

export const Basic: Story<VerticalBarChart> = () => {
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
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

  const barWidthControl = createSliderField('Bar Width', 'vbar-sa-bar-width', 0, 0, 60, nextValue => {
    barWidthControl.setValue(nextValue);
    if (nextValue === 0) {
      chart.removeAttribute('bar-width');
    } else {
      chart.setAttribute('bar-width', `${nextValue}`);
    }
  });
  sliderControls.appendChild(barWidthControl.element);

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

  toggleControls.appendChild(
    createSwitchField('Use Single Color', 'vbar-sa-single-color', false, checked => {
      chart.toggleAttribute('use-single-color', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '680px' } } };

export const NegativeValues: Story<VerticalBarChart> = () => {
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = negativeData;
  chart.chartTitle = 'Vertical bar chart with negative values';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('support-negative-data', '');
  return chart;
};
NegativeValues.parameters = { docs: { story: { height: '470px' } } };