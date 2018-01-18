import React from 'react'
import PropTypes from 'prop-types'
import Tag from './Tag'
import Input from './Input'
import Suggestions from './Suggestions'

const KEYS = {
  ENTER: 'Enter',
  TAB: 'Tab',
  BACKSPACE: 'Backspace',
  UP_ARROW: 'ArrowUp',
  DOWN_ARROW: 'ArrowDown'
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
      expanded: false,
      selected: -1,
      classNames: Object.assign({}, CLASS_NAMES, this.props.classNames)
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      classNames: Object.assign({}, CLASS_NAMES, newProps.classNames)
    })
  }

  onInput (e) {
    const query = e.target.value

    if (this.props.onInput) {
      this.props.onInput(query)
    }

    this.setState({ query })
  }

  onKeyDown (e) {
    const { query, selected } = this.state
    const { delimiters } = this.props

    // when one of the terminating keys is pressed, add current query to the tags.
    if (delimiters.indexOf(e.key) > -1) {
      if (query || selected > -1) {
        e.preventDefault()
      }

      if (query.length >= this.props.minQueryLength) {
        // Check if the user typed in an existing suggestion.
        const match = this.suggestions.state.options.findIndex((suggestion) => (
          suggestion.name.search(new RegExp(`^${query}$`, 'i')) === 0
        ))

        const index = selected === -1 ? match : selected

        if (index > -1) {
          this.addTag(this.suggestions.state.options[index])
        } else if (this.props.allowNew) {
          this.addTag({ name: query })
        }
      }
    }

    // when backspace key is pressed and query is blank, delete the last tag
    if (e.key === KEYS.BACKSPACE && query.length === 0 && this.props.allowBackspace) {
      this.deleteTag(this.props.tags.length - 1)
    }

    if (e.key === KEYS.UP_ARROW) {
      e.preventDefault()

      // if last item, cycle to the bottom
      if (selected <= 0) {
        this.setState({ selected: this.suggestions.state.options.length - 1 })
      } else {
        this.setState({ selected: selected - 1 })
      }
    }

    if (e.key === KEYS.DOWN_ARROW) {
      e.preventDefault()

      this.setState({ selected: (selected + 1) % this.suggestions.state.options.length })
    }
  }

  onClick (e) {
    if (document.activeElement !== e.target) {
      this.input.input.focus()
    }
  }

  onBlur () {
    this.setState({ focused: false, selected: -1 })

    if (this.props.onBlur) {
      this.props.onBlur()
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

    this.props.onAddition(tag)

    // reset the state
    this.setState({
      query: '',
      selected: -1
    })
  }

  deleteTag (i) {
    this.props.onDelete(i)
    this.setState({ query: '' })
  }

  render () {
    const listboxId = 'ReactTags-listbox'

    const TagComponent = this.props.tagComponent || Tag

    const tags = this.props.tags.map((tag, i) => (
      <TagComponent
        key={i}
        tag={tag}
        classNames={this.state.classNames}
        onDelete={this.deleteTag.bind(this, i)} />
    ))

    const expanded = this.state.focused && this.state.query.length >= this.props.minQueryLength
    const classNames = [this.state.classNames.root]

    this.state.focused && classNames.push(this.state.classNames.rootFocused)

    return (
      <div className={classNames.join(' ')} onClick={this.onClick.bind(this)}>
        <div className={this.state.classNames.selected} aria-live='polite' aria-relevant='additions removals'>
          {tags}
        </div>
        <div
          className={this.state.classNames.search}
          onFocusCapture={this.onFocus.bind(this)}
          onBlurCapture={this.onBlur.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          onInput={this.onInput.bind(this)}>
          <Input {...this.state}
            ref={(c) => { this.input = c }}
            listboxId={listboxId}
            autoresize={this.props.autoresize}
            expanded={expanded}
            placeholder={this.props.placeholder} />
          <Suggestions {...this.state}
            ref={(c) => { this.suggestions = c }}
            listboxId={listboxId}
            expanded={expanded}
            suggestions={this.props.suggestions}
            addTag={this.addTag.bind(this)}
            maxSuggestionsLength={this.props.maxSuggestionsLength} />
        </div>
      </div>
    )
  }
}

ReactTags.defaultProps = {
  tags: [],
  placeholder: 'Add new tag',
  suggestions: [],
  autoresize: true,
  delimiters: [KEYS.TAB, KEYS.ENTER],
  minQueryLength: 2,
  maxSuggestionsLength: 6,
  allowNew: false,
  allowBackspace: true,
  tagComponent: null
}

ReactTags.propTypes = {
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
  minQueryLength: PropTypes.number,
  maxSuggestionsLength: PropTypes.number,
  classNames: PropTypes.object,
  allowNew: PropTypes.bool,
  allowBackspace: PropTypes.bool,
  tagComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element
  ])
}

export default ReactTags
