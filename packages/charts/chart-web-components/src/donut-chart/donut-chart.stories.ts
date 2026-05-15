import { html } from '@microsoft/fast-element';
import {
  DropdownDefinition,
  DropdownOptionDefinition,
  FieldDefinition,
  FluentDesignSystem,
  LabelDefinition,
  ListboxDefinition,
  SliderDefinition,
  SwitchDefinition,
  TextInputDefinition,
} from '@fluentui/web-components';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import { renderComponent } from '../helpers.stories.js';
import { DonutChart as FluentDonutChart } from './donut-chart.js';
import type { DonutDataPoint } from './donut-chart.options.js';

type FluentSliderElement = HTMLElement & { value: string };
type FluentSwitchElement = HTMLElement & { checked: boolean };
type FluentDropdownElement = HTMLElement & { value: string };
type FluentTextInputElement = HTMLElement & { value: string };

const ensureDefinition = (tagName: string, define: () => void) => {
  if (!customElements.get(tagName)) {
    define();
  }
};

ensureDefinition('fluent-dropdown', () => DropdownDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-field', () => FieldDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-label', () => LabelDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-listbox', () => ListboxDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-option', () => DropdownOptionDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-slider', () => SliderDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-switch', () => SwitchDefinition.define(FluentDesignSystem.registry));
ensureDefinition('fluent-text-input', () => TextInputDefinition.define(FluentDesignSystem.registry));

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

const createDropdownField = (
  labelText: string,
  id: string,
  options: string[],
  value: string,
  onChange: (nextValue: string) => void,
) => {
  const field = document.createElement('fluent-field');
  field.setAttribute('label-position', 'above');
  field.setAttribute('style', 'min-width:180px;');

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

const createTextInputField = (
  labelText: string,
  id: string,
  value: string,
  onChange: (nextValue: string | undefined) => void,
) => {
  const field = document.createElement('fluent-field');
  field.setAttribute('label-position', 'above');
  field.setAttribute('style', 'min-width:220px;flex:1 1 220px;');

  const label = document.createElement('label');
  label.slot = 'label';
  label.htmlFor = id;
  label.textContent = labelText;
  field.appendChild(label);

  const input = document.createElement('fluent-text-input') as FluentTextInputElement;
  input.slot = 'input';
  input.id = id;
  input.setAttribute('value', value);
  input.addEventListener('input', () => {
    onChange(input.value || undefined);
  });
  field.appendChild(input);

  return { element: field };
};

const basicTitle = 'Donut chart basic example';
const sortedTitle = 'Sorted donut chart example';

const points: DonutDataPoint[] = [
  {
    legend: 'first',
    data: 20000,
  },
  {
    legend: 'second',
    data: 39000,
  },
];

const data: DonutDataPoint[] = points;

const sortedPoints: DonutDataPoint[] = [
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

const sortedData: DonutDataPoint[] = sortedPoints;

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

export const OutsideLabels: Story<FluentDonutChart> = () => {
  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Donut chart outside labels example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('value-inside-donut', '39,000');
  chart.setAttribute('inner-radius', '85');
  chart.setAttribute('width', '320');
  chart.setAttribute('height', '320');
  chart.setAttribute('style', 'width:320px;height:320px');
  chart.hideLabels = false;

  return chart;
};

export const Sizing: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);
  const chartHost = document.createElement('div');
  chartHost.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chartHost);

  let width = 320;
  let height = 320;
  let innerRadius = 55;

  const renderChart = () => {
    const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
    chart.setAttribute('chart-title', 'Donut chart sizing example');
    chart.setAttribute('data', JSON.stringify(data));
    chart.setAttribute('value-inside-donut', '39,000');
    chart.setAttribute('inner-radius', `${innerRadius}`);
    chart.width = width;
    chart.height = height;
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);
    chart.setAttribute('style', `width:${width}px;height:${height}px`);

    chartHost.replaceChildren(chart);
  };

  const widthControl = createSliderField('Width', 'donut-width', width, 200, 640, nextWidth => {
    width = nextWidth;
    widthControl.setValue(nextWidth);
    renderChart();
  });
  controls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'donut-height', height, 200, 640, nextHeight => {
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

export const RoundedCorners: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let roundCorners = false;
  let hideLabels = false;

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Donut chart rounded corners example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('value-inside-donut', '39,000');
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('style', 'width:320px;height:320px;margin-top:20px;');

  const renderChart = () => {
    chart.hideLabels = hideLabels;
    chart.roundCorners = roundCorners;
    chart.toggleAttribute('hide-labels', hideLabels);
    chart.toggleAttribute('round-corners', roundCorners);

    if (!chart.isConnected) {
      container.appendChild(chart);
    }
  };

  const roundedCornersControl = createSwitchField(
    'Rounded corners',
    'donut-rounded-corners',
    roundCorners,
    nextChecked => {
      roundCorners = nextChecked;
      roundedCornersControl.setValue(nextChecked);
      renderChart();
    },
  );
  controls.appendChild(roundedCornersControl.element);

  const hideLabelsControl = createSwitchField('Hide labels', 'donut-rounded-hide-labels', hideLabels, nextChecked => {
    hideLabels = nextChecked;
    hideLabelsControl.setValue(nextChecked);
    renderChart();
  });
  controls.appendChild(hideLabelsControl.element);

  renderChart();

  return container;
};

export const HideLegends: Story<FluentDonutChart> = renderComponent(html<StoryArgs<FluentDonutChart>>`
  <fluent-donut-chart
    chart-title="Donut chart hide legends example"
    data="${JSON.stringify(data)}"
    value-inside-donut="39,000"
    inner-radius="55"
    hide-legends
  >
  </fluent-donut-chart>
`);

export const ShowLabelsInPercent: Story<FluentDonutChart> = () => {
  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Donut chart percent labels example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('inner-radius', '55');
  chart.toggleAttribute('show-labels-in-percent', true);
  chart.hideLabels = false;

  return chart;
};

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

export const Sorted: Story<FluentDonutChart> = renderComponent(html<StoryArgs<FluentDonutChart>>`
  <fluent-donut-chart
    chart-title="${sortedTitle}"
    data="${JSON.stringify(sortedData)}"
    inner-radius="55"
    order="sorted"
  >
  </fluent-donut-chart>
`);

export const HideTooltip: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let hideTooltip = true;

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Donut chart hide tooltip example');
  chart.setAttribute('data', JSON.stringify(data));
  chart.setAttribute('value-inside-donut', '39,000');
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.toggleAttribute('hide-tooltip', hideTooltip);
  container.appendChild(chart);

  const hideTooltipControl = createSwitchField('Hide tooltip', 'donut-hide-tooltip', hideTooltip, nextChecked => {
    hideTooltip = nextChecked;
    hideTooltipControl.setValue(nextChecked);
    chart.hideTooltip = nextChecked;
    chart.toggleAttribute('hide-tooltip', nextChecked);
  });
  controls.appendChild(hideTooltipControl.element);

  return container;
};

export const LegendListLabel: Story<FluentDonutChart> = renderComponent(html<StoryArgs<FluentDonutChart>>`
  <fluent-donut-chart
    chart-title="Donut chart legend list label example"
    data="${JSON.stringify(data)}"
    value-inside-donut="39,000"
    inner-radius="55"
    legend-list-label="Chart segments"
  >
  </fluent-donut-chart>
`);

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

  const cultureControl = createDropdownField(
    'Culture',
    'donut-culture',
    [...cultures],
    currentCulture,
    nextCulture => {
      currentCulture = nextCulture;
      chart.setAttribute('culture', currentCulture);
      chart.setAttribute('chart-title', `Donut chart culture example (${currentCulture})`);
    },
  );
  controls.appendChild(cultureControl.element);

  return container;
};

export const MultipleLegendSelection: Story<FluentDonutChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  let allowMultiple = true;

  const chart = document.createElement('fluent-donut-chart') as FluentDonutChart;
  chart.setAttribute('chart-title', 'Donut chart multiple legend selection example');
  chart.setAttribute('data', JSON.stringify(sortedData));
  chart.setAttribute('inner-radius', '55');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.allowMultipleLegendSelection = allowMultiple;
  chart.toggleAttribute('allow-multiple-legend-selection', allowMultiple);
  container.appendChild(chart);

  const multipleControl = createSwitchField(
    'Allow multiple legend selection',
    'donut-multiple-legend',
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

  const titlePosControl= createDropdownField(
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

