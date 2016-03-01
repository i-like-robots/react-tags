const React = require('react');

module.exports = React.createClass({

    propTypes: {
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired
    },

    render(){
        return (
            <button className='ReactTags__tag' title='Click to remove tag' onClick={this.props.onDelete}>
                <span className='ReactTags__tagName'>{this.props.tag.name}</span>
            </button>
        );
    }
});
