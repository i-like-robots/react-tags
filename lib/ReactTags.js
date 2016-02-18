const React = require('react');
const Tag = require('./Tag');
const Suggestions = require('./Suggestions');

// Constants
const Keys = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ESCAPE: 27
};

module.exports = React.createClass({

    propTypes: {
        busy: React.PropTypes.bool,
        tags: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        suggestions: React.PropTypes.array,
        delimiters: React.PropTypes.array,
        autofocus: React.PropTypes.bool,
        handleDelete: React.PropTypes.func.isRequired,
        handleAddition: React.PropTypes.func.isRequired,
        handleInputChange: React.PropTypes.func,
        minQueryLength: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            busy: false,
            placeholder: 'Add new tag',
            tags: [],
            suggestions: [],
            delimiters: [Keys.ENTER, Keys.TAB],
            autofocus: true,
            minQueryLength: 2
        };
    },

    componentDidMount() {
        if (this.props.autofocus) {
            this.refs.input.focus();
        }
    },

    getInitialState() {
        return {
            suggestions: this.props.suggestions,
            query: '',
            selectedIndex: -1,
            selectionMode: false
        };
    },

    filteredSuggestions(query, suggestions) {
        return suggestions.filter(
            item => item.name.toLowerCase().indexOf(query.toLowerCase()) === 0
        );
    },

    componentWillReceiveProps(props) {
        this.setState({
            suggestions: this.filteredSuggestions(this.state.query, props.suggestions)
        });
    },

    handleDelete(i) {
        this.props.handleDelete(i);
        this.setState({ query: '' });
    },

    handleChange(e) {
        const query = e.target.value.trim();

        if (this.props.handleInputChange){
            this.props.handleInputChange(query);
        }

        this.setState({
            query: query,
            suggestions: this.filteredSuggestions(query, this.props.suggestions)
        });
    },

    handleKeyDown(e) {
        const { query, selectedIndex, suggestions } = this.state;

        // hide suggestions menu on escape
        if (e.keyCode === Keys.ESCAPE) {
            e.preventDefault();

            this.setState({
                selectedIndex: -1,
                selectionMode: false,
                suggestions: []
            });
        }

        // When one of the terminating keys is pressed, add current query to the
        // tags. If no text is typed in so far, ignore the action - so we don't
        // end up with a terminating character typed in.
        if (this.props.delimiters.indexOf(e.keyCode) !== -1) {
            if (e.keyCode !== Keys.TAB) {
              e.preventDefault();
            }

            if (this.state.selectionMode) {
                this.addTag(this.state.suggestions[this.state.selectedIndex]);
            } else if (this.state.suggestions.length === 1) {
                this.addTag(this.state.suggestions[0]);
            }
        }

        // when backspace key is pressed and query is blank, delete tag
        if (e.keyCode === Keys.BACKSPACE && query.length === 0) {
            this.handleDelete(this.props.tags.length - 1);
        }

        // up arrow
        if (e.keyCode === Keys.UP_ARROW) {
            e.preventDefault();

            // if last item, cycle to the bottom
            if (this.state.selectedIndex <= 0) {
                this.setState({
                  selectedIndex: this.state.suggestions.length - 1,
                  selectionMode: true
                });
            } else {
                this.setState({
                  selectedIndex: this.state.selectedIndex - 1,
                  selectionMode: true
                });
            }
        }

        // down arrow
        if (e.keyCode === Keys.DOWN_ARROW) {
            e.preventDefault();

            this.setState({
                selectedIndex: (this.state.selectedIndex + 1) % suggestions.length,
                selectionMode: true
            });
        }
    },

    addTag(tag) {
        this.props.handleAddition(tag);

        // reset the state
        this.setState({
            query: '',
            selectionMode: false,
            selectedIndex: -1
        });

        // focus back on the input box
        this.refs.input.value = '';
        this.refs.input.focus();
    },

    handleSuggestionClick(i) {
        this.addTag(this.state.suggestions[i]);
    },

    render() {
        const listboxId = 'ReactTags-listbox';

        const tagItems = this.props.tags.map((tag, i) => {
            return (
                <Tag
                    key={i}
                    tag={tag}
                    onDelete={this.handleDelete.bind(null, i)}
                    removeComponent={this.props.removeComponent} />
            );
        });

        const query = this.state.query.trim();
        const placeholder = this.props.placeholder;
        const selectedIndex = this.state.selectedIndex;

        const tagInput = (
            <div className='ReactTags__tagInput'>
                <input
                    ref='input'
                    type='text'
                    role='combobox'
                    placeholder={placeholder}
                    aria-label={placeholder}
                    aria-owns={listboxId}
                    aria-autocomplete='list'
                    aria-activedescendant={selectedIndex !== -1 ? `${listboxId}-${selectedIndex}` : null}
                    aria-expanded
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown} />
                {this.props.busy ? <div className='ReactTags__busy' /> : null}
                <Suggestions
                    listboxId={listboxId}
                    query={query}
                    selectedIndex={selectedIndex}
                    suggestions={this.state.suggestions}
                    handleClick={this.handleSuggestionClick}
                    minQueryLength={this.props.minQueryLength} />
            </div>
        );

        return (
            <div className='ReactTags'>
                <div className='ReactTags__selected'>
                    {tagItems}
                </div>
                {tagInput}
            </div>
        );
    }
});
