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
  'letterSpacing'
]

const CHECK_PROPS = [
  'autoresize',
  'placeholder',
  'query'
]

function compareProps (propsToCompare, prevProps, newProps) {
  return propsToCompare.some((prop) => prevProps[prop] !== newProps[prop])
}

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputWidth: null }
  }

  componentDidMount () {
    this.copyInputStyles()
    this.updateInputWidth()

    if (this.props.autofocus) {
      this.input.focus()
    }
  }

  componentDidUpdate (prevProps) {
    if (compareProps(CHECK_PROPS, prevProps, this.props)) {
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
    if (!this.props.autoresize) {
      return
    }

    // scrollWidth is designed to be fast not accurate.
    // +2 is completely arbitrary but does the job.
    const inputWidth = Math.ceil(this.sizer.scrollWidth) + 2

    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth })
    }
  }

  render () {
    const { inputAttributes, inputEventHandlers, query, placeholder, expandable, listboxId, selectedIndex } = this.props

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
          aria-label={placeholder}
          aria-owns={listboxId}
          aria-activedescendant={selectedIndex > -1 ? `${listboxId}-${selectedIndex}` : null}
          aria-expanded={expandable}
          style={{ width: this.state.inputWidth }} />
        <div ref={(c) => { this.sizer = c }} style={SIZER_STYLES}>{query || placeholder}</div>
      </div>
    )
  }
}

module.exports = Input
