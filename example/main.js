'use strict'

const React = require('react')
const ReactDom = require('react-dom')
const Tags = require('../lib/ReactTags')
const suggestions = require('./countries')

const App = React.createClass({
  getInitialState () {
    return {
      tags: [ { id: 184, name: 'Thailand' }, { id: 86, name: 'India' } ],
      suggestions
    }
  },

  handleDelete (i) {
    const tags = this.state.tags
    tags.splice(i, 1)
    this.setState({ tags })
  },

  handleAddition (tag) {
    const tags = this.state.tags
    tags.push(tag)
    this.setState({ tags })
  },

  render () {
    const { tags, suggestions } = this.state

    return (
      <div>
        <Tags
          tags={tags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition} />
        <hr />
        <pre><code>{JSON.stringify(tags, null, 2)}</code></pre>
      </div>
    )
  }

})

ReactDom.render(<App />, document.getElementById('app'))
