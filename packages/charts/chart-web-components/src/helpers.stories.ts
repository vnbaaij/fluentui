import type { ElementViewTemplate, FASTElement, ViewTemplate } from '@microsoft/fast-element';
import type { AnnotatedStoryFn, Args, ComponentAnnotations, Renderer, StoryAnnotations } from 'storybook/internal/csf';

/**
 * A helper that returns a function to bind a Storybook story to a ViewTemplate.
 *
 * @param template - The ViewTemplate to render
 * @returns - a function to bind a Storybook story
 */
export function renderComponent<TArgs = Args>(template: ViewTemplate): (args: TArgs) => Element | DocumentFragment {
  return function (args) {
    const storyFragment = new DocumentFragment();
    template.render(args, storyFragment);
    if (storyFragment.childElementCount === 1) {
      return storyFragment.firstElementChild!;
    }
    return storyFragment;
  };
}

export declare interface FASTComponentsRenderer extends Renderer {
  canvasElement: FASTElement;
  component: typeof FASTElement | string;
  storyResult: string | Node | DocumentFragment | ElementViewTemplate;
}

/**
 * A helper that returns a function to bind a Storybook story to a ViewTemplate.
 */
export type FASTFramework = Renderer & {
  component: typeof FASTElement;
  storyResult: FASTElement | Element | DocumentFragment;
};

/**
 * Metadata to configure the stories for a component.
 */
export declare type Meta<TArgs = Args> = ComponentAnnotations<FASTComponentsRenderer, StoryArgs<TArgs>>;

/**
 * Story object that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export declare type StoryObj<TArgs = Args> = StoryAnnotations<FASTComponentsRenderer, StoryArgs<TArgs>>;

/**
 * Story function that represents a CSFv2 component example.
 */
export declare type StoryFn<TArgs = Args> = AnnotatedStoryFn<FASTFramework, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * NOTE that in Storybook 7.0, this type will be renamed to `StoryFn` and replaced by the current `StoryObj` type.
 */
export declare type Story<TArgs = Args> = StoryFn<StoryArgs<TArgs>>;

/**
 * Combined Storybook story args.
 */
export type StoryArgs<TArgs = Args> = Partial<Omit<TArgs, keyof FASTElement>> & Args;

export function generateImage({
  width,
  height = width,
  backgroundColor = 'rgb(204, 204, 204)',
  color = 'rgb(150, 150, 150)',
  text = `${width} x ${height}`,
}: {
  width: number;
  height?: number;
  backgroundColor?: string;
  color?: string;
  text?: string;
}): string {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.width = width;
  canvas.height = height;

  // Clear the canvas.
  context.clearRect(0, 0, canvas.width, canvas.height);

  // get the font size to fit the text
  context.font = '1px sans-serif';
  const maxFontSize = Math.max(width / context.measureText(text).width / 2, 7);

  // Draw the background
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = `${maxFontSize}px Helvetica, Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL('image/png');
}

// ── Shared story control infrastructure ──────────────────────────────────────

// Shared element types
export type FluentSliderElement = HTMLElement & { value: string };
export type FluentSwitchElement = HTMLElement & { checked: boolean };
export type FluentDropdownElement = HTMLElement & { value: string };
export type FluentTextInputElement = HTMLElement & { value: string };
export type FluentCheckboxElement = HTMLElement & { checked: boolean };

// Shared layout styles
export const controlsRowStyle = 'display:flex;flex-wrap:wrap;gap:16px 24px;align-items:end;';
export const sliderFieldStyle = 'min-width:220px;flex:1 1 220px;';
export const toggleFieldStyle = 'min-width:220px;';
export const visuallyHiddenStyle =
  'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;';

export const createSliderField = (
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

export const createSwitchField = (
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

export const createCheckboxField = (
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

export const createDropdownField = (
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

export const createTextInputField = (
  labelText: string,
  id: string,
  value: string,
  onChange: (nextValue: string | undefined) => void,
) => {
  const field = document.createElement('fluent-field');
  field.setAttribute('label-position', 'above');
  field.setAttribute('style', sliderFieldStyle);

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

export const createRadioGroupField = (
  labelText: string,
  name: string,
  options: Array<{ label: string; value: string }>,
  currentValue: string,
  onChange: (value: string) => void,
) => {
  const outerField = document.createElement('fluent-field');
  outerField.setAttribute('label-position', 'above');

  const groupLabel = document.createElement('label');
  groupLabel.slot = 'label';
  groupLabel.textContent = labelText;
  outerField.appendChild(groupLabel);

  const radioGroup = document.createElement('fluent-radio-group');
  radioGroup.slot = 'input';
  radioGroup.setAttribute('name', name);
  radioGroup.setAttribute('value', currentValue);
  outerField.appendChild(radioGroup);

  for (const option of options) {
    const itemField = document.createElement('fluent-field');
    itemField.setAttribute('label-position', 'after');

    const radio = document.createElement('fluent-radio') as HTMLInputElement;
    radio.slot = 'input';
    radio.setAttribute('value', option.value);
    if (option.value === currentValue) {
      radio.toggleAttribute('checked', true);
    }
    radio.addEventListener('change', () => onChange(option.value));
    itemField.appendChild(radio);

    const itemLabel = document.createElement('label');
    itemLabel.slot = 'label';
    itemLabel.textContent = option.label;
    itemField.appendChild(itemLabel);

    radioGroup.appendChild(itemField);
  }

  return {
    element: outerField,
    setValue: (newValue: string) => {
      radioGroup.setAttribute('value', newValue);
    },
  };
};

export const createFluentButton = (text: string, onClick: () => void) => {
  const button = document.createElement('fluent-button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
};
