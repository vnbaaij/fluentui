import { FluentDesignSystem } from '@fluentui/web-components';
import { definition as chartLegendDefinition } from '../chart-legend/chart-legend.definition.js';
import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  createTextInputField,
  ensureDefinition,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './sankey-chart.definition.js';
import type { SankeyChartData } from './sankey-chart.options.js';
import type { SankeyChart } from './sankey-chart.js';

ensureDefinition('fluent-chart-legend', () => chartLegendDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-sankey-chart', () => definition.define(FluentDesignSystem.registry));

// ── Sample data ───────────────────────────────────────────────────────────────

const basicData: SankeyChartData = {
  nodes: [
    { name: 'node0', color: 'qualitative.2' },
    { name: 'node1', color: 'qualitative.7' },
    { name: 'node2', color: 'qualitative.8' },
    { name: 'node3', color: 'qualitative.9' },
    { name: 'node4', color: 'qualitative.11' },
    { name: 'node5', color: 'qualitative.12' },
  ],
  links: [
    { source: 0, target: 2, value: 2 },
    { source: 1, target: 2, value: 2 },
    { source: 1, target: 3, value: 2 },
    { source: 0, target: 4, value: 2 },
    { source: 2, target: 3, value: 2 },
    { source: 2, target: 4, value: 2 },
    { source: 3, target: 4, value: 4 },
    { source: 4, target: 5, value: 4 },
  ],
};

const inboxData: SankeyChartData = {
  nodes: [
    { name: '192.168.42.1', color: 'qualitative.1' },
    { name: '172.16.8.112', color: 'qualitative.3' },
    { name: '192.168.42.2', color: 'qualitative.5' },
    { name: '172.16.8.1', color: 'qualitative.7' },
    { name: '192.168.42.60', color: 'qualitative.9' },
    { name: '192.168.42.153', color: 'qualitative.11' },
    { name: 'Inbox', color: 'qualitative.2' },
    { name: 'Sent', color: 'qualitative.4' },
    { name: 'Junk', color: 'qualitative.6' },
    { name: 'Deleted', color: 'qualitative.8' },
    { name: 'Deliver', color: 'qualitative.10' },
    { name: 'Block', color: 'qualitative.12' },
  ],
  links: [
    { source: 0, target: 6, value: 80 },
    { source: 0, target: 7, value: 5 },
    { source: 0, target: 8, value: 5 },
    { source: 1, target: 6, value: 50 },
    { source: 1, target: 9, value: 20 },
    { source: 2, target: 6, value: 30 },
    { source: 2, target: 8, value: 10 },
    { source: 3, target: 6, value: 45 },
    { source: 4, target: 6, value: 35 },
    { source: 5, target: 6, value: 25 },
    { source: 6, target: 10, value: 265 },
    { source: 9, target: 11, value: 20 },
  ],
};

export default { title: 'Components/SankeyChart' } as Meta<SankeyChart>;

export const Basic: Story<SankeyChart> = () => {
  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = basicData;
  chart.chartTitle = 'Sankey Chart basic example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '350');
  return chart;
};
Basic.parameters = { docs: { story: { height: '470px' } } };

export const StandardAttributes: Story<SankeyChart> = () => {
  const container = document.createElement('div');

  let width = 700;
  let height = 350;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = basicData;
  chart.chartTitle = 'Sankey Chart basic example';
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'sankey-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'sankey-sa-height', height, 100, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'sankey-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'sankey-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  const pathColorInput = createTextInputField('Path Color', 'sankey-sa-path-color', '', value => {
    if (value) {
      chart.setAttribute('path-color', value);
    } else {
      chart.removeAttribute('path-color');
    }
  });
  toggleControls.appendChild(pathColorInput.element);

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '460px' } } };

export const Culture: Story<SankeyChart> = () => {
  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = basicData;
  chart.chartTitle = 'Sankey chart culture example (de-DE)';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '350');
  chart.setAttribute('culture', 'de-DE');
  return chart;
};
Culture.parameters = { docs: { story: { height: '470px' } } };

export const TitleAlign: Story<SankeyChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = basicData;
  chart.chartTitle = 'Sankey chart title align example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'sankey-title-align', [...aligns], currentAlign, nextAlign => {
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

export const TitleAndLegendPositions: Story<SankeyChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = basicData;
  chart.chartTitle = 'Sankey chart title and legend positions example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'sankey-title-position',
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
      'sankey-legend-position',
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

export const RTL: Story<SankeyChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = basicData;
  chart.chartTitle = 'Sankey chart RTL example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '350');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '470px' } } };

export const Inbox: Story<SankeyChart> = () => {
  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = inboxData;
  chart.chartTitle = 'Email flow from IPs to folders';
  chart.setAttribute('width', '900');
  chart.setAttribute('height', '450');
  return chart;
};
Inbox.parameters = { docs: { story: { height: '570px' } } };
