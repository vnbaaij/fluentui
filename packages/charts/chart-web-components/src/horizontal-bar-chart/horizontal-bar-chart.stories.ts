import { html } from '@microsoft/fast-element';
import {
  FieldDefinition,
  FluentDesignSystem,
  LabelDefinition,
  SliderDefinition,
  SwitchDefinition,
} from '@fluentui/web-components';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import { renderComponent } from '../helpers.stories.js';
import { HorizontalBarChart as FluentHorizontalBarChart } from './horizontal-bar-chart.js';
import type { ChartDataPoint, ChartProps } from './horizontal-bar-chart.options.js';
import { Variant } from './horizontal-bar-chart.options.js';

type FluentSliderElement = HTMLElement & { value: string };
type FluentSwitchElement = HTMLElement & { checked: boolean };

const ensureDefinition = (tagName: string, define: () => void) => {
  if (!customElements.get(tagName)) {
    define();
  }
};

ensureDefinition('fluent-field', () => FieldDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-label', () => LabelDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-slider', () => SliderDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-switch', () => SwitchDefinition.define(FluentDesignSystem.registry));

const controlsRowStyle = 'display:flex;flex-wrap:wrap;gap:16px 24px;align-items:end;';
const sliderFieldStyle = 'min-width:220px;flex:1 1 220px;';
const toggleFieldStyle = 'min-width:220px;';

const createSliderField = (
  labelText: string,
  id: string,
  value: number,
  min: number,
  max: number,
  onChange: (nextValue: number) => void,
) => {
  const field = document.createElement('fluent-field');
  field.setAttribute('label-position', 'above');
  field.setAttribute('style', sliderFieldStyle);

  const label = document.createElement('label');
  label.slot = 'label';
  label.htmlFor = id;
  label.textContent = labelText;
  field.appendChild(label);

  const slider = document.createElement('fluent-slider') as FluentSliderElement;
  slider.slot = 'input';
  slider.id = id;
  slider.setAttribute('min', `${min}`);
  slider.setAttribute('max', `${max}`);
  slider.value = `${value}`;
  slider.setAttribute('value', `${value}`);
  field.appendChild(slider);

  const message = document.createElement('fluent-label');
  message.slot = 'message';
  message.textContent = `${value}`;
  field.appendChild(message);

  slider.addEventListener('change', () => onChange(Number(slider.value)));

  return {
    element: field,
    setValue: (nextValue: number) => {
      slider.value = `${nextValue}`;
      slider.setAttribute('value', `${nextValue}`);
      message.textContent = `${nextValue}`;
    },
  };
};

const createSwitchField = (
  labelText: string,
  id: string,
  checked: boolean,
  onChange: (nextChecked: boolean) => void,
) => {
  const field = document.createElement('fluent-field');
  field.setAttribute('label-position', 'after');
  field.setAttribute('style', toggleFieldStyle);

  const label = document.createElement('label');
  label.slot = 'label';
  label.htmlFor = id;
  label.textContent = labelText;
  field.appendChild(label);

  const control = document.createElement('fluent-switch') as FluentSwitchElement;
  control.slot = 'input';
  control.id = id;
  control.checked = checked;
  control.toggleAttribute('checked', checked);
  control.addEventListener('change', () => onChange(control.checked));
  field.appendChild(control);

  return {
    element: field,
    setValue: (nextChecked: boolean) => {
      control.checked = nextChecked;
      control.toggleAttribute('checked', nextChecked);
    },
  };
};

const singleBarHBCData = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 1543,
        total: 15000,
        color: '#637cef',
      },
    ],
  },
  {
    chartSeriesTitle: 'two',
    chartData: [
      {
        legend: 'two',
        data: 800,
        total: 15000,
        color: '#e3008c',
      },
    ],
  },
  {
    chartSeriesTitle: 'three',
    chartData: [
      {
        legend: 'three',
        data: 8888,
        total: 15000,
        color: '#2aa0a4',
      },
    ],
  },
  {
    chartSeriesTitle: 'four',
    chartData: [
      {
        legend: 'four',
        data: 15888,
        total: 15000,
        color: '#9373c0',
      },
    ],
  },
  {
    chartSeriesTitle: 'five',
    chartData: [
      {
        legend: 'five',
        data: 11444,
        total: 15000,
        color: '#13a10e',
      },
    ],
  },
  {
    chartSeriesTitle: 'six',
    chartData: [
      {
        legend: 'six',
        data: 14000,
        total: 15000,
        color: '#3a96dd',
      },
    ],
  },
  {
    chartSeriesTitle: 'seven',
    chartData: [
      {
        legend: 'seven',
        data: 9855,
        total: 15000,
        color: '#ca5010',
      },
    ],
  },
  {
    chartSeriesTitle: 'eight',
    chartData: [
      {
        legend: 'eight',
        data: 4250,
        total: 15000,
        color: '#57811b',
      },
    ],
  },
];

const singleBarNMVariantData: ChartProps[] = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 1543,
        total: 15000,
        color: '#637cef',
      },
    ],
    chartDataText: '1.5k/15k hours',
  },
  {
    chartSeriesTitle: 'two',
    chartData: [
      {
        legend: 'two',
        data: 800,
        total: 15000,
        color: '#e3008c',
      },
    ],
    chartDataText: '800/15k hours',
  },
  {
    chartSeriesTitle: 'three',
    chartData: [
      {
        legend: 'three',
        data: 8888,
        total: 15000,
        color: '#2aa0a4',
      },
    ],
    chartDataText: '8.9k/15k hours',
  },
  {
    chartSeriesTitle: 'four',
    chartData: [
      {
        legend: 'four',
        data: 15888,
        total: 15000,
        color: '#9373c0',
      },
    ],
    chartDataText: '16k/15k hours',
  },
  {
    chartSeriesTitle: 'five',
    chartData: [
      {
        legend: 'five',
        data: 11444,
        total: 15000,
        color: '#13a10e',
      },
    ],
    chartDataText: '11k/15k hours',
  },
  {
    chartSeriesTitle: 'six',
    chartData: [
      {
        legend: 'six',
        data: 14000,
        total: 15000,
        color: '#3a96dd',
      },
    ],
    chartDataText: '14k/15k hours',
  },
  {
    chartSeriesTitle: 'seven',
    chartData: [
      {
        legend: 'seven',
        data: 9855,
        total: 15000,
        color: '#ca5010',
      },
    ],
    chartDataText: '9.9k/15k hours',
  },
  {
    chartSeriesTitle: 'eight',
    chartData: [
      {
        legend: 'eight',
        data: 4250,
        total: 15000,
        color: '#57811b',
      },
    ],
    chartDataText: '4.3k/15k hours',
  },
];

const chartPoints1: ChartDataPoint[] = [
  {
    legend: 'Debit card numbers (EU and USA)',
    data: 40,
    color: '#0099BC',
  },
  {
    legend: 'Passport numbers (USA)',
    data: 23,
    color: '#77004D',
  },
  {
    legend: 'Social security numbers',
    data: 35,
    color: '#4F68ED',
  },
  {
    legend: 'Credit card Numbers',
    data: 87,
    color: '#AE8C00',
  },
  {
    legend: 'Tax identification numbers (USA)',
    data: 87,
    color: '#004E8C',
  },
];

const chartPoints2: ChartDataPoint[] = [
  {
    legend: 'Debit card numbers (EU and USA)',
    data: 40,
    color: '#0099BC',
  },
  {
    legend: 'Passport numbers (USA)',
    data: 56,
    color: '#77004D',
  },
  {
    legend: 'Social security numbers',
    data: 35,
    color: '#4F68ED',
  },
  {
    legend: 'Credit card Numbers',
    data: 92,
    color: '#AE8C00',
  },
  {
    legend: 'Tax identification numbers (USA)',
    data: 87,
    color: '#004E8C',
  },
];

const chartPoints3: ChartDataPoint[] = [
  {
    legend: 'Phone Numbers',
    data: 40,
    color: '#881798',
  },
  {
    legend: 'Credit card Numbers',
    data: 23,
    color: '#AE8C00',
  },
];

const data: ChartProps[] = [
  {
    chartSeriesTitle: 'Monitored First',
    chartData: chartPoints1,
  },
  {
    chartSeriesTitle: 'Monitored Second',
    chartData: chartPoints2,
  },
  {
    chartSeriesTitle: 'Unmonitored',
    chartData: chartPoints3,
  },
];

const singlePointData = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 1543,
        total: 15000,
        gradient: ['#637cef', '#e3008c'],
      },
    ],
  },
];

const benchmarkData: ChartProps[] = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 10,
        total: 100,
        color: '#637cef',
      },
    ],
    benchmarkData: 50,
  },
  {
    chartSeriesTitle: 'two',
    chartData: [
      {
        legend: 'two',
        data: 30,
        total: 200,
        color: '#e3008c',
      },
    ],
    benchmarkData: 30,
  },
  {
    chartSeriesTitle: 'three',
    chartData: [
      {
        legend: 'three',
        data: 15,
        total: 50,
        color: '#2aa0a4',
      },
    ],
    benchmarkData: 5,
  },
];

const storyTemplate = html<StoryArgs<FluentHorizontalBarChart>>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart basic example"
    data="${JSON.stringify(data)}"
  >
  </fluent-horizontal-bar-chart>
`;

export default {
  title: 'Components/HorizontalBarChart',
} as Meta<FluentHorizontalBarChart>;

export const Basic: Story<FluentHorizontalBarChart> = renderComponent(storyTemplate).bind({});

export const Sizing: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let width = 720;
  let height = 320;

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart sizing example');
  chart.setAttribute('data', JSON.stringify(data));

  const renderChart = () => {
    chart.width = `${width}`;
    chart.height = `${height}`;
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);
    chart.setAttribute('style', `width:${width}px;height:${height}px;margin-top:20px;`);

    if (!chart.isConnected) {
      container.appendChild(chart);
    }
  };

  const widthControl = createSliderField('Width', 'horizontal-bar-width', width, 320, 1000, nextWidth => {
    width = nextWidth;
    widthControl.setValue(nextWidth);
    renderChart();
  });
  controls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'horizontal-bar-height', height, 220, 640, nextHeight => {
    height = nextHeight;
    heightControl.setValue(nextHeight);
    renderChart();
  });
  controls.appendChild(heightControl.element);

  renderChart();

  return container;
};

export const singleDataPoint: Story<FluentHorizontalBarChart> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChart>
>`
  <div>
    <fluent-horizontal-bar-chart
      style="width: 100%"
      chart-title="Horizontal bar chart single data point example"
      variant="single-bar"
      data="${JSON.stringify(singlePointData)}"
    >
    </fluent-horizontal-bar-chart>
  </div>
`);

export const Benchmark: Story<FluentHorizontalBarChart> = renderComponent(html<StoryArgs<FluentHorizontalBarChart>>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart benchmark example"
    variant="single-bar"
    data="${JSON.stringify(benchmarkData)}"
  >
  </fluent-horizontal-bar-chart>
`);

export const singleBarNMVariant: Story<FluentHorizontalBarChart> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChart>
>`
  <div>
    <fluent-horizontal-bar-chart
      style="width: 100%"
      chart-title="Horizontal bar chart single bar variant example"
      variant="single-bar"
      data="${JSON.stringify(singleBarNMVariantData)}"
    >
    </fluent-horizontal-bar-chart>
  </div>
`);

export const singleBarHBC: Story<FluentHorizontalBarChart> = renderComponent(html<StoryArgs<FluentHorizontalBarChart>>`
  <div>
    <fluent-horizontal-bar-chart
      style="width: 100%"
      chart-title="Horizontal bar chart absolute scale example"
      data="${JSON.stringify(singleBarHBCData)}"
      variant="${Variant.AbsoluteScale}"
    >
    </fluent-horizontal-bar-chart>
  </div>
`);

export const HideLabels: Story<FluentHorizontalBarChart> = renderComponent(html<StoryArgs<FluentHorizontalBarChart>>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart hide labels example"
    hide-labels
    data="${JSON.stringify(data)}"
  >
  </fluent-horizontal-bar-chart>
`);

export const RoundedCorners: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let roundCorners = false;

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart rounded corners example');
  chart.setAttribute('variant', Variant.AbsoluteScale);
  chart.setAttribute('data', JSON.stringify(singleBarHBCData));
  chart.setAttribute('style', 'width:100%;margin-top:20px;');

  const renderChart = () => {
    chart.roundCorners = roundCorners;
    chart.toggleAttribute('round-corners', roundCorners);

    if (!chart.isConnected) {
      container.appendChild(chart);
    }
  };

  const roundCornersControl = createSwitchField(
    'Rounded corners',
    'horizontal-bar-round-corners',
    roundCorners,
    nextChecked => {
      roundCorners = nextChecked;
      roundCornersControl.setValue(nextChecked);
      renderChart();
    },
  );
  controls.appendChild(roundCornersControl.element);

  renderChart();

  return container;
};

export const ChartDataModeFraction: Story<FluentHorizontalBarChart> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChart>
>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart fraction mode example"
    variant="single-bar"
    chart-data-mode="fraction"
    data="${JSON.stringify(singleBarHBCData)}"
  >
  </fluent-horizontal-bar-chart>
`);

export const ChartDataModePercentage: Story<FluentHorizontalBarChart> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChart>
>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart percentage mode example"
    variant="single-bar"
    chart-data-mode="percentage"
    data="${JSON.stringify(singleBarHBCData)}"
  >
  </fluent-horizontal-bar-chart>
`);

export const HideRatio: Story<FluentHorizontalBarChart> = renderComponent(html<StoryArgs<FluentHorizontalBarChart>>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart hide ratio example"
    variant="single-bar"
    hide-ratio
    data="${JSON.stringify(singleBarHBCData)}"
  >
  </fluent-horizontal-bar-chart>
`);

export const RTL: Story<FluentHorizontalBarChart> = renderComponent(html<StoryArgs<FluentHorizontalBarChart>>`
  <div dir="rtl">
    <div>
      <fluent-horizontal-bar-chart
        style="width: 100%"
        chart-title="Horizontal bar chart RTL example"
        data="${JSON.stringify(data)}"
      >
      </fluent-horizontal-bar-chart>
    </div>
  </div>
`);

export const HideLegends: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let hideLegends = true;

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart hide legends example');
  chart.setAttribute('style', 'width:100%;margin-top:20px;');
  chart.setAttribute('data', JSON.stringify(data));
  chart.toggleAttribute('hide-legends', hideLegends);
  container.appendChild(chart);

  const hideLegendsControl = createSwitchField(
    'Hide legends',
    'horizontal-bar-hide-legends',
    hideLegends,
    nextChecked => {
      hideLegends = nextChecked;
      hideLegendsControl.setValue(nextChecked);
      chart.hideLegends = nextChecked;
      chart.toggleAttribute('hide-legends', nextChecked);
    },
  );
  controls.appendChild(hideLegendsControl.element);

  return container;
};

export const HideTooltip: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let hideTooltip = true;

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart hide tooltip example');
  chart.setAttribute('style', 'width:100%;margin-top:20px;');
  chart.setAttribute('data', JSON.stringify(data));
  chart.toggleAttribute('hide-tooltip', hideTooltip);
  container.appendChild(chart);

  const hideTooltipControl = createSwitchField(
    'Hide tooltip',
    'horizontal-bar-hide-tooltip',
    hideTooltip,
    nextChecked => {
      hideTooltip = nextChecked;
      hideTooltipControl.setValue(nextChecked);
      chart.hideTooltip = nextChecked;
      chart.toggleAttribute('hide-tooltip', nextChecked);
    },
  );
  controls.appendChild(hideTooltipControl.element);

  return container;
};

export const LegendListLabel: Story<FluentHorizontalBarChart> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChart>
>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart legend list label example"
    legend-list-label="Chart legend"
    data="${JSON.stringify(data)}"
  >
  </fluent-horizontal-bar-chart>
`);

export const Culture: Story<FluentHorizontalBarChart> = renderComponent(html<StoryArgs<FluentHorizontalBarChart>>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart culture example (de-DE)"
    culture="de-DE"
    data="${JSON.stringify(data)}"
  >
  </fluent-horizontal-bar-chart>
`);

export const MultipleLegendSelection: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let allowMultiple = true;

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart multiple legend selection example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('style', 'width:100%;margin-top:20px;');
  chart.allowMultipleLegendSelection = allowMultiple;
  chart.toggleAttribute('allow-multiple-legend-selection', allowMultiple);
  container.appendChild(chart);

  const multipleControl = createSwitchField(
    'Allow multiple legend selection',
    'horizontal-bar-multiple-legend',
    allowMultiple,
    nextChecked => {
      allowMultiple = nextChecked;
      multipleControl.setValue(nextChecked);
      chart.allowMultipleLegendSelection = nextChecked;
      chart.toggleAttribute('allow-multiple-legend-selection', nextChecked);
    },
  );
  controls.appendChild(multipleControl.element);

  return container;
};

export const Gradient: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let enableGradient = true;

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart gradient example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('style', 'width:100%;margin-top:20px;');
  chart.enableGradient = enableGradient;
  chart.toggleAttribute('enable-gradient', enableGradient);
  container.appendChild(chart);

  const gradientControl = createSwitchField(
    'Enable gradient',
    'horizontal-bar-enable-gradient',
    enableGradient,
    nextChecked => {
      enableGradient = nextChecked;
      gradientControl.setValue(nextChecked);
      chart.enableGradient = nextChecked;
      chart.toggleAttribute('enable-gradient', nextChecked);
    },
  );
  controls.appendChild(gradientControl.element);

  return container;
};
