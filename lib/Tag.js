import React from 'react'

export default (props) => (
  <button type='button' className={props.classNames.selectedTag} title='Click to remove tag' onClick={props.onDelete}>
    <span className={props.classNames.selectedTagName}>{props.tag.name}</span>
  </button>
)
