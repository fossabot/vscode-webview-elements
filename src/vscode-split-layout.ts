import { css, CSSResultGroup, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map';
import { styleMap } from 'lit/directives/style-map';
import { VscElement } from './includes/VscElement';

const HANDLE_SIZE = 4;

@customElement('vscode-split-layout')
export class VscodeSplitLayout extends VscElement {
  @property()
  split: 'horizontal' | 'vertical' = 'vertical';

  @property({ type: Boolean })
  resetOnDblClick = false;

  @property()
  initialPos = '50%';

  @state() _startPaneRight = 0;

  @state() _startPaneBottom = 0;

  @state() _endPaneTop = 0;

  @state() _endPaneLeft = 0;

  @state() _handleLeft = 0;

  @state() _handleTop = 0;

  @state() _isDragActive = false;

  @state()
  private _hover = false;

  @state()
  private _hide = false;

  private _boundRect: DOMRect = new DOMRect();

  private _handleOffset = 0;

  connectedCallback(): void {
    super.connectedCallback();

    this._boundRect = this.getBoundingClientRect();

    this._initPosition();
  }

  private _initPosition() {
    const { height, width } = this._boundRect;
    const maxPos = this.split === 'vertical' ? width : height;
    const matches = /(^[0-9.]+)(%{0,1})$/.exec(this.initialPos);
    let pos = 0;
    let numericVal = 0;

    if (matches) {
      numericVal = parseFloat(matches[1]);
    }

    if (matches && matches[2] === '%') {
      pos = Math.min(maxPos, (maxPos / 100) * numericVal);
    } else if (matches && matches[2] !== '%') {
      pos = Math.min(numericVal, maxPos);
    } else {
      pos = maxPos / 2;
    }

    if (this.split === 'vertical') {
      this._startPaneRight = maxPos - pos;
      this._endPaneLeft = pos;
      this._handleLeft = pos;
    }

    if (this.split === 'horizontal') {
      this._startPaneBottom = maxPos - pos;
      this._endPaneTop = pos;
      this._handleTop = pos;
    }
  }

  private _handleMouseOver() {
    this._hover = true;
    this._hide = false;
  }

  private _handleMouseOut(event: MouseEvent) {
    if (event.buttons !== 1) {
      this._hover = false;
      this._hide = true;
    }
  }

  private _handleMouseDown(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    const mouseXLocal = event.clientX - this._boundRect.left;
    const mouseYLocal = event.clientY - this._boundRect.top;

    if (this.split === 'vertical') {
      this._handleOffset = mouseXLocal - this._handleLeft;
    }

    if (this.split === 'horizontal') {
      this._handleOffset = mouseYLocal - this._handleTop;
    }

    this._boundRect = this.getBoundingClientRect();
    this._isDragActive = true;

    window.addEventListener('mouseup', this._handleMouseUpBound);
    window.addEventListener('mousemove', this._handleMouseMoveBound);
  }

  private _handleMouseUp() {
    this._isDragActive = false;
    window.removeEventListener('mouseup', this._handleMouseUpBound);
    window.removeEventListener('mousemove', this._handleMouseMoveBound);
  }

  private _handleMouseUpBound = this._handleMouseUp.bind(this);

  private _handleMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { left, top, height, width } = this._boundRect;

    if (this.split === 'vertical') {
      const mouseXLocal = clientX - left;

      this._handleLeft = Math.max(0, Math.min(mouseXLocal - this._handleOffset, width));
      this._startPaneRight = Math.max(0, width - this._handleLeft);
      this._endPaneLeft = this._handleLeft;
    }

    if (this.split === 'horizontal') {
      const mouseYLocal = clientY - top;

      this._handleTop = Math.max(0, Math.min(mouseYLocal - this._handleOffset, height));
      this._startPaneBottom = Math.max(0, height - this._handleTop);
      this._endPaneTop = this._handleTop;
    }
  }

  private _handleMouseMoveBound = this._handleMouseMove.bind(this);

  private _handleDblClick() {
    if (!this.resetOnDblClick) {
      return;
    }

    this._initPosition();
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      css`
        :host {
          display: block;
          overflow: hidden;
          position: relative;
        }

        .start {
          left: 0;
          top: 0;
          overflow: hidden;
          position: absolute;
        }

        .end {
          bottom: 0;
          overflow: hidden;
          position: absolute;
          right: 0;
        }

        .handle-overlay {
          display: none;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: 1;
        }

        .handle-overlay.active {
          display: block;
        }

        .handle-overlay.split-vertical {
          cursor: ew-resize;
        }

        .handle-overlay.split-horizontal {
          cursor: ns-resize;
        }

        .handle {
          position: absolute;
          z-index: 2;
        }

        .handle.hover {
          background-color: var(--vscode-sash-hoverBorder);
          transition: background-color 100ms linear 300ms;
        }

        .handle.hide {
          background-color: transparent;
          transition: background-color 100ms linear;
        }

        .handle.split-vertical {
          cursor: ew-resize;
          height: 100%;
        }

        .handle.split-horizontal {
          cursor: ns-resize;
          width: 100%;
        }
      `,
    ];
  }

  render(): TemplateResult {
    const startPaneStyles = {
      bottom: `${this._startPaneBottom}px`,
      right: `${this._startPaneRight}px`,
    };

    const endPaneStyles = {
      left: `${this._endPaneLeft}px`,
      top: `${this._endPaneTop}px`,
    };

    const handleStyles: { [prop: string]: string } = {
      left: `${this._handleLeft}px`,
      top: `${this._handleTop}px`,
    };

    if (this.split === 'vertical') {
      handleStyles.marginLeft = `${0 - HANDLE_SIZE / 2}px`;
      handleStyles.width = `${HANDLE_SIZE}px`;
    }

    if (this.split === 'horizontal') {
      handleStyles.height = `${HANDLE_SIZE}px`;
      handleStyles.marginTop = `${0 - HANDLE_SIZE / 2}px`;
    }

    // const handleStyles = styleMap(handleStylesPropObj);

    const handleOverlayClasses = {
      'handle-overlay': true,
      active: this._isDragActive,
      'split-vertical': this.split === 'vertical',
      'split-horizontal': this.split === 'horizontal',
    };

    const handleClasses = {
      handle: true,
      hover: this._hover,
      hide: this._hide,
      'split-vertical': this.split === 'vertical',
      'split-horizontal': this.split === 'horizontal',
    };

    return html`
      <div class="start" style=${styleMap(startPaneStyles)}>
        <slot name="start"></slot>
      </div>
      <div class="end" style=${styleMap(endPaneStyles)}>
        <slot name="end"></slot>
      </div>
      <div class=${classMap(handleOverlayClasses)}></div>
      <div
        class=${classMap(handleClasses)}
        style=${styleMap(handleStyles)}
        @mouseover=${this._handleMouseOver}
        @mouseout=${this._handleMouseOut}
        @mousedown=${this._handleMouseDown}
        @dblclick=${this._handleDblClick}
      ></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vscode-split-layout': VscodeSplitLayout;
  }
}
