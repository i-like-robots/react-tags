import React from 'react'
import ReactDOM from 'react-dom'
import ReactTags from '../lib/ReactTags'
import suggestions from './countries'

/**
 * Demo 1 - Country selector
 */
class Demo1 extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [
        { id: 184, name: 'Thailand' },
        { id: 86, name: 'India' }
      ],
      suggestions
    }

    this.reactTags = React.createRef()
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
      <>
        <p>Select the countries you have visited using React Tags below:</p>
        <ReactTags
          ref={this.reactTags}
          tags={this.state.tags}
          suggestions={this.state.suggestions}
          onDelete={this.onDelete.bind(this)}
          onAddition={this.onAddition.bind(this)}
        />
        <p>Output:</p>
        <pre><code>{JSON.stringify(this.state.tags, null, 2)}</code></pre>
      </>
    )
  }
}

ReactDOM.render(<Demo1 />, document.getElementById('demo-1'))

/**
 * Demo 2 - Custom tags
 */
class Demo2 extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [],
      suggestions: []
    }

    this.reactTags = React.createRef()
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
      <>
        <p>Enter new tags using React Tags below:</p>
        <ReactTags
          allowNew={true}
          newTagPrefix="Create new tag: "
          ref={this.reactTags}
          tags={this.state.tags}
          suggestions={this.state.suggestions}
          onDelete={this.onDelete.bind(this)}
          onAddition={this.onAddition.bind(this)}
        />
        <p>Output:</p>
        <pre><code>{JSON.stringify(this.state.tags, null, 2)}</code></pre>
      </>
    )
  }
}

ReactDOM.render(<Demo2 />, document.getElementById('demo-2'))
