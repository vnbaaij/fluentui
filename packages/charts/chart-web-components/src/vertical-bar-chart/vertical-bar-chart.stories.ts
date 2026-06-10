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

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '560px' } } };

export const ChartAttributes: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart chart attributes example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');

  const barWidthControl = createSliderField('Bar Width', 'vbar-ca-bar-width', 0, 0, 60, nextValue => {
    barWidthControl.setValue(nextValue);
    if (nextValue === 0) {
      chart.removeAttribute('bar-width');
    } else {
      chart.setAttribute('bar-width', `${nextValue}`);
    }
  });
  sliderControls.appendChild(barWidthControl.element);

  toggleControls.appendChild(
    createSwitchField('Use Single Color', 'vbar-ca-single-color', false, checked => {
      chart.toggleAttribute('use-single-color', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
ChartAttributes.storyName = 'Chart Attributes';
ChartAttributes.parameters = { docs: { story: { height: '560px' } } };

export const TooltipRendererStory: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a bar — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart custom tooltipRenderer';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('x-axis-title', 'Days since project start');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
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

export const Culture: Story<VerticalBarChart> = () => {
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart culture example (de-DE)';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('culture', 'de-DE');
  return chart;
};
Culture.parameters = { docs: { story: { height: '470px' } } };

export const TitleAlign: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart title align example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'vbar-title-align', [...aligns], currentAlign, nextAlign => {
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

export const TitleAndLegendPositions: Story<VerticalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart title and legend positions example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'vbar-title-position',
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
      'vbar-legend-position',
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

export const RTL: Story<VerticalBarChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-vertical-bar-chart') as VerticalBarChart;
  chart.data = basicData;
  chart.chartTitle = 'Vertical bar chart RTL example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '470px' } } };

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
