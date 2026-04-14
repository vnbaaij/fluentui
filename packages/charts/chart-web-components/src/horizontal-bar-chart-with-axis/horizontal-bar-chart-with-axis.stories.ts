import { html } from '@microsoft/fast-element';
import {
  ButtonDefinition,
  CheckboxDefinition,
  DropdownDefinition,
  DropdownOptionDefinition,
  FieldDefinition,
  FluentDesignSystem,
  LabelDefinition,
  ListboxDefinition,
  SliderDefinition,
  SwitchDefinition,
} from '@fluentui/web-components';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import { renderComponent } from '../helpers.stories.js';
import { HorizontalBarChartWithAxis as FluentHorizontalBarChartWithAxis } from './horizontal-bar-chart-with-axis.js';
import type {
  AxisCategoryOrder,
  HorizontalBarChartWithAxisDataPoint,
} from './horizontal-bar-chart-with-axis.options.js';

type FluentSliderElement = HTMLElement & { value: string };
type FluentCheckboxElement = HTMLElement & { checked: boolean };
type FluentSwitchElement = HTMLElement & { checked: boolean };
type FluentDropdownElement = HTMLElement & { value: string };

const ensureDefinition = (tagName: string, define: () => void) => {
  if (!customElements.get(tagName)) {
    define();
  }
};

ensureDefinition('fluent-button', () => ButtonDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-checkbox', () => CheckboxDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-dropdown', () => DropdownDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-field', () => FieldDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-label', () => LabelDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-listbox', () => ListboxDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-option', () => DropdownOptionDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-slider', () => SliderDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-switch', () => SwitchDefinition.define(FluentDesignSystem.registry));

const categoricalData: HorizontalBarChartWithAxisDataPoint[] = [
  {
    y: 'String One',
    x: 1000,
    legend: 'Oranges',
    color: '#637cef',
    xAxisCalloutData: '1K',
    yAxisCalloutData: 'String One',
  },
  {
    y: 'String Two',
    x: 5000,
    legend: 'Grapes',
    color: '#e3008c',
    xAxisCalloutData: '5K',
    yAxisCalloutData: 'String Two',
  },
  {
    y: 'String Three',
    x: 3000,
    legend: 'Apples',
    color: '#2aa0a4',
    xAxisCalloutData: '3K',
    yAxisCalloutData: 'String Three',
  },
  {
    y: 'String Four',
    x: 2000,
    legend: 'Bananas',
    color: '#9373c0',
    xAxisCalloutData: '2K',
    yAxisCalloutData: 'String Four',
  },
];

const numericYAxisData: HorizontalBarChartWithAxisDataPoint[] = [
  {
    x: 10000,
    y: 5000,
    legend: 'Oranges',
    color: '#637cef',
    xAxisCalloutData: '10K',
    yAxisCalloutData: '5K',
  },
  {
    x: 20000,
    y: 50000,
    legend: 'Dogs',
    color: '#e3008c',
    xAxisCalloutData: '20K',
    yAxisCalloutData: '50K',
  },
  {
    x: 25000,
    y: 30000,
    legend: 'Apples',
    color: '#2aa0a4',
    xAxisCalloutData: '25K',
    yAxisCalloutData: '30K',
  },
  {
    x: 40000,
    y: 13000,
    legend: 'Bananas',
    color: '#9373c0',
    xAxisCalloutData: '40K',
    yAxisCalloutData: '13K',
  },
];

const stackedData: HorizontalBarChartWithAxisDataPoint[] = [
  {
    x: 10000,
    y: 'Q1',
    legend: 'Product A',
    color: '#637cef',
    xAxisCalloutData: '10K',
    yAxisCalloutData: 'Q1',
  },
  {
    x: -5000,
    y: 'Q1',
    legend: 'Product B',
    color: '#e3008c',
    xAxisCalloutData: '-5K',
    yAxisCalloutData: 'Q1',
  },
  {
    x: 8000,
    y: 'Q1',
    legend: 'Product C',
    color: '#2aa0a4',
    xAxisCalloutData: '8K',
    yAxisCalloutData: 'Q1',
  },
  {
    x: -7000,
    y: 'Q2',
    legend: 'Product A',
    color: '#637cef',
    xAxisCalloutData: '-7K',
    yAxisCalloutData: 'Q2',
  },
  {
    x: 12000,
    y: 'Q2',
    legend: 'Product B',
    color: '#e3008c',
    xAxisCalloutData: '12K',
    yAxisCalloutData: 'Q2',
  },
  {
    x: 3000,
    y: 'Q2',
    legend: 'Product C',
    color: '#2aa0a4',
    xAxisCalloutData: '3K',
    yAxisCalloutData: 'Q2',
  },
  {
    x: 15000,
    y: 'Q3',
    legend: 'Product A',
    color: '#637cef',
    xAxisCalloutData: '15K',
    yAxisCalloutData: 'Q3',
  },
  {
    x: -4000,
    y: 'Q3',
    legend: 'Product B',
    color: '#e3008c',
    xAxisCalloutData: '-4K',
    yAxisCalloutData: 'Q3',
  },
  {
    x: 5000,
    y: 'Q3',
    legend: 'Product C',
    color: '#2aa0a4',
    xAxisCalloutData: '5K',
    yAxisCalloutData: 'Q3',
  },
];

const negativeData: HorizontalBarChartWithAxisDataPoint[] = [
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [10, 20, 30, 40, 50][index],
    y: category,
    legend: 'Series 1',
    color: '#637cef',
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [-10, -20, -30, -40, -50][index],
    y: category,
    legend: 'Series 1',
    color: '#637cef',
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [20, 30, 40, 50, 60][index],
    y: category,
    legend: 'Series 2',
    color: '#e3008c',
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [-20, -30, -40, -50, -60][index],
    y: category,
    legend: 'Series 2',
    color: '#e3008c',
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [30, 40, 50, 60, 70][index],
    y: category,
    legend: 'Series 3',
    color: '#2aa0a4',
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [-30, -40, -50, -60, -70][index],
    y: category,
    legend: 'Series 3',
    color: '#2aa0a4',
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [40, 50, 60, 70, 80][index],
    y: category,
    legend: 'Series 4',
    color: '#9373c0',
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [-40, -50, -60, -70, -80][index],
    y: category,
    legend: 'Series 4',
    color: '#9373c0',
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
];

const categoryOrderOptions: AxisCategoryOrder[] = [
  'default',
  'data',
  'category ascending',
  'category descending',
  'total ascending',
  'total descending',
  'min ascending',
  'min descending',
  'max ascending',
  'max descending',
  'sum ascending',
  'sum descending',
  'mean ascending',
  'mean descending',
  'median ascending',
  'median descending',
];

const categoryOrderColors = ['#637cef', '#e3008c', '#2aa0a4', '#9373c0', '#13a10e'];

const getCategoryOrderData = (dataSize: number): HorizontalBarChartWithAxisDataPoint[] => {
  const data: HorizontalBarChartWithAxisDataPoint[] = [];

  for (let index = 0; index < dataSize; index++) {
    const x = Math.floor(Math.random() * 200) - 100;
    const yIndex = Math.floor(Math.random() * (index + 1));
    const legendIndex = Math.floor(Math.random() * (index + 1));

    data.push({
      x,
      y: `Label ${yIndex + 1}`,
      legend: `Legend ${legendIndex + 1}`,
      color: categoryOrderColors[legendIndex % categoryOrderColors.length],
    });
  }

  return data;
};

const visuallyHiddenStyle =
  'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;';

const controlsRowStyle = 'display:flex;flex-wrap:wrap;gap:16px 24px;align-items:end;';
const sliderFieldStyle = 'min-width:220px;flex:1 1 220px;';
const toggleFieldStyle = 'min-width:220px;';

const createSliderField = (
  labelText: string,
  id: string,
  value: number,
  min: number,
  max: number,
  onInput: (nextValue: number) => void,
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

  slider.addEventListener('change', () => onInput(Number(slider.value)));

  return {
    element: field,
    setValue: (nextValue: number) => {
      slider.value = `${nextValue}`;
      slider.setAttribute('value', `${nextValue}`);
      message.textContent = `${nextValue}`;
    },
  };
};

const createCheckboxField = (
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

  const checkbox = document.createElement('fluent-checkbox') as FluentCheckboxElement;
  checkbox.slot = 'input';
  checkbox.id = id;
  checkbox.checked = checked;
  checkbox.toggleAttribute('checked', checked);
  checkbox.addEventListener('change', () => onChange(checkbox.checked));
  field.appendChild(checkbox);

  return {
    element: field,
    setValue: (nextChecked: boolean) => {
      checkbox.checked = nextChecked;
      checkbox.toggleAttribute('checked', nextChecked);
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

const createDropdownField = (
  labelText: string,
  id: string,
  options: string[],
  value: string,
  onChange: (nextValue: string) => void,
) => {
  const field = document.createElement('fluent-field');
  field.setAttribute('label-position', 'above');
  field.setAttribute('style', 'min-width:260px;');

  const label = document.createElement('label');
  label.slot = 'label';
  label.htmlFor = id;
  label.textContent = labelText;
  field.appendChild(label);

  const dropdown = document.createElement('fluent-dropdown') as FluentDropdownElement;
  dropdown.slot = 'input';
  dropdown.id = id;
  dropdown.setAttribute('value', value);

  const listbox = document.createElement('fluent-listbox');
  options.forEach(optionValue => {
    const option = document.createElement('fluent-option');
    option.setAttribute('value', optionValue);
    if (optionValue === value) {
      option.toggleAttribute('selected', true);
    }
    option.textContent = optionValue;
    listbox.appendChild(option);
  });

  dropdown.appendChild(listbox);
  dropdown.addEventListener('change', () => onChange(dropdown.value));
  field.appendChild(dropdown);

  return {
    element: field,
    setValue: (nextValue: string) => {
      dropdown.setAttribute('value', nextValue);
      dropdown.value = nextValue;
      listbox.querySelectorAll('fluent-option').forEach(option => {
        option.toggleAttribute('selected', option.getAttribute('value') === nextValue);
      });
    },
  };
};

const createFluentButton = (text: string, onClick: () => void) => {
  const button = document.createElement('fluent-button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
};

export default {
  title: 'Components/HorizontalBarChartWithAxis',
} as Meta<FluentHorizontalBarChartWithAxis>;

export const Basic: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const checkboxControls = document.createElement('div');
  checkboxControls.setAttribute('style', 'margin-top:16px;');
  container.appendChild(checkboxControls);

  const switchControls = document.createElement('div');
  switchControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(switchControls);

  let width = 650;
  let height = 350;
  let useSingleColor = false;
  let enableGradient = false;
  let roundCorners = false;
  let allowMultipleLegendSelection = false;

  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', `width:${width}px;height:${height}px;margin-top:20px;`);
  container.appendChild(chartHost);

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;

  const renderChart = () => {
    chartHost.style.width = `${width}px`;
    chartHost.style.height = `${height}px`;
    chart.setAttribute('style', `width:${width}px;height:${height}px`);
    chart.setAttribute('chart-title', 'Horizontal bar chart basic example');
    chart.setAttribute('data', JSON.stringify(numericYAxisData));
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);

    chart.width = `${width}`;
    chart.height = `${height}`;
    chart.useSingleColor = useSingleColor;
    chart.enableGradient = enableGradient;
    chart.roundCorners = roundCorners;
    chart.allowMultipleLegendSelection = allowMultipleLegendSelection;

    chart.toggleAttribute('use-single-color', useSingleColor);
    chart.toggleAttribute('enable-gradient', enableGradient);
    chart.toggleAttribute('round-corners', roundCorners);
    chart.toggleAttribute('allow-multiple-legend-selection', allowMultipleLegendSelection);

    if (!chart.isConnected) {
      chartHost.appendChild(chart);
    }
  };

  const widthControl = createSliderField('Width', 'basic-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    renderChart();
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'basic-height', height, 200, 1000, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    renderChart();
  });
  sliderControls.appendChild(heightControl.element);

  const useSingleColorControl = createCheckboxField(
    'Use single color',
    'basic-single-color',
    useSingleColor,
    nextChecked => {
      useSingleColor = nextChecked;
      useSingleColorControl.setValue(nextChecked);
      renderChart();
    },
  );
  checkboxControls.appendChild(useSingleColorControl.element);

  const enableGradientControl = createSwitchField(
    'Enable gradient',
    'basic-enable-gradient',
    enableGradient,
    nextChecked => {
      enableGradient = nextChecked;
      enableGradientControl.setValue(nextChecked);
      renderChart();
    },
  );
  switchControls.appendChild(enableGradientControl.element);

  const roundCornersControl = createSwitchField('Rounded corners', 'basic-round-corners', roundCorners, nextChecked => {
    roundCorners = nextChecked;
    roundCornersControl.setValue(nextChecked);
    renderChart();
  });
  switchControls.appendChild(roundCornersControl.element);

  const allowMultipleLegendSelectionControl = createSwitchField(
    'Select multiple legends',
    'basic-multi-select',
    allowMultipleLegendSelection,
    nextChecked => {
      allowMultipleLegendSelection = nextChecked;
      allowMultipleLegendSelectionControl.setValue(nextChecked);
      renderChart();
    },
  );
  switchControls.appendChild(allowMultipleLegendSelectionControl.element);

  renderChart();

  return container;
};

export const StringYAxis: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Revenue by category"
    data="${JSON.stringify(categoricalData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const NumericYAxis: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Revenue by value"
    data="${JSON.stringify(numericYAxisData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const Stacked: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Quarterly comparison"
    data="${JSON.stringify(stackedData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const Negative: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 650px; height: 350px"
    chart-title="Horizontal bar chart with negative axis values"
    hide-legends
    show-y-axis-labels-tooltip
    data="${JSON.stringify(negativeData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const CategoryOrder: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  container.className = 'containerDiv';

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const initialDataSize = 5;
  let width = 650;
  let height = 350;
  let dataSize = initialDataSize;
  let statusKey = 0;
  let yAxisCategoryOrder: AxisCategoryOrder = 'default';
  let dynamicData = getCategoryOrderData(initialDataSize);

  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', `width:${width}px;height:${height}px;margin-top:20px;`);
  container.appendChild(chartHost);

  const actionRow = document.createElement('div');
  actionRow.setAttribute('style', 'margin-top:20px;display:flex;align-items:center;gap:16px;');
  container.appendChild(actionRow);

  const changeDataButton = createFluentButton('Change data', () => {
    dynamicData = getCategoryOrderData(dataSize);
    statusKey += 1;
    renderChart();
  });
  actionRow.appendChild(changeDataButton);

  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  actionRow.appendChild(liveRegion);

  const statusMessage = document.createElement('p');
  statusMessage.setAttribute('style', visuallyHiddenStyle);
  liveRegion.appendChild(statusMessage);

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;

  const renderChart = () => {
    chartHost.style.width = `${width}px`;
    chartHost.style.height = `${height}px`;
    chart.setAttribute('style', `width:${width}px;height:${height}px`);
    chart.setAttribute('data', JSON.stringify(dynamicData));
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);
    chart.setAttribute('show-y-axis-labels', '');
    chart.setAttribute('hide-legends', '');
    chart.setAttribute('y-axis-category-order', yAxisCategoryOrder);
    chart.width = `${width}`;
    chart.height = `${height}`;
    chart.hideLegends = true;
    chart.showYAxisLabels = true;
    chart.yAxisCategoryOrder = yAxisCategoryOrder;

    if (!chart.isConnected) {
      chartHost.appendChild(chart);
    }

    statusMessage.textContent = `Horizontal bar chart with Axis data changed ${statusKey}`;
  };

  const widthControl = createSliderField('Width', 'input-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    renderChart();
  });
  controls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'input-height', height, 200, 1000, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    renderChart();
  });
  controls.appendChild(heightControl.element);

  const dataSizeControl = createSliderField('Data size', 'input-datasize', dataSize, 0, 50, nextValue => {
    dataSize = nextValue;
    dataSizeControl.setValue(nextValue);
    dynamicData = getCategoryOrderData(dataSize);
    statusKey += 1;
    renderChart();
  });
  controls.appendChild(dataSizeControl.element);

  const selectControl = createDropdownField(
    'yAxisCategoryOrder',
    'y-axis-category-order-select',
    categoryOrderOptions,
    yAxisCategoryOrder,
    nextValue => {
      yAxisCategoryOrder = nextValue as AxisCategoryOrder;
      selectControl.setValue(nextValue);
      renderChart();
    },
  );
  controls.appendChild(selectControl.element);

  renderChart();

  return container;
};

export const HideLegends: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Revenue by category"
    hide-legends
    data="${JSON.stringify(categoricalData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const Gradient: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Revenue by category"
    enable-gradient
    data="${JSON.stringify(categoricalData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const RoundedCorners: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Revenue by category"
    round-corners
    data="${JSON.stringify(categoricalData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const ShowYAxisLabels: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Very long category labels"
    show-y-axis-labels
    show-y-axis-labels-tooltip
    data="${JSON.stringify(
      categoricalData.map(point => ({
        ...point,
        y: `${point.y} with a much longer label for layout coverage`,
      })),
    )}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const RTL: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <div dir="rtl">
    <fluent-horizontal-bar-chart-with-axis
      style="width: 650px; height: 350px"
      chart-title="Horizontal bar chart basic example"
      data="${JSON.stringify(numericYAxisData)}"
    >
    </fluent-horizontal-bar-chart-with-axis>
  </div>
`);
