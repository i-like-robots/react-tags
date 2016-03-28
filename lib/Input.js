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
            inputWidth: Math.max(this.sizer.scrollWidth) + 2
        });
    },

    render() {
        const { value, placeholder } = this.props;
        const style = this.props.autoresize ? { width: this.state.inputWidth } : null;

        return (
            <div>
                <input ref={(c) => this.input = c} {...this.props} style={style} />
                <input ref={(c) => this.sizer = c} readOnly value={value || placeholder} aria-hidden='true' />
            </div>
        );
    }

});