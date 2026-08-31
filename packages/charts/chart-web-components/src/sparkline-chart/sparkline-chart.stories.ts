import {
  controlsRowStyle,
  createDropdownField,
  createTextInputField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { DataVizPalette } from '../utils/chart-helpers.js';
import type { SparklineChartData, SparklineDataPoint } from './sparkline-chart.options.js';
import type { SparklineChart } from './sparkline-chart.js';

const sharedData: SparklineDataPoint[] = [
  { x: 1, y: 29.13 },
  { x: 2, y: 70.98 },
  { x: 3, y: 60 },
  { x: 4, y: 89.7 },
  { x: 5, y: 19 },
  { x: 6, y: 49.44 },
];

const createExample = (
  chartTitle: string,
  legend: string,
  color: string,
  data: SparklineDataPoint[],
): SparklineChartData => ({ chartTitle, lineChartData: [{ legend, color, data }] });

const sparklineExamples: SparklineChartData[] = [
  createExample('10.21', '19.64', DataVizPalette.color1, [
    { x: 1, y: 58.13 },
    { x: 2, y: 140.98 },
    { x: 3, y: 20 },
    { x: 4, y: 89.7 },
    { x: 5, y: 99 },
    { x: 6, y: 13.28 },
    { x: 7, y: 31.32 },
    { x: 8, y: 10.21 },
  ]),
  createExample('49.44', '19.64', DataVizPalette.color2, sharedData),
  createExample('49.44', '19.64', DataVizPalette.color3, sharedData),
  createExample('49.44', '464.64', DataVizPalette.color4, sharedData),
  createExample('49.44', '46.49', DataVizPalette.color5, sharedData),
  createExample('49.44', '49.44', DataVizPalette.color6, [
    { x: new Date('2020-03-03T00:00:00.000Z'), y: 29.13 },
    { x: new Date('2020-03-04T00:00:00.000Z'), y: 70.98 },
    { x: new Date('2020-03-05T00:00:00.000Z'), y: 60 },
    { x: new Date('2020-03-07T00:00:00.000Z'), y: 89.7 },
    { x: new Date('2020-03-12T00:00:00.000Z'), y: 19 },
    { x: new Date('2020-03-15T00:00:00.000Z'), y: 49.44 },
  ]),
  createExample('49.44', '49.44', DataVizPalette.color7, sharedData),
  createExample('541.44', '541.44', DataVizPalette.color8, [
    { x: 1, y: 291.13 },
    { x: 2, y: 170.98 },
    { x: 3, y: 260 },
    { x: 4, y: 89.7 },
    { x: 5, y: 664 },
    { x: 6, y: 66.44 },
    { x: 7, y: 541.44 },
    { x: 8, y: 32.44 },
    { x: 9, y: 499.14 },
    { x: 10, y: 350.48 },
    { x: 11, y: 32.44 },
    { x: 12, y: 400.44 },
  ]),
];

const dimensionsExample = createExample('89.7', '89.7', DataVizPalette.color1, [
  { x: 1, y: 58.13 },
  { x: 2, y: 140.98 },
  { x: 3, y: 20 },
  { x: 4, y: 89.7 },
  { x: 5, y: 99 },
  { x: 6, y: 13.28 },
  { x: 7, y: 31.32 },
  { x: 8, y: 89.7 },
]);

const createSparkline = (
  example: SparklineChartData,
  { width = 80, height = 20 }: { width?: number; height?: number } = {},
): SparklineChart => {
  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = example;
  chart.setAttribute('width', String(width));
  chart.setAttribute('height', String(height));
  chart.setAttribute('style', 'display:inline-block;flex:none;');
  return chart;
};

const createSparklineWithLegend = (
  example: SparklineChartData,
  showLegend: boolean,
  dimensions?: { width?: number; height?: number },
): SparklineChart => {
  const chart = createSparkline(example, dimensions);
  chart.showLegend = showLegend;
  return chart;
};

const createBasicDemo = (direction: 'ltr' | 'rtl' = 'ltr'): HTMLDivElement => {
  const container = document.createElement('div');
  container.dir = direction;
  const introduction = document.createElement('div');
  introduction.append(
    'A sparkline ',
    createSparklineWithLegend(sparklineExamples[0], true),
    ' - is a very small line chart, drawn without axes or coordinates. It presents the general shape of the variation (like over time) in some measurement, ',
    createSparklineWithLegend(sparklineExamples[1], false),
    ' - such as temperature or stock market price, in a simple and highly condensed way.',
    document.createElement('br'),
    document.createElement('br'),
    'Below table shows sparklines in one of its columns.',
    document.createElement('br'),
    document.createElement('br'),
  );
  container.appendChild(introduction);

  const table = document.createElement('table');
  table.setAttribute('role', 'grid');
  const body = document.createElement('tbody');
  sparklineExamples.forEach((example, index) => {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    labelCell.textContent = `Row ${index + 1}`;
    labelCell.setAttribute('style', 'padding-block:5px;padding-inline-end:15px;');
    const chartCell = document.createElement('td');
    chartCell.appendChild(createSparklineWithLegend(example, index < 2 || index > 4));
    row.append(labelCell, chartCell);
    body.appendChild(row);
  });
  table.appendChild(body);
  container.appendChild(table);
  return container;
};

export default { title: 'Components/SparklineChart' } as Meta<SparklineChart>;

export const Basic: Story<SparklineChart> = () => createBasicDemo();
Basic.parameters = { docs: { story: { height: '500px' } } };

export const Dimensions: Story<SparklineChart> = () => {
  const container = document.createElement('div');
  container.setAttribute('style', 'display:flex;flex-direction:column;gap:20px;');
  const dimensions = [
    { label: 'Default (80x20):', width: 80, height: 20 },
    { label: 'Custom width=150:', width: 150, height: 20 },
    { label: 'Custom height=40:', width: 80, height: 40 },
    { label: 'Both (200x60):', width: 200, height: 60 },
  ];
  dimensions.forEach(({ label, width, height }) => {
    const row = document.createElement('div');
    row.setAttribute('style', 'display:flex;align-items:center;gap:15px;');
    const rowLabel = document.createElement('span');
    rowLabel.textContent = label;
    rowLabel.setAttribute('style', 'min-width:140px;');
    row.append(rowLabel, createSparklineWithLegend(dimensionsExample, true, { width, height }));
    container.appendChild(row);
  });
  return container;
};
Dimensions.storyName = 'Dimensions';
Dimensions.parameters = {
  docs: {
    story: { height: '260px' },
    description: { story: 'Customize Sparkline dimensions using width and height. Default: width=80px, height=20px.' },
  },
};

export const ChartAttributes: Story<SparklineChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = dimensionsExample;
  chart.setAttribute('style', 'margin-top:20px;');

  const variantControl = createDropdownField('Variant', 'sparkline-ca-variant', ['area', 'line'], 'area', nextValue => {
    chart.variant = nextValue as SparklineChart['variant'];
  });
  controls.appendChild(variantControl.element);

  const colorInput = createTextInputField('Color', 'sparkline-ca-color', '', nextValue => {
    if (nextValue) {
      chart.color = nextValue;
      chart.setAttribute('color', nextValue);
    } else {
      chart.color = undefined;
      chart.removeAttribute('color');
    }
  });
  controls.appendChild(colorInput.element);

  container.appendChild(chart);
  return container;
};
ChartAttributes.storyName = 'Chart Attributes';
ChartAttributes.parameters = { docs: { story: { height: '260px' } } };

export const RTL: Story<SparklineChart> = () => createBasicDemo('rtl');
RTL.parameters = { docs: { story: { height: '500px' } } };
