const React = require('react');

module.exports = React.createClass({

    propTypes: {
        query: React.PropTypes.string.isRequired,
        selectedIndex: React.PropTypes.number.isRequired,
        suggestions: React.PropTypes.array.isRequired,
        handleClick: React.PropTypes.func.isRequired,
        minQueryLength: React.PropTypes.number
    },

    markIt(input, query) {
        var escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
        var r = RegExp(escapedRegex, 'gi');
        return {
          __html: input.replace(r, '<mark>$&</mark>')
        }
    },

    render() {
        const suggestions = this.props.suggestions.map((item, i) => {
            const key = `${this.props.listboxId}-${i}`;

            return (
                <li
                    id={key}
                    key={key}
                    role='option'
                    onClick={this.props.handleClick.bind(null, i)}
                    className={i === this.props.selectedIndex ? 'is-active' : ''}>
                    <span dangerouslySetInnerHTML={this.markIt(item.name, this.props.query)} />
                </li>
            );
        });

        if (suggestions.length === 0 || this.props.query.length < this.props.minQueryLength) {
            return <div className='ReactTags__suggestions'></div>;
        }

        return (
            <div className='ReactTags__suggestions'>
                <ul role='listbox' id={this.props.listboxId}>{suggestions}</ul>
            </div>
        );
    }
});
