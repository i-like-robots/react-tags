'use strict';

const React = require('react');

module.exports = React.createClass({

    getInitialState() {
        return { inputWidth: null };
    },

    componentDidMount() {
        if (this.props.autoresize) {
            this.updateInputWidth();
        }
    },

    componentDidUpdate(prevProps) {
        if (this.props.autoresize && prevProps.value !== this.props.value) {
            this.updateInputWidth();
        }
    },

    updateInputWidth() {
        this.setState({
            inputWidth: Math.max(this.refs.sizer.scrollWidth) + 2
        });
    },

    focus() {
        this.refs.input.focus();
    },

    render() {
        const { value, placeholder } = this.props;
        const style = this.props.autoresize ? { width: this.state.inputWidth } : null;

        return (
            <div>
                <input ref='input' {...this.props} style={style} />
                <input ref='sizer' readOnly value={value || placeholder} aria-hidden='true' />
            </div>
        );
    }

});