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
import { definition } from './polar-chart.definition.js';
import type { PolarChartSeries } from './polar-chart.options.js';
import type { PolarChart } from './polar-chart.js';

ensureDefinition('fluent-chart-legend', () => chartLegendDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-polar-chart', () => definition.define(FluentDesignSystem.registry));

// ── Sample data ───────────────────────────────────────────────────────────────

const basicData: PolarChartSeries[] = [
  {
    legend: 'Mike',
    color: '#8884d8',
    data: [
      { x: 'Math', y: 120 },
      { x: 'Chinese', y: 98 },
      { x: 'English', y: 86 },
      { x: 'Geography', y: 99 },
      { x: 'Physics', y: 85 },
      { x: 'History', y: 65 },
    ],
  },
  {
    legend: 'Lily',
    color: '#82ca9d',
    data: [
      { x: 'Math', y: 110 },
      { x: 'Chinese', y: 130 },
      { x: 'English', y: 95 },
      { x: 'Geography', y: 90 },
      { x: 'Physics', y: 100 },
      { x: 'History', y: 90 },
    ],
  },
];

const basicTitle = 'Academic Performance';

export default { title: 'Components/PolarChart' } as Meta<PolarChart>;

export const Basic: Story<PolarChart> = () => {
  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  return chart;
};
Basic.parameters = { docs: { story: { height: '570px' } } };

export const StandardAttributes: Story<PolarChart> = () => {
  const container = document.createElement('div');

  let width = 500;
  let height = 450;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'polar-sa-width', width, 200, 800, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'polar-sa-height', height, 200, 700, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'polar-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'polar-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'polar-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'polar-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Show Markers', 'polar-sa-show-markers', false, checked => {
      chart.toggleAttribute('show-markers', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '420px' } } };

export const ShowMarkers: Story<PolarChart> = () => {
  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = 'Academic Performance with data point markers';
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  chart.setAttribute('show-markers', '');
  return chart;
};
ShowMarkers.parameters = { docs: { story: { height: '570px' } } };
