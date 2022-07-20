import React from 'react'
import { matchAny } from './concerns/matchers'

function markIt(name, query) {
  const regexp = matchAny(query)
  return name.replace(regexp, '<mark>$&</mark>')
}

function DefaultSuggestionComponent({ item, query }) {
  return (
    <span dangerouslySetInnerHTML={{ __html: markIt(item.name, query) }} />
  )
}

function Suggestions(props) {
  const SuggestionComponent = props.suggestionComponent || DefaultSuggestionComponent

  const options = props.options.map((item, index) => {
    const key = `${props.id}-${index}`
    const classNames = []

    if (props.index === index) {
      classNames.push(props.classNames.suggestionActive)
    }

    if (item.disabled) {
      classNames.push(props.classNames.suggestionDisabled)
    }

    if (item.className) {
      classNames.push(item.className)
    }

    return (
      <li
        id={key}
        key={key}
        role='option'
        className={classNames.join(' ')}
        aria-disabled={Boolean(item.disabled)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => props.addTag(item)}
      >
        {item.prefix
          ? <span className={props.classNames.suggestionPrefix}>{item.prefix}{' '}</span>
          : null}
        {item.disableMarkIt
          ? item.name
          : <SuggestionComponent item={item} query={props.query} />}
      </li>
    )
  })

  return (
    <div className={props.classNames.suggestions}>
      <ul role='listbox' id={props.id}>{options}</ul>
    </div>
  )
}

export default Suggestions
