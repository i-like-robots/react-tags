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

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = { inputWidth: null }
  }

  componentDidMount () {
    if (this.props.autoresize) {
      this.copyInputStyles()
    }

    if (this.props.autofocus) {
      this.input.focus()
    }
  }

  componentWillReceiveProps (newProps) {
    if (this.input.value !== newProps.query) {
      this.input.value = newProps.query
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
      // changed +2 to +20 to get the same behavior
      inputWidth = Math.ceil(this.getScrollWidth()) + 20
      return inputWidth
    }
  }

  getScrollWidth () {
    if (this.sizer) {
      return this.sizer.scrollWidth       // we have to mock this function in test to return a random number
    }
  }

  render () {
    const { inputAttributes, inputEventHandlers, query, placeholder, expandable, listboxId, selectedIndex } = this.props
    const width = this.updateInputWidth()

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
          style={{ width: width }} />
        <div ref={(c) => { this.sizer = c }} style={SIZER_STYLES}>{query || placeholder}</div>
      </div>
    )
  }
}

module.exports = Input
