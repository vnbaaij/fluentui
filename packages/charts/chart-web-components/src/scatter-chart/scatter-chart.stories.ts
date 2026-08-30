import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './scatter-chart.definition.js';
import type { ScatterChartSeries } from './scatter-chart.options.js';
import type { ScatterChart } from './scatter-chart.js';

// ── Sample data ───────────────────────────────────────────────────────────────

const basicData: ScatterChartSeries[] = [
  {
    legend: 'Phase 1',
    color: 'qualitative.3',
    data: [
      { x: 10, y: 50000, size: 12 },
      { x: 20, y: 75000, size: 15 },
      { x: 30, y: 90000, size: 18 },
      { x: 40, y: 120000, size: 22 },
      { x: 50, y: 150000, size: 25 },
    ],
  },
  {
    legend: 'Phase 2',
    color: 'qualitative.4',
    data: [
      { x: 60, y: 180000, size: 28 },
      { x: 70, y: 200000, size: 30 },
      { x: 80, y: 220000, size: 32 },
      { x: 90, y: 250000, size: 35 },
      { x: 100, y: 300000, size: 40 },
    ],
  },
  {
    legend: 'Milestone',
    color: 'qualitative.5',
    data: [{ x: 75, y: 250000, size: 50 }],
  },
];

const basicTitle = 'Project Revenue and Transactions Over Time';

export default { title: 'Components/ScatterChart' } as Meta<ScatterChart>;

export const Basic: Story<ScatterChart> = () => {
  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('x-axis-title', 'Days since project start');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
  return chart;
};
Basic.parameters = { docs: { story: { height: '470px' } } };

export const StandardAttributes: Story<ScatterChart> = () => {
  const container = document.createElement('div');

  let width = 650;
  let height = 350;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('x-axis-title', 'Days since project start');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'scatter-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'scatter-sa-height', height, 100, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'scatter-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'scatter-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'scatter-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'scatter-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '560px' } } };

export const TooltipRendererStory: Story<ScatterChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a bubble — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  chart.data = basicData;
  chart.chartTitle = 'Scatter chart custom tooltipRenderer';
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

export const Culture: Story<ScatterChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  chart.data = basicData;
  chart.chartTitle = `Scatter chart culture example (${currentCulture})`;
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('x-axis-title', 'Days since project start');
  chart.setAttribute('y-axis-title', 'Revenue in dollars');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField(
    'Culture',
    'scatter-culture',
    [...cultures],
    currentCulture,
    nextCulture => {
      currentCulture = nextCulture;
      chart.setAttribute('culture', currentCulture);
      chart.chartTitle = `Scatter chart culture example (${currentCulture})`;
    },
  );
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '470px' } } };

export const TitleAlign: Story<ScatterChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  chart.data = basicData;
  chart.chartTitle = 'Scatter chart title align example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'scatter-title-align', [...aligns], currentAlign, nextAlign => {
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

export const TitleAndLegendPositions: Story<ScatterChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  chart.data = basicData;
  chart.chartTitle = 'Scatter chart title and legend positions example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'scatter-title-position',
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
      'scatter-legend-position',
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

export const RTL: Story<ScatterChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-scatter-chart') as ScatterChart;
  chart.data = basicData;
  chart.chartTitle = 'Scatter chart RTL example';
  chart.setAttribute('width', '650');
  chart.setAttribute('height', '350');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '470px' } } };
