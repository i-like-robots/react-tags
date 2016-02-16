const React = require('react');

module.exports = React.createClass({

    propTypes: {
        labelField: React.PropTypes.string,
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired
    },

    getDefaultProps() {
        return { labelField: 'text' };
    },

    render(){
        return (
            <span className="ReactTags__tag">
                {this.props.tag[this.props.labelField]}
                <button className="ReactTags__remove" onClick={this.props.onDelete}>{'\u2715'}</button>
            </span>
        );
    }
});
