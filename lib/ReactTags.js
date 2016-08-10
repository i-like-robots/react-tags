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
  DOWN_ARROW: 40
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

class ReactTags extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      query: '',
      focused: false,
      selectedIndex: -1,
      classNames: Object.assign({}, CLASS_NAMES, this.props.classNames)
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      classNames: Object.assign({}, CLASS_NAMES, newProps.classNames)
    })
  }

  handleChange (e) {
    const query = e.target.value

    if (this.props.handleInputChange) {
      this.props.handleInputChange(query)
    }

    this.setState({ query })
  }

  handleKeyDown (e) {
    const { query, selectedIndex } = this.state

    // when one of the terminating keys is pressed, add current query to the tags.
    if (this.props.delimiters.indexOf(e.keyCode) !== -1) {
      if (e.keyCode !== KEYS.TAB || query) {
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
    if (e.keyCode === KEYS.BACKSPACE && query.length === 0) {
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
    this.setState({ focused: false })
  }

  handleFocus () {
    this.setState({ focused: true })
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
  }

  deleteTag (i) {
    this.props.handleDelete(i)
    this.setState({ query: '' })
  }

  render () {
    const listboxId = 'ReactTags-listbox'

    const tags = this.props.tags.map((tag, i) => (
      <Tag
        key={i}
        tag={tag}
        classNames={this.state.classNames}
        onDelete={this.deleteTag.bind(this, i)} />
    ))

    const isExpandable = this.state.focused && this.state.query.length >= this.props.minQueryLength

    return (
      <div className={this.state.classNames.root} onClick={this.handleClick.bind(this)}>
        <div className={this.state.classNames.selected} aria-live='polite' aria-relevant='additions removals'>
          {tags}
        </div>
        <div
          className={this.state.classNames.tagInput}
          onBlur={this.handleBlur.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}>
          <Input {...this.state}
            ref={(c) => { this.input = c }}
            listboxId={listboxId}
            autofocus={this.props.autofocus}
            autoresize={this.props.autoresize}
            placeholder={this.props.placeholder} />
          <Suggestions {...this.state}
            ref={(c) => { this.suggestions = c }}
            listboxId={listboxId}
            isExpandable={isExpandable}
            suggestions={this.props.suggestions}
            addTag={this.addTag.bind(this)} />
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
