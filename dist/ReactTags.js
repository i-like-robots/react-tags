'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var React = require('react');
var Tag = require('./Tag');
var Input = require('./Input');
var Suggestions = require('./Suggestions');

var Keys = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ESCAPE: 27
};

module.exports = React.createClass({
    displayName: 'exports',

    propTypes: {
        busy: React.PropTypes.bool,
        tags: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        suggestions: React.PropTypes.array,
        delimiters: React.PropTypes.array,
        autofocus: React.PropTypes.bool,
        autoresize: React.PropTypes.bool,
        handleDelete: React.PropTypes.func.isRequired,
        handleAddition: React.PropTypes.func.isRequired,
        handleInputChange: React.PropTypes.func,
        minQueryLength: React.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            busy: false,
            tags: [],
            placeholder: 'Add new tag',
            suggestions: [],
            delimiters: [Keys.ENTER, Keys.TAB],
            autofocus: true,
            autoresize: true,
            minQueryLength: 2
        };
    },

    getInitialState: function getInitialState() {
        return {
            query: '',
            suggestions: [].concat(_toConsumableArray(this.props.suggestions)),
            selectedIndex: -1
        };
    },

    componentDidMount: function componentDidMount() {
        if (this.props.autofocus) {
            this.refs.input.focus();
        }
    },

    filteredSuggestions: function filteredSuggestions(query, suggestions) {
        var regex = new RegExp('\\b' + query.toLowerCase().trim(), 'i');
        return suggestions.filter(function (item) {
            return regex.test(item.name);
        });
    },

    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        this.setState({
            suggestions: this.filteredSuggestions(this.state.query, newProps.suggestions)
        });
    },

    handleDelete: function handleDelete(i) {
        this.props.handleDelete(i);
        this.setState({ query: '' });
    },

    handleChange: function handleChange(e) {
        var query = e.target.value;

        if (this.props.handleInputChange) {
            this.props.handleInputChange(query);
        }

        this.setState({
            query: query,
            suggestions: this.filteredSuggestions(query, this.props.suggestions)
        });
    },

    handleKeyDown: function handleKeyDown(e) {
        var _state = this.state;
        var query = _state.query;
        var selectedIndex = _state.selectedIndex;
        var suggestions = _state.suggestions;

        // hide suggestions menu on escape
        if (e.keyCode === Keys.ESCAPE) {
            e.preventDefault();

            this.setState({
                selectedIndex: -1,
                suggestions: []
            });
        }

        // When one of the terminating keys is pressed, add current query to the
        // tags. If no text is typed in so far, ignore the action - so we don't
        // end up with a terminating character typed in.
        if (this.props.delimiters.indexOf(e.keyCode) !== -1) {
            if (e.keyCode !== Keys.TAB || query) {
                e.preventDefault();
            }

            if (this.state.selectedIndex > -1) {
                this.addTag(this.state.suggestions[this.state.selectedIndex]);
            }
        }

        // when backspace key is pressed and query is blank, delete tag
        if (e.keyCode === Keys.BACKSPACE && query.length === 0) {
            this.handleDelete(this.props.tags.length - 1);
        }

        // up arrow
        if (e.keyCode === Keys.UP_ARROW) {
            e.preventDefault();

            // if last item, cycle to the bottom
            if (this.state.selectedIndex <= 0) {
                this.setState({
                    selectedIndex: this.state.suggestions.length - 1
                });
            } else {
                this.setState({
                    selectedIndex: this.state.selectedIndex - 1
                });
            }
        }

        // down arrow
        if (e.keyCode === Keys.DOWN_ARROW) {
            e.preventDefault();

            this.setState({
                selectedIndex: (this.state.selectedIndex + 1) % suggestions.length
            });
        }
    },

    handleSuggestionClick: function handleSuggestionClick(i) {
        this.addTag(this.state.suggestions[i]);
    },

    addTag: function addTag(tag) {
        if (tag.disabled) {
            return;
        }

        this.props.handleAddition(tag);

        // reset the state
        this.setState({
            query: '',
            selectedIndex: -1
        });

        // focus back on the input box
        this.refs.input.focus();
    },

    render: function render() {
        var _this = this;

        var tagItems = this.props.tags.map(function (tag, i) {
            return React.createElement(Tag, {
                key: i,
                tag: tag,
                onDelete: _this.handleDelete.bind(null, i),
                removeComponent: _this.props.removeComponent });
        });

        var listboxId = 'ReactTags-listbox';
        var selectedId = listboxId + '-' + selectedIndex;
        var _state2 = this.state;
        var query = _state2.query;
        var selectedIndex = _state2.selectedIndex;
        var suggestions = _state2.suggestions;
        var _props = this.props;
        var placeholder = _props.placeholder;
        var busy = _props.busy;
        var minQueryLength = _props.minQueryLength;
        var autoresize = _props.autoresize;

        return React.createElement(
            'div',
            { className: 'ReactTags' },
            React.createElement(
                'div',
                { className: 'ReactTags__selected', 'aria-live': 'polite', 'aria-relevant': 'additions removals' },
                tagItems
            ),
            React.createElement(
                'div',
                { className: 'ReactTags__tagInput' },
                React.createElement(Input, {
                    ref: 'input',
                    value: query,
                    placeholder: placeholder,
                    autoresize: autoresize,
                    role: 'combobox',
                    'aria-autocomplete': 'list',
                    'aria-label': placeholder,
                    'aria-owns': listboxId,
                    'aria-activedescendant': selectedIndex > -1 ? selectedId : null,
                    'aria-expanded': selectedIndex > -1,
                    'aria-busy': busy,
                    onChange: this.handleChange,
                    onKeyDown: this.handleKeyDown }),
                busy ? React.createElement('div', { className: 'ReactTags__busy' }) : null,
                React.createElement(Suggestions, {
                    listboxId: listboxId,
                    query: query,
                    selectedIndex: selectedIndex,
                    suggestions: suggestions,
                    handleClick: this.handleSuggestionClick,
                    minQueryLength: minQueryLength })
            )
        );
    }
});