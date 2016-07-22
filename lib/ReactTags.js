const React = require('react');
const Tag = require('./Tag');
const Input = require('./Input');
const Suggestions = require('./Suggestions');

const Keys = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ESCAPE: 27
};

const DefaultClassNames = {
    root: 'ReactTags',
    tagInput: 'ReactTags__tagInput',
    selected: 'ReactTags__selected',
    tag: 'ReactTags__tag',
    tagName: 'ReactTags__tagName',
    suggestions: 'ReactTags__suggestions',
    isActive: 'is-active',
    isDisabled: 'is-disabled'
};

module.exports = React.createClass({

    propTypes: {
        tags: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        suggestions: React.PropTypes.array,
        delimiters: React.PropTypes.array,
        autofocus: React.PropTypes.bool,
        autoresize: React.PropTypes.bool,
        handleDelete: React.PropTypes.func.isRequired,
        handleAddition: React.PropTypes.func.isRequired,
        handleInputChange: React.PropTypes.func,
        minQueryLength: React.PropTypes.number,
        maxSuggestionsLength: React.PropTypes.number,
        classNames: React.PropTypes.object,
        allowNew: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            tags: [],
            placeholder: 'Add new tag',
            suggestions: [],
            delimiters: [Keys.ENTER, Keys.TAB],
            autofocus: true,
            autoresize: true,
            minQueryLength: 2,
            maxSuggestionsLength: 6,
            allowNew: false
        };
    },

    getInitialState() {
        return {
            query: '',
            suggestions: [...this.props.suggestions],
            selectedIndex: -1
        };
    },

    componentWillMount() {
        this.setState({
            classNames: Object.assign({}, DefaultClassNames, this.props.classNames)
        });
    },

    componentDidMount() {
        if (this.props.autofocus) {
            this.refs.input.input.focus();
        }
    },

    filteredSuggestions(query, suggestions) {
        const regex = new RegExp(`\\b${query.toLowerCase().trim()}`, 'i');
        return suggestions.filter(item => regex.test(item.name));
    },

    componentWillReceiveProps(newProps) {
        this.setState({
            suggestions: this.filteredSuggestions(this.state.query, newProps.suggestions).slice(0, this.props.maxSuggestionsLength),
            classNames: Object.assign({}, DefaultClassNames, newProps.classNames)
        });
    },

    handleDelete(i) {
        this.props.handleDelete(i);
        this.setState({ query: '' });
    },

    handleChange(e) {
        const query = e.target.value;

        if (this.props.handleInputChange){
            this.props.handleInputChange(query);
        }

        this.setState({
            query: query,
            suggestions: this.filteredSuggestions(query, this.props.suggestions).slice(0, this.props.maxSuggestionsLength)
        });
    },

    handleKeyDown(e) {
        const { query, selectedIndex, suggestions } = this.state;

        // hide suggestions menu on escape
        if (e.keyCode === Keys.ESCAPE) {
            e.preventDefault();

            this.setState({
                selectedIndex: -1,
                suggestions: []
            });
        }

        // When one of the terminating keys is pressed, add current query to the
        // tags. If no text is typed in so far, ignore the action - so we don't
        // end up with a terminating character typed in.
        if (this.props.delimiters.indexOf(e.keyCode) !== -1) {
            if (e.keyCode !== Keys.TAB || query) {
                e.preventDefault();
            }

            if (query && query.length >= this.props.minQueryLength) {
                // Check if the user typed in an existing suggestion.
                const match = suggestions.findIndex(suggestion => {
                    return suggestion.name.search(new RegExp(`^${query}$`, 'i')) === 0;
                });

                const index = selectedIndex === -1 ? match : selectedIndex;

                if (index > -1) {
                    this.addTag(suggestions[index]);
                } else if (this.props.allowNew) {
                    this.addTag({ name: query });
                }
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
            if (selectedIndex <= 0) {
                this.setState({
                    selectedIndex: suggestions.length - 1
                });
            } else {
                this.setState({
                    selectedIndex: selectedIndex - 1
                });
            }
        }

        // down arrow
        if (e.keyCode === Keys.DOWN_ARROW) {
            e.preventDefault();

            this.setState({
                selectedIndex: (selectedIndex + 1) % suggestions.length
            });
        }
    },

    handleSuggestionClick(i) {
        this.addTag(this.state.suggestions[i]);
    },

    handleClick(e) {
        if (document.activeElement !== e.target) {
            this.refs.input.input.focus();
        }
    },

    addTag(tag) {
        if (tag.disabled) {
            return;
        }

        this.props.handleAddition(tag);

        // reset the state
        this.setState({
            query: '',
            selectedIndex: -1
        });

        // focus back on the input box
        this.refs.input.input.focus();
    },

    render() {
        const tagItems = this.props.tags.map((tag, i) => {
            return (
                <Tag
                    key={i}
                    tag={tag}
                    onDelete={this.handleDelete.bind(null, i)}
                    removeComponent={this.props.removeComponent}
                    classNames={this.state.classNames} />
            );
        });

        const { query, selectedIndex, suggestions, classNames } = this.state;
        const { placeholder, minQueryLength, autoresize } = this.props;
        const listboxId = 'ReactTags-listbox';
        const selectedId = `${listboxId}-${selectedIndex}`;

        return (
            <div className={classNames.root} onClick={this.handleClick}>
                <div className={classNames.selected} aria-live='polite' aria-relevant='additions removals'>
                    {tagItems}
                </div>
                <div className={classNames.tagInput}>
                    <Input
                        ref='input'
                        value={query}
                        placeholder={placeholder}
                        autoresize={autoresize}
                        role='combobox'
                        aria-autocomplete='list'
                        aria-label={placeholder}
                        aria-owns={listboxId}
                        aria-activedescendant={selectedIndex > -1 ? selectedId : null}
                        aria-expanded={selectedIndex > -1}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown} />
                    <Suggestions
                        listboxId={listboxId}
                        query={query}
                        selectedIndex={selectedIndex}
                        suggestions={suggestions}
                        handleClick={this.handleSuggestionClick}
                        minQueryLength={minQueryLength}
                        classNames={classNames} />
                </div>
            </div>
        );
    }
});
