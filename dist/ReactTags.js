'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
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
        tags: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        labelField: React.PropTypes.string,
        suggestions: React.PropTypes.array,
        delimeters: React.PropTypes.array,
        autofocus: React.PropTypes.bool,
        handleDelete: React.PropTypes.func.isRequired,
        handleAddition: React.PropTypes.func.isRequired,
        handleInputChange: React.PropTypes.func,
        minQueryLength: React.PropTypes.number,
        autocomplete: React.PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
        return {
            placeholder: 'Add new tag',
            tags: [],
            suggestions: [],
            delimeters: [Keys.ENTER, Keys.TAB],
            autofocus: true,
            minQueryLength: 2,
            autocomplete: false
        };
    },

    componentDidMount: function componentDidMount() {
        if (this.props.autofocus) {
            this.refs.input.focus();
        }
    },

    getInitialState: function getInitialState() {
        return {
            suggestions: this.props.suggestions,
            query: '',
            selectedIndex: -1,
            selectionMode: false
        };
    },

    filteredSuggestions: function filteredSuggestions(query, suggestions) {
        return suggestions.filter(function (item) {
            return item.toLowerCase().indexOf(query.toLowerCase()) === 0;
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
                selectionMode: false,
                suggestions: []
            });
        }

        // When one of the terminating keys is pressed, add current query to the
        // tags. If no text is typed in so far, ignore the action - so we don't
        // end up with a terminating character typed in.
        if (this.props.delimeters.indexOf(e.keyCode) !== -1) {
            if (e.keyCode !== Keys.TAB) {
                e.preventDefault();
            }

            if (this.state.selectionMode) {
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
                    selectedIndex: this.state.suggestions.length - 1,
                    selectionMode: true
                });
            } else {
                this.setState({
                    selectedIndex: this.state.selectedIndex - 1,
                    selectionMode: true
                });
            }
        }

        // down arrow
        if (e.keyCode === Keys.DOWN_ARROW) {
            e.preventDefault();

            this.setState({
                selectedIndex: (this.state.selectedIndex + 1) % suggestions.length,
                selectionMode: true
            });
        }
    },

    addTag: function addTag(tag) {
        this.props.handleAddition(tag);

        // reset the state
        this.setState({
            query: '',
            selectionMode: false,
            selectedIndex: -1
        });

        // focus back on the input box
        this.refs.input.value = '';
        this.refs.input.focus();
    },

    handleSuggestionClick: function handleSuggestionClick(i, e) {
        this.addTag(this.state.suggestions[i]);
    },

    render: function render() {
        var _this = this;

        var tagItems = this.props.tags.map(function (tag, i) {
            return React.createElement(Tag, {
                key: tag.id,
                tag: tag,
                labelField: _this.props.labelField,
                onDelete: _this.handleDelete.bind(_this, i),
                moveTag: _this.moveTag,
                removeComponent: _this.props.removeComponent });
        });

        var query = this.state.query.trim();
        var placeholder = this.props.placeholder;

        var tagInput = React.createElement(
            'div',
            { className: 'ReactTags__tagInput' },
            React.createElement('input', {
                ref: 'input',
                type: 'text',
                placeholder: placeholder,
                'aria-label': placeholder,
                onChange: this.handleChange,
                onKeyDown: this.handleKeyDown }),
            React.createElement(Suggestions, {
                query: query,
                suggestions: this.state.suggestions,
                selectedIndex: this.state.selectedIndex,
                handleClick: this.handleSuggestionClick,
                minQueryLength: this.props.minQueryLength })
        );

        return React.createElement(
            'div',
            { className: 'ReactTags' },
            React.createElement(
                'div',
                { className: 'ReactTags__selected' },
                tagItems,
                tagInput
            )
        );
    }
});