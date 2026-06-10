import { html } from '@microsoft/fast-element';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  renderComponent,
} from '../helpers.stories.js';
import { DataVizPalette, getColorFromToken } from '../utils/chart-helpers.js';
import { HeatMapChart as FluentHeatMapChart } from './heat-map-chart.js';
import type { HeatMapChartData } from './heat-map-chart.options.js';

// ── Sample data ───────────────────────────────────────────────────────────────

const yPoints = ['Ohio', 'Alaskaaaaaaaaaaaaaaaaaaa', 'Texas', 'DC', 'NYC'];

const xPoints: Date[] = [
  new Date('2020-03-03'),
  new Date('2020-03-04'),
  new Date('2020-03-05'),
  new Date('2020-03-06'),
  new Date('2020-03-07'),
  new Date('2020-03-08'),
  new Date('2020-03-09'),
];

const airQualityData: HeatMapChartData[] = [
  {
    value: 100,
    legend: 'Excellent (0-200)',
    data: [
      {
        x: xPoints[2],
        y: yPoints[2],
        value: 46,
        rectText: 46,
        ratio: [46, 2391],
        descriptionMessage: 'air quality seems to be excellent today',
      },
    ],
  },
  {
    value: 250,
    legend: 'Good (201-300)',
    data: [
      {
        x: xPoints[0],
        y: yPoints[1],
        value: 265,
        rectText: 265,
        ratio: [265, 2479],
        descriptionMessage: 'today we have good air quality in Alaska',
      },
      {
        x: xPoints[1],
        y: yPoints[0],
        value: 310,
        rectText: 310,
        ratio: [310, 2043],
        descriptionMessage: 'a sudden rise of 150 units in Ohio today',
      },
      {
        x: xPoints[2],
        y: yPoints[0],
        value: 320,
        rectText: 320,
        ratio: [320, 2043],
        descriptionMessage: 'air quality seems to have decreased by only 15 units from yesterday',
      },
      {
        x: xPoints[6],
        y: yPoints[2],
        value: 300,
        rectText: 300,
        ratio: [300, 2391],
        descriptionMessage: 'air comes to control a little bit more than yesterday',
      },
      {
        x: xPoints[0],
        y: yPoints[3],
        value: 290,
        rectText: 290,
        ratio: [290, 2462],
        descriptionMessage: '1st day in the week, DC witnesses good air quality',
      },
      {
        x: xPoints[4],
        y: yPoints[4],
        value: 280,
        rectText: 280,
        ratio: [280, 2486],
        descriptionMessage: `Air quality index decreases by exactly 300 units,
            giving the people of NYC good hope`,
      },
      {
        x: xPoints[5],
        y: yPoints[3],
        value: 300,
        rectText: 300,
        ratio: [300, 2462],
        descriptionMessage: '60 units decreased from yesterday.',
      },
    ],
  },
  {
    value: 350,
    legend: 'Medium (301-400)',
    data: [
      {
        x: xPoints[1],
        y: yPoints[1],
        value: 345,
        rectText: 345,
        ratio: [345, 2479],
        descriptionMessage: 'Alaska has just reported nearly 100 units hike in air quality',
      },
      {
        x: xPoints[6],
        y: yPoints[1],
        value: 325,
        rectText: 325,
        ratio: [325, 2479],
        descriptionMessage: 'Alaska to 300',
      },
      {
        x: xPoints[5],
        y: yPoints[2],
        value: 390,
        rectText: 390,
        ratio: [390, 2391],
        descriptionMessage: 'air comes to control a little bit',
      },
      {
        x: xPoints[1],
        y: yPoints[3],
        value: 385,
        rectText: 385,
        ratio: [385, 2462],
        descriptionMessage: 'Washington DC witnesses a hike of nearly 100 units in air quality',
      },
      {
        x: xPoints[4],
        y: yPoints[3],
        value: 360,
        rectText: 360,
        ratio: [360, 2462],
        descriptionMessage: 'a 200% hike in the air quality index',
      },
      {
        x: xPoints[1],
        y: yPoints[2],
        value: 400,
        rectText: 400,
        ratio: [400, 2391],
        descriptionMessage: 'a sudden spike in the badness of the air quality',
      },
      {
        x: xPoints[3],
        y: yPoints[0],
        value: 400,
        rectText: 400,
        ratio: [400, 2043],
        descriptionMessage: 'situation got worse in air quality due to industrial smoke',
      },
    ],
  },
  {
    value: 450,
    legend: 'Danger (401-500)',
    data: [
      {
        x: xPoints[4],
        y: yPoints[0],
        value: 423,
        rectText: 423,
        ratio: [423, 2043],
        descriptionMessage: 'we can see an increase of 23 units',
      },
      {
        x: xPoints[2],
        y: yPoints[1],
        value: 463,
        rectText: 463,
        ratio: [463, 2479],
        descriptionMessage: 'day by day, situation is getting worse in Alaska',
      },
      {
        x: xPoints[3],
        y: yPoints[2],
        value: 480,
        rectText: 480,
        ratio: [480, 2391],
        descriptionMessage: 'same story, today also air quality decreases. a bad day in Texas',
      },
      {
        x: xPoints[2],
        y: yPoints[3],
        value: 491,
        rectText: 491,
        ratio: [491, 2462],
        descriptionMessage: 'Day by day, 100 units are increasing in air quality',
      },
      {
        x: xPoints[1],
        y: yPoints[4],
        value: 433,
        rectText: 433,
        ratio: [433, 2486],
        descriptionMessage: `They say good things stay for a short time, today
            this saying became reality. New York has witnessed nearly 300% bad air quality`,
      },
      {
        x: xPoints[5],
        y: yPoints[4],
        value: 473,
        rectText: 473,
        ratio: [473, 2486],
        descriptionMessage: `Today is the same fate as the 2nd day. still, air quality
            stays above 400`,
      },
    ],
  },
  {
    value: 550,
    legend: 'Very Danger (501-600)',
    data: [
      {
        x: xPoints[5],
        y: yPoints[0],
        value: 600,
        rectText: 600,
        ratio: [600, 2043],
        descriptionMessage: 'looks like god has cursed us with poisonous air. worst air quality index',
      },
      {
        x: xPoints[5],
        y: yPoints[1],
        value: 536,
        rectText: 536,
        ratio: [536, 2479],
        descriptionMessage: `shh!, all the hopes were washed away in the rain yesterday,
            with another hike of 400% in air quality`,
      },
      {
        x: xPoints[3],
        y: yPoints[1],
        value: 520,
        rectText: 520,
        ratio: [520, 2479],
        descriptionMessage: 'Alaska planning to build air purifier to control the air quality',
      },
      {
        x: xPoints[4],
        y: yPoints[2],
        value: 525,
        rectText: 525,
        ratio: [525, 2391],
        descriptionMessage: 'air worsens badly today due to farmers burning the harvest',
      },
      {
        x: xPoints[6],
        y: yPoints[3],
        value: 560,
        rectText: 560,
        ratio: [560, 2462],
        descriptionMessage: `Due to industrial pollution and the
            burning of harvest, it resulted in bad air quality in Washington DC`,
      },
      {
        x: xPoints[3],
        y: yPoints[4],
        value: 580,
        rectText: 580,
        ratio: [580, 2486],
        descriptionMessage: `Air quality index is becoming worse day by day, leaving the
            people of NYC in very bad medical conditions.`,
      },
      {
        x: xPoints[6],
        y: yPoints[4],
        value: 590,
        rectText: 590,
        ratio: [590, 2486],
        descriptionMessage: `finally, the weekend ends with very bad air quality in New York City`,
      },
    ],
  },
];

const domainValues = [0, 200, 400, 600];
const rangeColors = [
  getColorFromToken(DataVizPalette.color5),
  getColorFromToken(DataVizPalette.color6),
  getColorFromToken(DataVizPalette.color3),
  getColorFromToken(DataVizPalette.color10),
];

// Simple string-axis data
const stringData: HeatMapChartData[] = [
  {
    value: 20,
    legend: 'Low',
    data: [
      { x: 'Mon', y: 'Team A', value: 12, rectText: 12 },
      { x: 'Tue', y: 'Team C', value: 18, rectText: 18 },
    ],
  },
  {
    value: 50,
    legend: 'Medium',
    data: [
      { x: 'Mon', y: 'Team B', value: 45, rectText: 45 },
      { x: 'Wed', y: 'Team A', value: 52, rectText: 52 },
      { x: 'Thu', y: 'Team C', value: 49, rectText: 49 },
    ],
  },
  {
    value: 80,
    legend: 'High',
    data: [
      { x: 'Tue', y: 'Team A', value: 78, rectText: 78 },
      { x: 'Wed', y: 'Team B', value: 82, rectText: 82 },
      { x: 'Thu', y: 'Team B', value: 91, rectText: 91 },
      { x: 'Fri', y: 'Team C', value: 86, rectText: 86 },
    ],
  },
];

// ── Story metadata ────────────────────────────────────────────────────────────

export default {
  title: 'Components/HeatMapChart',
  component: FluentHeatMapChart,
} as Meta<FluentHeatMapChart>;

// ── Basic story (mirrors React HeatMapChartBasic) ─────────────────────────────

export const Basic: Story<FluentHeatMapChart> = renderComponent(html<StoryArgs<FluentHeatMapChart>>`
  <div style="padding-bottom: 120px;">
    <fluent-heat-map-chart
      width="450"
      height="378"
      allow-multiple-legend-selection
      chart-title="Heat map explaining the Air Quality Index"
      data="${JSON.stringify(airQualityData)}"
      domain-values-for-color-scale="${JSON.stringify(domainValues)}"
      range-values-for-color-scale="${JSON.stringify(rangeColors)}"
      y-axis-tick-label-max-width="64"
      sort-order="none"
    ></fluent-heat-map-chart>
  </div>
`);
Basic.parameters = { docs: { story: { height: '500px' } } };

export const StandardAttributes: Story<FluentHeatMapChart> = () => {
  const container = document.createElement('div');

  let width = 450;
  let height = 378;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-heat-map-chart') as FluentHeatMapChart;
  chart.setAttribute('chart-title', 'Heat map explaining the Air Quality Index');
  chart.setAttribute('data', JSON.stringify(airQualityData));
  chart.setAttribute('domain-values-for-color-scale', JSON.stringify(domainValues));
  chart.setAttribute('range-values-for-color-scale', JSON.stringify(rangeColors));
  chart.setAttribute('sort-order', 'none');
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'hmc-sa-width', width, 200, 800, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'hmc-sa-height', height, 200, 600, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'hmc-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'hmc-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'hmc-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'hmc-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '580px' } } };

export const StringAxis: Story<FluentHeatMapChart> = renderComponent(html<StoryArgs<FluentHeatMapChart>>`
  <fluent-heat-map-chart
    chart-title="Heat map - string axis"
    data="${JSON.stringify(stringData)}"
    domain-values-for-color-scale="${JSON.stringify([0, 50, 100])}"
    range-values-for-color-scale="${JSON.stringify(['#d4e8ff', '#0078d4', '#003a78'])}"
  ></fluent-heat-map-chart>
`);

// ── Axis titles ───────────────────────────────────────────────────────────────

StringAxis.parameters = { docs: { story: { height: '500px' } } };
export const WithAxisTitles: Story<FluentHeatMapChart> = renderComponent(html<StoryArgs<FluentHeatMapChart>>`
  <fluent-heat-map-chart
    chart-title="Air quality index by region and date"
    data="${JSON.stringify(airQualityData)}"
    domain-values-for-color-scale="${JSON.stringify(domainValues)}"
    range-values-for-color-scale="${JSON.stringify(rangeColors)}"
    x-axis-title="Date"
    y-axis-title="Region"
  ></fluent-heat-map-chart>
`);

// ── Hide legends ──────────────────────────────────────────────────────────────

WithAxisTitles.parameters = { docs: { story: { height: '500px' } } };
export const HideLegends: Story<FluentHeatMapChart> = renderComponent(html<StoryArgs<FluentHeatMapChart>>`
  <fluent-heat-map-chart
    chart-title="Heat map - hidden legends"
    data="${JSON.stringify(airQualityData)}"
    domain-values-for-color-scale="${JSON.stringify(domainValues)}"
    range-values-for-color-scale="${JSON.stringify(rangeColors)}"
    hide-legends
  ></fluent-heat-map-chart>
`);

// ── Hide tooltip ──────────────────────────────────────────────────────────────

HideLegends.parameters = { docs: { story: { height: '500px' } } };
export const HideTooltip: Story<FluentHeatMapChart> = renderComponent(html<StoryArgs<FluentHeatMapChart>>`
  <fluent-heat-map-chart
    chart-title="Heat map - no tooltip"
    data="${JSON.stringify(airQualityData)}"
    domain-values-for-color-scale="${JSON.stringify(domainValues)}"
    range-values-for-color-scale="${JSON.stringify(rangeColors)}"
    hide-tooltip
  ></fluent-heat-map-chart>
`);

// ── Sort order: none ──────────────────────────────────────────────────────────

HideTooltip.parameters = { docs: { story: { height: '500px' } } };
export const SortOrderNone: Story<FluentHeatMapChart> = renderComponent(html<StoryArgs<FluentHeatMapChart>>`
  <fluent-heat-map-chart
    chart-title="Heat map - no sort order"
    data="${JSON.stringify(stringData)}"
    domain-values-for-color-scale="${JSON.stringify([0, 50, 100])}"
    range-values-for-color-scale="${JSON.stringify(['#d4e8ff', '#0078d4', '#003a78'])}"
    sort-order="none"
  ></fluent-heat-map-chart>
`);

// ── Custom date format ────────────────────────────────────────────────────────

SortOrderNone.parameters = { docs: { story: { height: '500px' } } };
export const CustomDateFormat: Story<FluentHeatMapChart> = renderComponent(html<StoryArgs<FluentHeatMapChart>>`
  <fluent-heat-map-chart
    chart-title="Heat map - custom date format"
    data="${JSON.stringify(airQualityData)}"
    domain-values-for-color-scale="${JSON.stringify(domainValues)}"
    range-values-for-color-scale="${JSON.stringify(rangeColors)}"
    x-axis-date-format-string="%m/%d"
  ></fluent-heat-map-chart>
`);

// ── Sizing controls ───────────────────────────────────────────────────────────

CustomDateFormat.parameters = { docs: { story: { height: '500px' } } };
export const Sizing: Story<FluentHeatMapChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);
  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chartHost);

  let width = 640;
  let height = 420;

  const renderChart = () => {
    const chart = document.createElement('fluent-heat-map-chart') as FluentHeatMapChart;
    chart.setAttribute('chart-title', 'Heat map - sizing example');
    chart.setAttribute('data', JSON.stringify(airQualityData));
    chart.setAttribute('domain-values-for-color-scale', JSON.stringify(domainValues));
    chart.setAttribute('range-values-for-color-scale', JSON.stringify(rangeColors));
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);
    chartHost.replaceChildren(chart);
  };

  const widthControl = createSliderField('Width', 'hm-width', width, 300, 1000, next => {
    width = next;
    widthControl.setValue(next);
    renderChart();
  });
  controls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'hm-height', height, 200, 800, next => {
    height = next;
    heightControl.setValue(next);
    renderChart();
  });
  controls.appendChild(heightControl.element);

  renderChart();
  return container;
};
Sizing.parameters = { docs: { story: { height: '560px' } } };

// ── Legend selection toggle ───────────────────────────────────────────────────

export const LegendToggle: Story<FluentHeatMapChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);
  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chartHost);

  const chart = document.createElement('fluent-heat-map-chart') as FluentHeatMapChart;
  chart.setAttribute('chart-title', 'Heat map - legend toggle example');
  chart.setAttribute('data', JSON.stringify(airQualityData));
  chart.setAttribute('domain-values-for-color-scale', JSON.stringify(domainValues));
  chart.setAttribute('range-values-for-color-scale', JSON.stringify(rangeColors));
  chart.setAttribute('allow-multiple-legend-selection', '');
  chartHost.appendChild(chart);

  const switchControl = createSwitchField('Allow multiple legend selection', 'hm-multi-legend', true, next => {
    chart.toggleAttribute('allow-multiple-legend-selection', next);
    switchControl.setValue(next);
  });
  controls.appendChild(switchControl.element);

  return container;
};
LegendToggle.parameters = { docs: { story: { height: '560px' } } };

const xAxisStringLabels = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
};

const yAxisStringLabels = {
  'Team A': 'Alpha team',
  'Team B': 'Bravo team',
  'Team C': 'Charlie team',
};

const categoryOrderData: HeatMapChartData[] = [
  {
    value: 50,
    legend: 'Usage',
    data: [
      { x: 'Banana', y: 'Team A', value: 40, rectText: 40 },
      { x: 'Apple', y: 'Team A', value: 55, rectText: 55 },
      { x: 'Cherry', y: 'Team A', value: 70, rectText: 70 },
    ],
  },
];

export const StringLabels: Story<FluentHeatMapChart> = renderComponent(html<StoryArgs<FluentHeatMapChart>>`
  <fluent-heat-map-chart
    chart-title="Heat map - string label overrides"
    data="${JSON.stringify(stringData)}"
    domain-values-for-color-scale="${JSON.stringify([0, 50, 100])}"
    range-values-for-color-scale="${JSON.stringify(['#d4e8ff', '#0078d4', '#003a78'])}"
    x-axis-string-labels="${JSON.stringify(xAxisStringLabels)}"
    y-axis-string-labels="${JSON.stringify(yAxisStringLabels)}"
  ></fluent-heat-map-chart>
`);

StringLabels.parameters = { docs: { story: { height: '500px' } } };
export const CategoryOrder: Story<FluentHeatMapChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const orderOptions = ['alphabetical', 'alphabetical-desc', 'none', 'default'] as const;
  type CategoryOrderControlValue = (typeof orderOptions)[number];

  const normalizeOrder = (value: CategoryOrderControlValue) => {
    if (value === 'alphabetical-desc') {
      return 'category descending';
    }
    return value;
  };

  let currentOrder: CategoryOrderControlValue = 'alphabetical';

  const chart = document.createElement('fluent-heat-map-chart') as FluentHeatMapChart;
  chart.setAttribute('chart-title', 'Heat map - x-axis category order');
  chart.setAttribute('data', JSON.stringify(categoryOrderData));
  chart.setAttribute('domain-values-for-color-scale', JSON.stringify([0, 50, 100]));
  chart.setAttribute('range-values-for-color-scale', JSON.stringify(['#d4e8ff', '#0078d4', '#003a78']));
  chart.setAttribute('sort-order', 'none');
  chart.setAttribute('x-axis-category-order', normalizeOrder(currentOrder));
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const orderControl = createDropdownField(
    'X-axis category order',
    'heat-map-x-axis-category-order',
    [...orderOptions],
    currentOrder,
    nextValue => {
      currentOrder = nextValue as CategoryOrderControlValue;
      chart.setAttribute('x-axis-category-order', normalizeOrder(currentOrder));
    },
  );
  controls.appendChild(orderControl.element);

  return container;
};
CategoryOrder.parameters = { docs: { story: { height: '420px' } } };

export const Culture: Story<FluentHeatMapChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-heat-map-chart') as FluentHeatMapChart;
  chart.setAttribute('chart-title', `Heat map chart culture example (${currentCulture})`);
  chart.setAttribute('data', JSON.stringify(airQualityData));
  chart.setAttribute('domain-values-for-color-scale', JSON.stringify(domainValues));
  chart.setAttribute('range-values-for-color-scale', JSON.stringify(rangeColors));
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'hm-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.setAttribute('chart-title', `Heat map chart culture example (${currentCulture})`);
  });
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '560px' } } };

export const TitleAlign: Story<FluentHeatMapChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const alignments = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof alignments)[number] = 'start';

  const chart = document.createElement('fluent-heat-map-chart') as FluentHeatMapChart;
  chart.setAttribute('chart-title', 'Heat map title alignment example');
  chart.setAttribute('data', JSON.stringify(airQualityData));
  chart.setAttribute('domain-values-for-color-scale', JSON.stringify(domainValues));
  chart.setAttribute('range-values-for-color-scale', JSON.stringify(rangeColors));
  chart.setAttribute('title-align', currentAlign);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const alignControl = createDropdownField(
    'Title align',
    'hm-title-align',
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
TitleAlign.parameters = { docs: { story: { height: '560px' } } };

export const TitleAndLegendPositions: Story<FluentHeatMapChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const positions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentPosition: (typeof positions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-heat-map-chart') as FluentHeatMapChart;
  chart.setAttribute('chart-title', 'Title and legend position example');
  chart.setAttribute('data', JSON.stringify(airQualityData));
  chart.setAttribute('domain-values-for-color-scale', JSON.stringify(domainValues));
  chart.setAttribute('range-values-for-color-scale', JSON.stringify(rangeColors));
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const posControl = createDropdownField(
    'Legend position',
    'hm-legend-position',
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
    'hm-title-position',
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
TitleAndLegendPositions.parameters = { docs: { story: { height: '560px' } } };

// ── RTL ───────────────────────────────────────────────────────────────────────

export const RTL: Story<FluentHeatMapChart> = renderComponent(html<StoryArgs<FluentHeatMapChart>>`
  <div dir="rtl">
    <fluent-heat-map-chart
      chart-title="Heat map chart RTL example"
      data="${JSON.stringify(airQualityData)}"
      domain-values-for-color-scale="${JSON.stringify(domainValues)}"
      range-values-for-color-scale="${JSON.stringify(rangeColors)}"
    ></fluent-heat-map-chart>
  </div>
`);
RTL.parameters = { docs: { story: { height: '500px' } } };
