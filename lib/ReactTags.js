import React from 'react'
import PropTypes from 'prop-types'
import Tag from './Tag'
import Input from './Input'
import Suggestions from './Suggestions'
import { matchExact, matchPartial } from './concerns/matchers'

const KEYS = {
  ENTER: 'Enter',
  TAB: 'Tab',
  BACKSPACE: 'Backspace',
  UP_ARROW: 'ArrowUp',
  UP_ARROW_COMPAT: 'UP',
  DOWN_ARROW: 'ArrowDown',
  DOWN_ARROW_COMPAT: 'Down'
}

const CLASS_NAMES = {
  root: 'react-tags',
  rootFocused: 'is-focused',
  selected: 'react-tags__selected',
  selectedTag: 'react-tags__selected-tag',
  selectedTagName: 'react-tags__selected-tag-name',
  search: 'react-tags__search',
  searchWrapper: 'react-tags__search-wrapper',
  searchInput: 'react-tags__search-input',
  suggestions: 'react-tags__suggestions',
  suggestionActive: 'is-active',
  suggestionDisabled: 'is-disabled'
}

function pressDelimiter () {
  if (this.state.query.length >= this.props.minQueryLength) {
    // Check if the user typed in an existing suggestion.
    const match = this.state.options.findIndex((option) => {
      return matchExact(this.state.query).test(option.name)
    })

    const index = this.state.index === -1 ? match : this.state.index

    if (index > -1) {
      this.addTag(this.state.options[index])
    } else if (this.props.allowNew) {
      this.addTag({ name: this.state.query })
    }
  }
}

function pressUpKey (e) {
  e.preventDefault()

  // if first item, cycle to the bottom
  const size = this.state.options.length - 1
  this.setState({ index: this.state.index <= 0 ? size : this.state.index - 1 })
}

function pressDownKey (e) {
  e.preventDefault()

  // if last item, cycle to top
  const size = this.state.options.length - 1
  this.setState({ index: this.state.index >= size ? 0 : this.state.index + 1 })
}

function pressBackspaceKey () {
  // when backspace key is pressed and query is blank, delete the last tag
  if (!this.state.query.length) {
    this.deleteTag(this.props.tags.length - 1)
  }
}

function filterSuggestions (query, suggestions) {
  const regexp = matchPartial(query)
  return suggestions.filter((item) => regexp.test(item.name))
}

class ReactTags extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      query: '',
      focused: false,
      options: [],
      index: -1
    }

    this.inputEventHandlers = {
      // Provide a no-op function to the input component to avoid warnings
      // <https://github.com/i-like-robots/react-tags/issues/135>
      // <https://github.com/facebook/react/issues/13835>
      onChange: () => {},
      onBlur: this.onBlur.bind(this),
      onFocus: this.onFocus.bind(this),
      onInput: this.onInput.bind(this),
      onKeyDown: this.onKeyDown.bind(this)
    }

    this.input = React.createRef()
    this.suggestions = React.createRef()
  }

  onInput (e) {
    const query = e.target.value

    if (this.props.onInput) {
      this.props.onInput(query)
    }

    if (query !== this.state.query) {
      const filtered = filterSuggestions(query, this.props.suggestions)
      const options = filtered.slice(0, this.props.maxSuggestionsLength)

      this.setState({ query, options })
    }
  }

  onKeyDown (e) {
    // when one of the terminating keys is pressed, add current query to the tags
    if (this.props.delimiters.indexOf(e.key) > -1) {
      if (this.state.query || this.state.index > -1) {
        e.preventDefault()
      }

      pressDelimiter.call(this)
    }

    // when backspace key is pressed and query is blank, delete the last tag
    if (e.key === KEYS.BACKSPACE && this.props.allowBackspace) {
      pressBackspaceKey.call(this, e)
    }

    if (e.key === KEYS.UP_ARROW || e.key === KEYS.UP_ARROW_COMPAT) {
      pressUpKey.call(this, e)
    }

    if (e.key === KEYS.DOWN_ARROW || e.key === KEYS.DOWN_ARROW_COMPAT) {
      pressDownKey.call(this, e)
    }
  }

  onClick (e) {
    if (document.activeElement !== e.target) {
      this.input.current.input.current.focus()
    }
  }

  onBlur () {
    this.setState({ focused: false, index: -1 })

    if (this.props.onBlur) {
      this.props.onBlur()
    }

    if (this.props.addOnBlur) {
      pressDelimiter.call(this)
    }
  }

  onFocus () {
    this.setState({ focused: true })

    if (this.props.onFocus) {
      this.props.onFocus()
    }
  }

  addTag (tag) {
    if (tag.disabled) {
      return
    }

    if (typeof this.props.onValidate === 'function' && !this.props.onValidate(tag)) {
      return
    }

    this.props.onAddition(tag)

    // reset the state
    this.setState({
      query: '',
      index: -1
    })
  }

  deleteTag (i) {
    this.props.onDelete(i)
    this.setState({ query: '' })
  }

  clearInput () {
    this.setState({ query: '' })
  }

  render () {
    const TagComponent = this.props.tagComponent || Tag

    const expanded = this.state.focused && this.state.query.length >= this.props.minQueryLength
    const classNames = [this.props.classNames.root]

    this.state.focused && classNames.push(this.props.classNames.rootFocused)

    return (
      <div className={classNames.join(' ')} onClick={this.onClick.bind(this)}>
        <div
          className={this.props.classNames.selected}
          aria-relevant='additions removals'
          aria-live='polite'>
          {this.props.tags.map((tag, i) => (
            <TagComponent
              key={i}
              tag={tag}
              classNames={this.props.classNames}
              onDelete={this.deleteTag.bind(this, i)} />
          ))}
        </div>
        <div className={this.props.classNames.search}>
          <Input
            {...this.state}
            id={this.props.id}
            ref={this.input}
            classNames={this.props.classNames}
            inputAttributes={this.props.inputAttributes}
            inputEventHandlers={this.inputEventHandlers}
            autoresize={this.props.autoresize}
            expanded={expanded}
            placeholder={this.props.placeholder} />
          <Suggestions
            {...this.state}
            id={this.props.id}
            ref={this.suggestions}
            classNames={this.props.classNames}
            expanded={expanded}
            addTag={this.addTag.bind(this)}
            suggestionComponent={this.props.suggestionComponent} />
        </div>
      </div>
    )
  }
}

ReactTags.defaultProps = {
  id: 'ReactTags',
  tags: [],
  placeholder: 'Add new tag',
  suggestions: [],
  autoresize: true,
  classNames: CLASS_NAMES,
  delimiters: [KEYS.TAB, KEYS.ENTER],
  minQueryLength: 2,
  maxSuggestionsLength: 6,
  allowNew: false,
  allowBackspace: true,
  addOnBlur: false,
  tagComponent: null,
  suggestionComponent: null,
  inputAttributes: {}
}

ReactTags.propTypes = {
  id: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
  autoresize: PropTypes.bool,
  delimiters: PropTypes.arrayOf(PropTypes.string),
  onDelete: PropTypes.func.isRequired,
  onAddition: PropTypes.func.isRequired,
  onInput: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onValidate: PropTypes.func,
  minQueryLength: PropTypes.number,
  maxSuggestionsLength: PropTypes.number,
  classNames: PropTypes.object,
  allowNew: PropTypes.bool,
  allowBackspace: PropTypes.bool,
  addOnBlur: PropTypes.bool,
  tagComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
  suggestionComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ]),
  inputAttributes: PropTypes.object
}

export default ReactTags
