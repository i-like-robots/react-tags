'use strict';

var React = require('react');
var Tag = require('./Tag');
var Suggestions = require('./Suggestions');

// Constants
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
        handleDelete: React.PropTypes.func.isRequired,
        handleAddition: React.PropTypes.func.isRequired,
        handleInputChange: React.PropTypes.func,
        minQueryLength: React.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            busy: false,
            placeholder: 'Add new tag',
            tags: [],
            suggestions: [],
            delimiters: [Keys.ENTER, Keys.TAB],
            autofocus: true,
            minQueryLength: 2
        };
    },

    componentDidMount: function componentDidMount() {
        if (this.props.autofocus) {
            this.refs.input.focus();
        }
    },

    getInitialState: function getInitialState() {
        return {
            query: '',
            suggestions: this.props.suggestions,
            selectedIndex: -1
        };
    },

    filteredSuggestions: function filteredSuggestions(query, suggestions) {
        return suggestions.filter(function (item) {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) === 0;
        });
    },

    componentWillReceiveProps: function componentWillReceiveProps(props) {
        this.setState({
            suggestions: this.filteredSuggestions(this.state.query, props.suggestions)
        });
    },

    handleDelete: function handleDelete(i) {
        this.props.handleDelete(i);
        this.setState({ query: '' });
    },

    handleChange: function handleChange(e) {
        var query = e.target.value.trim();

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
            if (e.keyCode !== Keys.TAB) {
                e.preventDefault();
            }

            if (this.state.selectedIndex > -1) {
                this.addTag(this.state.suggestions[this.state.selectedIndex]);
            } else if (this.state.suggestions.length === 1) {
                this.addTag(this.state.suggestions[0]);
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

    addTag: function addTag(tag) {
        this.props.handleAddition(tag);

        // reset the state
        this.setState({
            query: '',
            selectedIndex: -1
        });

        // focus back on the input box
        this.refs.input.value = '';
        this.refs.input.focus();
    },

    handleSuggestionClick: function handleSuggestionClick(i) {
        this.addTag(this.state.suggestions[i]);
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
        var query = this.state.query.trim();
        var placeholder = this.props.placeholder;
        var selectedIndex = this.state.selectedIndex;

        var tagInput = React.createElement(
            'div',
            { className: 'ReactTags__tagInput' },
            React.createElement('input', {
                ref: 'input',
                type: 'text',
                role: 'combobox',
                placeholder: placeholder,
                'aria-label': placeholder,
                'aria-owns': listboxId,
                'aria-autocomplete': 'list',
                'aria-activedescendant': selectedIndex > -1 ? listboxId + '-' + selectedIndex : null,
                'aria-expanded': selectedIndex > -1,
                'aria-busy': this.props.busy,
                onChange: this.handleChange,
                onKeyDown: this.handleKeyDown }),
            this.props.busy ? React.createElement('div', { className: 'ReactTags__busy' }) : null,
            React.createElement(Suggestions, {
                listboxId: listboxId,
                query: query,
                selectedIndex: selectedIndex,
                suggestions: this.state.suggestions,
                handleClick: this.handleSuggestionClick,
                minQueryLength: this.props.minQueryLength })
        );

        return React.createElement(
            'div',
            { className: 'ReactTags' },
            React.createElement(
                'div',
                { className: 'ReactTags__selected', 'aria-live': 'polite', 'aria-relevant': 'additions removals' },
                tagItems
            ),
            tagInput
        );
    }
});