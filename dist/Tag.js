'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    propTypes: {
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired,
        classNames: React.PropTypes.object
    },

    render: function render() {
        return React.createElement(
            'button',
            { type: 'button', className: this.props.classNames.tag, title: 'Click to remove tag', onClick: this.props.onDelete },
            React.createElement(
                'span',
                { className: this.props.classNames.tagName },
                this.props.tag.name
            )
        );
    }
});