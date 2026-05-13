import { FASTElement, attr, observable } from '@microsoft/fast-element';
import type { Legend } from '../utils/chart.options.js';

/**
 * A reusable legend list used by all chart components.
 *
 * Renders a listbox of colour-coded legend buttons and emits custom events
 * (`legend-click`, `legend-mouseover`, `legend-mouseout`, `legend-focus`,
 * `legend-blur`) so the parent chart can update its interaction state.
 *
 * The parent is responsible for keeping `highlighted` up to date by calling
 * `_applyLegendButtonState()` on ChartBase whenever interaction state changes.
 *
 * @public
 */
export class ChartLegend extends FASTElement {
  /** The legend items to render. */
  @observable
  public items: Legend[] = [];

  /**
   * Legend titles that are currently active (hovered, focused, or selected).
   * When non-empty, all other items are dimmed.
   */
  @observable
  public highlighted: string[] = [];

  /** Accessible label for the legend listbox (`aria-label`). */
  @attr
  public label?: string;
}
