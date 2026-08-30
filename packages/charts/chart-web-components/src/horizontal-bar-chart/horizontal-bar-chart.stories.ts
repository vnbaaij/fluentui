import { html } from '@microsoft/fast-element';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  renderComponent,
} from '../helpers.stories.js';
import { HorizontalBarChart as FluentHorizontalBarChart } from './horizontal-bar-chart.js';
import type { HorizontalBarChartDataPoint, HorizontalBarChartProps } from './horizontal-bar-chart.options.js';
import { DataVizPalette } from '../utils/chart-helpers.js';

const singleBarHBCData = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 1543,
        total: 15000,
        color: DataVizPalette.color1,
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
        color: DataVizPalette.color2,
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
        color: DataVizPalette.color3,
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
        color: DataVizPalette.color4,
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
        color: DataVizPalette.color5,
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
        color: DataVizPalette.color6,
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
        color: DataVizPalette.color7,
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
        color: DataVizPalette.color8,
      },
    ],
  },
];

const singleBarNMVariantData: HorizontalBarChartProps[] = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 1543,
        total: 15000,
        color: DataVizPalette.color1,
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
        color: DataVizPalette.color2,
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
        color: DataVizPalette.color3,
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
        color: DataVizPalette.color4,
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
        color: DataVizPalette.color5,
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
        color: DataVizPalette.color6,
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
        color: DataVizPalette.color7,
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
        color: DataVizPalette.color8,
      },
    ],
    chartDataText: '4.3k/15k hours',
  },
];

const chartPoints1: HorizontalBarChartDataPoint[] = [
  {
    legend: 'Debit card numbers (EU and USA)',
    data: 40,
    color: DataVizPalette.color1,
  },
  {
    legend: 'Passport numbers (USA)',
    data: 23,
    color: DataVizPalette.color2,
  },
  {
    legend: 'Social security numbers',
    data: 35,
    color: DataVizPalette.color3,
  },
  {
    legend: 'Credit card Numbers',
    data: 87,
    color: DataVizPalette.color10,
  },
  {
    legend: 'Tax identification numbers (USA)',
    data: 87,
    color: DataVizPalette.color4,
  },
];

const chartPoints2: HorizontalBarChartDataPoint[] = [
  {
    legend: 'Debit card numbers (EU and USA)',
    data: 40,
    color: DataVizPalette.color1,
  },
  {
    legend: 'Passport numbers (USA)',
    data: 56,
    color: DataVizPalette.color2,
  },
  {
    legend: 'Social security numbers',
    data: 35,
    color: DataVizPalette.color3,
  },
  {
    legend: 'Credit card Numbers',
    data: 92,
    color: DataVizPalette.color10,
  },
  {
    legend: 'Tax identification numbers (USA)',
    data: 87,
    color: DataVizPalette.color4,
  },
];

const chartPoints3: HorizontalBarChartDataPoint[] = [
  {
    legend: 'Phone Numbers',
    data: 40,
    color: DataVizPalette.color9,
  },
  {
    legend: 'Credit card Numbers',
    data: 23,
    color: DataVizPalette.color10,
  },
];

const data: HorizontalBarChartProps[] = [
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
        gradient: [DataVizPalette.color1, DataVizPalette.color2],
      },
    ],
  },
];

const benchmarkData: HorizontalBarChartProps[] = [
  {
    chartSeriesTitle: 'one',
    chartData: [
      {
        legend: 'one',
        data: 10,
        total: 100,
        color: DataVizPalette.color1,
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
        color: DataVizPalette.color2,
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
        color: DataVizPalette.color3,
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
Basic.parameters = { docs: { story: { height: '440px' } } };

export const StandardAttributes: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');

  let width = 720;
  let height = 320;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart basic example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', `width:${width}px;height:${height}px;margin-top:20px;`);

  const widthControl = createSliderField('Width', 'hbc-sa-width', width, 320, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
    chart.setAttribute('style', `width:${nextValue}px;height:${height}px;margin-top:20px;`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'hbc-sa-height', height, 220, 640, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
    chart.setAttribute('style', `width:${width}px;height:${nextValue}px;margin-top:20px;`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'hbc-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'hbc-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'hbc-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Rounded Corners', 'hbc-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'hbc-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '500px' } } };

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
Sizing.parameters = { docs: { story: { height: '460px' } } };

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

singleDataPoint.parameters = { docs: { story: { height: '280px' } } };
export const Benchmark: Story<FluentHorizontalBarChart> = renderComponent(html<StoryArgs<FluentHorizontalBarChart>>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart benchmark example"
    variant="single-bar"
    data="${JSON.stringify(benchmarkData)}"
  >
  </fluent-horizontal-bar-chart>
`);

Benchmark.parameters = { docs: { story: { height: '280px' } } };
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

singleBarNMVariant.parameters = { docs: { story: { height: '280px' } } };
export const singleBarHBC: Story<FluentHorizontalBarChart> = renderComponent(html<StoryArgs<FluentHorizontalBarChart>>`
  <div>
    <fluent-horizontal-bar-chart
      style="width: 100%"
      chart-title="Horizontal bar chart absolute scale example"
      data="${JSON.stringify(singleBarHBCData)}"
      variant="${'absolute-scale'}"
    >
    </fluent-horizontal-bar-chart>
  </div>
`);

singleBarHBC.parameters = { docs: { story: { height: '280px' } } };
export const HideLabels: Story<FluentHorizontalBarChart> = renderComponent(html<StoryArgs<FluentHorizontalBarChart>>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart hide labels example"
    hide-labels
    data="${JSON.stringify(data)}"
  >
  </fluent-horizontal-bar-chart>
`);

HideLabels.parameters = { docs: { story: { height: '440px' } } };
export const RoundedCorners: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let roundCorners = false;

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart rounded corners example');
  chart.setAttribute('variant', 'absolute-scale');
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
RoundedCorners.parameters = { docs: { story: { height: '520px' } } };

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

ChartDataModeFraction.parameters = { docs: { story: { height: '440px' } } };
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

ChartDataModePercentage.parameters = { docs: { story: { height: '440px' } } };
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

HideRatio.parameters = { docs: { story: { height: '440px' } } };
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
HideLegends.parameters = { docs: { story: { height: '420px' } } };

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
HideTooltip.parameters = { docs: { story: { height: '420px' } } };

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

LegendListLabel.parameters = { docs: { story: { height: '440px' } } };
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
MultipleLegendSelection.parameters = { docs: { story: { height: '420px' } } };

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
Gradient.parameters = { docs: { story: { height: '420px' } } };

export const ChartDataModeInteractive: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let chartDataMode: 'default' | 'fraction' | 'percentage' = 'default';

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart data mode example');
  chart.setAttribute('variant', 'single-bar');
  chart.setAttribute('data', JSON.stringify(singleBarHBCData));
  chart.setAttribute('style', 'width:100%;margin-top:20px;');
  chart.setAttribute('chart-data-mode', chartDataMode);
  container.appendChild(chart);

  const dataModeControl = createDropdownField(
    'Chart data mode',
    'hbc-chart-data-mode',
    ['default', 'fraction', 'percentage'],
    chartDataMode,
    nextMode => {
      chartDataMode = nextMode as 'default' | 'fraction' | 'percentage';
      chart.chartDataMode = chartDataMode;
      chart.setAttribute('chart-data-mode', chartDataMode);
    },
  );
  controls.appendChild(dataModeControl.element);

  return container;
};
ChartDataModeInteractive.parameters = { docs: { story: { height: '500px' } } };

export const BarHeight: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let barHeight = 12;

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart bar height example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('style', 'width:100%;margin-top:20px;');
  chart.barHeight = barHeight;
  chart.setAttribute('bar-height', `${barHeight}`);
  container.appendChild(chart);

  const barHeightControl = createSliderField('Bar height', 'horizontal-bar-bar-height', barHeight, 4, 40, nextValue => {
    barHeight = nextValue;
    barHeightControl.setValue(nextValue);
    chart.barHeight = nextValue;
    chart.setAttribute('bar-height', `${nextValue}`);
  });
  controls.appendChild(barHeightControl.element);

  return container;
};
BarHeight.parameters = { docs: { story: { height: '420px' } } };

export const TooltipRendererStory: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a bar — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.data = data;
  chart.tooltipRenderer = (point, defaultRender) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding:8px;border-left:3px solid #637cef;background:#f3f6ff;';
    wrapper.innerHTML = `<strong>${(point as any).legend ?? ''}</strong><br>${defaultRender(point)}`;
    return wrapper;
  };

  container.appendChild(chart);
  return container;
};
TooltipRendererStory.storyName = 'Tooltip Renderer';
TooltipRendererStory.parameters = { docs: { story: { height: '380px' } } };

const hideRatioPerBarData: HorizontalBarChartProps[] = [
  {
    chartSeriesTitle: 'Quarter 1',
    chartData: [
      { legend: 'Completed', data: 32, color: DataVizPalette.color1 },
      { legend: 'Remaining', data: 68, color: DataVizPalette.color2 },
    ],
  },
  {
    chartSeriesTitle: 'Quarter 2',
    chartData: [
      { legend: 'Completed', data: 54, color: DataVizPalette.color1 },
      { legend: 'Remaining', data: 46, color: DataVizPalette.color2 },
    ],
  },
  {
    chartSeriesTitle: 'Quarter 3',
    chartData: [
      { legend: 'Completed', data: 71, color: DataVizPalette.color1 },
      { legend: 'Remaining', data: 29, color: DataVizPalette.color2 },
    ],
  },
];

export const HideRatioPerBar: Story<FluentHorizontalBarChart> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChart>
>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart hide ratio per bar example"
    hide-ratio-per-bar="[true,false,false]"
    data="${JSON.stringify(hideRatioPerBarData)}"
  >
  </fluent-horizontal-bar-chart>
`);

const singlePointLegendData: HorizontalBarChartProps[] = [
  {
    chartSeriesTitle: 'Servers',
    chartData: [{ legend: 'Servers', data: 32, total: 100, color: DataVizPalette.color1 }],
  },
  {
    chartSeriesTitle: 'Storage',
    chartData: [{ legend: 'Storage', data: 48, total: 100, color: DataVizPalette.color2 }],
  },
  {
    chartSeriesTitle: 'Network',
    chartData: [{ legend: 'Network', data: 20, total: 100, color: DataVizPalette.color3 }],
  },
];

HideRatioPerBar.parameters = { docs: { story: { height: '440px' } } };
export const LegendForSinglePointBar: Story<FluentHorizontalBarChart> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChart>
>`
  <fluent-horizontal-bar-chart
    style="width: 100%"
    chart-title="Horizontal bar chart single point legend example"
    show-legend-for-single-point-bar
    data="${JSON.stringify(singlePointLegendData)}"
  >
  </fluent-horizontal-bar-chart>
`);

LegendForSinglePointBar.parameters = { docs: { story: { height: '440px' } } };
export const Culture: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', `Horizontal bar chart culture example (${currentCulture})`);
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('style', 'width:100%;margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'hbc-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.setAttribute('chart-title', `Horizontal bar chart culture example (${currentCulture})`);
  });
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '440px' } } };

export const TitleAlign: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const alignments = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof alignments)[number] = 'start';

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Horizontal bar chart title alignment example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('title-align', currentAlign);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const alignControl = createDropdownField(
    'Title align',
    'hbc-title-align',
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

export const TitleAndLegendPositions: Story<FluentHorizontalBarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const positions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentPosition: (typeof positions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-horizontal-bar-chart') as FluentHorizontalBarChart;
  chart.setAttribute('chart-title', 'Title and legend position example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const posControl = createDropdownField(
    'Legend position',
    'hbc-legend-position',
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
    'hbc-title-position',
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
RTL.parameters = { docs: { story: { height: '440px' } } };
