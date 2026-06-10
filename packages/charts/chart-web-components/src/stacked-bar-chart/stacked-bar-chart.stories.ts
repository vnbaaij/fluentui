import { FluentDesignSystem } from '@fluentui/web-components';
import { definition as chartLegendDefinition } from '../chart-legend/chart-legend.definition.js';
import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  ensureDefinition,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './stacked-bar-chart.definition.js';
import type { StackedBarChartData } from './stacked-bar-chart.options.js';
import type { StackedBarChart } from './stacked-bar-chart.js';

ensureDefinition('fluent-chart-legend', () => chartLegendDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-stacked-bar-chart', () => definition.define(FluentDesignSystem.registry));

const sampleData: StackedBarChartData = {
  chartTitle: 'Stacked Bar Chart',
  chartData: [
    { legend: 'Alpha', data: 25, color: '#637cef' },
    { legend: 'Beta', data: 15, color: '#e3008c' },
    { legend: 'Gamma', data: 10, color: '#107c10' },
  ],
};

export default { title: 'Components/StackedBarChart' } as Meta<StackedBarChart>;

export const Basic: Story<StackedBarChart> = () => {
  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked Bar Chart';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '100');
  return chart;
};
Basic.parameters = { docs: { story: { height: '220px' } } };

export const StandardAttributes: Story<StackedBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let width = 600;
  let height = 100;

  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked Bar Chart';
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createSliderField('Width', 'stackedbar-width', width, 200, 1000, nextValue => {
      width = nextValue;
      chart.setAttribute('width', `${nextValue}`);
    }).element,
  );
  controls.appendChild(
    createSliderField('Height', 'stackedbar-height', height, 60, 240, nextValue => {
      height = nextValue;
      chart.setAttribute('height', `${nextValue}`);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '320px' } } };

export const Culture: Story<StackedBarChart> = () => {
  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked Bar Chart (de-DE)';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '100');
  chart.setAttribute('culture', 'de-DE');
  return chart;
};
Culture.parameters = { docs: { story: { height: '220px' } } };

export const TitleAlign: Story<StackedBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked bar title align example';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '100');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'stackedbar-title-align', [...aligns], currentAlign, nextAlign => {
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
TitleAlign.parameters = { docs: { story: { height: '320px' } } };

export const TitleAndLegendPositions: Story<StackedBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked bar title and legend positions example';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '100');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'stackedbar-title-position',
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
      'stackedbar-legend-position',
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
TitleAndLegendPositions.parameters = { docs: { story: { height: '320px' } } };

export const RTL: Story<StackedBarChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked bar RTL example';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '100');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '220px' } } };
