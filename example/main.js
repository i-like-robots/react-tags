import React from 'react'
import ReactDom from 'react-dom'
import Tags from '../'
import suggestions from './countries'

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

  onDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  onAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  render () {
    return (
      <div>
        <Tags
          tags={this.state.tags}
          suggestions={this.state.suggestions}
          onDelete={this.onDelete.bind(this)}
          onAddition={this.onAddition.bind(this)} />
        <hr />
        <pre><code>{JSON.stringify(this.state.tags, null, 2)}</code></pre>
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('app'))
