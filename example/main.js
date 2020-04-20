'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const ReactTags = require('../lib/ReactTags')
const debounce = require('./debounce')
const fetchData = require('./fetch-data')

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [
        { id: 184, name: 'Thailand' },
        { id: 86, name: 'India' }
      ],
      busy: false,
      suggestions: []
    }

    this.handleInputChange = debounce(this.handleInputChange.bind(this));
  }

  handleDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  handleInputChange(query) {
    if (!this.state.busy) {
      this.setState({ busy: true })

      return fetchData(query).then((suggestions) => {
        this.setState({ busy: false, suggestions })
      })
    }
  }

  render () {
    return (
      <React.Fragment>
        <p>Select the breweries you have visited using React Tags below (powered by the <a href="https://www.openbrewerydb.org/">Open Brewery DB</a>):</p>
        <ReactTags
          tags={this.state.tags}
          noSuggestionsText={'No suggestions found'}
          suggestions={this.state.suggestions}
          handleDelete={this.handleDelete.bind(this)}
          handleAddition={this.handleAddition.bind(this)}
          handleInputChange={this.handleInputChange} />
        <p>Output:</p>
        <pre><code>{JSON.stringify(this.state.tags, null, 2)}</code></pre>
      </React.Fragment>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
