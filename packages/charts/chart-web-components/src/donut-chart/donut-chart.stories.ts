import { html } from '@microsoft/fast-element';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import { renderComponent } from '../helpers.stories.js';
import { DonutChart as FluentDonutChart } from './donut-chart.js';
import type { ChartDataPoint, ChartProps } from './donut-chart.options.js';

const points: ChartDataPoint[] = [
  {
    legend: 'first',
    data: 20000,
  },
  {
    legend: 'second',
    data: 39000,
  },
];

const data: ChartProps = {
  chartTitle: 'Donut chart basic example',
  chartData: points,
};

const sortedPoints: ChartDataPoint[] = [
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

const sortedData: ChartProps = {
  chartTitle: 'Sorted donut chart example',
  chartData: sortedPoints,
};

const storyTemplate = html<StoryArgs<FluentDonutChart>>`
  <fluent-donut-chart data="${JSON.stringify(data)}" value-inside-donut="39,000" inner-radius="55">
  </fluent-donut-chart>
`;

export default {
  title: 'Components/DonutChart',
} as Meta<FluentDonutChart>;

export const RTL: Story<FluentDonutChart> = renderComponent(html<StoryArgs<FluentDonutChart>>`
  <div dir="rtl">
    <fluent-donut-chart data="${JSON.stringify(data)}" value-inside-donut="39,000" inner-radius="55">
    </fluent-donut-chart>
  </div>
`);

export const Basic: Story<FluentDonutChart> = renderComponent(storyTemplate).bind({});

export const HideLabels: Story<FluentDonutChart> = renderComponent(html<StoryArgs<FluentDonutChart>>`
  <fluent-donut-chart data="${JSON.stringify(data)}" value-inside-donut="39,000" inner-radius="55" hide-labels>
  </fluent-donut-chart>
`);

export const ShowLabelsInPercent: Story<FluentDonutChart> = renderComponent(html<StoryArgs<FluentDonutChart>>`
  <fluent-donut-chart
    data="${JSON.stringify(data)}"
    value-inside-donut="39,000"
    inner-radius="55"
    show-labels-in-percent
  >
  </fluent-donut-chart>
`);

export const SortedOrder: Story<FluentDonutChart> = renderComponent(html<StoryArgs<FluentDonutChart>>`
  <fluent-donut-chart data="${JSON.stringify(sortedData)}" value-inside-donut="Total" inner-radius="55" order="sorted">
  </fluent-donut-chart>
`);
