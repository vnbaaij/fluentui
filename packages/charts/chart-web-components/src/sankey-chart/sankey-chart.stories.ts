import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  createTextInputField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './sankey-chart.definition.js';
import { rebalanceComplexData, rebalanceSimpleData } from './sankey-chart-rebalance.data.js';
import type { SankeyChartData } from './sankey-chart.options.js';
import type { SankeyChart } from './sankey-chart.js';

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
    { source: 3, target: 5, value: 4 },
  ],
};

const responsiveData: SankeyChartData = {
  nodes: [
    { name: 'node0', color: 'qualitative.11' },
    { name: 'node1', color: 'qualitative.12' },
    { name: 'node2', color: 'qualitative.13' },
    { name: 'node3', color: 'qualitative.14' },
    { name: 'node4', color: 'qualitative.2' },
    { name: 'node5', color: 'qualitative.15' },
  ],
  links: [
    { source: 0, target: 2, value: 2 },
    { source: 1, target: 2, value: 2 },
    { source: 1, target: 3, value: 2 },
    { source: 0, target: 4, value: 2 },
    { source: 2, target: 3, value: 2 },
    { source: 2, target: 4, value: 2 },
    { source: 3, target: 4, value: 4 },
    { source: 3, target: 5, value: 4 },
  ],
};

const inboxData: SankeyChartData = {
  nodes: [
    { name: '192.168.42.72', color: 'qualitative.2' },
    { name: '172.152.48.13', color: 'qualitative.2' },
    { name: '124.360.55.1', color: 'qualitative.2' },
    { name: '192.564.10.2', color: 'qualitative.2' },
    { name: '124.124.50.1', color: 'qualitative.2' },
    { name: '172.630.89.4', color: 'qualitative.2' },
    { name: 'inbox', color: 'qualitative.7' },
    { name: 'Junk Folder', color: 'qualitative.7' },
    { name: 'Deleted Folder', color: 'qualitative.7' },
    { name: 'Clicked', color: 'qualitative.8' },
    { name: 'Opened', color: 'qualitative.8' },
    { name: ' No further action  required', color: 'qualitative.8' },
  ],
  links: [
    { source: 0, target: 6, value: 80 },
    { source: 1, target: 6, value: 50 },
    { source: 1, target: 7, value: 28 },
    { source: 2, target: 7, value: 14 },
    { source: 3, target: 7, value: 7 },
    { source: 3, target: 8, value: 20 },
    { source: 4, target: 7, value: 10 },
    { source: 5, target: 7, value: 10 },
    { source: 6, target: 9, value: 30 },
    { source: 6, target: 10, value: 55 },
    { source: 7, target: 11, value: 60 },
    { source: 8, target: 11, value: 2 },
  ],
};

export default { title: 'Components/SankeyChart' } as Meta<SankeyChart>;

export const Basic: Story<SankeyChart> = () => {
  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = basicData;
  chart.chartTitle = 'Sankey Chart basic example';
  chart.setAttribute('width', '820');
  chart.setAttribute('height', '412');
  return chart;
};
Basic.parameters = { docs: { story: { height: '532px' } } };

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

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '460px' } } };

export const ChartAttributes: Story<SankeyChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = basicData;
  chart.chartTitle = 'Sankey chart chart attributes example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');

  const pathColorInput = createTextInputField('Path Color', 'sankey-ca-path-color', '', value => {
    if (value) {
      chart.setAttribute('path-color', value);
    } else {
      chart.removeAttribute('path-color');
    }
  });
  controls.appendChild(pathColorInput.element);

  container.appendChild(chart);
  return container;
};
ChartAttributes.storyName = 'Chart Attributes';
ChartAttributes.parameters = { docs: { story: { height: '470px' } } };

export const Inbox: Story<SankeyChart> = () => {
  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = inboxData;
  chart.chartTitle = 'Email flow from IPs to folders';
  chart.setAttribute('width', '900');
  chart.setAttribute('height', '450');
  return chart;
};
Inbox.parameters = { docs: { story: { height: '570px' } } };

export const Rebalance: Story<SankeyChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let width = 820;
  let height = 400;
  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = rebalanceSimpleData;
  chart.chartTitle = 'Sankey Chart';
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:15px;');

  const dataSourceControl = createSwitchField('Data Source: simple', 'sankey-rebalance-data-source', true, checked => {
    dataSourceControl.element.querySelector('label')!.textContent = `Data Source: ${checked ? 'simple' : 'complex'}`;
    chart.data = checked ? rebalanceSimpleData : rebalanceComplexData;
  });
  controls.appendChild(dataSourceControl.element);

  const widthControl = createSliderField('Change Width', 'sankey-rebalance-width', width, 400, 1600, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  controls.appendChild(widthControl.element);

  const heightControl = createSliderField('Change Height', 'sankey-rebalance-height', height, 312, 400, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  controls.appendChild(heightControl.element);

  container.appendChild(chart);
  return container;
};
Rebalance.parameters = { docs: { story: { height: '540px' } } };

export const Responsive: Story<SankeyChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent = 'Resize the container horizontally to see the chart respond to available width.';
  container.appendChild(info);

  const responsiveHost = document.createElement('div');
  responsiveHost.id = 'sankey-responsive-container';
  responsiveHost.setAttribute(
    'style',
    'width:700px; max-width:100%; min-width:0; resize:horizontal; overflow:auto; border:1px solid #ddd; padding:8px; box-sizing:border-box;',
  );
  container.appendChild(responsiveHost);

  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = responsiveData;
  chart.chartTitle = 'Sankey Chart';
  chart.setAttribute('width', '100%');
  chart.setAttribute('height', '412');
  chart.setAttribute('style', 'min-width:0;');
  responsiveHost.appendChild(chart);

  return container;
};
Responsive.parameters = { docs: { story: { height: '560px' } } };

export const Culture: Story<SankeyChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-sankey-chart') as SankeyChart;
  chart.data = basicData;
  chart.chartTitle = `Sankey chart culture example (${currentCulture})`;
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '350');
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField(
    'Culture',
    'sankey-culture',
    [...cultures],
    currentCulture,
    nextCulture => {
      currentCulture = nextCulture;
      chart.setAttribute('culture', currentCulture);
      chart.chartTitle = `Sankey chart culture example (${currentCulture})`;
    },
  );
  controls.appendChild(cultureControl.element);

  return container;
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
