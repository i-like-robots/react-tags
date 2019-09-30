'use strict'

const React = require('react')

function escapeForRegExp (query) {
  return query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
}

function markIt (input, query) {
  if (query) {
    const regex = RegExp(escapeForRegExp(query), 'gi')
    input = input.replace(regex, '<mark>$&</mark>')
  }

  return {
    __html: input
  }
}

function filterSuggestions (query, suggestions, length, suggestionsFilter) {
  if (!suggestionsFilter) {
    const regex = new RegExp(`(?:^|\\s)${escapeForRegExp(query)}`, 'i')
    suggestionsFilter = (item) => regex.test(item.name)
  }

  return suggestions.filter((item) => suggestionsFilter(item, query)).slice(0, length)
}

class Suggestions extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      options: filterSuggestions(this.props.query, this.props.suggestions, this.props.maxSuggestionsLength, this.props.suggestionsFilter)
    }
  }

  componentWillReceiveProps (newProps) {
    const options = filterSuggestions(newProps.query, newProps.suggestions, newProps.maxSuggestionsLength, newProps.suggestionsFilter)

    // If the index is out of bounds, reset it
    if (this.props.selectedIndex > options.length - 1) {
      this.props.resetSelectedIndex()
    }

    this.setState({ options })
  }

  handleMouseDown (item, e) {
    // focus is shifted on mouse down but calling preventDefault prevents this
    e.preventDefault()
    this.props.addTag(item)
  }

  render () {
    if (!this.props.expandable || !this.state.options.length) {
      return null
    }

    const options = this.state.options.map((item, i) => {
      const key = `${this.props.listboxId}-${i}`
      const classNames = []

      if (this.props.selectedIndex === i) {
        classNames.push(this.props.classNames.suggestionActive)
      }

      if (item.disabled) {
        classNames.push(this.props.classNames.suggestionDisabled)
      }

      return (
        <li
          id={key}
          key={key}
          role='option'
          className={classNames.join(' ')}
          aria-disabled={item.disabled === true}
          onMouseDown={this.handleMouseDown.bind(this, item)}>
          <span dangerouslySetInnerHTML={markIt(item.name, this.props.query)} />
        </li>
      )
    })

    return (
      <div className={this.props.classNames.suggestions}>
        <ul role='listbox' id={this.props.listboxId}>{options}</ul>
      </div>
    )
  }
}

module.exports = Suggestions
