import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createTextInputField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { definition } from './sparkline-chart.definition.js';
import type { SparklineDataPoint } from './sparkline-chart.options.js';
import type { SparklineChart } from './sparkline-chart.js';

const sampleData: SparklineDataPoint[] = [
  { x: 0, y: 10 },
  { x: 1, y: 18 },
  { x: 2, y: 12 },
  { x: 3, y: 20 },
  { x: 4, y: 14 },
];

export default { title: 'Components/SparklineChart' } as Meta<SparklineChart>;

export const Basic: Story<SparklineChart> = () => {
  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = sampleData;
  chart.variant = 'line';
  chart.setAttribute('width', '220');
  chart.setAttribute('height', '60');
  return chart;
};
Basic.parameters = { docs: { story: { height: '160px' } } };

export const StandardAttributes: Story<SparklineChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let width = 220;
  let height = 60;

  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = sampleData;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createSliderField('Width', 'sparkline-width', width, 120, 600, nextValue => {
      width = nextValue;
      chart.setAttribute('width', `${nextValue}`);
    }).element,
  );

  controls.appendChild(
    createSliderField('Height', 'sparkline-height', height, 30, 220, nextValue => {
      height = nextValue;
      chart.setAttribute('height', `${nextValue}`);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '260px' } } };

export const ChartAttributes: Story<SparklineChart> = () => {
  const container = document.createElement('div');

  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = sampleData;
  chart.setAttribute('width', '220');
  chart.setAttribute('height', '60');
  chart.setAttribute('style', 'margin-top:20px;');

  const variantControl = createDropdownField('Variant', 'sparkline-ca-variant', ['line', 'area'], 'line', nextValue => {
    chart.variant = nextValue as SparklineChart['variant'];
  });
  controls.appendChild(variantControl.element);

  const colorInput = createTextInputField('Color', 'sparkline-ca-color', '', nextValue => {
    if (nextValue) {
      chart.color = nextValue;
      chart.setAttribute('color', nextValue);
    } else {
      chart.color = undefined;
      chart.removeAttribute('color');
    }
  });
  controls.appendChild(colorInput.element);

  container.appendChild(chart);
  return container;
};
ChartAttributes.storyName = 'Chart Attributes';
ChartAttributes.parameters = { docs: { story: { height: '260px' } } };

export const TooltipRendererStory: Story<SparklineChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over the sparkline — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = sampleData;
  chart.chartTitle = 'Sparkline chart custom tooltipRenderer';
  chart.variant = 'line';
  chart.setAttribute('width', '220');
  chart.setAttribute('height', '60');
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
TooltipRendererStory.parameters = { docs: { story: { height: '160px' } } };

export const Culture: Story<SparklineChart> = () => {
  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = sampleData;
  chart.variant = 'line';
  chart.setAttribute('width', '220');
  chart.setAttribute('height', '60');
  chart.setAttribute('culture', 'de-DE');
  return chart;
};
Culture.parameters = { docs: { story: { height: '160px' } } };

export const TitleAlign: Story<SparklineChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = sampleData;
  chart.chartTitle = 'Sparkline title align example';
  chart.variant = 'line';
  chart.setAttribute('width', '400');
  chart.setAttribute('height', '80');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'sparkline-title-align', [...aligns], currentAlign, nextAlign => {
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
TitleAlign.parameters = { docs: { story: { height: '260px' } } };

export const TitleAndLegendPositions: Story<SparklineChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = sampleData;
  chart.chartTitle = 'Sparkline title and legend positions example';
  chart.variant = 'line';
  chart.setAttribute('width', '400');
  chart.setAttribute('height', '80');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'sparkline-title-position',
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
      'sparkline-legend-position',
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
TitleAndLegendPositions.parameters = { docs: { story: { height: '260px' } } };

export const RTL: Story<SparklineChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-sparkline-chart') as SparklineChart;
  chart.data = sampleData;
  chart.chartTitle = 'Sparkline RTL example';
  chart.variant = 'line';
  chart.setAttribute('width', '400');
  chart.setAttribute('height', '80');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '200px' } } };
