/* eslint-env jasmine */

'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-dom/test-utils')
const keycode = require('keycode')
const sinon = require('sinon')
const fixture = require('../example/countries')
const Subject = require('../dist-es5/ReactTags')

let props
let instance

function createInstance (data) {
  if (instance) {
    teardownInstance()
  }

  const defaults = {
    tags: [],
    suggestions: [],
    handleDelete: sinon.stub(),
    handleAddition: sinon.stub(),
    handleInputChange: sinon.stub()
  }

  props = Object.assign(defaults, data || {})
  instance = ReactDOM.render(React.createElement(Subject, props), document.getElementById('app'))
}

function teardownInstance () {
  ReactDOM.unmountComponentAtNode(document.getElementById('app'))
  instance = null
}

function $ (selector) {
  return document.querySelector(selector)
}

function $$ (selector) {
  return Array.from(document.querySelectorAll(selector))
}

function type (value) {
  value.split('').forEach((char) => {
    key(char)
    $('input').value += char
    // React calls onchange for every update to maintain state at all times
    TestUtils.Simulate.change($('input'))
  })
}

function paste (value) {
  $('input').value = value
  // React calls onchange following paste
  TestUtils.Simulate.change($('input'))
}

function key () {
  Array.from(arguments).forEach((value) => {
    TestUtils.Simulate.keyDown($('input'), { value, keyCode: keycode(value), key: value })
  })
}

function click (target) {
  TestUtils.Simulate.mouseDown(target)
  TestUtils.Simulate.mouseUp(target)
  TestUtils.Simulate.click(target)
}

describe('React Tags', () => {
  afterEach(() => {
    teardownInstance()
  })

  describe('basic rendering', () => {
    beforeEach(() => {
      createInstance()
    })

    it('renders the basic components', () => {
      expect($('.react-tags')).toBeTruthy()
      expect($('.react-tags__selected')).toBeTruthy()
      expect($('.react-tags__search')).toBeTruthy()
      expect($('.react-tags__search-input')).toBeTruthy()
    })
  })

  describe('input', () => {
    it('assigns the given placeholder', () => {
      createInstance({ placeholder: 'Please enter a tag' })
      expect($('input').placeholder).toEqual('Please enter a tag')
    })

    it('autofocuses on the input', () => {
      createInstance({ autofocus: true })
      expect(document.activeElement).toEqual($('input'))
    })

    it('does not autofocus on the input', () => {
      createInstance({ autofocus: false })
      expect(document.activeElement).not.toEqual($('input'))
    })

    it('updates state when suggestions list is expanded', () => {
      createInstance()

      const input = $('input')

      expect(input.getAttribute('aria-expanded')).toEqual('false')

      type('uni')

      expect(input.getAttribute('aria-expanded')).toEqual('true')

      TestUtils.Simulate.blur(input)

      expect(input.getAttribute('aria-expanded')).toEqual('false')
    })

    it('decorates the component root when focused', () => {
      createInstance()

      TestUtils.Simulate.focus($('input'))
      expect($('.is-focused')).toBeTruthy()

      TestUtils.Simulate.blur($('input'))
      expect($('.is-focused')).toBeNull()
    })
  })

  describe('query', () => {
    const query = 'united'

    beforeEach(() => {
      createInstance()
    })

    it('updates the internal state', () => {
      type(query)
      expect(instance.state.query).toEqual(query)
    })

    it('triggers the change callback', () => {
      type(query)

      sinon.assert.called(props.handleInputChange)
      sinon.assert.calledWith(props.handleInputChange, query)
    })

    it('can allow new, non-suggested tags to be added', () => {
      createInstance({ allowNew: false })

      type(query); key('enter')

      sinon.assert.notCalled(props.handleAddition)

      createInstance({ allowNew: true })

      type(query); key('enter')

      sinon.assert.calledOnce(props.handleAddition)
      sinon.assert.calledWith(props.handleAddition, [{ name: query }])
    })

    it('can add new tags when a delimiter character is entered', () => {
      createInstance({ allowNew: true, delimiterChars: [',', ';'] })

      type('foo,bar;baz'); key('enter')

      sinon.assert.calledThrice(props.handleAddition)
    })

    it('decriments maxTagIdx, when final character is not a separator', () => {
      createInstance({ delimiterChars: [','], allowNew: true })

      const input = $('input')

      paste('antarctica, spain')

      sinon.assert.calledOnce(props.handleAddition)
      sinon.assert.calledWith(props.handleAddition, [{ name: 'antarctica' }])

      expect(input.value).toEqual('spain')
    })

    it('adds value on paste, where values are delimiter terminated', () => {
      createInstance({ delimiterChars: [','], allowNew: true, handleAddition: props.handleAddition })

      paste('Algeria,Guinea Bissau,')

      sinon.assert.calledOnce(props.handleAddition)
      sinon.assert.calledWith(props.handleAddition, [{ name: 'Algeria' }, { name: 'Guinea Bissau' }])
    })

    it('does not process final tag on paste, if unrecognised tag', () => {
      createInstance({ delimiterChars: [','], allowNew: false, suggestions: fixture })

      paste('Thailand,Indonesia')

      expect($('input').value).toEqual('Indonesia')
    })

    it('does not process final tag on paste, if unrecognised tag (white-space test)', () => {
      createInstance({ delimiterChars: [','], allowNew: false, suggestions: fixture })

      paste('Thailand, Algeria, Indonesia')

      expect($('input').value).toEqual('Indonesia')
    })

    it('does not process final text on paste, if final text is not delimiter terminated', () => {
      createInstance({ delimiterChars: [','], allowNew: false, suggestions: fixture })

      paste('Thailand,Algeria')

      expect($('input').value).toEqual('Algeria')
    })

    it('checks the trailing delimiter is removed on paste, when tag unrecognised', () => {
      createInstance({ delimiterChars: [','], allowNew: false, suggestions: fixture })

      paste('United Arab Emirates, Mars,')

      expect($('input').value).toEqual('United Arab Emirates, Mars')
    })

    it('checks the trailing delimiter is removed on typing, when tag unrecognised', () => {
      createInstance({ delimiterChars: [','], allowNew: false, suggestions: fixture })

      type('Mars,')

      expect($('input').value).toEqual('Mars')
    })

    it('checks last character not removed on paste, if not a delimiter', () => {
      createInstance({ delimiterChars: [','], allowNew: false, suggestions: fixture })

      paste('xxx, Thailand')

      expect($('input').value).toEqual('xxx, Thailand')
    })
  })

  describe('suggestions', () => {
    const query = 'united'

    beforeEach(() => {
      createInstance({ minQueryLength: 3, suggestions: fixture })
    })

    it('shows suggestions list when the query is long enough', () => {
      type(query.slice(0, 2))
      expect($('ul[role="listbox"]')).toBeNull()

      type(query.slice(2, 3))
      expect($('ul[role="listbox"]')).toBeTruthy()
    })

    it('shows the suggestions list when there are suggestions available', () => {
      type(query)
      expect($('ul[role="listbox"]')).toBeTruthy()

      type('xyz')
      expect($('ul[role="listbox"]')).toBeNull()
    })

    it('hides the suggestions list when the input is not focused', () => {
      type(query)

      expect($('ul[role="listbox"]')).toBeTruthy()

      TestUtils.Simulate.blur($('input'))

      expect($('ul[role="listbox"]')).toBeNull()
    })

    it('filters suggestions to those that match', () => {
      type(query)

      $$('li[role="option"]').forEach((option) => {
        expect(option.textContent).toMatch(new RegExp(query, 'i'))
      })
    })

    it('can handle non-ascii characters', () => {
      const cities = ['Закаменск', 'Заозёрный', 'Заозёрск', 'Западная Двина', 'Заполярный', 'Зарайск']

      createInstance({ minQueryLength: 3, suggestions: cities.map((city, i) => ({ name: city, id: i })) })

      type('Зап')

      expect($$('li[role="option"]').length).toEqual(2)
    })

    it('escapes the query before matching', () => {
      expect(() => { type(query + '\\') }).not.toThrow()
    })

    it('can limit the number of suggestions', () => {
      type('uni')

      expect($$('li[role="option"]').length).toEqual(3)

      createInstance({ maxSuggestionsLength: 1, suggestions: fixture })

      type('uni')

      expect($$('li[role="option"]').length).toEqual(1)
    })

    it('marks the matching text', () => {
      type(query)

      $$('li[role="option"]').forEach((option) => {
        expect(option.querySelector('mark')).toBeTruthy()
        expect(option.querySelector('mark').textContent).toMatch(new RegExp('^' + query + '$', 'i'))
      })
    })

    it('handles up/down keys and can wrap', () => {
      type(query)

      const input = $('input')
      const results = $$('li[role="option"]')

      key('down')

      expect(input.getAttribute('aria-activedescendant')).toEqual(results[0].id)
      expect(results[0].className).toMatch(/is-active/)

      key('down', 'down')

      expect(input.getAttribute('aria-activedescendant')).toEqual(results[2].id)
      expect(results[2].className).toMatch(/is-active/)

      key('down')

      expect(input.getAttribute('aria-activedescendant')).toEqual(results[0].id)
      expect(results[0].className).toMatch(/is-active/)

      key('up', 'up')

      expect(input.getAttribute('aria-activedescendant')).toEqual(results[1].id)
      expect(results[1].className).toMatch(/is-active/)
    })

    it('does not allow selection of disabled options', () => {
      createInstance({
        suggestions: fixture.map((item) => Object.assign({}, item, { disabled: true }))
      })

      type(query)

      $$('li[role="option"]').forEach((option) => {
        expect(option.matches('[aria-disabled="true"]')).toBeTruthy()
      })

      key('down', 'enter')

      sinon.assert.notCalled(props.handleAddition)
    })

    it('triggers addition when a suggestion is clicked', () => {
      type(query); click($('li[role="option"]:nth-child(2)'))

      sinon.assert.calledOnce(props.handleAddition)
      sinon.assert.calledWith(props.handleAddition, [{ id: 196, name: 'United Kingdom' }])
    })

    it('triggers addition for the selected suggestion when a delimiter is pressed', () => {
      key('enter')

      sinon.assert.notCalled(props.handleAddition)

      type(query); key('down', 'down', 'enter')

      sinon.assert.calledOnce(props.handleAddition)
      sinon.assert.calledWith(props.handleAddition, [{ id: 196, name: 'United Kingdom' }])
    })

    it('triggers addition for an unselected but matching suggestion when a delimiter is pressed', () => {
      type('united kingdom'); key('enter')
      sinon.assert.calledWith(props.handleAddition, [{ id: 196, name: 'United Kingdom' }])
    })

    it('clears the input when an addition is triggered', () => {
      type(query); key('down', 'down', 'enter')

      const input = $('input')

      expect(input.value).toEqual('')
      expect(document.activeElement).toEqual(input)
    })

    it('does nothing for onchange if there are no delimiterChars', () => {
      createInstance({ delimiterChars: [] })

      type('united kingdom,')

      sinon.assert.notCalled(props.handleAddition)
    })

    it('checks to see if onchange accepts known tags, during paste', () => {
      createInstance({
        delimiterChars: [','],
        allowNew: false,
        handleAddition: props.handleAddition,
        suggestions: fixture
      })

      paste('Thailand,')

      sinon.assert.calledOnce(props.handleAddition)
      sinon.assert.calledWith(props.handleAddition, [{ id: 184, name: 'Thailand' }])
    })

    it('checks to see if onchange rejects unknown tags, during paste', () => {
      createInstance({
        delimiterChars: [','],
        allowNew: false,
        handleAddition: props.handleAddition,
        suggestions: fixture.map((item) => Object.assign({}, item, { disabled: true }))
      })

      paste('Algeria, abc,')

      sinon.assert.notCalled(props.handleAddition)
    })
  })

  describe('tags', () => {
    beforeEach(() => {
      createInstance({ tags: [fixture[0], fixture[1]] })
    })

    it('renders selected tags', () => {
      expect($$('.react-tags__selected-tag').length).toEqual(instance.props.tags.length)
    })

    it('triggers removal when a tag is clicked', () => {
      click($('.react-tags__selected-tag'))

      sinon.assert.calledOnce(props.handleDelete)
      sinon.assert.calledWith(props.handleDelete, sinon.match(0))
    })

    it('deletes the last selected tag when backspace is pressed and query is empty', () => {
      type(''); key('backspace')

      sinon.assert.calledOnce(props.handleDelete)
      sinon.assert.calledWith(props.handleDelete, sinon.match(instance.props.tags.length - 1))
    })

    it('does not delete the last selected tag when backspace is pressed and query is not empty', () => {
      type('uni'); key('backspace')
      sinon.assert.notCalled(props.handleDelete)
    })

    it('does not delete the last selected tag when allowBackspace option is false', () => {
      createInstance({
        tags: [fixture[0], fixture[1]],
        allowBackspace: false
      })

      type(''); key('backspace')

      sinon.assert.notCalled(props.handleDelete)
    })

    it('can render a custom tag component when provided', () => {
      const Tag = (props) => (
        React.createElement('button', { className: 'custom-tag' }, props.tag.name)
      )

      createInstance({
        tags: [fixture[0], fixture[1]],
        tagComponent: Tag
      })

      expect($$('.custom-tag').length).toEqual(2)
    })
  })

  describe('sizer', () => {
    beforeEach(() => {
      createInstance()
    })

    it('appends a sizer element', () => {
      expect($('input + div[style]')).toBeTruthy()
    })

    it('removes the sizer from the layout', () => {
      const result = Array.from($('input + div').style)

      expect(result).toContain('position')
      expect(result).toContain('visibility')
    })

    it('copies styles from the input', () => {
      const result = Array.from($('input + div').style)

      expect(result).toContain('font-family')
      expect(result).toContain('letter-spacing')
    })

    it('copies the input placeholder or value into the sizer', () => {
      const input = $('input')
      const sizer = $('input + div')

      expect(sizer.textContent).toEqual(input.placeholder)

      type('hello world')

      expect(sizer.textContent).toEqual(input.value)
    })

    it('resizes input to match sizer width', () => {
      const input = $('input')
      const sizer = $('input + div')

      type('hello world')

      // As of JSDom 9.10.0 scrollWidth is a getter only and always 0
      // TODO: can we test this another way?
      expect(input.style.width).toBeTruthy()
      expect(window.getComputedStyle(input).width).toEqual(sizer.scrollWidth + 2 + 'px')
    })
  })

  describe('without autoresize', () => {
    beforeEach(() => {
      createInstance({ autoresize: false })
    })

    it('does not assign a width to the input', () => {
      const input = $('input')

      type('hello world')

      // As of JSDom 9.10.0 scrollWidth is a getter only and always 0
      // TODO: can we test this another way?
      expect(input.style.width).toBeFalsy()
    })
  })
})
