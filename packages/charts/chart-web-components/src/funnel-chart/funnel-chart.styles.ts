import { css } from '@microsoft/fast-element';
import {
  borderRadiusMedium,
  colorNeutralBackground1,
  colorNeutralForeground1,
  colorNeutralShadowAmbient,
  colorNeutralShadowKey,
  colorStrokeFocus1,
  colorStrokeFocus2,
  colorTransparentStroke,
  display,
  spacingHorizontalL,
  spacingHorizontalS,
  spacingVerticalMNudge,
  spacingVerticalS,
  strokeWidthThickest,
  strokeWidthThin,
  typographyBody1StrongStyles,
  typographyCaption1Styles,
  typographyTitle2Styles,
} from '@fluentui/web-components';
import { tooltipBaseStyles } from '../utils/tooltip.styles.js';

/**
 * Styles for the FunnelChart component.
 *
 * @public
 */
export const styles = css`
  ${display('block')}

  :host {
    ${typographyBody1StrongStyles}
    width: 100%;
    height: 100%;
    position: relative;
  }

  .chart-title {
    ${typographyBody1StrongStyles}
    color: ${colorNeutralForeground1};
    margin-bottom: ${spacingVerticalS};
  }

  .chart {
    box-sizing: content-box;
    overflow: visible;
    display: block;
  }

  .funnel-segment {
    transition: opacity 0.1s ease;
  }

  .funnel-segment.inactive {
    opacity: 0.1;
  }

  .funnel-segment:focus {
    outline: none;
    stroke-width: ${strokeWidthThin};
    stroke: ${colorStrokeFocus1};
  }

  .funnel-segment:focus-visible {
    stroke-width: ${strokeWidthThickest};
    stroke: ${colorStrokeFocus2};
  }

  .funnel-segment-text {
    font-size: 12px;
    pointer-events: none;
    user-select: none;
  }

  .funnel-segment-text.inactive {
    opacity: 0.1;
  }

  ${tooltipBaseStyles}

  .tooltip {
    z-index: 1;
    background-blend-mode: normal, luminosity;
    border-radius: ${borderRadiusMedium};
    border: 1px solid ${colorTransparentStroke};
    filter: drop-shadow(0 0 2px ${colorNeutralShadowAmbient}) drop-shadow(0 8px 16px ${colorNeutralShadowKey});
  }

  .tooltip-inner {
    padding-inline-start: ${spacingHorizontalS};
    color: ${colorNeutralForeground1};
    border-inline-start: 4px solid;
  }

  .tooltip-legend-text {
    ${typographyCaption1Styles}
  }

  .tooltip-value {
    ${typographyTitle2Styles}
  }

  @media (forced-colors: active) {
    .funnel-segment-text {
      fill: CanvasText;
    }

    .tooltip-body {
      forced-color-adjust: none;
    }

    .tooltip-legend-text,
    .tooltip-content-y {
      forced-color-adjust: auto;
      color: CanvasText;
    }
  }
`;
