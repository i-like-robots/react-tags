/// <reference path="./types.d.ts" />

import * as React from 'react'

export interface SuggestionsProps {
  query: string,
  listboxId: string,
  expanded: boolean,
  selected: number,
  suggestions: Array<ReactTags.Tag>,
  classNames: ReactTags.ClassNames,
  maxSuggestionsLength: number,
  addTag: ReactTags.AdditionCallback
}

export interface SuggestionsState {
  options: Array<ReactTags.Tag>
}

function escapeForRegExp (query: string): string {
  return query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
}

function markIt (input: string, query: string): string {
  const regex = RegExp(escapeForRegExp(query), 'gi')
  return input.replace(regex, '<mark>$&</mark>')
}

function filterSuggestions (query: string, suggestions: Array<ReactTags.Tag>, length: number): Array<ReactTags.Tag> {
  const regex = new RegExp(`(?:^|\\s)${escapeForRegExp(query)}`, 'i')
  return suggestions.filter((item) => regex.test(item.name)).slice(0, length)
}

class Suggestions extends React.Component<SuggestionsProps, SuggestionsState> {
  constructor (props: SuggestionsProps) {
    super(props)

    this.state = {
      options: filterSuggestions(this.props.query, this.props.suggestions, this.props.maxSuggestionsLength)
    }
  }

  componentWillReceiveProps (newProps: SuggestionsProps) {
    this.setState({
      options: filterSuggestions(newProps.query, newProps.suggestions, newProps.maxSuggestionsLength)
    })
  }

  onMouseDown (tag: ReactTags.Tag, e: React.MouseEvent<HTMLElement>) {
    // focus is shifted on mouse down but calling preventDefault prevents this
    e.preventDefault()
    this.props.addTag(tag)
  }

  render () {
    if (!this.props.expanded || !this.state.options.length) {
      return null
    }

    const options = this.state.options.map((item, i) => {
      const key = `${this.props.listboxId}-${i}`
      const classNames = []

      if (this.props.selected === i) {
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
          onMouseDown={this.onMouseDown.bind(this, item)}>
          <span dangerouslySetInnerHTML={{ __html: markIt(item.name, this.props.query) }} />
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

export default Suggestions
