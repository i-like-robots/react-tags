'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    propTypes: {
        labelField: React.PropTypes.string,
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return { labelField: 'text' };
    },

    render: function render() {
        return React.createElement(
            'span',
            { className: 'ReactTags__tag' },
            this.props.tag[this.props.labelField],
            React.createElement(
                'button',
                { className: 'ReactTags__remove', onClick: this.props.onDelete },
                '✕'
            )
        );
    }
});