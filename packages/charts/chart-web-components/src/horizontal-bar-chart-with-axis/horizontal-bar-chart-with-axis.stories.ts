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
import type { HorizontalBarChartWithAxisDataPoint } from './horizontal-bar-chart-with-axis.options.js';
import type { AxisCategoryOrder } from '../utils/chart.options.js';
import { DataVizPalette } from '../utils/chart-helpers.js';

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
    color: DataVizPalette.color1,
    xAxisCalloutData: '1K',
    yAxisCalloutData: 'String One',
  },
  {
    y: 'String Two',
    x: 5000,
    legend: 'Grapes',
    color: DataVizPalette.color2,
    xAxisCalloutData: '5K',
    yAxisCalloutData: 'String Two',
  },
  {
    y: 'String Three',
    x: 3000,
    legend: 'Apples',
    color: DataVizPalette.color3,
    xAxisCalloutData: '3K',
    yAxisCalloutData: 'String Three',
  },
  {
    y: 'String Four',
    x: 2000,
    legend: 'Bananas',
    color: DataVizPalette.color4,
    xAxisCalloutData: '2K',
    yAxisCalloutData: 'String Four',
  },
];

const numericYAxisData: HorizontalBarChartWithAxisDataPoint[] = [
  {
    x: 10000,
    y: 5000,
    legend: 'Oranges',
    color: DataVizPalette.color1,
    xAxisCalloutData: '10K',
    yAxisCalloutData: '5K',
  },
  {
    x: 20000,
    y: 50000,
    legend: 'Dogs',
    color: DataVizPalette.color2,
    xAxisCalloutData: '20K',
    yAxisCalloutData: '50K',
  },
  {
    x: 25000,
    y: 30000,
    legend: 'Apples',
    color: DataVizPalette.color3,
    xAxisCalloutData: '25K',
    yAxisCalloutData: '30K',
  },
  {
    x: 40000,
    y: 13000,
    legend: 'Bananas',
    color: DataVizPalette.color4,
    xAxisCalloutData: '40K',
    yAxisCalloutData: '13K',
  },
];

const stackedData: HorizontalBarChartWithAxisDataPoint[] = [
  {
    x: 10000,
    y: 'Q1',
    legend: 'Product A',
    color: DataVizPalette.color1,
    xAxisCalloutData: '10K',
    yAxisCalloutData: 'Q1',
  },
  {
    x: -5000,
    y: 'Q1',
    legend: 'Product B',
    color: DataVizPalette.color2,
    xAxisCalloutData: '-5K',
    yAxisCalloutData: 'Q1',
  },
  {
    x: 8000,
    y: 'Q1',
    legend: 'Product C',
    color: DataVizPalette.color3,
    xAxisCalloutData: '8K',
    yAxisCalloutData: 'Q1',
  },
  {
    x: -7000,
    y: 'Q2',
    legend: 'Product A',
    color: DataVizPalette.color1,
    xAxisCalloutData: '-7K',
    yAxisCalloutData: 'Q2',
  },
  {
    x: 12000,
    y: 'Q2',
    legend: 'Product B',
    color: DataVizPalette.color2,
    xAxisCalloutData: '12K',
    yAxisCalloutData: 'Q2',
  },
  {
    x: 3000,
    y: 'Q2',
    legend: 'Product C',
    color: DataVizPalette.color3,
    xAxisCalloutData: '3K',
    yAxisCalloutData: 'Q2',
  },
  {
    x: 15000,
    y: 'Q3',
    legend: 'Product A',
    color: DataVizPalette.color1,
    xAxisCalloutData: '15K',
    yAxisCalloutData: 'Q3',
  },
  {
    x: -4000,
    y: 'Q3',
    legend: 'Product B',
    color: DataVizPalette.color2,
    xAxisCalloutData: '-4K',
    yAxisCalloutData: 'Q3',
  },
  {
    x: 5000,
    y: 'Q3',
    legend: 'Product C',
    color: DataVizPalette.color3,
    xAxisCalloutData: '5K',
    yAxisCalloutData: 'Q3',
  },
];

const negativeData: HorizontalBarChartWithAxisDataPoint[] = [
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [10, 20, 30, 40, 50][index],
    y: category,
    legend: 'Series 1',
    color: DataVizPalette.color1,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [-10, -20, -30, -40, -50][index],
    y: category,
    legend: 'Series 1',
    color: DataVizPalette.color1,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [20, 30, 40, 50, 60][index],
    y: category,
    legend: 'Series 2',
    color: DataVizPalette.color2,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [-20, -30, -40, -50, -60][index],
    y: category,
    legend: 'Series 2',
    color: DataVizPalette.color2,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [30, 40, 50, 60, 70][index],
    y: category,
    legend: 'Series 3',
    color: DataVizPalette.color3,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [-30, -40, -50, -60, -70][index],
    y: category,
    legend: 'Series 3',
    color: DataVizPalette.color3,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [40, 50, 60, 70, 80][index],
    y: category,
    legend: 'Series 4',
    color: DataVizPalette.color4,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  })),
  ...['A', 'B', 'C', 'D', 'E'].map((category, index) => ({
    x: [-40, -50, -60, -70, -80][index],
    y: category,
    legend: 'Series 4',
    color: DataVizPalette.color4,
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

const categoryOrderColors = [
  DataVizPalette.color1,
  DataVizPalette.color2,
  DataVizPalette.color3,
  DataVizPalette.color4,
  DataVizPalette.color5,
];

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
Basic.parameters = { docs: { story: { height: '640px' } } };

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
CategoryOrder.parameters = { docs: { story: { height: '560px' } } };

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

export const Culture: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;
  chart.setAttribute('chart-title', `Horizontal bar chart culture example (${currentCulture})`);
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('data', JSON.stringify(categoricalData));
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'hbcwa-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.setAttribute('chart-title', `Horizontal bar chart culture example (${currentCulture})`);
  });
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '480px' } } };

export const LegendListLabel: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 650px; height: 350px"
    chart-title="Horizontal bar chart legend list label example"
    legend-list-label="Chart series"
    data="${JSON.stringify(categoricalData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const HideTooltip: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let hideTooltip = true;

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;
  chart.setAttribute('chart-title', 'Horizontal bar chart hide tooltip example');
  chart.setAttribute('data', JSON.stringify(categoricalData));
  chart.setAttribute('style', 'width:650px;height:350px;margin-top:20px;');
  chart.toggleAttribute('hide-tooltip', hideTooltip);
  container.appendChild(chart);

  const hideTooltipControl = createSwitchField('Hide tooltip', 'hbcwa-hide-tooltip', hideTooltip, nextChecked => {
    hideTooltip = nextChecked;
    hideTooltipControl.setValue(nextChecked);
    chart.hideTooltip = nextChecked;
    chart.toggleAttribute('hide-tooltip', nextChecked);
  });
  controls.appendChild(hideTooltipControl.element);

  return container;
};
HideTooltip.parameters = { docs: { story: { height: '480px' } } };

export const MultipleLegendSelection: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let allowMultiple = true;

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;
  chart.setAttribute('chart-title', 'Horizontal bar chart multiple legend selection example');
  chart.setAttribute('data', JSON.stringify(stackedData));
  chart.setAttribute('style', 'width:650px;height:350px;margin-top:20px;');
  chart.allowMultipleLegendSelection = allowMultiple;
  chart.toggleAttribute('allow-multiple-legend-selection', allowMultiple);
  container.appendChild(chart);

  const multipleControl = createSwitchField(
    'Allow multiple legend selection',
    'hbcwa-multiple-legend',
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
MultipleLegendSelection.parameters = { docs: { story: { height: '480px' } } };

export const HideLabels: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Revenue by category (labels hidden)"
    hide-labels
    data="${JSON.stringify(categoricalData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);

export const BarHeight: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let barHeight = 32;

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;
  chart.setAttribute('chart-title', 'Bar height control');
  chart.setAttribute('data', JSON.stringify(categoricalData));
  chart.setAttribute('style', 'width:800px;height:500px;margin-top:20px;');
  chart.setAttribute('height', '500');
  chart.setAttribute('bar-height', `${barHeight}`);
  container.appendChild(chart);

  const barHeightControl = createSliderField('Bar height (px)', 'bh-bar-height', barHeight, 4, 64, nextValue => {
    barHeight = nextValue;
    barHeightControl.setValue(nextValue);
    chart.barHeight = nextValue;
    chart.setAttribute('bar-height', `${nextValue}`);
  });
  controls.appendChild(barHeightControl.element);

  return container;
};
BarHeight.parameters = { docs: { story: { height: '640px' } } };

export const AxisTickCounts: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let xTickCount = 6;
  let yTickCount = 4;

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;
  chart.setAttribute('chart-title', 'Axis tick count control');
  chart.setAttribute('data', JSON.stringify(numericYAxisData));
  chart.setAttribute('style', 'width:800px;height:400px;margin-top:20px;');
  chart.setAttribute('x-axis-tick-count', `${xTickCount}`);
  chart.setAttribute('y-axis-tick-count', `${yTickCount}`);
  container.appendChild(chart);

  const xTickControl = createSliderField('X-axis tick count', 'atc-x-ticks', xTickCount, 2, 12, nextValue => {
    xTickCount = nextValue;
    xTickControl.setValue(nextValue);
    chart.xAxisTickCount = nextValue;
    chart.setAttribute('x-axis-tick-count', `${nextValue}`);
  });
  controls.appendChild(xTickControl.element);

  const yTickControl = createSliderField('Y-axis tick count', 'atc-y-ticks', yTickCount, 2, 12, nextValue => {
    yTickCount = nextValue;
    yTickControl.setValue(nextValue);
    chart.yAxisTickCount = nextValue;
    chart.setAttribute('y-axis-tick-count', `${nextValue}`);
  });
  controls.appendChild(yTickControl.element);

  return container;
};
AxisTickCounts.parameters = { docs: { story: { height: '540px' } } };

export const YAxisPadding: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  // Slider is 0-9, representing y-axis-padding values 0.0–0.9 (divided by 10)
  let paddingTenths = 5;

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;
  chart.setAttribute('chart-title', 'Y-axis padding control');
  chart.setAttribute('data', JSON.stringify(categoricalData));
  chart.setAttribute('style', 'width:800px;height:400px;margin-top:20px;');
  chart.setAttribute('y-axis-padding', `${paddingTenths / 10}`);
  container.appendChild(chart);

  const paddingControl = createSliderField('Y-axis padding (/10)', 'yap-padding', paddingTenths, 0, 9, nextValue => {
    paddingTenths = nextValue;
    paddingControl.setValue(nextValue);
    chart.yAxisPadding = nextValue / 10;
    chart.setAttribute('y-axis-padding', `${nextValue / 10}`);
  });
  controls.appendChild(paddingControl.element);

  return container;
};
YAxisPadding.parameters = { docs: { story: { height: '540px' } } };

export const DomainOverride: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  // numericYAxisData: x in [10K, 40K], y in [5K, 50K]
  let xMinValue = 0;
  let xMaxValue = 40000;
  let yMinValue = 0;
  let yMaxValue = 50000;

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;
  chart.setAttribute('chart-title', 'Domain override (x-min/max-value, y-min/max-value)');
  chart.setAttribute('data', JSON.stringify(numericYAxisData));
  chart.setAttribute('style', 'width:800px;height:400px;margin-top:20px;');
  container.appendChild(chart);

  const applyDomain = () => {
    chart.xMinValue = xMinValue;
    chart.xMaxValue = xMaxValue;
    chart.yMinValue = yMinValue;
    chart.yMaxValue = yMaxValue;
    chart.setAttribute('x-min-value', `${xMinValue}`);
    chart.setAttribute('x-max-value', `${xMaxValue}`);
    chart.setAttribute('y-min-value', `${yMinValue}`);
    chart.setAttribute('y-max-value', `${yMaxValue}`);
  };

  const xMinControl = createSliderField('x-min-value', 'dom-x-min', xMinValue, -10000, 0, nextValue => {
    xMinValue = nextValue;
    xMinControl.setValue(nextValue);
    applyDomain();
  });
  controls.appendChild(xMinControl.element);

  const xMaxControl = createSliderField('x-max-value', 'dom-x-max', xMaxValue, 40000, 80000, nextValue => {
    xMaxValue = nextValue;
    xMaxControl.setValue(nextValue);
    applyDomain();
  });
  controls.appendChild(xMaxControl.element);

  const yMinControl = createSliderField('y-min-value', 'dom-y-min', yMinValue, -20000, 5000, nextValue => {
    yMinValue = nextValue;
    yMinControl.setValue(nextValue);
    applyDomain();
  });
  controls.appendChild(yMinControl.element);

  const yMaxControl = createSliderField('y-max-value', 'dom-y-max', yMaxValue, 50000, 100000, nextValue => {
    yMaxValue = nextValue;
    yMaxControl.setValue(nextValue);
    applyDomain();
  });
  controls.appendChild(yMaxControl.element);

  applyDomain();
  return container;
};
DomainOverride.parameters = { docs: { story: { height: '560px' } } };

export const TitleAlign: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const alignments = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof alignments)[number] = 'start';

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;
  chart.setAttribute('chart-title', 'Title alignment example');
  chart.setAttribute('data', JSON.stringify(categoricalData));
  chart.setAttribute('title-align', currentAlign);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const alignControl = createDropdownField(
    'Title align',
    'hbcwa-title-align',
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
TitleAlign.parameters = { docs: { story: { height: '480px' } } };

export const TitleAndLegendPositions: Story<FluentHorizontalBarChartWithAxis> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const positions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentPosition: (typeof positions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-horizontal-bar-chart-with-axis') as FluentHorizontalBarChartWithAxis;
  chart.setAttribute('chart-title', 'Title and legend position example');
  chart.setAttribute('data', JSON.stringify(categoricalData));
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const posControl = createDropdownField(
    'Legend position',
    'hbcwa-legend-position',
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
    'hbcwa-title-position',
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
TitleAndLegendPositions.parameters = { docs: { story: { height: '480px' } } };

export const AxisTitles: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Revenue by quarter"
    x-axis-title="Revenue (USD)"
    y-axis-title="Quarter"
    data="${JSON.stringify(categoricalData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);
AxisTitles.parameters = { docs: { story: { height: '420px' } } };

export const TickFormat: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Fixed decimal tick format (.2f)"
    x-axis-tick-format=".2f"
    data="${JSON.stringify(numericYAxisData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);
TickFormat.parameters = { docs: { story: { height: '420px' } } };

export const TickPadding: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Tick padding = 14"
    tick-padding="14"
    data="${JSON.stringify(categoricalData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);
TickPadding.parameters = { docs: { story: { height: '420px' } } };

export const RotateXAxisLabels: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Rotated x-axis labels"
    rotate-x-axis-labels
    data="${JSON.stringify(categoricalData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);
RotateXAxisLabels.parameters = { docs: { story: { height: '420px' } } };

export const WrapXAxisLabels: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Wrapped x-axis labels"
    wrap-x-axis-labels
    data="${JSON.stringify(categoricalData.map(p => ({ ...p, x: p.x + 1234 })))}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);
WrapXAxisLabels.parameters = { docs: { story: { height: '420px' } } };

export const SupportNegativeData: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Negative numeric y-axis (support-negative-data)"
    support-negative-data
    data="${JSON.stringify([
      { x: 1000, y: -5, legend: 'Oranges', color: DataVizPalette.color1 },
      { x: 2000, y: 5, legend: 'Grapes', color: DataVizPalette.color2 },
      { x: 1500, y: 10, legend: 'Apples', color: DataVizPalette.color3 },
    ])}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);
SupportNegativeData.parameters = { docs: { story: { height: '420px' } } };

export const RoundedTicks: Story<FluentHorizontalBarChartWithAxis> = renderComponent(html<
  StoryArgs<FluentHorizontalBarChartWithAxis>
>`
  <fluent-horizontal-bar-chart-with-axis
    style="width: 800px"
    chart-title="Rounded/niced tick domain"
    rounded-ticks
    data="${JSON.stringify(numericYAxisData)}"
  >
  </fluent-horizontal-bar-chart-with-axis>
`);
RoundedTicks.parameters = { docs: { story: { height: '420px' } } };
