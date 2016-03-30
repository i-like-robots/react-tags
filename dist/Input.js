'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

var sizerStyles = {
    position: 'absolute',
    width: 0,
    height: 0,
    visibility: 'hidden',
    overflow: 'scroll',
    whiteSpace: 'pre'
};

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return { inputWidth: null };
    },

    componentDidMount: function componentDidMount() {
        if (this.props.autoresize) {
            this.copyInputStyles();
            this.updateInputWidth();
        }
    },

    componentDidUpdate: function componentDidUpdate(prevProps) {
        if (this.props.autoresize && prevProps.value !== this.props.value) {
            this.updateInputWidth();
        }
    },

    copyInputStyles: function copyInputStyles() {
        var inputStyle = window.getComputedStyle(this.input);

        this.sizer.style.fontSize = inputStyle.fontSize;
        this.sizer.style.fontFamily = inputStyle.fontFamily;
        this.sizer.style.fontWeight = inputStyle.fontWeight;
        this.sizer.style.fontStyle = inputStyle.fontStyle;
        this.sizer.style.letterSpacing = inputStyle.letterSpacing;
    },

    updateInputWidth: function updateInputWidth() {
        this.setState({
            inputWidth: Math.ceil(this.sizer.scrollWidth) + 2
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
            React.createElement(
                'div',
                { ref: function (c) {
                        return _this.sizer = c;
                    }, style: sizerStyles },
                value || placeholder
            )
        );
    }

});