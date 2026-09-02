import {
  controlsRowStyle,
  createDropdownField,
  createRadioGroupField,
  createSliderField,
  createSwitchField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import type { ChartAnnotation } from '../utils/chart-options.js';
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
  chart.setAttribute('y-axis-tick-label-max-width', '32');
  chart.setAttribute('y-min-value', '200');
  chart.setAttribute('y-max-value', '301');
  chart.setAttribute('line-stroke-width', '4');
  chart.setAttribute('line-border-width', '2');
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

export const ChartAttributes: Story<LineChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('x-axis-title', 'Values of each category');
  chart.setAttribute('y-axis-title', 'Different categories of mail flow');
  chart.setAttribute('y-min-value', '200');
  chart.setAttribute('y-max-value', '301');
  chart.setAttribute('line-stroke-width', '4');
  chart.setAttribute('line-border-width', '2');
  chart.setAttribute('use-utc', '');
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createSwitchField('Multiple shapes', 'line-multiple-shapes', false, checked => {
      chart.toggleAttribute('allow-multiple-shapes-for-points', checked);
    }).element,
  );
  controls.appendChild(
    createSwitchField('Show axis titles', 'line-show-axis-titles', true, checked => {
      if (checked) {
        chart.setAttribute('x-axis-title', 'Values of each category');
        chart.setAttribute('y-axis-title', 'Different categories of mail flow');
      } else {
        chart.removeAttribute('x-axis-title');
        chart.removeAttribute('y-axis-title');
      }
    }).element,
  );
  controls.appendChild(
    createSwitchField('Use UTC time', 'line-use-utc', true, checked => {
      chart.toggleAttribute('use-utc', checked);
    }).element,
  );
  controls.appendChild(
    createRadioGroupField(
      'Callout',
      'line-callout',
      [
        { label: 'Single Callout', value: 'single' },
        { label: 'Stack Callout', value: 'stack' },
      ],
      'single',
      value => chart.toggleAttribute('is-callout-for-stack', value === 'stack'),
    ).element,
  );

  container.appendChild(chart);
  return container;
};
ChartAttributes.parameters = { docs: { story: { height: '540px' } } };

const createLineStory = (id: string, data: LineChartSeries[], width = 700, height = 300, chartTitle = 'Line Chart') => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = data;
  chart.chartTitle = chartTitle;
  chart.setAttribute('width', String(width));
  chart.setAttribute('height', String(height));

  controls.appendChild(
    createSliderField('Width', `${id}-width`, width, 200, 1500, value => chart.setAttribute('width', String(value)))
      .element,
  );
  controls.appendChild(
    createSliderField('Height', `${id}-height`, height, 200, 1000, value => chart.setAttribute('height', String(value)))
      .element,
  );
  container.appendChild(chart);
  return { container, controls, chart };
};

const addMultipleShapesControl = (controls: HTMLElement, chart: LineChart, id: string, checked = false) => {
  controls.appendChild(
    createSwitchField('Multiple shapes', id, checked, enabled => {
      chart.toggleAttribute('allow-multiple-shapes-for-points', enabled);
    }).element,
  );
};

const placeSliderValuesAfterControls = (controls: HTMLElement, classPrefix = 'line-multiple') => {
  controls.querySelectorAll('fluent-field').forEach(field => {
    const slider = field.querySelector('fluent-slider');
    const value = field.querySelector<HTMLElement>('[slot="message"]');
    if (!slider || !value) {
      return;
    }

    const inputRow = document.createElement('div');
    inputRow.classList.add(`${classPrefix}-slider-input`);
    inputRow.slot = 'input';
    inputRow.setAttribute('style', 'display:flex;align-items:center;gap:8px;');
    const inlineValue = document.createElement('output');
    inlineValue.classList.add(`${classPrefix}-slider-value`);
    inlineValue.setAttribute('for', slider.id);
    inlineValue.setAttribute('style', 'min-width:4ch;font-variant-numeric:tabular-nums;');
    inlineValue.textContent = value.textContent;
    slider.addEventListener('change', () => {
      inlineValue.textContent = (slider as HTMLElement & { value: string }).value;
    });
    slider.removeAttribute('slot');
    value.remove();
    inputRow.append(slider, inlineValue);
    field.appendChild(inputRow);
  });
};

export const Multiple: Story<LineChart> = () => {
  const dates = Array.from({ length: 7 }, (_, index) => new Date(2018, index, 1));
  const names = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
    'Ninth',
    'Tenth',
    'Eleventh',
    'Twelfth',
  ];
  const data = names.map(
    (legend, seriesIndex): LineChartSeries => ({
      legend,
      color: `qualitative.${(seriesIndex % 10) + 1}`,
      lineOptions: { lineBorderWidth: 2 },
      data: dates.map((x, pointIndex) => ({
        x,
        y: 10 + seriesIndex * 20 + (pointIndex % 2) * 20,
        xAxisCalloutData: x.toLocaleDateString(),
      })),
    }),
  );
  const { container, controls, chart } = createLineStory('line-multiple', data);
  container.setAttribute('style', 'display:flex;flex-direction:column;gap:16px;align-items:stretch;');
  controls.classList.add('line-multiple-size-controls');
  placeSliderValuesAfterControls(controls);
  chart.tickFormat = '%m/%d';
  chart.tickValues = dates;
  chart.colorFillBars = [
    {
      legend: 'Time range 1',
      color: 'color19',
      data: [{ startX: new Date('2018/01/06'), endX: new Date('2018/01/25') }],
    },
    {
      legend: 'Time range 2',
      color: 'color20',
      data: [
        { startX: new Date('2018/01/18'), endX: new Date('2018/02/20') },
        { startX: new Date('2018/04/17'), endX: new Date('2018/05/10') },
      ],
      applyPattern: true,
    },
  ];
  chart.allowMultipleShapesForPoints = true;
  chart.isCalloutForStack = true;
  chart.allowMultipleLegendSelection = true;

  const shapeControls = document.createElement('div');
  shapeControls.classList.add('line-multiple-shape-controls');
  shapeControls.setAttribute('style', controlsRowStyle);
  addMultipleShapesControl(shapeControls, chart, 'line-multiple-shapes', true);
  container.insertBefore(shapeControls, chart);

  const calloutControls = document.createElement('div');
  calloutControls.classList.add('line-multiple-callout-controls');
  calloutControls.setAttribute('style', controlsRowStyle);
  calloutControls.appendChild(
    createRadioGroupField(
      'Callout',
      'line-multiple-callout',
      [
        { label: 'Single Callout', value: 'single' },
        { label: 'Stack Callout', value: 'stack' },
      ],
      'stack',
      value => chart.toggleAttribute('is-callout-for-stack', value === 'stack'),
    ).element,
  );
  container.insertBefore(calloutControls, chart);
  return container;
};
Multiple.storyName = 'Multiple';
Multiple.parameters = { docs: { story: { height: '530px' } } };

export const CustomLocaleDateAxis: Story<LineChart> = () => {
  const status = document.createElement('output');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('style', 'display:block;margin-top:8px;');
  const reportInteraction = (message: string) => {
    status.textContent = message;
  };
  const data: LineChartSeries[] = [
    {
      legend: 'From_Legacy_to_O365',
      color: 'qualitative.1',
      lineOptions: { lineBorderWidth: 2 },
      data: [
        { x: new Date('2020-03-03T00:00:00Z'), y: 216000 },
        { x: new Date('2020-04-03T10:00:00Z'), y: 218123 },
        { x: new Date('2020-05-05T11:00:00Z'), y: 217124 },
        { x: new Date('2020-07-14T00:00:00Z'), y: 248000 },
        { x: new Date('2020-11-15T00:00:00Z'), y: 252000 },
        { x: new Date('2021-01-07T00:00:00Z'), y: 260000 },
        { x: new Date('2021-03-09T00:00:00Z'), y: 218000 },
      ].map(point => ({
        ...point,
        onDataPointClick: () => reportInteraction(`Clicked data point ${point.y}`),
      })),
      onLineClick: () => reportInteraction('Clicked line From_Legacy_to_O365'),
    },
    {
      legend: 'All',
      color: 'qualitative.2',
      lineOptions: { lineBorderWidth: 2 },
      data: [
        { x: new Date('2020-03-03T00:00:00Z'), y: 297000 },
        { x: new Date('2020-05-05T00:00:00Z'), y: 282000 },
        { x: new Date('2020-09-16T00:00:00Z'), y: 224000 },
        { x: new Date('2021-02-08T00:00:00Z'), y: 300000 },
        { x: new Date('2021-03-09T00:00:00Z'), y: 298000 },
      ],
    },
  ];
  const { container, controls, chart } = createLineStory('line-locale', data);
  container.setAttribute('style', 'display:flex;flex-direction:column;gap:16px;align-items:stretch;');
  controls.classList.add('line-locale-size-controls');
  placeSliderValuesAfterControls(controls, 'line-locale');
  const cultures = ['it-IT', 'en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'];
  chart.culture = cultures[0];
  chart.dateLocalizeOptions = { month: 'short', year: 'numeric' };
  chart.yMinValue = 200;
  chart.yMaxValue = 301;
  chart.xAxisTickCount = 10;
  const optionControls = document.createElement('div');
  optionControls.classList.add('line-locale-option-controls');
  optionControls.setAttribute('style', controlsRowStyle);
  addMultipleShapesControl(optionControls, chart, 'line-locale-shapes');
  optionControls.appendChild(
    createDropdownField('Culture', 'line-locale-culture', cultures, cultures[0], culture => {
      chart.culture = culture;
    }).element,
  );
  container.insertBefore(optionControls, chart);
  container.appendChild(status);
  return container;
};
CustomLocaleDateAxis.storyName = 'Custom Locale Date Axis';
CustomLocaleDateAxis.parameters = { docs: { story: { height: '500px' } } };

export const Events: Story<LineChart> = () => {
  const dates = Array.from({ length: 7 }, (_, index) => new Date(Date.UTC(2020, 2, 3 + index)));
  const data: LineChartSeries[] = [
    {
      legend: 'From_Legacy_to_O365',
      color: 'qualitative.8',
      data: dates.map((x, i) => ({ x, y: [297, 284, 282, 294, 294, 300, 298][i] })),
    },
    {
      legend: 'All',
      color: 'qualitative.10',
      data: dates.map((x, i) => ({ x, y: [292, 287, 287, 292, 287, 297, 292][i] })),
    },
  ];
  const { container, controls, chart } = createLineStory('line-events', data);
  chart.useUTC = true;
  chart.tickFormat = '%m/%d';
  chart.tickValues = dates;
  chart.yAxisTickFormat = '$,';
  chart.annotations = [
    { id: 'events-1', text: '3 events', coordinates: { type: 'data', x: dates[1], y: 284 }, layout: { offsetY: 28 } },
    { id: 'events-2', text: 'event 4', coordinates: { type: 'data', x: dates[3], y: 294 }, layout: { offsetY: -20 } },
    { id: 'events-3', text: 'event 5', coordinates: { type: 'data', x: dates[5], y: 300 }, layout: { offsetY: 28 } },
  ];
  const color = document.createElement('input');
  color.type = 'color';
  color.value = '#616161';
  color.setAttribute('aria-label', 'Event annotation color');
  color.addEventListener('input', () => {
    chart.annotations = chart.annotations?.map(annotation => ({
      ...annotation,
      style: { ...annotation.style, textColor: color.value },
      connector: { ...annotation.connector, strokeColor: color.value },
    }));
  });
  controls.appendChild(color);
  return container;
};
Events.storyName = 'Events';
Events.parameters = { docs: { story: { height: '500px' } } };

export const Gaps: Story<LineChart> = () => {
  const dates = Array.from({ length: 8 }, (_, index) => new Date(Date.UTC(2020, 2, 3 + index)));
  const { container, chart } = createLineStory(
    'line-gaps',
    [
      {
        legend: 'Normal Data',
        color: 'qualitative.12',
        gaps: [
          { startIndex: 1, endIndex: 2 },
          { startIndex: 3, endIndex: 4 },
          { startIndex: 5, endIndex: 6 },
        ],
        lineOptions: { lineBorderWidth: 2 },
        data: dates.map((x, i) => ({ x, y: [216000, 218123, 219000, 248000, 252000, 274000, 260000, 300000][i] })),
      },
      {
        legend: 'Low Confidence Data*',
        color: 'qualitative.13',
        lineOptions: { strokeDasharray: 2, strokeDashoffset: -1, strokeLinecap: 'butt', lineBorderWidth: 2 },
        data: [
          { x: dates[1], y: 218123 },
          { x: dates[2], y: 219000 },
          { x: dates[3], y: 248000 },
          { x: dates[4], y: 252000 },
          { x: dates[5], y: 274000 },
          { x: dates[6], y: 260000 },
        ],
      },
      {
        legend: 'Green Data',
        color: 'colorPaletteGreenForeground1',
        data: dates.map((x, i) => ({ x, y: [297000, 284000, 282000, 294000, 224000, 300000, 298000, 299000][i] })),
      },
    ],
    700,
    400,
  );
  chart.yMinValue = 150000;
  chart.yMaxValue = 400000;
  return container;
};
Gaps.storyName = 'Gaps';
Gaps.parameters = { docs: { story: { height: '580px' } } };

const largeDataStart = new Date('2020-03-01T00:00:00Z').getTime();
const createLargeData = (start: number, count: number, value: (index: number) => number) =>
  Array.from({ length: count }, (_, index) => ({
    x: new Date(largeDataStart + (start + index) * 60 * 60 * 1000),
    y: value(start + index),
  }));

export const LargeData: Story<LineChart> = () => {
  const data: LineChartSeries[] = [
    { legend: 'Constant', color: 'qualitative.1', data: createLargeData(0, 10000, () => 500000) },
    {
      legend: 'Wave',
      color: 'colorPaletteGreenForeground1',
      data: createLargeData(1000, 8000, index => {
        const n = index % 1000;
        return n < 500 ? n * n : 1000000 - n * n;
      }),
    },
    { legend: 'Single point', color: 'qualitative.10', data: [{ x: new Date('2020-03-05T00:00:00Z'), y: 282000 }] },
  ];
  const { container, controls, chart } = createLineStory('line-large', data);
  addMultipleShapesControl(controls, chart, 'line-large-shapes');
  return container;
};
LargeData.storyName = 'Large Data';
LargeData.parameters = { docs: { story: { height: '500px' } } };

const createNegativeData = (allNegative: boolean): LineChartSeries[] => {
  const dates = Array.from({ length: 7 }, (_, index) => new Date(Date.UTC(2020, 2, 3 + index)));
  const sign = (value: number, index: number) => (allNegative || index % 2 === 0 ? -value : value);
  return [
    {
      legend: 'From_Legacy_to_O365',
      color: 'qualitative.3',
      data: dates.map((x, i) => ({ x, y: sign([216000, 218123, 217124, 248000, 252000, 274000, 260000][i], i) })),
    },
    {
      legend: 'All',
      color: 'qualitative.4',
      data: dates.map((x, i) => ({ x, y: sign([297000, 284000, 282000, 294000, 224000, 300000, 298000][i], i + 1) })),
    },
    {
      legend: 'Single point',
      color: 'qualitative.5',
      data: [{ x: new Date('2020-03-05T12:00:00Z'), y: allNegative ? -232000 : 232000 }],
    },
  ];
};

const createNegativeStory = (id: string, allNegative: boolean) => {
  const { container, controls, chart } = createLineStory(id, createNegativeData(allNegative));
  chart.useUTC = true;
  chart.xAxisTitle = 'Values of each category';
  chart.yAxisTitle = 'Different categories of mail flow';
  addMultipleShapesControl(controls, chart, `${id}-shapes`);
  controls.appendChild(
    createSwitchField('Show axis titles', `${id}-titles`, true, checked => {
      chart.xAxisTitle = checked ? 'Values of each category' : undefined;
      chart.yAxisTitle = checked ? 'Different categories of mail flow' : undefined;
    }).element,
  );
  controls.appendChild(
    createSwitchField('Use UTC time', `${id}-utc`, true, checked => chart.toggleAttribute('use-utc', checked)).element,
  );
  return container;
};

export const Negative: Story<LineChart> = () => createNegativeStory('line-negative', false);
Negative.storyName = 'Negative';
Negative.parameters = { docs: { story: { height: '520px' } } };

export const AllNegative: Story<LineChart> = () => createNegativeStory('line-all-negative', true);
AllNegative.storyName = 'All Negative';
AllNegative.parameters = { docs: { story: { height: '520px' } } };

export const SecondaryYAxis: Story<LineChart> = () => {
  const dates = Array.from({ length: 7 }, (_, index) => new Date(Date.UTC(2020, 2, 3 + index)));
  const { container, chart } = createLineStory('line-secondary-y', [
    {
      legend: 'Primary',
      color: 'qualitative.3',
      data: dates.map((x, i) => ({ x, y: [216, 218, 217, 248, -252, 274, 304][i] })),
    },
    {
      legend: 'Secondary',
      color: 'qualitative.4',
      useSecondaryYScale: true,
      data: dates.map((x, i) => ({ x, y: [297000, 284000, 282000, -294000, 224000, -300000, 298000][i] })),
    },
  ]);
  chart.useUTC = true;
  chart.secondaryYAxisTitle = 'Secondary values';
  return container;
};
SecondaryYAxis.storyName = 'Secondary Y Axis';
SecondaryYAxis.parameters = { docs: { story: { height: '500px' } } };

export const LogAxisExample: Story<LineChart> = () => {
  const values = Array.from({ length: 8 }, (_, index) => index + 1);
  const { container, controls, chart } = createLineStory('line-log', [
    { legend: 'Series 1', color: 'qualitative.1', data: values.map(value => ({ x: value, y: 9 - value })) },
    {
      legend: 'Series 2',
      color: 'colorPaletteDarkOrangeForeground1',
      data: values.map(value => ({ x: value, y: value })),
    },
  ]);
  chart.xScaleType = 'log';
  chart.yScaleType = 'log';
  controls.appendChild(
    createRadioGroupField(
      'X scale',
      'line-log-x',
      [
        { label: 'Default', value: 'default' },
        { label: 'Log', value: 'log' },
      ],
      'log',
      value => chart.setAttribute('x-scale-type', value),
    ).element,
  );
  controls.appendChild(
    createRadioGroupField(
      'Y scale',
      'line-log-y',
      [
        { label: 'Default', value: 'default' },
        { label: 'Log', value: 'log' },
      ],
      'log',
      value => chart.setAttribute('y-scale-type', value),
    ).element,
  );
  return container;
};
LogAxisExample.storyName = 'Log Axis Example';
LogAxisExample.parameters = { docs: { story: { height: '560px' } } };

export const AnnotationsExample: Story<LineChart> = () => {
  const annotations: ChartAnnotation[] = [
    {
      id: 'launch',
      text: 'Launch day: +18% conversions',
      coordinates: { type: 'data', x: 1, y: 26 },
      layout: { align: 'start', offsetX: 16, offsetY: -48 },
      style: { textColor: 'qualitative.3', fontSize: '12px' },
      connector: { strokeColor: 'qualitative.3', strokeWidth: 2 },
    },
    {
      id: 'experiment',
      text: 'Pricing experiment: A/B test running',
      coordinates: { type: 'data', x: 3, y: 37 },
      layout: { offsetX: 100, offsetY: -20 },
      style: { textColor: 'qualitative.6', fontSize: '12px' },
      connector: { strokeColor: 'qualitative.6', strokeWidth: 2, dashArray: '5 5' },
    },
    {
      id: 'goal',
      text: 'Stretch goal: 5k signups',
      coordinates: { type: 'relative', x: 0.8, y: 0.28 },
      style: { textColor: '#d83b01', fontSize: '12px' },
    },
    {
      id: 'note',
      text: 'Values rounded to whole signups',
      coordinates: { type: 'pixel', x: 24, y: 24 },
      layout: { align: 'start' },
      style: { fontSize: '11px' },
    },
  ];
  const { container, chart } = createLineStory(
    'line-annotations',
    [{ legend: 'Signups', color: 'qualitative.3', data: [18, 26, 31, 37, 44, 51, 47].map((y, x) => ({ x, y })) }],
    960,
    520,
    'Weekly signups',
  );
  chart.annotations = annotations;
  return container;
};
AnnotationsExample.storyName = 'Annotations Example';
AnnotationsExample.parameters = { docs: { story: { height: '700px' } } };

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
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-line-chart') as LineChart;
  chart.data = basicData;
  chart.chartTitle = `Line chart culture example (${currentCulture})`;
  chart.setAttribute('width', '700');
  chart.setAttribute('height', '300');
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('x-axis-title', 'Values of each category');
  chart.setAttribute('y-axis-title', 'Different categories of mail flow');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'line-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.chartTitle = `Line chart culture example (${currentCulture})`;
  });
  controls.appendChild(cultureControl.element);

  return container;
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
