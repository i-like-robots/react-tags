/// <reference path="./types.d.ts" />

import * as React from 'react'

export interface TagProps {
  tag: ReactTags.Tag,
  classNames: ReactTags.ClassNames,
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => any
}

const Tag: React.SFC<TagProps> = (props) => (
  <button type='button' className={props.classNames.selectedTag} title='Click to remove tag' onClick={props.onDelete}>
    <span className={props.classNames.selectedTagName}>{props.tag.name}</span>
  </button>
)

export default Tag
