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
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      classNames: Object.assign({}, CLASS_NAMES, newProps.classNames)
    })
  }

  /**
   * Protect against entered characters that could break a RegEx
   */
  escapeForRegExp (query) {
    return query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  isSuggestedTag (query) {

  }

  /**
   * Handles the value changes to the input field and uses the `delimiterChars`
   * property to know on what character to try to create a tag for. Only characters
   * valid for display in an `input` field are supported. Other values passed,
   * such as 'Tab' and 'Enter' cause adverse effects.
   *
   * Note, this method is necessary on Android, due to a limitation of the
   * `KeyboardEvent.key` having an undefined value, when using soft keyboards.
   * in Android's version of Google Chrome. This method also handles the paste
   * scenario, without needing to provide a supplemental 'onPaste' handl+er.
   */
  handleChange (e) {
    const { delimiterChars } = this.props

    if (this.props.handleInputChange) {
      this.props.handleInputChange(e.target.value)
    }

    const query = e.target.value

    this.setState({ query: query })

    if (query && delimiterChars.length > 0) {
      const regex = new RegExp('[' + this.escapeForRegExp(delimiterChars.join('')) + ']')

      let tagsToAdd = []

      // only process if query contains a delimiter character
      if (query.match(regex)) {
        // split the string based on the delimiterChars as a regex, being sure
        // to escape chars, to prevent them being treated as special characters
        const tags = query.split(regex)

        // handle the case where the last character was not a delimiter, to
        // avoid matching text a user was not ready to lookup
        let maxTagIdx = tags.length
        if (delimiterChars.indexOf(query.charAt(query.length - 1)) < 0) {
          --maxTagIdx
        }

        // deal with case where we don't allow new tags
        // for now just stop processing
        if (!this.props.allowNew) {
          const lastTag = tags[tags.length - 2]
          const match = this.props.suggestions.findIndex((suggestion) => {
            return suggestion.name.toLowerCase() === lastTag.toLowerCase()
          })

          if (match < 0) {
            this.setState({ query: query.substring(0, query.length - 1) })
            return
          }
        }

        for (let i = 0; i < maxTagIdx; i++) {
          // the logic here is similar to handleKeyDown, but subtly different,
          // due to the context of the operation
          if (tags[i].length > 0) {
            // look to see if the tag is already known, ignoring case
            const matchIdx = this.props.suggestions.findIndex((suggestion) => {
              return tags[i].toLowerCase() === suggestion.name.toLowerCase()
            })

            // if already known add it, otherwise add it only if we allow new tags
            if (matchIdx > -1) {
              tagsToAdd.push(this.props.suggestions[matchIdx])
            } else if (this.props.allowNew) {
              tagsToAdd.push({ name: tags[i] })
            }
          }
        }

        // Add all the found tags. We do it one shot, to avoid potential
        // state issues.
        if (tagsToAdd.length > 0) {
          this.addTag(tagsToAdd)
        }

        // if there was remaining undelimited text, add it to the query
        if (maxTagIdx < tags.length) {
          this.setState({ query: tags[maxTagIdx] })
        }
      }
    }
  }

  /**
   * Handles the keydown event. This method allows handling of special keys,
   * such as tab, enter and other meta keys. Use the `delimiter` property
   * to define these keys.
   *
   * Note, While the `KeyboardEvent.keyCode` is considered deprecated, a limitation
   * in Android Chrome, related to soft keyboards, prevents us from using the
   * `KeyboardEvent.key` attribute. Any other scenario, not handled by this method,
   * and related to printable characters, is handled by the `handleChange()` method.
   */
  handleKeyDown (e) {
    const { query, selectedIndex } = this.state
    const { delimiters } = this.props

    // when one of the terminating keys is pressed, add current query to the tags.
    if (delimiters.indexOf(e.keyCode) > -1) {
      if (query || selectedIndex > -1) {
        e.preventDefault()
      }

      if (query.length >= this.props.minQueryLength) {
        // Check if the user typed in an existing suggestion.
        const match = this.suggestions.state.options.findIndex((suggestion) => {
          return suggestion.name.search(new RegExp(`^${query}$`, 'i')) === 0
        })

        const index = selectedIndex === -1 ? match : selectedIndex

        if (index > -1) {
          this.addTag(this.suggestions.state.options[index])
        } else if (this.props.allowNew) {
          this.addTag({ name: query })
        }
      }
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

  handleClick (e) {
    if (document.activeElement !== e.target) {
      this.input.input.focus()
    }
  }

  handleBlur () {
    this.setState({ focused: false, selectedIndex: -1 })
  }

  handleFocus () {
    this.setState({ focused: true })
  }

  addTag (tags) {
    let filteredTags = tags

    if (!Array.isArray(filteredTags)) {
      filteredTags = [filteredTags]
    }

    filteredTags = filteredTags.filter((tag) => {
      return tag.disabled !== true
    })

    if (filteredTags.length === 0) {
      return
    }

    this.props.handleAddition(filteredTags)

    // reset the state
    this.setState({
      query: '',
      selectedIndex: -1
    })
  }

  deleteTag (i) {
    this.props.handleDelete(i)
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

    const expandable = this.state.focused && this.state.query.length >= this.props.minQueryLength
    const classNames = [this.state.classNames.root]

    this.state.focused && classNames.push(this.state.classNames.rootFocused)

    return (
      <div className={classNames.join(' ')} onClick={this.handleClick.bind(this)}>
        <div className={this.state.classNames.selected} aria-live='polite' aria-relevant='additions removals'>
          {tags}
        </div>
        <div
          className={this.state.classNames.search}
          onBlur={this.handleBlur.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}>
          <Input {...this.state}
            ref={(c) => { this.input = c }}
            listboxId={listboxId}
            autofocus={this.props.autofocus}
            autoresize={this.props.autoresize}
            expandable={expandable}
            placeholder={this.props.placeholder} />
          <Suggestions {...this.state}
            ref={(c) => { this.suggestions = c }}
            listboxId={listboxId}
            expandable={expandable}
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
  autofocus: true,
  autoresize: true,
  delimiters: [KEYS.TAB, KEYS.ENTER],
  delimiterChars: [',', ' '],
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
  autofocus: PropTypes.bool,
  autoresize: PropTypes.bool,
  delimiters: PropTypes.arrayOf(PropTypes.number),
  delimiterChars: PropTypes.arrayOf(PropTypes.string),
  handleDelete: PropTypes.func.isRequired,
  handleAddition: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func,
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

module.exports = ReactTags
