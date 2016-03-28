'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return { inputWidth: null };
    },

    componentDidMount: function componentDidMount() {
        if (this.props.autoresize) {
            this.updateInputWidth();
        }
    },

    componentDidUpdate: function componentDidUpdate(prevProps) {
        if (this.props.autoresize && prevProps.value !== this.props.value) {
            this.updateInputWidth();
        }
    },

    updateInputWidth: function updateInputWidth() {
        this.setState({
            inputWidth: Math.max(this.sizer.scrollWidth) + 2
        });
    },

    render: function render() {
        var _this = this;

        var _props = this.props;
        var value = _props.value;
        var placeholder = _props.placeholder;

        var style = this.props.autoresize ? { width: this.state.inputWidth } : null;

        return React.createElement(
            'div',
            null,
            React.createElement('input', _extends({ ref: function (c) {
                    return _this.input = c;
                } }, this.props, { style: style })),
            React.createElement('input', { ref: function (c) {
                    return _this.sizer = c;
                }, readOnly: true, value: value || placeholder, 'aria-hidden': 'true' })
        );
    }

});