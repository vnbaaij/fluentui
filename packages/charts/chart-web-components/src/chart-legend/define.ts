import {
  FluentDesignSystem,
  MenuButtonDefinition,
  MenuDefinition,
  MenuItemDefinition,
  MenuListDefinition,
} from '@fluentui/web-components';
import { definition } from './chart-legend.definition.js';

const ensureDefinition = (tagName: string, define: () => void) => {
  if (!customElements.get(tagName)) {
    define();
  }
};

ensureDefinition(`${FluentDesignSystem.prefix}-menu`, () => MenuDefinition.define(FluentDesignSystem.registry));
ensureDefinition(`${FluentDesignSystem.prefix}-menu-button`, () =>
  MenuButtonDefinition.define(FluentDesignSystem.registry),
);
ensureDefinition(`${FluentDesignSystem.prefix}-menu-list`, () =>
  MenuListDefinition.define(FluentDesignSystem.registry),
);
ensureDefinition(`${FluentDesignSystem.prefix}-menu-item`, () =>
  MenuItemDefinition.define(FluentDesignSystem.registry),
);

definition.define(FluentDesignSystem.registry);
