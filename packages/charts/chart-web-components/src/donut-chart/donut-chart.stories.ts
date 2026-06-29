import { html } from '@microsoft/fast-element';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  createTextInputField,
  renderComponent,
} from '../helpers.stories.js';
import { DonutChart as FluentDonutChart } from './donut-chart.js';
import type { DonutChartDataPoint } from './donut-chart.options.js';

const basicTitle = 'Donut chart basic example';
const sortedTitle = 'Sorted donut chart example';

const points: DonutChartDataPoint[] = [
  {
    legend: 'first',
    data: 20000,
  },
  {
    legend: 'second',
    data: 39000,
  },
];

const data: DonutChartDataPoint[] = points;

const sortedPoints: DonutChartDataPoint[] = [
  {
    legend: 'small',
    data: 5000,
  },
  {
    legend: 'large',
    data: 39000,
  },
  {
    legend: 'medium',
    data: 15000,
  },
];

const sortedData: DonutChartDataPoint[] = sortedPoints;

const storyTemplate = html<StoryArgs<FluentDonutChart>>`
  <fluent-donut-chart
    chart-title="${basicTitle}"
    data="${JSON.stringify(data)}"
    value-inside-donut="39,000"
    inner-radius="55"
  >
  </fluent-donut-chart>
`;

export default {
  title: 'Components/DonutChart',
} as Meta<FluentDonutChart>;

export const Basic: Story<FluentDonutChart> = renderComponent(storyTemplate).bind({});
Basic.parameters = { docs: { story: { height: '380px' } } };

export const StandardAttributes: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');

  let width = 200;
  let height = 200;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', basicTitle);
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('value-inside-donut', '39,000');
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'donut-sa-width', width, 100, 500, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'donut-sa-height', height, 100, 500, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'donut-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'donut-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'donut-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Rounded Corners', 'donut-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'donut-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '480px' } } };

export const Sizing: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);
  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chartHost);

  let width = 300;
  let height = 300;
  let innerRadius = 100;

  const renderChart = () => {
    const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
    chart.setAttribute('chart-title', 'Donut chart sizing example');
    chart.setAttribute('data', JSON.stringify(data));
    chart.setAttribute('value-inside-donut', '39,000');
    chart.setAttribute('inner-radius', `${innerRadius}`);
    // width/height accept both pixel numbers and CSS length strings (e.g. "50%").
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);

    chartHost.replaceChildren(chart);
  };

  const widthControl = createSliderField('Width', 'donut-width', width, 100, 500, nextWidth => {
    width = nextWidth;
    widthControl.setValue(nextWidth);
    renderChart();
  });
  controls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'donut-height', height, 100, 500, nextHeight => {
    height = nextHeight;
    heightControl.setValue(nextHeight);
    renderChart();
  });
  controls.appendChild(heightControl.element);

  const innerRadiusControl = createSliderField(
    'Inner radius',
    'donut-inner-radius',
    innerRadius,
    1,
    120,
    nextRadius => {
      innerRadius = nextRadius;
      innerRadiusControl.setValue(nextRadius);
      renderChart();
    },
  );
  controls.appendChild(innerRadiusControl.element);

  renderChart();

  return container;
};
Sizing.parameters = { docs: { story: { height: '460px' } } };

export const ResponsiveWidth: Story<FluentDonutChart> = () => {
  const outer = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'The chart uses width="75%" and height="75%". Drag the handle to resize the container — the donut re-centers automatically.';
  outer.appendChild(info);

  // A resizable wrapper so the story viewer can see the responsive behaviour.
  const resizable = document.createElement('div');
  resizable.setAttribute(
    'style',
    'resize:horizontal;overflow:auto;border:1px dashed #999;padding:8px;width:400px;min-width:200px;max-width:640px;',
  );
  outer.appendChild(resizable);

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Responsive donut chart');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('value-inside-donut', '39,000');
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('width', '75%');
  chart.setAttribute('height', '75%');

  resizable.appendChild(chart);
  return outer;
};
ResponsiveWidth.storyName = 'Responsive Width';
ResponsiveWidth.parameters = { docs: { story: { height: '420px' } } };

export const ShowLabelsInPercent: Story<FluentDonutChart> = () => {
  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Donut chart percent labels example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('inner-radius', '55');
  chart.toggleAttribute('show-labels-in-percent', true);
  chart.hideLabels = false;

  return chart;
};
ShowLabelsInPercent.parameters = { docs: { story: { height: '380px' } } };

export const ValueInsideDonut: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Donut chart value inside donut example');
  chart.setAttribute('data', JSON.stringify(sortedData));
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('value-inside-donut', '39,000');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const inputField = createTextInputField('Value inside donut', 'donut-value-inside', '39,000', nextValue => {
    if (nextValue) {
      chart.valueInsideDonut = nextValue;
      chart.setAttribute('value-inside-donut', nextValue);
    } else {
      chart.valueInsideDonut = undefined;
      chart.removeAttribute('value-inside-donut');
    }
  });
  controls.appendChild(inputField.element);

  return container;
};
ValueInsideDonut.parameters = { docs: { story: { height: '440px' } } };

export const AutoSumExample: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Auto-sum: no value-inside-donut attribute');
  chart.setAttribute('data', JSON.stringify(sortedData));
  chart.setAttribute('inner-radius', '55');
  // No value-inside-donut attribute → auto-sum enabled (shows 59,000 with locale formatting)
  container.appendChild(chart);
  return container;
};
AutoSumExample.storyName = 'Auto-sum (Default)';
AutoSumExample.parameters = { docs: { story: { height: '380px' } } };

export const FormatStringExample: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Format String with {0} placeholder');
  chart.setAttribute('data', JSON.stringify(sortedData));
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('value-inside-donut', 'Total: {0} items');
  // Format string with {0} placeholder → shows "Total: 59,000 items" (with locale formatting)
  container.appendChild(chart);
  return container;
};
FormatStringExample.storyName = 'Format String';
FormatStringExample.parameters = { docs: { story: { height: '380px' } } };

export const FormatterFunctionExample: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Custom Formatter Function');
  chart.setAttribute('data', JSON.stringify(sortedData));
  chart.setAttribute('inner-radius', '55');
  // Use valueInsideFormatter property for custom formatting
  chart.valueInsideFormatter = (value: number) => {
    // Format as currency with k suffix
    return `$${(value / 1000).toFixed(1)}k`;
  };
  // Shows "$59.0k"
  container.appendChild(chart);
  return container;
};
FormatterFunctionExample.storyName = 'Custom Formatter Function';
FormatterFunctionExample.parameters = { docs: { story: { height: '380px' } } };

export const ForceEmptyExample: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Force Empty (space character)');
  chart.setAttribute('data', JSON.stringify(sortedData));
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('value-inside-donut', ' ');
  // Space character forces empty center (no text displayed)
  container.appendChild(chart);
  return container;
};
ForceEmptyExample.storyName = 'Force Empty';
ForceEmptyExample.parameters = { docs: { story: { height: '380px' } } };

export const Sorted: Story<FluentDonutChart> = renderComponent(html<StoryArgs<FluentDonutChart>>`
  <fluent-donut-chart
    chart-title="${sortedTitle}"
    data="${JSON.stringify(sortedData)}"
    inner-radius="55"
    order="sorted"
  >
  </fluent-donut-chart>
`);
Sorted.parameters = { docs: { story: { height: '380px' } } };

export const TooltipRendererStory: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a slice — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.data = data;
  chart.chartTitle = 'Donut Chart — custom tooltipRenderer';
  chart.innerRadius = 55;
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
TooltipRendererStory.parameters = { docs: { story: { height: '380px' } } };

export const Culture: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', `Donut chart culture example (${currentCulture})`);
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('value-inside-donut', '39.000');
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'donut-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.setAttribute('chart-title', `Donut chart culture example (${currentCulture})`);
  });
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '440px' } } };

export const TitleAlign: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const alignments = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof alignments)[number] = 'start';

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Donut chart title alignment example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('value-inside-donut', '39,000');
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('title-align', currentAlign);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const alignControl = createDropdownField(
    'Title align',
    'donut-title-align',
    [...alignments],
    currentAlign,
    nextAlign => {
      currentAlign = nextAlign as (typeof alignments)[number];
      chart.setAttribute('title-align', currentAlign);
    },
  );
  controls.appendChild(alignControl.element);

  return container;
};
TitleAlign.parameters = { docs: { story: { height: '440px' } } };

export const TitleAndLegendPositions: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const positions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentPosition: (typeof positions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Title and legend position example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('value-inside-donut', '39,000');
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const posControl = createDropdownField(
    'Legend position',
    'donut-legend-position',
    [...positions],
    currentPosition,
    nextPosition => {
      currentPosition = nextPosition as (typeof positions)[number];
      if (currentPosition === 'bottom') {
        chart.removeAttribute('legend-position');
      } else {
        chart.setAttribute('legend-position', currentPosition);
      }
    },
  );

  const titlePosControl = createDropdownField(
    'Title position',
    'donut-title-position',
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
  );
  controls.appendChild(titlePosControl.element);
  controls.appendChild(posControl.element);

  return container;
};
TitleAndLegendPositions.parameters = { docs: { story: { height: '440px' } } };

export const RTL: Story<FluentDonutChart> = renderComponent(html<StoryArgs<FluentDonutChart>>`
  <div dir="rtl">
    <fluent-donut-chart
      chart-title="Donut chart RTL example"
      data="${JSON.stringify(data)}"
      value-inside-donut="39,000"
      inner-radius="55"
    >
    </fluent-donut-chart>
  </div>
`);
RTL.parameters = { docs: { story: { height: '380px' } } };
