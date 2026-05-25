import type { ElementStyles } from '@microsoft/fast-element';
import { css } from '@microsoft/fast-element';
import {
  borderRadiusMedium,
  colorNeutralBackground1,
  colorNeutralForeground1,
  colorNeutralForeground2,
  colorNeutralShadowAmbient,
  colorNeutralShadowKey,
  colorNeutralStroke1,
  colorStrokeFocus1,
  colorStrokeFocus2,
  display,
  spacingHorizontalS,
  spacingVerticalXS,
  strokeWidthThick,
  strokeWidthThickest,
  typographyBody1StrongStyles,
  typographyCaption1Styles,
} from '@fluentui/web-components';
import { tooltipBaseStyles } from '../utils/tooltip.styles.js';

/**
 * Styles for the HeatMapChart component.
 *
 * @public
 */
export const styles: ElementStyles = css`
  ${display('block')}

  :host {
    display: grid;
    grid-template-areas:
      'title'
      'chart'
      'legend';
    grid-template-columns: 1fr;
    position: relative;
    width: 100%;
  }

  /* ── Title and legend layout (CSS Grid named areas) ─────────── */

  .chart-title {
    grid-area: title;
    margin-bottom: 8px;
    ${typographyBody1StrongStyles}
    text-align: start;
  }

  .chart-container {
    grid-area: chart;
    min-width: 0; /* allow grid cell to shrink below SVG intrinsic width */
  }

  fluent-chart-legend {
    grid-area: legend;
  }

  /* title-position="bottom" */
  :host([title-position='bottom']) {
    grid-template-areas:
      'chart'
      'legend'
      'title';
  }

  :host([title-position='bottom']) .chart-title {
    margin-bottom: 0;
    margin-top: 8px;
  }

  /* legend-position="top" */
  :host([legend-position='top']) {
    grid-template-areas:
      'title'
      'legend'
      'chart';
  }

  /* legend-position="start" */
  :host([legend-position='start']) {
    grid-template-areas:
      'title  title'
      'legend chart';
    grid-template-columns: auto 1fr;
  }

  /* legend-position="end" */
  :host([legend-position='end']) {
    grid-template-areas:
      'title  title'
      'chart  legend';
    grid-template-columns: 1fr auto;
  }

  /* Legend on side: anchor legend to the top of its cell */
  :host([legend-position='start']) fluent-chart-legend,
  :host([legend-position='end']) fluent-chart-legend {
    align-self: start;
  }

  /* Combined: title-position="bottom" + legend-position="top" */
  :host([title-position='bottom'][legend-position='top']) {
    grid-template-areas:
      'legend'
      'chart'
      'title';
    grid-template-columns: 1fr;
  }

  /* Combined: title-position="bottom" + legend-position="start" */
  :host([title-position='bottom'][legend-position='start']) {
    grid-template-areas:
      'legend chart'
      'title  title';
    grid-template-columns: auto 1fr;
  }

  /* Combined: title-position="bottom" + legend-position="end" */
  :host([title-position='bottom'][legend-position='end']) {
    grid-template-areas:
      'chart  legend'
      'title  title';
    grid-template-columns: 1fr auto;
  }

  :host([title-align='center']) .chart-title {
    text-align: center;
  }

  :host([title-align='end']) .chart-title {
    text-align: end;
  }

  .chart-svg {
    display: block;
    overflow: visible;
  }

  /* ── Axes ──────────────────────────────────────────────────── */

  .axis-domain {
    stroke: ${colorNeutralStroke1};
    stroke-width: 1;
    opacity: 0.2;
  }

  .axis-text,
  .y-axis-text {
    ${typographyCaption1Styles}
    fill: ${colorNeutralForeground2};
    font-size: 10px;
    font-weight: 600;
  }

  .axis-title {
    ${typographyCaption1Styles}
    fill: ${colorNeutralForeground2};
    font-size: 11px;
  }

  /* ── Grid cells ────────────────────────────────────────────── */

  .heat-cell {
    cursor: default;
  }

  .heat-cell.inactive {
    opacity: 0.1;
  }

  .heat-rect {
    rx: 2px;
  }

  .cell-text {
    pointer-events: none;
    user-select: none;
  }

  .heat-cell:focus {
    outline: none;
  }

  .heat-cell:focus .heat-rect {
    outline: ${strokeWidthThick} solid ${colorStrokeFocus2};
    outline-offset: 2px;
    stroke: ${colorStrokeFocus1};
    stroke-width: ${strokeWidthThickest};
  }

  /* ── Live region (screen-reader announcements) ─────────────── */

  .live-region {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  /* ── Tooltip ────────────────────────────────────────────────── */

  ${tooltipBaseStyles}

  .tooltip {
    ${typographyCaption1Styles}
    z-index: 999;
    box-shadow: 0 0 2px ${colorNeutralShadowAmbient}, 0 4px 8px ${colorNeutralShadowKey};
    border: ${strokeWidthThick};
    white-space: nowrap;
    border-radius: ${borderRadiusMedium};
    background: ${colorNeutralBackground1};
    color: ${colorNeutralForeground1};
    padding: ${spacingVerticalXS} ${spacingHorizontalS};
  }

  .tooltip-header {
    ${typographyCaption1Styles}
    color: ${colorNeutralForeground2};
    opacity: 0.8;
    margin-bottom: 4px;
  }

  .tooltip-value {
    font-weight: bold;
    color: ${colorNeutralForeground1};
  }

  .tooltip-ratio,
  .tooltip-description {
    ${typographyCaption1Styles}
    color: ${colorNeutralForeground2};
    margin-top: 2px;
  }

  /* ── Forced-colors (Windows High Contrast) ─────────────────── */

  @media (forced-colors: active) {
    .heat-rect {
      forced-color-adjust: none;
    }

    .heat-cell:focus .heat-rect {
      stroke: Highlight;
    }

    .axis-text,
    .y-axis-text,
    .axis-title,
    .cell-text {
      fill: CanvasText;
    }

    .axis-domain {
      stroke: CanvasText;
    }
  }
`;
