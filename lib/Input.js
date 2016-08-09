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
      this.updateInputWidth()
    }

    if (this.props.autofocus) {
      this.input.focus()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.autoresize && prevProps.query !== this.props.query) {
      this.updateInputWidth()
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
    this.setState({ inputWidth: Math.ceil(this.sizer.scrollWidth) + 2 })
  }

  render () {
    const sizerText = this.props.query || this.props.placeholder

    const { placeholder, listboxId, selectedIndex } = this.props

    const selectedId = `${listboxId}-${selectedIndex}`

    return (
      <div>
        <input
          ref={(c) => { this.input = c }}
          role='combobox'
          aria-autocomplete='list'
          aria-label={placeholder}
          aria-owns={listboxId}
          aria-activedescendant={selectedIndex > -1 ? selectedId : null}
          aria-expanded={selectedIndex > -1}
          placeholder={placeholder}
          style={{ width: this.state.inputWidth }} />
        <div ref={(c) => { this.sizer = c }} style={SIZER_STYLES}>{sizerText}</div>
      </div>
    )
  }
}

module.exports = Input
