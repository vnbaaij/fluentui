import { attr } from '@microsoft/fast-element';
import { FASTSwitch } from '@microsoft/fast-foundation';
import { SwitchLabelPosition } from './switch.options.js';

export class Switch extends FASTSwitch {
  /**
   * The label position of the switch
   *
   * @public
   * @remarks
   * HTML Attribute: label
   */
  @attr
  public labelPosition: SwitchLabelPosition = 'after';
}
