const React = require('react');

module.exports = React.createClass({

    propTypes: {
        query: React.PropTypes.string.isRequired,
        selectedIndex: React.PropTypes.number.isRequired,
        suggestions: React.PropTypes.array.isRequired,
        handleClick: React.PropTypes.func.isRequired,
        minQueryLength: React.PropTypes.number,
        classNames: React.PropTypes.object
    },

    markIt(input, query) {
        const escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
        const r = RegExp(escapedRegex, 'gi');

        return {
          __html: input.replace(r, '<mark>$&</mark>')
        }
    },

    render() {
        const suggestions = this.props.suggestions.map((item, i) => {
            const key = `${this.props.listboxId}-${i}`;

            const classNames = [
                this.props.selectedIndex === i ? this.props.classNames.isActive : '',
                item.disabled ? this.props.classNames.isDisabled : ''
            ];

            return (
                <li
                    id={key}
                    key={key}
                    role='option'
                    aria-disabled={item.disabled === true}
                    onClick={this.props.handleClick.bind(null, i)}
                    className={classNames.join(' ')}>
                    <span dangerouslySetInnerHTML={this.markIt(item.name, this.props.query)} />
                </li>
            );
        });

        if (suggestions.length === 0 || this.props.query.length < this.props.minQueryLength) {
            return <div className={this.props.classNames.suggestions}></div>;
        }

        return (
            <div className={this.props.classNames.suggestions}>
                <ul role='listbox' id={this.props.listboxId}>{suggestions}</ul>
            </div>
        );
    }
});
