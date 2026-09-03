import { controlsRowStyle, createDropdownField, createSliderField, type Meta, type Story } from '../helpers.stories.js';
import { definition } from './tree-chart.definition.js';
import type { TreeChart } from './tree-chart.js';

export default {
  title: 'Components/TreeChart',
  parameters: {
    docs: {
      description: {
        component: '<h2>Experimental component</h2>',
      },
    },
  },
} as Meta<TreeChart>;

export const Basic: Story<TreeChart> = () => {
  const chart = document.createElement('fluent-tree-chart') as TreeChart;
  chart.data = {
    name: 'CEO',
    fill: '#637cef',
    children: [
      { name: 'CTO', fill: '#0078d4', children: [{ name: 'Dev Lead', fill: '#005a9e' }] },
      { name: 'CFO', fill: '#e3008c' },
      { name: 'COO', fill: '#107c10' },
    ],
  };
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  return chart;
};
Basic.parameters = { docs: { story: { height: '420px' } } };

export const StandardAttributes: Story<TreeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let width = 600;
  let height = 300;

  const chart = document.createElement('fluent-tree-chart') as TreeChart;
  chart.data = {
    name: 'CEO',
    fill: '#637cef',
    children: [
      { name: 'CTO', fill: '#0078d4', children: [{ name: 'Dev Lead', fill: '#005a9e' }] },
      { name: 'CFO', fill: '#e3008c' },
      { name: 'COO', fill: '#107c10' },
    ],
  };
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createSliderField('Width', 'tree-width', width, 200, 1000, nextValue => {
      width = nextValue;
      chart.setAttribute('width', `${nextValue}`);
    }).element,
  );
  controls.appendChild(
    createSliderField('Height', 'tree-height', height, 120, 700, nextValue => {
      height = nextValue;
      chart.setAttribute('height', `${nextValue}`);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '520px' } } };

export const TooltipRendererStory: Story<TreeChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a node — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-tree-chart') as TreeChart;
  chart.data = {
    name: 'CEO',
    fill: '#637cef',
    children: [
      { name: 'CTO', fill: '#0078d4', children: [{ name: 'Dev Lead', fill: '#005a9e' }] },
      { name: 'CFO', fill: '#e3008c' },
      { name: 'COO', fill: '#107c10' },
    ],
  };
  chart.chartTitle = 'Tree chart custom tooltipRenderer';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
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
TooltipRendererStory.parameters = { docs: { story: { height: '420px' } } };

export const Culture: Story<TreeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-tree-chart') as TreeChart;
  chart.data = {
    name: 'CEO',
    fill: '#637cef',
    children: [
      { name: 'CTO', fill: '#0078d4', children: [{ name: 'Dev Lead', fill: '#005a9e' }] },
      { name: 'CFO', fill: '#e3008c' },
      { name: 'COO', fill: '#107c10' },
    ],
  };
  chart.chartTitle = `Tree chart culture example (${currentCulture})`;
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'tree-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.chartTitle = `Tree chart culture example (${currentCulture})`;
  });
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '420px' } } };

export const TitleAlign: Story<TreeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-tree-chart') as TreeChart;
  chart.data = {
    name: 'CEO',
    fill: '#637cef',
    children: [
      { name: 'CTO', fill: '#0078d4', children: [{ name: 'Dev Lead', fill: '#005a9e' }] },
      { name: 'CFO', fill: '#e3008c' },
      { name: 'COO', fill: '#107c10' },
    ],
  };
  chart.chartTitle = 'Tree chart title align example';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'tree-title-align', [...aligns], currentAlign, nextAlign => {
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
TitleAlign.parameters = { docs: { story: { height: '520px' } } };

export const TitleAndLegendPositions: Story<TreeChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-tree-chart') as TreeChart;
  chart.data = {
    name: 'CEO',
    fill: '#637cef',
    children: [
      { name: 'CTO', fill: '#0078d4', children: [{ name: 'Dev Lead', fill: '#005a9e' }] },
      { name: 'CFO', fill: '#e3008c' },
      { name: 'COO', fill: '#107c10' },
    ],
  };
  chart.chartTitle = 'Tree chart title and legend positions example';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'tree-title-position',
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
      'tree-legend-position',
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
TitleAndLegendPositions.parameters = { docs: { story: { height: '520px' } } };

export const RTL: Story<TreeChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-tree-chart') as TreeChart;
  chart.data = {
    name: 'CEO',
    fill: '#637cef',
    children: [
      { name: 'CTO', fill: '#0078d4', children: [{ name: 'Dev Lead', fill: '#005a9e' }] },
      { name: 'CFO', fill: '#e3008c' },
      { name: 'COO', fill: '#107c10' },
    ],
  };
  chart.chartTitle = 'Tree chart RTL example';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '420px' } } };
