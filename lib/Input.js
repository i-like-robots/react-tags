'use strict';

const React = require('react');

const sizerStyles = {
    position: 'absolute',
    width: 0,
    height: 0,
    visibility: 'hidden',
    overflow: 'scroll',
    whiteSpace: 'pre'
};

module.exports = React.createClass({

    getInitialState() {
        return { inputWidth: null };
    },

    componentDidMount() {
        if (this.props.autoresize) {
            this.copyInputStyles();
            this.updateInputWidth();
        }
    },

    componentDidUpdate(prevProps) {
        if (this.props.autoresize && prevProps.value !== this.props.value) {
            this.updateInputWidth();
        }
    },

    copyInputStyles() {
        const inputStyle = window.getComputedStyle(this.input);

        this.sizer.style.fontSize = inputStyle.fontSize;
        this.sizer.style.fontFamily = inputStyle.fontFamily;
        this.sizer.style.fontWeight = inputStyle.fontWeight;
        this.sizer.style.fontStyle = inputStyle.fontStyle;
        this.sizer.style.letterSpacing = inputStyle.letterSpacing;
    },

    updateInputWidth() {
        this.setState({
            inputWidth: Math.ceil(this.sizer.scrollWidth) + 2
        });
    },

    render() {
        const { value, placeholder } = this.props;
        const style = this.props.autoresize ? { width: this.state.inputWidth } : null;

        return (
            <div>
                <input ref={(c) => this.input = c} {...this.props} style={style} />
                <div ref={(c) => this.sizer = c} style={sizerStyles}>{value || placeholder}</div>
            </div>
        );
    }

});