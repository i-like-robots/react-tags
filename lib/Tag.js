const React = require('react');

module.exports = React.createClass({

    propTypes: {
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired,
        classNames: React.PropTypes.object
    },

    render(){
        return (
            <button type='button' className={this.props.classNames.tag} title='Click to remove tag' onClick={this.props.onDelete}>
                <span className={this.props.classNames.tagName}>{this.props.tag.name}</span>
            </button>
        );
    }
});
