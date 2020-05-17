'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const Tag = require('./Tag')
const Input = require('./Input')
const Suggestions = require('./Suggestions')

const KEYS = {
  ENTER: 13,
  TAB: 9,
  BACKSPACE: 8,
  UP_ARROW: 38,
  DOWN_ARROW: 40
}

const CLASS_NAMES = {
  root: 'react-tags',
  rootFocused: 'is-focused',
  selected: 'react-tags__selected',
  selectedTag: 'react-tags__selected-tag',
  selectedTagName: 'react-tags__selected-tag-name',
  search: 'react-tags__search',
  searchInput: 'react-tags__search-input',
  suggestions: 'react-tags__suggestions',
  suggestionActive: 'is-active',
  suggestionDisabled: 'is-disabled'
}

class ReactTags extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      query: '',
      focused: false,
      expandable: false,
      selectedIndex: -1,
      classNames: Object.assign({}, CLASS_NAMES, this.props.classNames)
    }

    this.inputEventHandlers = {
      // Provide a no-op function to the input component to avoid warnings
      // <https://github.com/i-like-robots/react-tags/issues/135>
      // <https://github.com/facebook/react/issues/13835>
      onChange: () => { },
      onBlur: this.handleBlur.bind(this),
      onFocus: this.handleFocus.bind(this),
      onInput: this.handleInput.bind(this),
      onKeyDown: this.handleKeyDown.bind(this)
    }

    this.container = React.createRef()
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      classNames: Object.assign({}, CLASS_NAMES, newProps.classNames)
    })
  }

  handleInput (e) {
    const query = e.target.value

    if (this.props.handleInputChange) {
      this.props.handleInputChange(query)
    }

    this.setState({ query })
  }

  handleKeyDown (e) {
    const { query, selectedIndex } = this.state
    const { delimiters, delimiterChars } = this.props

    // when one of the terminating keys is pressed, add current query to the tags.
    if (delimiters.indexOf(e.keyCode) > -1 || delimiterChars.indexOf(e.key) > -1) {
      if (query || selectedIndex > -1) {
        e.preventDefault()
      }

      this.handleDelimiter()
    }

    // when backspace key is pressed and query is blank, delete the last tag
    if (e.keyCode === KEYS.BACKSPACE && query.length === 0 && this.props.allowBackspace) {
      this.deleteTag(this.props.tags.length - 1)
    }

    if (e.keyCode === KEYS.UP_ARROW) {
      e.preventDefault()

      // if last item, cycle to the bottom
      if (selectedIndex <= 0) {
        this.setState({ selectedIndex: this.suggestions.state.options.length - 1 })
      } else {
        this.setState({ selectedIndex: selectedIndex - 1 })
      }
    }

    if (e.keyCode === KEYS.DOWN_ARROW) {
      e.preventDefault()

      this.setState({ selectedIndex: (selectedIndex + 1) % this.suggestions.state.options.length })
    }
  }

  handleDelimiter () {
    const { query, selectedIndex } = this.state

    if (query.length >= this.props.minQueryLength) {
      // Check if the user typed in an existing suggestion.
      const match = this.suggestions.state.options.findIndex((suggestion) => {
        return suggestion.name.search(new RegExp(`^${query}$`, 'i')) === 0
      })

      const index = selectedIndex === -1 ? match : selectedIndex

      if (index > -1 && this.suggestions.state.options[index]) {
        this.addTag(this.suggestions.state.options[index])
      } else if (this.props.allowNew) {
        this.addTag({ name: query })
      }
    }
  }

  handleClick (e) {
    if (document.activeElement !== e.target) {
      this.input.input.focus()
    }
  }

  handleBlur () {
    this.setState({ focused: false, selectedIndex: -1 })

    if (this.props.handleBlur) {
      this.props.handleBlur()
    }

    if (this.props.addOnBlur) {
      this.handleDelimiter()
    }
  }

  handleFocus () {
    this.setState({ focused: true })

    if (this.props.handleFocus) {
      this.props.handleFocus()
    }
  }

  handleDeleteTag (index, event) {
    // Because we'll destroy the element with cursor focus we need to ensure
    // it does not get lost and move it to the next interactive element
    if (this.container.current) {
      const interactiveEls = this.container.current.querySelectorAll('a,button,input')

      const currentEl = Array.prototype.findIndex.call(interactiveEls, (element) => {
        return element === event.currentTarget
      })

      const nextEl = interactiveEls[currentEl - 1] || interactiveEls[currentEl + 1]

      if (nextEl) {
        nextEl.focus()
      }
    }

    this.deleteTag(index)
  }

  addTag (tag) {
    if (tag.disabled) {
      return
    }

    if (typeof this.props.handleValidate === 'function' && !this.props.handleValidate(tag)) {
      return
    }

    this.props.handleAddition(tag)

    // reset the state
    this.setState({
      query: '',
      selectedIndex: -1
    })
  }

  deleteTag (i) {
    this.props.handleDelete(i)

    if (this.props.clearInputOnDelete && this.state.query !== '') {
      this.setState({ query: '' })
    }
  }

  render () {
    const listboxId = 'ReactTags-listbox'

    const TagComponent = this.props.tagComponent || Tag

    const tags = this.props.tags.map((tag, i) => (
      <TagComponent
        key={i}
        tag={tag}
        classNames={this.state.classNames}
        onDelete={this.handleDeleteTag.bind(this, i)}
      />
    ))

    const expandable = this.state.focused && this.state.query.length >= this.props.minQueryLength
    const classNames = [this.state.classNames.root]

    this.state.focused && classNames.push(this.state.classNames.rootFocused)

    return (
      <div ref={this.container} className={classNames.join(' ')} onClick={this.handleClick.bind(this)}>
        <div className={this.state.classNames.selected} aria-live='polite' aria-relevant='additions removals'>
          {tags}
        </div>
        <div className={this.state.classNames.search}>
          <Input
            {...this.state}
            inputAttributes={this.props.inputAttributes}
            inputEventHandlers={this.inputEventHandlers}
            ref={(c) => { this.input = c }}
            listboxId={listboxId}
            autofocus={this.props.autofocus}
            autoresize={this.props.autoresize}
            expandable={expandable}
            placeholder={this.props.placeholder}
            ariaLabel={this.props.ariaLabel}
          />
          <Suggestions
            {...this.state}
            ref={(c) => { this.suggestions = c }}
            listboxId={listboxId}
            expandable={expandable}
            noSuggestionsText={this.props.noSuggestionsText}
            suggestions={this.props.suggestions}
            suggestionsFilter={this.props.suggestionsFilter}
            addTag={this.addTag.bind(this)}
            maxSuggestionsLength={this.props.maxSuggestionsLength}
          />
        </div>
      </div>
    )
  }
}

ReactTags.defaultProps = {
  tags: [],
  placeholder: 'Add new tag',
  noSuggestionsText: null,
  suggestions: [],
  suggestionsFilter: null,
  autofocus: true,
  autoresize: true,
  delimiters: [KEYS.TAB, KEYS.ENTER],
  delimiterChars: [],
  minQueryLength: 2,
  maxSuggestionsLength: 6,
  allowNew: false,
  allowBackspace: true,
  tagComponent: null,
  inputAttributes: {},
  addOnBlur: false,
  clearInputOnDelete: true
}

ReactTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  noSuggestionsText: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
  suggestionsFilter: PropTypes.func,
  autofocus: PropTypes.bool,
  autoresize: PropTypes.bool,
  delimiters: PropTypes.arrayOf(PropTypes.number),
  delimiterChars: PropTypes.arrayOf(PropTypes.string),
  handleDelete: PropTypes.func.isRequired,
  handleAddition: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func,
  handleFocus: PropTypes.func,
  handleBlur: PropTypes.func,
  handleValidate: PropTypes.func,
  minQueryLength: PropTypes.number,
  maxSuggestionsLength: PropTypes.number,
  classNames: PropTypes.object,
  allowNew: PropTypes.bool,
  allowBackspace: PropTypes.bool,
  tagComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
  inputAttributes: PropTypes.object,
  addOnBlur: PropTypes.bool,
  clearInputOnDelete: PropTypes.bool
}

module.exports = ReactTags
