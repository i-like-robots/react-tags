'use strict'

const React = require('react')

function markIt (input, query) {
  const escaped = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = RegExp(escaped, 'gi')

  return {
    __html: input.replace(regex, '<mark>$&</mark>')
  }
}

module.exports = (props) => {
  const suggestions = props.suggestions.map((item, i) => {
    const key = `${props.listboxId}-${i}`
    const classNames = []

    props.selectedIndex === i && classNames.push(props.classNames.isActive)
    item.disabled && classNames.push(props.classNames.isDisabled)

    return (
      <li
        id={key}
        key={key}
        role='option'
        className={classNames.join(' ')}
        aria-disabled={item.disabled === true}
        onClick={props.handleClick.bind(null, i)}>
        <span dangerouslySetInnerHTML={markIt(item.name, props.query)} />
      </li>
    )
  })

  if (!suggestions.length || props.query.length < props.minQueryLength) {
    return null
  }

  return (
    <div className={props.classNames.suggestions}>
      <ul role='listbox' id={props.listboxId}>{suggestions}</ul>
    </div>
  )
}
