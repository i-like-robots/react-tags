'use strict'

const React = require('react')

const SIZER_STYLES = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  overflow: 'scroll',
  whiteSpace: 'pre'
}

const STYLE_PROPS = [
  'fontSize',
  'fontFamily',
  'fontWeight',
  'fontStyle',
  'letterSpacing',
  'textTransform'
]

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputWidth: null }
  }

  componentDidMount () {
    if (this.props.autoresize) {
      this.copyInputStyles()
      this.updateInputWidth()
    }

    if (this.props.autofocus) {
      this.input.focus()
    }
  }

  componentDidUpdate ({ query, placeholder }) {
    if (query !== this.props.query || placeholder !== this.props.placeholder) {
      this.updateInputWidth()
    }
  }

  copyInputStyles () {
    const inputStyle = window.getComputedStyle(this.input)

    STYLE_PROPS.forEach((prop) => {
      this.sizer.style[prop] = inputStyle[prop]
    })
  }

  updateInputWidth () {
    let inputWidth

    if (this.props.autoresize) {
      // scrollWidth is designed to be fast not accurate.
      // +2 is completely arbitrary but does the job.
      inputWidth = Math.ceil(this.sizer.scrollWidth) + 2
    }

    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth })
    }
  }

  render () {
    const { inputAttributes, inputEventHandlers, query, placeholder, expandable, listboxId, selectedIndex, ariaLabel } = this.props

    return (
      <div className={this.props.classNames.searchInput}>
        <input
          {...inputAttributes}
          {...inputEventHandlers}
          ref={(c) => { this.input = c }}
          value={query}
          placeholder={placeholder}
          role='combobox'
          aria-autocomplete='list'
          aria-label={ariaLabel || placeholder}
          aria-owns={listboxId}
          aria-activedescendant={selectedIndex > -1 ? `${listboxId}-${selectedIndex}` : null}
          aria-expanded={expandable}
          style={{ width: this.state.inputWidth }}
        />
        <div ref={(c) => { this.sizer = c }} style={SIZER_STYLES}>{query || placeholder}</div>
      </div>
    )
  }
}

module.exports = Input
