import {
  controlsRowStyle,
  createDropdownField,
  createSliderField,
  createSwitchField,
  type Meta,
  type Story,
} from '../helpers.stories.js';
import { DataVizPalette, getColorFromToken } from '../utils/chart-helpers.js';
import { definition } from './polar-chart.definition.js';
import type { PolarChartSeries } from './polar-chart.options.js';
import type { PolarChart } from './polar-chart.js';

// ── Sample data ───────────────────────────────────────────────────────────────

const basicData: PolarChartSeries[] = [
  {
    legend: 'Mike',
    color: DataVizPalette.color1,
    data: [
      { x: 'Math', y: 120 },
      { x: 'Chinese', y: 98 },
      { x: 'English', y: 86 },
      { x: 'Geography', y: 99 },
      { x: 'Physics', y: 85 },
      { x: 'History', y: 65 },
    ],
  },
  {
    legend: 'Lily',
    color: DataVizPalette.color3,
    data: [
      { x: 'Math', y: 110 },
      { x: 'Chinese', y: 130 },
      { x: 'English', y: 95 },
      { x: 'Geography', y: 90 },
      { x: 'Physics', y: 100 },
      { x: 'History', y: 90 },
    ],
  },
];

const basicTitle = 'Academic Performance';

export default { title: 'Components/PolarChart' } as Meta<PolarChart>;

export const Basic: Story<PolarChart> = () => {
  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.shape = 'polygon';
  chart.direction = 'clockwise';
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  return chart;
};
Basic.parameters = { docs: { story: { height: '570px' } } };

export const StandardAttributes: Story<PolarChart> = () => {
  const container = document.createElement('div');

  let width = 500;
  let height = 450;

  const sliderControls = document.createElement('div');
  sliderControls.setAttribute('style', controlsRowStyle);
  container.appendChild(sliderControls);

  const toggleControls = document.createElement('div');
  toggleControls.setAttribute('style', `margin-top:16px;${controlsRowStyle}`);
  container.appendChild(toggleControls);

  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = basicTitle;
  chart.setAttribute('width', `${width}`);
  chart.setAttribute('height', `${height}`);
  chart.setAttribute('style', 'margin-top:20px;');

  const widthControl = createSliderField('Width', 'polar-sa-width', width, 200, 800, nextValue => {
    width = nextValue;
    widthControl.setValue(nextValue);
    chart.setAttribute('width', `${nextValue}`);
  });
  sliderControls.appendChild(widthControl.element);

  const heightControl = createSliderField('Height', 'polar-sa-height', height, 200, 700, nextValue => {
    height = nextValue;
    heightControl.setValue(nextValue);
    chart.setAttribute('height', `${nextValue}`);
  });
  sliderControls.appendChild(heightControl.element);

  toggleControls.appendChild(
    createSwitchField('Hide Legends', 'polar-sa-hide-legends', false, checked => {
      chart.toggleAttribute('hide-legends', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Hide Tooltip', 'polar-sa-hide-tooltip', false, checked => {
      chart.toggleAttribute('hide-tooltip', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Round Corners', 'polar-sa-round-corners', false, checked => {
      chart.toggleAttribute('round-corners', checked);
    }).element,
  );

  toggleControls.appendChild(
    createSwitchField('Multiple Legend Selection', 'polar-sa-multi-select', false, checked => {
      chart.toggleAttribute('allow-multiple-legend-selection', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
StandardAttributes.storyName = 'Standard Attributes';
StandardAttributes.parameters = { docs: { story: { height: '420px' } } };

export const ShowMarkers: Story<PolarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = 'Polar chart attributes example';
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  chart.setAttribute('style', 'margin-top:20px;');

  controls.appendChild(
    createDropdownField('Shape', 'polar-shape', ['circle', 'polygon'], 'circle', nextShape => {
      chart.setAttribute('shape', nextShape);
    }).element,
  );
  controls.appendChild(
    createDropdownField(
      'Direction',
      'polar-direction',
      ['counterclockwise', 'clockwise'],
      'counterclockwise',
      nextDirection => {
        chart.setAttribute('direction', nextDirection);
      },
    ).element,
  );
  controls.appendChild(
    createSwitchField('Show markers', 'polar-show-markers', false, checked => {
      chart.toggleAttribute('show-markers', checked);
    }).element,
  );
  controls.appendChild(
    createSwitchField('Multi-value callout', 'polar-multi-value-callout', false, checked => {
      chart.toggleAttribute('enable-multi-value-callout', checked);
    }).element,
  );

  container.appendChild(chart);
  return container;
};
ShowMarkers.storyName = 'Chart Attributes';
ShowMarkers.parameters = { docs: { story: { height: '620px' } } };

export const MixedSeries: Story<PolarChart> = () => {
  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = [
    {
      type: 'areapolar',
      legend: 'Current',
      color: DataVizPalette.color1,
      data: [
        { theta: 'Quality', r: 82 },
        { theta: 'Speed', r: 74 },
        { theta: 'Reliability', r: 88 },
        { theta: 'Support', r: 70 },
        { theta: 'Value', r: 78 },
        { theta: 'Adoption', r: 65 },
      ],
    },
    {
      type: 'linepolar',
      legend: 'Target',
      color: DataVizPalette.color7,
      lineOptions: { curve: 'natural', strokeWidth: 3, strokeDasharray: '7 4', strokeLinecap: 'round' },
      data: [
        { theta: 'Quality', r: 90 },
        { theta: 'Speed', r: 85 },
        { theta: 'Reliability', r: 92 },
        { theta: 'Support', r: 80 },
        { theta: 'Value', r: 88 },
        { theta: 'Adoption', r: 82 },
      ],
    },
    {
      type: 'scatterpolar',
      legend: 'Milestones',
      color: DataVizPalette.success,
      data: [
        { theta: 'Quality', r: 95, markerSize: 8 },
        { theta: 'Reliability', r: 96, markerSize: 12, text: 'Release' },
        { theta: 'Value', r: 91, markerSize: 10 },
      ],
    },
  ];
  chart.chartTitle = 'Mixed polar series';
  chart.shape = 'polygon';
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  return chart;
};
MixedSeries.storyName = 'Mixed Series';
MixedSeries.parameters = { docs: { story: { height: '570px' } } };

export const NumericAndLogarithmicAxes: Story<PolarChart> = () => {
  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = [
    {
      type: 'areapolar',
      legend: 'Response time',
      color: DataVizPalette.color6,
      data: [
        { theta: 0, r: 10 },
        { theta: 60, r: 40 },
        { theta: 120, r: 300 },
        { theta: 180, r: 80 },
        { theta: 240, r: 600 },
        { theta: 300, r: 120 },
      ],
    },
  ];
  chart.chartTitle = 'Numeric angle and logarithmic radius';
  chart.hole = 0.2;
  chart.angularAxis = { tickCount: 6, unit: 'radians' };
  chart.radialAxis = {
    scaleType: 'log',
    rangeStart: 1,
    rangeEnd: 1000,
    tickValues: [1, 10, 100, 1000],
    tickFormat: '.0s',
  };
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  return chart;
};
NumericAndLogarithmicAxes.storyName = 'Numeric and Logarithmic Axes';
NumericAndLogarithmicAxes.parameters = { docs: { story: { height: '570px' } } };

export const MultiValueCallout: Story<PolarChart> = () => {
  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = 'Grouped values by subject';
  chart.shape = 'polygon';
  chart.direction = 'clockwise';
  chart.enableMultiValueCallout = true;
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  return chart;
};
MultiValueCallout.storyName = 'Multi-value Callout';
MultiValueCallout.parameters = { docs: { story: { height: '570px' } } };

export const TooltipRendererStory: Story<PolarChart> = () => {
  const container = document.createElement('div');

  const info = document.createElement('p');
  info.textContent =
    'Hover over a radar point — the tooltip body is replaced by a custom renderer that wraps the default HTML in a styled box.';
  container.appendChild(info);

  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = 'Polar chart custom tooltipRenderer';
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  chart.tooltipRenderer = (_point, defaultRender) => {
    const accentColor = getColorFromToken(DataVizPalette.color1);
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `padding:8px;border-left:3px solid ${accentColor};background:color-mix(in srgb, ${accentColor} 10%, transparent);`;
    wrapper.innerHTML = defaultRender(_point);
    return wrapper;
  };

  container.appendChild(chart);
  return container;
};
TooltipRendererStory.storyName = 'Tooltip Renderer';
TooltipRendererStory.parameters = { docs: { story: { height: '570px' } } };

export const Culture: Story<PolarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const cultures = ['en-US', 'de-DE', 'fr-FR', 'nl-NL', 'ja-JP', 'ar-SA'] as const;
  let currentCulture: string = 'en-US';

  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = `Academic Performance (${currentCulture})`;
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  chart.setAttribute('culture', currentCulture);
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  const cultureControl = createDropdownField('Culture', 'polar-culture', [...cultures], currentCulture, nextCulture => {
    currentCulture = nextCulture;
    chart.setAttribute('culture', currentCulture);
    chart.chartTitle = `Academic Performance (${currentCulture})`;
  });
  controls.appendChild(cultureControl.element);

  return container;
};
Culture.parameters = { docs: { story: { height: '570px' } } };

export const TitleAlign: Story<PolarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const aligns = ['start', 'center', 'end'] as const;
  let currentAlign: (typeof aligns)[number] = 'start';

  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = 'Polar chart title align example';
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField('Title align', 'polar-title-align', [...aligns], currentAlign, nextAlign => {
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
TitleAlign.parameters = { docs: { story: { height: '570px' } } };

export const TitleAndLegendPositions: Story<PolarChart> = () => {
  const container = document.createElement('div');
  const controls = document.createElement('div');
  controls.setAttribute('style', controlsRowStyle);
  container.appendChild(controls);

  const legendPositions = ['bottom', 'top', 'start', 'end'] as const;
  const titlePositions = ['top', 'bottom'] as const;
  let currentLegendPosition: (typeof legendPositions)[number] = 'bottom';
  let currentTitlePosition: (typeof titlePositions)[number] = 'top';

  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = 'Polar chart title and legend positions example';
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  chart.setAttribute('style', 'margin-top:20px;');
  container.appendChild(chart);

  controls.appendChild(
    createDropdownField(
      'Title position',
      'polar-title-position',
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
      'polar-legend-position',
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
TitleAndLegendPositions.parameters = { docs: { story: { height: '570px' } } };

export const RTL: Story<PolarChart> = () => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('dir', 'rtl');
  const chart = document.createElement('fluent-polar-chart') as PolarChart;
  chart.data = basicData;
  chart.chartTitle = 'Polar chart RTL example';
  chart.setAttribute('width', '500');
  chart.setAttribute('height', '450');
  wrapper.appendChild(chart);
  return wrapper;
};
RTL.parameters = { docs: { story: { height: '570px' } } };
