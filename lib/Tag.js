'use strict'

const React = require('react')

module.exports = (props) => (
  <button type='button' className={props.classNames.tag} title='Click to remove tag' onClick={props.onDelete}>
    <span className={props.classNames.tagName}>{props.tag.name}</span>
  </button>
)
