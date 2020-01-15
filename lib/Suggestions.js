'use strict'

const React = require('react')

function escapeForRegExp (query) {
  return query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
}

function markIt (input, query, markInput) {
  if (query) {
    const regex = RegExp(escapeForRegExp(query), 'gi')
    input = (typeof markInput === 'undefined') ? input.replace(regex, '<mark>$&</mark>') : input
  }

  return {
    __html: input
  }
}

function filterSuggestions (query, suggestions, length, suggestionsFilter, noSuggestionsMessage) {
  if (!suggestionsFilter) {
    const regex = new RegExp(`(?:^|\\s)${escapeForRegExp(query)}`, 'i')
    suggestionsFilter = (item) => regex.test(item.name)
  }

  const filtered = suggestions.filter((item) => suggestionsFilter(item, query)).slice(0, length)

  if (filtered.length === 0 && noSuggestionsMessage) {
    filtered.push({ id: 0, name: noSuggestionsMessage, disabled: true, markInput: false })
  }

  return filtered
}

class Suggestions extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      options: filterSuggestions(this.props.query, this.props.suggestions, this.props.maxSuggestionsLength, this.props.suggestionsFilter, this.props.noSuggestionsMessage)
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      options: filterSuggestions(newProps.query, newProps.suggestions, newProps.maxSuggestionsLength, newProps.suggestionsFilter, newProps.noSuggestionsMessage)
    })
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
          <span dangerouslySetInnerHTML={markIt(item.name, this.props.query, item.markInput)} />
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
