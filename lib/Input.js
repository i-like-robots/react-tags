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
  }

  componentDidUpdate (prevProps) {
    if (this.props.autoresize && prevProps.value !== this.props.value) {
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
    this.setState({ inputWidth: Math.ceil(this.sizer.scrollWidth) + 2 })
  }

  render () {
    const inputSize = { width: this.state.inputWidth }
    const sizerText = this.props.value || this.props.placeholder

    return (
      <div>
        <input ref={(c) => { this.input = c }} {...this.props} style={inputSize} />
        <div ref={(c) => { this.sizer = c }} style={SIZER_STYLES}>{sizerText}</div>
      </div>
    )
  }
}

module.exports = Input
