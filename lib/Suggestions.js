'use strict'

const React = require('react')

function markIt (input, query) {
  const escaped = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = RegExp(escaped, 'gi')

  return {
    __html: input.replace(regex, '<mark>$&</mark>')
  }
}

function filterSuggestions (query, suggestions, length) {
  const regex = new RegExp(`\\b${query}`, 'i')
  return suggestions.filter((item) => regex.test(item.name)).slice(0, length)
}

class Suggestions extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      options: filterSuggestions(this.props.query, this.props.suggestions, this.props.maxSuggestionsLength)
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      options: filterSuggestions(newProps.query, newProps.suggestions, newProps.maxSuggestionsLength)
    })
  }

  render () {
    if (!this.props.isExpandable || !this.state.options.length) {
      return null
    }

    const options = this.state.options.map((item, i) => {
      const key = `${this.props.listboxId}-${i}`
      const classNames = []

      if (this.props.selectedIndex === i) {
        classNames.push(this.props.classNames.isActive)
      }

      if (item.disabled) {
        classNames.push(this.props.classNames.isDisabled)
      }

      return (
        <li
          id={key}
          key={key}
          role='option'
          className={classNames.join(' ')}
          aria-disabled={item.disabled === true}
          onMouseDown={() => this.props.addTag(item)}>
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
