'use strict'

const React = require('react')

module.exports = (props) => (
  <button type='button' className={props.classNames.selectedTag} title={props.removeTagTitle} onClick={props.onDelete}>
    <span className={props.classNames.selectedTagName}>{props.tag.name}</span>
  </button>
)
