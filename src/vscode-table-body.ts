import {
  LitElement,
  html,
  customElement,
  css,
  TemplateResult,
  property,
} from 'lit-element';

@customElement('vscode-table-body')
export class VscodeTableBody extends LitElement {
  @property({reflect: true})
  role = 'rowgroup';

  static styles = css`
    :host {
      display: table;
      table-layout: fixed;
      width: 100%;
    }

    :host-context(vscode-table[zebra]) ::slotted(vscode-table-row:nth-child(even)) {
      background-color: rgba(130, 130, 130, 0.04);;
    }

    :host-context(vscode-table[zebra-odd]) ::slotted(vscode-table-row:nth-child(odd)) {
      background-color: rgba(130, 130, 130, 0.04);;
    }
  `;

  render(): TemplateResult {
    return html`
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vscode-table-body': VscodeTableBody;
  }
}
