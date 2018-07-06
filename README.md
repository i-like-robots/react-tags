# React Tag Autocomplete

[![Build status](https://api.travis-ci.org/i-like-robots/react-tags.svg?branch=master)](https://travis-ci.org/i-like-robots/react-tags) [![Coverage Status](https://coveralls.io/repos/github/i-like-robots/react-tags/badge.svg?branch=master)](https://coveralls.io/github/i-like-robots/react-tags)

React Tag Autocomplete is a simple tagging component ready to drop in your React projects. Originally based on the [React Tags project](http://prakhar.me/react-tags/example) by Prakhar Srivastav this version removes the drag-and-drop re-ordering functionality, adds appropriate roles and ARIA states and introduces a resizing text input. React Tag Autocomplete is compatible with [Preact](https://preactjs.com/) >= 6.0.0.

![Screenshot of React Tag Autocomplete](https://cloud.githubusercontent.com/assets/271645/25478773/54aa2bbe-2b3a-11e7-95cf-d419f3c24418.png)

## Installation

The preferred way of using the component is via NPM

```
npm install --save react-tag-autocomplete
```

## Usage

Here's a sample implementation that initializes the component with a list of preselected `tags` and a `suggestions` list. For more details, go through the [API](#Options).

```js
const React = require('react')
const ReactDOM = require('react-dom')
const ReactTags = require('react-tag-autocomplete')

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [
        { id: 1, name: "Apples" },
        { id: 2, name: "Pears" }
      ],
      suggestions: [
        { id: 3, name: "Bananas" },
        { id: 4, name: "Mangos" },
        { id: 5, name: "Lemons" },
        { id: 6, name: "Apricots" }
      ]
    }
  }

  onDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  onAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  render () {
    return (
      <ReactTags
        tags={this.state.tags}
        suggestions={this.state.suggestions}
        onDelete={this.onDelete.bind(this)}
        onAddition={this.onAddition.bind(this)} />
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
```

### Options

- [`id`](#id-optional)
- [`tags`](#tags-optional)
- [`suggestions`](#suggestions-optional)
- [`placeholder`](#placeholder-optional)
- [`autoresize`](#autoresize-optional)
- [`delimiters`](#delimiters-optional)
- [`minQueryLength`](#minquerylength-optional)
- [`maxSuggestionsLength`](#maxsuggestionslength-optional)
- [`classNames`](#classnames-optional)
- [`onAddition`](#onaddition-optional)
- [`onDelete`](#ondelete-optional)
- [`onInput`](#oninput-optional)
- [`onFocus`](#onfocus-optional)
- [`onBlur`](#onblur-optional)
- [`allowNew`](#allownew-optional)
- [`allowBackspace`](#allowbackspace-optional)
- [`tagComponent`](#tagcomponent-optional)

#### id (optional)

The ID attribute given to the listbox element. Default: `ReactTags`.

#### tags (optional)

An array of tags that are displayed as pre-selected. Each tag must have an `id` and a `name` property. Default: `[]`.

```js
const tags =  [
  { id: 1, name: "Apples" },
  { id: 2, name: "Pears" }
]
```

#### suggestions (optional)

An array of suggestions that are used as basis for showing suggestions. Each suggestion must have an `id` and a `name` property and an optional `disabled` property. Default: `[]`.

```js
const suggestions = [
  { id: 3, name: "Bananas" },
  { id: 4, name: "Mangos" },
  { id: 5, name: "Lemons" },
  { id: 6, name: "Apricots", disabled: true }
]
```

#### placeholder (optional)

The placeholder string shown for the input. Default: `'Add new tag'`.

#### autoresize (optional)

Boolean parameter to control whether the text-input should be automatically resized to fit its value. Default: `true`.

#### delimiters (optional)

Array of keys matching keyboard event `key` values. When a corresponding key is pressed, the preceding string is finalised as tag. Default: `['Enter', 'Tab']`.

#### minQueryLength (optional)

How many characters are needed for suggestions to appear. Default: `2`.

#### maxSuggestionsLength (optional)

Maximum number of suggestions to display. Default: `6`.

#### classNames (optional)

Override the default class names. Defaults:

```js
{
  root: 'react-tags',
  rootFocused: 'is-focused',
  selected: 'react-tags__selected',
  selectedTag: 'react-tags__selected-tag',
  selectedTagName: 'react-tags__selected-tag-name',
  search: 'react-tags__search',
  searchWrapper: 'react-tags__search-wrapper',
  searchInput: 'react-tags__search-input',
  suggestions: 'react-tags__suggestions',
  suggestionActive: 'is-active',
  suggestionDisabled: 'is-disabled'
}
```

#### onAddition (required)

Function called when the user wants to add a tag. Receives the tag.

```js
function onAddition (tag) {
  // Add the tag { id, name } to the tag list
  tags.push(tag)
}
```

#### onDelete (required)

Function called when the user wants to delete a tag. Receives the tag index.

```js
function onDelete (i) {
  // Delete the tag at index i
  tags.splice(i, 1)
}
```

#### onInput (optional)

Optional event handler when the input changes. Receives the current input value.

```js
function onInput (input) {
  if (!this.state.busy) {
    this.setState({ busy: true })

    return fetch(`query=${input}`).then((result) => {
      this.setState({ busy: false })
    })
  }
}
```

#### onFocus (optional)

Optional event handler when the input receives focus. Receives no arguments.

#### onBlur (optional)

Optional event handler when focus on the input is lost. Receives no arguments.

#### allowNew (optional)

Allows users to add new (not suggested) tags. Default: `false`.

#### allowBackspace (optional)

Disables ability to delete the selected tags when backspace is pressed while focussed on the text input. Default: `true`.

#### tagComponent (optional)

Provide a custom tag component to render. Default: `null`.

#### suggestionComponent (optional)

Provide a custom suggestion component to render. Default: `null`.

### API

#### addTag(tag)

#### deleteTag(index)

#### clearInput()

### Styling

It is possible to customize the look of the component the way you want it. An example can be found in `/example/styles.css`.

### Development

The component is written in ES6 and uses [Webpack](http://webpack.github.io/) as its build tool.

```
npm install
npm run dev # open http://localhost:8080
```

### Upgrading from 4.x to 5.x

1. The `delimiters` option has been removed, any references to this will now be ignored.
2. The `classNames` option has been updated:

  ```udiff
  {
  -  root: 'ReactTags',
  -  tagInput: 'ReactTags__tagInput',
  -  selected: 'ReactTags__selected',
  -  tag: 'ReactTags__tag',
  -  tagName: 'ReactTags__tagName',
  -  suggestions: 'ReactTags__suggestions',
  -  isActive: 'is-active',
  -  isDisabled: 'is-disabled'
  +  root: 'react-tags',
  +  rootFocused: 'is-focused',
  +  selected: 'react-tags__selected',
  +  selectedTag: 'react-tags__selected-tag',
  +  selectedTagName: 'react-tags__selected-tag-name',
  +  search: 'react-tags__search',
  +  searchInput: 'react-tags__search-input',
  +  suggestions: 'react-tags__suggestions',
  +  suggestionActive: 'is-active',
  +  suggestionDisabled: 'is-disabled'
  }
  ```

For smaller changes refer to [the changelog](CHANGELOG.md).
