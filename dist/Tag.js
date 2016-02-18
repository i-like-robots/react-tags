'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    propTypes: {
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired
    },

    render: function render() {
        return React.createElement(
            'span',
            { className: 'ReactTags__tag' },
            React.createElement(
                'span',
                { className: 'ReactTags__tagName' },
                this.props.tag.name
            ),
            React.createElement(
                'button',
                { className: 'ReactTags__remove', 'aria-title': 'Remove tag', onClick: this.props.onDelete },
                '✕'
            )
        );
    }
});