'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    propTypes: {
        query: React.PropTypes.string.isRequired,
        selectedIndex: React.PropTypes.number.isRequired,
        suggestions: React.PropTypes.array.isRequired,
        handleClick: React.PropTypes.func.isRequired,
        minQueryLength: React.PropTypes.number
    },

    markIt: function markIt(input, query) {
        var escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
        var r = RegExp(escapedRegex, 'gi');
        return {
            __html: input.replace(r, '<mark>$&</mark>')
        };
    },

    render: function render() {
        var _this = this;

        var suggestions = this.props.suggestions.map(function (item, i) {
            var key = _this.props.listboxId + '-' + i;

            var classNames = [_this.props.selectedIndex === i ? 'is-active' : '', item.disabled ? 'is-disabled' : ''];

            return React.createElement(
                'li',
                {
                    id: key,
                    key: key,
                    role: 'option',
                    'aria-disabled': item.disabled === true,
                    onClick: _this.props.handleClick.bind(null, i),
                    className: classNames.join(' ') },
                React.createElement('span', { dangerouslySetInnerHTML: _this.markIt(item.name, _this.props.query) })
            );
        });

        if (suggestions.length === 0 || this.props.query.length < this.props.minQueryLength) {
            return React.createElement('div', { className: 'ReactTags__suggestions' });
        }

        return React.createElement(
            'div',
            { className: 'ReactTags__suggestions' },
            React.createElement(
                'ul',
                { role: 'listbox', id: this.props.listboxId },
                suggestions
            )
        );
    }
});