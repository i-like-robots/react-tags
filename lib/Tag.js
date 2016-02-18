const React = require('react');

module.exports = React.createClass({

    propTypes: {
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired
    },

    render(){
        return (
            <span className='ReactTags__tag'>
                <span className='ReactTags__tagName'>{this.props.tag.name}</span>
                <button className='ReactTags__remove' aria-title='Remove tag' onClick={this.props.onDelete}>
                    {'\u2715'}
                </button>
            </span>
        );
    }
});
