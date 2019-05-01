'use strict'

const React = require('react')
const ReactDom = require('react-dom')
const Tags = require('../lib/ReactTags')
const suggestions = require('./countries')

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [
        { id: 184, name: 'Thailand' },
        { id: 86, name: 'India' }
      ],
      suggestions
    }
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

  render () {
    return (
      <React.Fragment>
        <p>Select the countries you have visited using React Tags below:</p>
        <Tags
          tags={this.state.tags}
          suggestions={this.state.suggestions}
          handleDelete={this.handleDelete.bind(this)}
          handleAddition={this.handleAddition.bind(this)} 
          delimiterChars={['188','190','32','55','220','191']}
          allowNew={true}
        />
        <p>Output:</p>
        <pre><code>{JSON.stringify(this.state.tags, null, 2)}</code></pre>
      </React.Fragment>
    )
  }
}

ReactDom.render(<App />, document.getElementById('app'))
