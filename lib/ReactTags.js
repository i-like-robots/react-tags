'use strict'

const React = require('react')
const Tag = require('./Tag')
const Input = require('./Input')
const Suggestions = require('./Suggestions')

const KEYS = {
  ENTER: 13,
  TAB: 9,
  BACKSPACE: 8,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  ESCAPE: 27
}

const CLASS_NAMES = {
  root: 'ReactTags',
  tagInput: 'ReactTags__tagInput',
  selected: 'ReactTags__selected',
  tag: 'ReactTags__tag',
  tagName: 'ReactTags__tagName',
  suggestions: 'ReactTags__suggestions',
  isActive: 'is-active',
  isDisabled: 'is-disabled'
}

function filteredSuggestions (query, suggestions) {
  const regex = new RegExp(`\\b${query.toLowerCase().trim()}`, 'i')
  return suggestions.filter((item) => regex.test(item.name))
}

class ReactTags extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      query: '',
      suggestions: [...this.props.suggestions],
      selectedIndex: -1
    }
  }

  componentWillMount () {
    this.setState({
      classNames: Object.assign({}, CLASS_NAMES, this.props.classNames)
    })
  }

  componentDidMount () {
    this.props.autofocus && this.input.input.focus()
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      suggestions: filteredSuggestions(this.state.query, newProps.suggestions).slice(0, this.props.maxSuggestionsLength),
      classNames: Object.assign({}, CLASS_NAMES, newProps.classNames)
    })
  }

  handleDelete (i) {
    this.props.handleDelete(i)
    this.setState({ query: '' })
  }

  handleChange (e) {
    const query = e.target.value

    if (this.props.handleInputChange) {
      this.props.handleInputChange(query)
    }

    this.setState({
      query,
      suggestions: filteredSuggestions(query, this.props.suggestions).slice(0, this.props.maxSuggestionsLength)
    })
  }

  handleKeyDown (e) {
    const { query, selectedIndex, suggestions } = this.state

    // hide suggestions menu on escape
    if (e.keyCode === KEYS.ESCAPE) {
      e.preventDefault()

      this.setState({
        selectedIndex: -1,
        suggestions: []
      })
    }

    // when one of the terminating keys is pressed, add current query to the tags.
    if (this.props.delimiters.indexOf(e.keyCode) !== -1) {
      if (e.keyCode !== KEYS.TAB || query) {
        e.preventDefault()
      }

      if (query.length >= this.props.minQueryLength) {
        // Check if the user typed in an existing suggestion.
        const match = suggestions.findIndex((suggestion) => {
          return suggestion.name.search(new RegExp(`^${query}$`, 'i')) === 0
        })

        const index = selectedIndex === -1 ? match : selectedIndex

        if (index > -1) {
          this.addTag(suggestions[index])
        } else if (this.props.allowNew) {
          this.addTag({ name: query })
        }
      }
    }

    // when backspace key is pressed and query is blank, delete the last tag
    if (e.keyCode === KEYS.BACKSPACE && query.length === 0) {
      this.handleDelete(this.props.tags.length - 1)
    }

    if (e.keyCode === KEYS.UP_ARROW) {
      e.preventDefault()

      // if last item, cycle to the bottom
      if (selectedIndex <= 0) {
        this.setState({ selectedIndex: suggestions.length - 1 })
      } else {
        this.setState({ selectedIndex: selectedIndex - 1 })
      }
    }

    if (e.keyCode === KEYS.DOWN_ARROW) {
      e.preventDefault()

      this.setState({ selectedIndex: (selectedIndex + 1) % suggestions.length })
    }
  }

  handleSuggestionClick (i) {
    this.addTag(this.state.suggestions[i])
  }

  handleClick (e) {
    if (document.activeElement !== e.target) {
      this.input.input.focus()
    }
  }

  addTag (tag) {
    if (tag.disabled) {
      return
    }

    this.props.handleAddition(tag)

    // reset the state
    this.setState({
      query: '',
      selectedIndex: -1
    })

    // focus back on the input box
    this.input.input.value = ''
    this.input.input.focus()
  }

  render () {
    const tags = this.props.tags.map((tag, i) => (
      <Tag
        key={i}
        tag={tag}
        classNames={this.state.classNames}
        onDelete={this.handleDelete.bind(this, i)} />
    ))

    const { query, selectedIndex, suggestions, classNames } = this.state
    const { placeholder, minQueryLength, autoresize } = this.props
    const listboxId = 'ReactTags-listbox'
    const selectedId = `${listboxId}-${selectedIndex}`

    return (
      <div className={classNames.root} onClick={this.handleClick.bind(this)}>
        <div className={classNames.selected} aria-live='polite' aria-relevant='additions removals'>
          {tags}
        </div>
        <div className={classNames.tagInput}>
          <Input
            ref={(c) => { this.input = c }}
            value={query}
            placeholder={placeholder}
            autoresize={autoresize}
            role='combobox'
            aria-autocomplete='list'
            aria-label={placeholder}
            aria-owns={listboxId}
            aria-activedescendant={selectedIndex > -1 ? selectedId : null}
            aria-expanded={selectedIndex > -1}
            onChange={this.handleChange.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)} />
          <Suggestions
            listboxId={listboxId}
            query={query}
            selectedIndex={selectedIndex}
            suggestions={suggestions}
            handleClick={this.handleSuggestionClick.bind(this)}
            minQueryLength={minQueryLength}
            classNames={classNames} />
        </div>
      </div>
    )
  }
}

ReactTags.defaultProps = {
  tags: [],
  placeholder: 'Add new tag',
  suggestions: [],
  delimiters: [KEYS.ENTER, KEYS.TAB],
  autofocus: true,
  autoresize: true,
  minQueryLength: 2,
  maxSuggestionsLength: 6,
  allowNew: false
}

ReactTags.propTypes = {
  tags: React.PropTypes.array,
  placeholder: React.PropTypes.string,
  suggestions: React.PropTypes.array,
  delimiters: React.PropTypes.array,
  autofocus: React.PropTypes.bool,
  autoresize: React.PropTypes.bool,
  handleDelete: React.PropTypes.func.isRequired,
  handleAddition: React.PropTypes.func.isRequired,
  handleInputChange: React.PropTypes.func,
  minQueryLength: React.PropTypes.number,
  maxSuggestionsLength: React.PropTypes.number,
  classNames: React.PropTypes.object,
  allowNew: React.PropTypes.bool
}

module.exports = ReactTags
