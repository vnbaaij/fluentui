import { css } from '@microsoft/fast-element';
import { display } from '@fluentui/web-components';

export const styles = css`
  ${display('block')}

  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .chart-container,
  .chart {
    display: block;
    width: 100%;
    height: 100%;
  }

  .sparkline-line {
    fill: none;
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .sparkline-area {
    opacity: 0.18;
  }
`;
