import { FluentDesignSystem } from '@fluentui/web-components';
import { definition as chartLegendDefinition } from '../chart-legend/chart-legend.definition.js';
import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  ensureDefinition,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './vertical-stacked-bar-chart.definition.js';
import type { VerticalStackedBarChartProps } from './vertical-stacked-bar-chart.options.js';
import type { VerticalStackedBarChart } from './vertical-stacked-bar-chart.js';

ensureDefinition('fluent-chart-legend', () => chartLegendDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-vertical-stacked-bar-chart', () => definition.define(FluentDesignSystem.registry));

// ── Sample data ───────────────────────────────────────────────────────────────

const basicData: VerticalStackedBarChartProps[] = [
  {
    xAxisPoint: 0,
    chartData: [
      { legend: 'Metadata1', data: 40, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 5, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 20, color: 'qualitative.3' },
      { legend: 'Metadata4', data: 3, color: 'qualitative.4' },
      { legend: 'Metadata5', data: 15, color: 'qualitative.5' },
      { legend: 'Metadata6', data: 5, color: 'qualitative.6' },
      { legend: 'Metadata7', data: 0.1, color: 'qualitative.7' },
      { legend: 'Metadata8', data: 3, color: 'qualitative.8' },
      { legend: 'Metadata9', data: 0.5, color: 'qualitative.9' },
      { legend: 'Metadata10', data: 7, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: 20,
    chartData: [
      { legend: 'Metadata1', data: 25, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 13, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 30, color: 'qualitative.3' },
      { legend: 'Metadata4', data: 3, color: 'qualitative.4' },
      { legend: 'Metadata5', data: 20, color: 'qualitative.5' },
      { legend: 'Metadata6', data: 25, color: 'qualitative.6' },
      { legend: 'Metadata7', data: 0.1, color: 'qualitative.7' },
      { legend: 'Metadata8', data: 5, color: 'qualitative.8' },
      { legend: 'Metadata9', data: 0.5, color: 'qualitative.9' },
      { legend: 'Metadata10', data: 7, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: 40,
    chartData: [
      { legend: 'Metadata1', data: 40, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 8, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 18, color: 'qualitative.3' },
      { legend: 'Metadata4', data: 4, color: 'qualitative.4' },
      { legend: 'Metadata5', data: 20, color: 'qualitative.5' },
      { legend: 'Metadata6', data: 15, color: 'qualitative.6' },
      { legend: 'Metadata7', data: 0.1, color: 'qualitative.7' },
      { legend: 'Metadata8', data: 4, color: 'qualitative.8' },
      { legend: 'Metadata9', data: 0.5, color: 'qualitative.9' },
      { legend: 'Metadata10', data: 7, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: 60,
    chartData: [
      { legend: 'Metadata1', data: 55, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 8, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 8, color: 'qualitative.3' },
      { legend: 'Metadata4', data: 88, color: 'qualitative.4' },
      { legend: 'Metadata5', data: 7, color: 'qualitative.5' },
      { legend: 'Metadata6', data: 5, color: 'qualitative.6' },
      { legend: 'Metadata7', data: 0.1, color: 'qualitative.7' },
      { legend: 'Metadata8', data: 6, color: 'qualitative.8' },
      { legend: 'Metadata9', data: 0.5, color: 'qualitative.9' },
      { legend: 'Metadata10', data: 7, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: 80,
    chartData: [
      { legend: 'Metadata1', data: 45, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 9, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 19, color: 'qualitative.3' },
      { legend: 'Metadata4', data: 8, color: 'qualitative.4' },
      { legend: 'Metadata5', data: 27, color: 'qualitative.5' },
      { legend: 'Metadata6', data: 10, color: 'qualitative.6' },
      { legend: 'Metadata7', data: 0.1, color: 'qualitative.7' },
      { legend: 'Metadata8', data: 5, color: 'qualitative.8' },
      { legend: 'Metadata9', data: 0.5, color: 'qualitative.9' },
      { legend: 'Metadata10', data: 7, color: 'qualitative.10' },
    ],
  },
  {
    xAxisPoint: 100,
    chartData: [
      { legend: 'Metadata1', data: 39, color: 'qualitative.1' },
      { legend: 'Metadata2', data: 3, color: 'qualitative.2' },
      { legend: 'Metadata3', data: 13, color: 'qualitative.3' },
      { legend: 'Metadata4', data: 5, color: 'qualitative.4' },
      { legend: 'Metadata5', data: 12, color: 'qualitative.5' },
      { legend: 'Metadata6', data: 7, color: 'qualitative.6' },
      { legend: 'Metadata7', data: 0.1, color: 'qualitative.7' },
      { legend: 'Metadata8', data: 4, color: 'qualitative.8' },
      { legend: 'Metadata9', data: 0.5, color: 'qualitative.9' },
      { legend: 'Metadata10', data: 7, color: 'qualitative.10' },
    ],
  },
];

const basicTitle = 'Vertical stacked bar chart basic example';

export default { title: 'Components/VerticalStackedBarChart' } as Meta<VerticalStackedBarChart>;

export const Basic: Story<VerticalStackedBarChart> = () => {
  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  return chart;
};
Basic.parameters = { docs: { story: { height: '470px' } } };

export const StandardAttributes: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  let width = 650;
  let height = 350;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'vsbar-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'vsbar-sa-height', height, 100, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'vsbar-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'vsbar-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'vsbar-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'vsbar-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'vsbar-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '560px' } } };

export const ChartAttributes: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart chart attributes example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');

  const barGapMaxControl = createSliderField('Bar Gap Max', 'vsbar-ca-bar-gap-max', 5, 0, 20, nextValue => {
    barGapMaxControl.setValue(nextValue);
    chart.setAttribute('bar-gap-max', `${nextValue}`);
  });
  sliderControls.appendChild(barGapMaxControl.element);

  const barWidthControl = createSliderField('Bar Width', 'vsbar-ca-bar-width', 0, 0, 60, nextValue => {
    barWidthControl.setValue(nextValue);
    if (nextValue === 0) {
      chart.removeAttribute('bar-width');
    } else {
      chart.setAttribute('bar-width', `${nextValue}`);
    }
  });
  sliderControls.appendChild(barWidthControl.element);

  container.appendChild(chart);
  return container;
};
ChartAttributes.storyName = 'Chart Attributes';
ChartAttributes.parameters = { docs: { story: { height: '560px' } } };

export const TooltipRendererStory: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a stack segment — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart custom tooltipRenderer';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
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
TooltipRendererStory.parameters = { docs: { story: { height: '470px' } } };

export const Culture: Story<VerticalStackedBarChart> = () => {
  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart culture example (de-DE)';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('culture', 'de-DE');
  return chart;
};
Culture.parameters = { docs: { story: { height: '470px' } } };

export const TitleAlign: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart title align example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'vsbar-title-align', [...aligns], currentAlign, nextAlign => {
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

export const TitleAndLegendPositions: Story<VerticalStackedBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart title and legend positions example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'vsbar-title-position',
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
      'vsbar-legend-position',
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

export const RTL: Story<VerticalStackedBarChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-vertical-stacked-bar-chart') as VerticalStackedBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical stacked bar chart RTL example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '470px' } } };
