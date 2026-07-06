import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './line-chart.definition.js';
import type { LineChartSeries } from './line-chart.options.js';
import type { LineChart } from './line-chart.js';

// ── Sample data ───────────────────────────────────────────────────────────────

const basicData: LineChartSeries[] = [
  {
    legend: 'From_Legacy_to_O365',
    color: 'qualitative.3',
    data: [
      { x: new Date('2020-03-03T00:00:00.000Z'), y: 216000 },
      { x: new Date('2020-03-03T10:00:00.000Z'), y: 218123 },
      { x: new Date('2020-03-03T11:00:00.000Z'), y: 217124 },
      { x: new Date('2020-03-04T00:00:00.000Z'), y: 248000 },
      { x: new Date('2020-03-05T00:00:00.000Z'), y: 252000 },
      { x: new Date('2020-03-06T00:00:00.000Z'), y: 274000 },
      { x: new Date('2020-03-07T00:00:00.000Z'), y: 260000 },
      { x: new Date('2020-03-08T00:00:00.000Z'), y: 304000 },
      { x: new Date('2020-03-09T00:00:00.000Z'), y: 218000 },
    ],
  },
  {
    legend: 'All',
    color: 'qualitative.4',
    data: [
      { x: new Date('2020-03-03T00:00:00.000Z'), y: 297000 },
      { x: new Date('2020-03-04T00:00:00.000Z'), y: 284000 },
      { x: new Date('2020-03-05T00:00:00.000Z'), y: 282000 },
      { x: new Date('2020-03-06T00:00:00.000Z'), y: 294000 },
      { x: new Date('2020-03-07T00:00:00.000Z'), y: 224000 },
      { x: new Date('2020-03-08T00:00:00.000Z'), y: 300000 },
      { x: new Date('2020-03-09T00:00:00.000Z'), y: 298000 },
    ],
  },
  {
    legend: 'single point',
    color: 'qualitative.5',
    data: [{ x: new Date('2020-03-05T12:00:00.000Z'), y: 232000 }],
  },
];

const basicTitle = 'Line Chart Basic Example';

export default { title: 'Components/LineChart' } as Meta<LineChart>;

export const Basic: Story<LineChart> = () => {
  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Values of each category');
  chart.setAttribute('y-axis-title', 'Different categories of mail flow');
  chart.setAttribute('y-axis-tick-label-max-width', '28');
  return chart;
};
Basic.parameters = { docs: { story: { height: '420px' } } };

export const StandardAttributes: Story<LineChart> = () => {
  const container = document.createElement('div');

  let width = 700;
  let height = 300;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('x-axis-title', 'Values of each category');
  chart.setAttribute('y-axis-title', 'Different categories of mail flow');
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'line-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'line-sa-height', height, 100, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'line-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'line-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'line-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'line-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '540px' } } };

export const TooltipRendererStory: Story<LineChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a line point — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = 'Line chart custom tooltipRenderer';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Values of each category');
  chart.setAttribute('y-axis-title', 'Different categories of mail flow');
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

export const Culture: Story<LineChart> = () => {
  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = 'Line chart culture example (de-DE)';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('culture', 'de-DE');
  chart.setAttribute('x-axis-title', 'Values of each category');
  chart.setAttribute('y-axis-title', 'Different categories of mail flow');
  return chart;
};
Culture.parameters = { docs: { story: { height: '420px' } } };

export const TitleAlign: Story<LineChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = 'Line chart title align example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'line-title-align', [...aligns], currentAlign, nextAlign => {
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
TitleAlign.parameters = { docs: { story: { height: '420px' } } };

export const TitleAndLegendPositions: Story<LineChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = 'Line chart title and legend positions example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'line-title-position',
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
      'line-legend-position',
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
TitleAndLegendPositions.parameters = { docs: { story: { height: '420px' } } };

export const RTL: Story<LineChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = 'Line chart RTL example';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '420px' } } };

export const ShowMarkers: Story<LineChart> = () => {
  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = 'Line chart with data point markers';
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('show-markers', '');
  return chart;
};
ShowMarkers.storyName = 'Chart Attributes';
ShowMarkers.parameters = { docs: { story: { height: '420px' } } };
