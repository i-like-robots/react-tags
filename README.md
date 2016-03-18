### React Tag Autocomplete

React Tag Autocomplete is a simple tagging component ready to drop in your React projects. This is a fork of the [original React Tags project](http://prakhar.me/react-tags/example) by Prakhar Srivastav. This version cleans out a few options, removes the drag-and-drop re-ordering functionality and adds appropriate roles and ARIA states.

### Installation

The preferred way of using the component is via NPM

```
npm install --save react-tag-autocomplete
```

### Usage

Here's a sample implementation that initializes the component with a list of initial `tags` and `suggestions` list. Apart from this, there are multiple events, handlers for which need to be set. For more details, go through the [API](#Options).

```javascript
var ReactTags = require('react-tag-autocomplete');

var App = React.createClass({
    getInitialState: function() {
        return {
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
    },
    handleDelete: function(i) {
        var tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({ tags: tags });
    },
    handleAddition: function(tag) {
        var tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            name: tag
        });
        this.setState({ tags: tags });
    },
    render: function() {
        return (
            <div>
                <ReactTags
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition} />
            </div>
        )
    }
});

React.render(<App />, document.getElementById('app'));
```

<a name="Options"></a>
### Options

- [`tags`](#tagsOption)
- [`suggestions`](#suggestionsOption)
- [`busy`](#suggestionsOption)
- [`delimiters`](#delimitersOption)
- [`placeholder`](#placeholderOption)
- [`autofocus`](#autofocusOption)
- [`autoresize`](#autoresizeOption)
- [`minQueryLength`](#minQueryLengthOption)
- [`handleAddition`](#handleAdditionOption)
- [`handleDelete`](#handleDeleteOption)
- [`handleInputChange`](#handleInputChange)

<a name="tagsOption"></a>
#### tags (optional)

An array of tags that are displayed as pre-selected. Each tag must have an `id` and a `name` property. Default: `[]`.

```js
var tags =  [
    { id: 1, name: "Apples" },
    { id: 2, name: "Pears" }
];
```

<a name="suggestionsOption"></a>
#### suggestions (optional)

An array of suggestions that are used as basis for showing suggestions. Each suggestion must have an `id` and a `name` property and an optional `disabled` property. Default: `[]`.

```js
var suggestions = [
    { id: 3, name: "Bananas" },
    { id: 4, name: "Mangos" },
    { id: 5, name: "Lemons" },
    { id: 6, name: "Apricots", disabled: true }
];
```

<a name="busy"></a>
#### busy (optional)

A boolean flag used to display the busy indicator or not. Useful when loading new `suggestions` asynchronously. Default: `false`.

<a name="delimitersOption"></a>
#### delimiters (optional)

An array of keycodes which should terminate tags input. Default: `[13, 9]`.

<a name="placeholderOption"></a>
#### placeholder (optional)

The placeholder string shown for the input. Default: `'Add new tag'`.

<a name="autofocusOption"></a>
#### autofocus (optional)

Boolean parameter to control whether the text-input should be autofocused on mount. Default: `true`.

<a name="autoresizeOption"></a>
#### autoresize (optional)

Boolean parameter to control whether the text-input should be automatically resized to fit its value. Default: `true`.

<a name="minQueryLengthOption"></a>
#### minQueryLength (optional)

How many characters are needed for suggestions to appear. Default: `2`.

<a name="handleAdditionOption"></a>
#### handleAddition (required)

Function called when the user wants to add a tag. Receives the tag.

```js
function(tag) {
    // Add the tag { id, name } to the tag list
    tags.push(tag);
}
```

<a name="handleDeleteOption"></a>
#### handleDelete (required)

Function called when the user wants to delete a tag. Receives the tag index.

```js
function(i) {
    // Delete the tag at index i
    tags.splice(i, 1);
}
```

<a name="handleInputChange"></a>
#### handleInputChange (optional)

Optional event handler when the input changes. Receives the current input value.

```js
function(input) {
    if (this.state.busy) {
        return;
    } else {
        this.setState({ busy: true });

        fetch(`query=${input}`).then(function(result) {
            this.setState({ busy: true });
        });
    }
}
```

### Styling

`<ReactTags>` does not come up with any styles. However, it is very easy to customize the look of the component the way you want it. The component provides the following classes with which you can style:-

- `ReactTags`
- `ReactTags__tagInput`
- `ReactTags__busy`
- `ReactTags__selected`
- `ReactTags__tag`
- `ReactTags__remove`
- `ReactTags__suggestions`

An example can be found in `/example/styles.css`.

### Dev

The component is written in ES6 and uses [Webpack](http://webpack.github.io/) as its build tool.

```
npm install
npm run dev # open http://localhost:8090
```

### Contributing

Got ideas on how to make this better? Open an issue! I'm yet to add tests so keep your PRs on hold :grinning:

### Thanks

The autocomplete dropdown is inspired by Lea Verou's [awesomeplete](https://github.com/LeaVerou/awesomplete) library.
