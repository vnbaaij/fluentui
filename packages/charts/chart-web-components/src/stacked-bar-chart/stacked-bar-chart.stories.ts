import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './stacked-bar-chart.definition.js';
import type { StackedBarChartData } from './stacked-bar-chart.options.js';
import type { StackedBarChart } from './stacked-bar-chart.js';

const sampleData: StackedBarChartData = {
  chartTitle: 'Stacked Bar Chart',
  chartData: [
    { legend: 'Alpha', data: 25, color: '#637cef' },
    { legend: 'Beta', data: 15, color: '#e3008c' },
    { legend: 'Gamma', data: 10, color: '#107c10' },
  ],
};

export default {
  title: 'Components/StackedBarChart',
  parameters: {
    docs: {
      description: {
        component: '<h2>Experimental component</h2>',
      },
    },
  },
} as Meta<StackedBarChart>;

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
  let width = 600;
  let height = 100;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked Bar Chart';
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'stackedbar-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'stackedbar-height', height, 60, 240, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'stackedbar-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'stackedbar-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'stackedbar-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'stackedbar-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'stackedbar-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '420px' } } };

export const ChartAttributes: Story<StackedBarChart> = () => {
  const container = document.createElement('div');
  let barHeight = 16;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked bar chart chart attributes example';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '100');
  chart.setAttribute('bar-height', `${barHeight}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const barHeightControl = createSliderField('Bar Height', 'stackedbar-ca-bar-height', barHeight, 8, 48, nextValue => {
    barHeight = nextValue;
    barHeightControl.setValue(nextValue);
    chart.setAttribute('bar-height', `${nextValue}`);
  });
  sliderControls.appendChild(barHeightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Number Display', 'stackedbar-ca-hide-number-display', false, checked => {
      chart.toggleAttribute('hide-number-display', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Enable Gradient', 'stackedbar-ca-enable-gradient', false, checked => {
      chart.toggleAttribute('enable-gradient', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
ChartAttributes.storyName = 'Chart Attributes';
ChartAttributes.parameters = { docs: { story: { height: '420px' } } };

export const TooltipRendererStory: Story<StackedBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a segment — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = 'Stacked bar chart custom tooltipRenderer';
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '100');
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
TooltipRendererStory.parameters = { docs: { story: { height: '220px' } } };

export const Culture: Story<StackedBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-stacked-bar-chart') as StackedBarChart;
  chart.data = sampleData;
  chart.chartTitle = `Stacked bar chart culture example (${currentCulture})`;
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '100');
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField(
    'Culture',
    'stacked-bar-culture',
    [...cultures],
    currentCulture,
    nextCulture => {
      currentCulture = nextCulture;
      chart.setAttribute('culture', currentCulture);
      chart.chartTitle = `Stacked bar chart culture example (${currentCulture})`;
    },
  );
  controls.appendChild(cultureControl.element);

  return container;
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
