/// <reference path="./types.d.ts" />

import * as React from 'react'

export interface InputProps {
  autoresize: boolean
  expanded: boolean,
  listboxId: string,
  placeholder: string,
  query: string,
  selected: number,
  classNames: ReactTags.ClassNames
}

export interface InputState {
  inputWidth?: number
}

const SIZER_STYLES: React.CSSProperties = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  overflow: 'scroll',
  whiteSpace: 'pre'
}

const STYLE_PROPS = [
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing'
]

class Input extends React.Component<InputProps, InputState> {
  input: HTMLInputElement
  sizer: HTMLDivElement

  constructor (props: InputProps) {
    super(props)
    this.state = { inputWidth: undefined }
  }

  componentDidMount () {
    if (this.props.autoresize) {
      this.copyInputStyles()
      this.updateInputWidth()
    }
  }

  componentDidUpdate () {
    this.updateInputWidth()
  }

  componentWillReceiveProps (newProps: InputProps) {
    if (this.input.value !== newProps.query) {
      this.input.value = newProps.query
    }
  }

  copyInputStyles () {
    const inputStyle = window.getComputedStyle(this.input)

    STYLE_PROPS.forEach((prop) => {
      // TS considers CSSStyleDeclaration as numerically indexed only...
      this.sizer.style[prop as any] = inputStyle[prop as any]
    })
  }

  updateInputWidth () {
    let inputWidth

    if (this.props.autoresize) {
      // scrollWidth is designed to be fast not accurate.
      // +2 is completely arbitrary but does the job.
      inputWidth = Math.ceil(this.sizer.scrollWidth) + 2
    }

    // This check avoids an ∞ loop!
    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth })
    }
  }

  render () {
    const { query, placeholder, expanded, listboxId, selected } = this.props
    const { inputWidth } = this.state

    return (
      <div className={this.props.classNames.searchInput}>
        <input
          ref={(c) => { this.input = c as any }}
          value={query}
          placeholder={placeholder}
          role='combobox'
          aria-autocomplete='list'
          aria-label={placeholder}
          aria-owns={listboxId}
          aria-activedescendant={selected > -1 ? `${listboxId}-${selected}` : null}
          aria-expanded={expanded}
          style={{ width: inputWidth }} />
        <div ref={(c) => { this.sizer = c as any }} style={SIZER_STYLES}>{query || placeholder}</div>
      </div>
    )
  }
}

export default Input
