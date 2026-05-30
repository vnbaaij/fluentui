import { html } from '@microsoft/fast-element';
import type { Meta, Story, StoryArgs } from '../helpers.stories.js';
import {
  controlsRowStyle,
  createDropdownField,
  createRadioGroupField,
  createSliderField,
  createSwitchField,
  renderComponent,
} from '../helpers.stories.js';
import { FunnelChart as FluentFunnelChart } from './funnel-chart.js';
import type { FunnelDataPoint } from './funnel-chart.options.js';
import { DataVizPalette } from '../utils/chart-helpers.js';

// ── Sample data ──────────────────────────────────────────────────────────────

// DataVizPalette.color5/6/10/3 resolved values – matches the React Charts FunnelChart story
const simpleData: FunnelDataPoint[] = [
  { stage: 'Visitors', value: 1000 },
  { stage: 'Signups', value: 600 },
  { stage: 'Trials', value: 300 },
  { stage: 'Customers', value: 250 },
];

// Matches the React Charts FunnelChart stacked story
const stackedData: FunnelDataPoint[] = [
  {
    stage: 'Visit',
    subValues: [
      { category: 'A', value: 100, color: DataVizPalette.color5 },
      { category: 'B', value: 80, color: DataVizPalette.color6 },
      { category: 'C', value: 50, color: DataVizPalette.color10 },
      { category: 'D', value: 30, color: DataVizPalette.color3 },
    ],
  },
  {
    stage: 'Sign-Up',
    subValues: [
      { category: 'A', value: 60, color: DataVizPalette.color5 },
      { category: 'B', value: 40, color: DataVizPalette.color6 },
      { category: 'C', value: 20, color: DataVizPalette.color10 },
      { category: 'D', value: 10, color: DataVizPalette.color3 },
    ],
  },
  {
    stage: 'Purchase',
    subValues: [
      { category: 'A', value: 30, color: DataVizPalette.color5 },
      { category: 'B', value: 20, color: DataVizPalette.color6 },
      { category: 'C', value: 10, color: DataVizPalette.color10 },
      { category: 'D', value: 5, color: DataVizPalette.color3 },
    ],
  },
];

// ── Stories ──────────────────────────────────────────────────────────────────

export default {
  title: 'Components/FunnelChart',
} as Meta<FluentFunnelChart>;

export const Basic: Story<FluentFunnelChart> = () => {
  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Basic Funnel Chart');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '500');
  chart.setAttribute('orientation', 'horizontal');
  return chart;
};
Basic.parameters = { docs: { story: { height: '560px' } } };

export const StandardAttributes: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');

  let width = 600;
  let height = 500;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Basic Funnel Chart');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('orientation', 'horizontal');
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'funnel-sa-width', width, 200, 1000, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'funnel-sa-height', height, 200, 1000, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'funnel-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Labels', 'funnel-sa-hide-labels', false, checked => {
      chart.toggleAttribute('hide-labels', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'funnel-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Rounded Corners', 'funnel-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'funnel-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '640px' } } };

export const Orientation: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Basic Funnel Chart');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '500');
  chart.setAttribute('orientation', 'horizontal');
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createRadioGroupField(
      'Orientation',
      'funnel-ca-orientation',
      [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
      'horizontal',
      newValue => {
        chart.setAttribute('orientation', newValue);
      },
    ).element,
  );

  container.appendChild(chart);
  return container;
};
Orientation.storyName = 'Orientation';
Orientation.parameters = { docs: { story: { height: '620px' } } };

export const Stacked: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');

  let width = 600;
  let height = 500;
  let hideLegends = false;
  let allowMultiple = false;
  let orientation: 'horizontal' | 'vertical' = 'horizontal';

  const renderChart = () => {
    // width/height accept both pixel numbers and CSS length strings (e.g. "50%").
    chart.setAttribute('width', `${width}`);
    chart.setAttribute('height', `${height}`);
    chart.hideLegends = hideLegends;
    chart.toggleAttribute('hide-legends', hideLegends);
    chart.allowMultipleLegendSelection = allowMultiple;
    chart.toggleAttribute('allow-multiple-legend-selection', allowMultiple);
    chart.orientation = orientation;
    chart.setAttribute('orientation', orientation);
  };

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  controls.appendChild(
    createSliderField('Change Width', 'funnel-stacked-width', width, 200, 1000, nextValue => {
      width = nextValue;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSliderField('Change Height', 'funnel-stacked-height', height, 200, 1000, nextValue => {
      height = nextValue;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSwitchField('Hide Legend', 'funnel-stacked-hide-legend', hideLegends, nextChecked => {
      hideLegends = nextChecked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createSwitchField('Multiple Legend Selection', 'funnel-stacked-multi-select', allowMultiple, nextChecked => {
      allowMultiple = nextChecked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createRadioGroupField(
      'Orientation',
      'funnel-stacked-orientation',
      [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
      orientation,
      newValue => {
        orientation = newValue as 'horizontal' | 'vertical';
        renderChart();
      },
    ).element,
  );

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Stacked Funnel Chart');
  chart.setAttribute('data', JSON.stringify(stackedData));
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('orientation', orientation);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  return container;
};
Stacked.parameters = { docs: { story: { height: '760px' } } };

export const HideTooltip: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  let hideTooltip = true;

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Funnel chart – hide tooltip');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  chart.toggleAttribute('hide-tooltip', hideTooltip);
  container.appendChild(chart);

  controls.appendChild(
    createSwitchField('Hide tooltip', 'funnel-hide-tooltip', hideTooltip, nextChecked => {
      hideTooltip = nextChecked;
      chart.hideTooltip = nextChecked;
      chart.toggleAttribute('hide-tooltip', nextChecked);
    }).element,
  );

  return container;
};
HideTooltip.parameters = { docs: { story: { height: '420px' } } };

export const Culture: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', `Funnel chart culture example (${currentCulture})`);
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField(
    'Culture',
    'funnel-culture',
    [...cultures],
    currentCulture,
    nextCulture => {
      currentCulture = nextCulture;
      chart.setAttribute('culture', currentCulture);
      chart.setAttribute('chart-title', `Funnel chart culture example (${currentCulture})`);
    },
  );
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '440px' } } };

export const TitleAlign: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const alignments = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof alignments)[number] = 'start';

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Funnel chart title alignment example');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  chart.setAttribute('title-align', currentAlign);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const alignControl = createDropdownField(
    'Title align',
    'funnel-title-align',
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

export const TitleAndLegendPositions: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  const positions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentPosition: (typeof positions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Title and legend position example');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const posControl = createDropdownField(
    'Legend position',
    'funnel-legend-position',
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
    'funnel-title-position',
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

export const RoundedCorners: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');

  let roundCorners = false;
  let orientation: 'horizontal' | 'vertical' = 'horizontal';

  const renderChart = () => {
    chart.roundCorners = roundCorners;
    chart.toggleAttribute('round-corners', roundCorners);
    chart.orientation = orientation;
    chart.setAttribute('orientation', orientation);
  };

  const controls = document.createElement('div');
  controls.setAttribute('style', `${controlsRowStyle}margin-bottom:16px;`);
  container.appendChild(controls);

  controls.appendChild(
    createSwitchField('Rounded corners', 'funnel-round-corners', roundCorners, nextChecked => {
      roundCorners = nextChecked;
      renderChart();
    }).element,
  );

  controls.appendChild(
    createRadioGroupField(
      'Orientation',
      'funnel-round-corners-orientation',
      [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
      orientation,
      newValue => {
        orientation = newValue as 'horizontal' | 'vertical';
        renderChart();
      },
    ).element,
  );

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Funnel chart rounded corners example');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  chart.setAttribute('orientation', orientation);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  return container;
};
RoundedCorners.parameters = { docs: { story: { height: '440px' } } };

export const TooltipRendererStory: Story<FluentFunnelChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a segment — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Funnel Chart — custom tooltipRenderer');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '600');
  chart.setAttribute('height', '300');
  (chart as any).tooltipRenderer = (_point: any, defaultRender: any) => {
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

export const ResponsiveWidth: Story<FluentFunnelChart> = () => {
  const outer = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'The chart uses width="75%" and height="75%". Drag the handle to resize the container — the funnel re-renders automatically.';
  outer.appendChild(info);

  // A resizable wrapper so the story viewer can see the responsive behaviour.
  const resizable = document.createElement('div');
  resizable.setAttribute(
    'style',
    'resize:both;overflow:auto;border:1px dashed #999;padding:8px;width:600px;min-width:200px;max-width:900px;',
  );
  outer.appendChild(resizable);

  const chart = document.createElement('fluent-funnel-chart') as FluentFunnelChart;
  chart.setAttribute('chart-title', 'Responsive funnel chart');
  chart.setAttribute('data', JSON.stringify(simpleData));
  chart.setAttribute('width', '75%');
  chart.setAttribute('height', '75%');

  resizable.appendChild(chart);
  return outer;
};
ResponsiveWidth.storyName = 'Responsive Width';
ResponsiveWidth.parameters = { docs: { story: { height: '440px' } } };

export const RTL: Story<FluentFunnelChart> = renderComponent(html<StoryArgs<FluentFunnelChart>>`
  <div dir="rtl">
    <fluent-funnel-chart
      chart-title="Funnel chart RTL example"
      data="${JSON.stringify(simpleData)}"
      width="600"
      height="300"
    ></fluent-funnel-chart>
  </div>
`);
