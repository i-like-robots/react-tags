/* eslint-env jasmine */

'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const TestUtils = require('react-dom/test-utils')
const sinon = require('sinon')
const matchSorter = require('match-sorter').default

const fixture = require('../example/countries')
const Subject = require('../')

let props
let instance

function createInstance (data = {}, teardown = true) {
  if (teardown && instance) {
    teardownInstance()
  }

  const defaults = {
    tags: [],
    suggestions: [],
    onBlur: sinon.stub(),
    onFocus: sinon.stub(),
    onDelete: sinon.stub(),
    onAddition: sinon.stub(),
    onInput: sinon.stub()
  }

  props = Object.assign(defaults, data)

  instance = ReactDOM.render(
    React.createElement(Subject, props),
    document.getElementById('app')
  )
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
  $('input').focus()

  value.split('').forEach((char) => {
    key(char)
    $('input').value += char
    // React calls oninput for every value change to maintain state at all times
    TestUtils.Simulate.input($('input'))
  })
}

function key () {
  Array.from(arguments).forEach((value) => {
    TestUtils.Simulate.keyDown($('input'), { value, key: value })
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
      createInstance({ placeholderText: 'Please enter a tag' })

      expect($('input').getAttribute('placeholder')).toEqual('Please enter a tag')
      expect($('input').getAttribute('aria-label')).toEqual('Please enter a tag')
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

    it('calls focus and blur callbacks when provided', () => {
      createInstance()

      TestUtils.Simulate.focus($('input'))
      sinon.assert.calledOnce(props.onFocus)

      TestUtils.Simulate.blur($('input'))
      sinon.assert.calledOnce(props.onBlur)
    })

    it('can be cleared programmatically', () => {
      createInstance()

      type('foo')

      expect(instance.state.query.length).toBe(3)

      instance.clearInput()

      expect(instance.state.query.length).toBe(0)
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

      sinon.assert.called(props.onInput)
      sinon.assert.calledWith(props.onInput, query)
    })

    it('can allow new, non-suggested tags to be added', () => {
      createInstance({ allowNew: false })

      type(query); key('Enter')

      sinon.assert.notCalled(props.onAddition)

      createInstance({ allowNew: true })

      type(query); key('Enter')

      sinon.assert.calledOnce(props.onAddition)
      sinon.assert.calledWith(props.onAddition, { name: query })
    })

    it('can add new tags when a delimiter character is entered', () => {
      createInstance({ allowNew: true, delimiters: ['Enter', ',', ';'] })

      type('foo,bar;baz'); key('Enter')

      sinon.assert.calledThrice(props.onAddition)
    })

    it('only adds tags which pass the provided onValidate function', () => {
      createInstance({ allowNew: true, onValidate: sinon.stub().returns(false), delimiters: ['Enter', ','] })
      type('foo,bar,baz'); key('Enter')
      sinon.assert.notCalled(props.onAddition)

      createInstance({ allowNew: true, onValidate: sinon.stub().returns(true), delimiters: ['Enter', ','] })
      type('foo,bar,baz'); key('Enter')
      sinon.assert.calledThrice(props.onAddition)
    })

    it('adds tag on blur when addOnBlur is true', () => {
      createInstance({ allowNew: true, addOnBlur: true })

      type(query)

      TestUtils.Simulate.blur($('input'))

      sinon.assert.calledOnce(props.onAddition)
      sinon.assert.calledWith(props.onAddition, { name: query })
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
    })

    it('shows a message when there are no suggestions available', () => {
      createInstance({ noSuggestionsText: 'No suggestions found' })

      type('xyz')
      expect($('ul[role="listbox"] > li:first-child').textContent).toEqual('No suggestions found')
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

    it('uses default suggestionsFilter', () => {
      createInstance({
        minQueryLength: 3,
        suggestions: fixture
      })

      type('Indi')

      const results = $$('li[role="option"]')

      expect(results.some((result) => result.textContent === 'French West Indies')).toBeTruthy()
      expect(results.some((result) => result.textContent === 'India')).toBeTruthy()
      expect(results.some((result) => result.textContent === 'Indonesia')).toBeFalsy()
    })

    it('uses provided suggestionsFilter callback', () => {
      createInstance({
        minQueryLength: 3,
        suggestions: fixture,
        suggestionsFilter: (item, query) => item.name.includes(query)
      })

      type('uni')

      const results = $$('li[role="option"]')

      expect(results.some((result) => result.textContent === 'Reunion')).toBeTruthy()
      expect(results.some((result) => result.textContent === 'Tunisia')).toBeTruthy()
    })

    it('should ignore suggestionsFilter when suggestionsTransform is provided', () => {
      const suggestionsFilter = jasmine.createSpy('suggestionsFilter').and.callFake((item, query) => item.name.includes(query))

      createInstance({
        minQueryLength: 3,
        suggestions: fixture,
        suggestionsFilter,
        suggestionsTransform: (query, suggestions) => matchSorter(suggestions, query, { keys: ['name'] })
      })

      type('uni')

      const results = $$('li[role="option"]')

      expect(results[0].textContent).toBe('United Arab Emirates') // best matches
      expect(suggestionsFilter).not.toHaveBeenCalled()
    })

    it('uses provided suggestionsTransform callback', () => {
      createInstance({
        minQueryLength: 3,
        suggestions: fixture,
        suggestionsTransform: (query, suggestions) => matchSorter(suggestions, query, { keys: ['name'] })
      })

      type('uni')

      const results = $$('li[role="option"]')

      expect(results[0].textContent).toBe('United Arab Emirates') // best matches
      expect(results[1].textContent).toBe('United Kingdom') // best matches
      expect(results.some((result) => result.textContent === 'Reunion')).toBeTruthy()
      expect(results.some((result) => result.textContent === 'Tunisia')).toBeTruthy()
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

      key('ArrowDown')

      expect(input.getAttribute('aria-activedescendant')).toEqual(results[1].id)
      expect(results[1].className).toMatch(/is-active/)

      key('ArrowDown', 'ArrowDown')

      expect(input.getAttribute('aria-activedescendant')).toEqual(results[0].id)
      expect(results[0].className).toMatch(/is-active/)

      key('ArrowUp', 'ArrowUp')

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

      key('ArrowDown', 'Enter')

      sinon.assert.notCalled(props.onAddition)
    })

    it('triggers addition when a suggestion is clicked', () => {
      type(query); click($('li[role="option"]:nth-child(2)'))

      sinon.assert.calledOnce(props.onAddition)
      sinon.assert.calledWith(props.onAddition, { id: 196, name: 'United Kingdom' })
    })

    it('triggers addition for the selected suggestion when a delimiter is pressed', () => {
      key('Enter')

      sinon.assert.notCalled(props.onAddition)

      type(query); key('ArrowDown', 'Enter')

      sinon.assert.calledOnce(props.onAddition)
      sinon.assert.calledWith(props.onAddition, { id: 196, name: 'United Kingdom' })
    })

    it('triggers addition for an unselected but matching suggestion when a delimiter is pressed', () => {
      type('united kingdom'); key('Enter')
      sinon.assert.calledWith(props.onAddition, { id: 196, name: 'United Kingdom' })
    })

    it('does not trigger addition for a previously selected suggestion when no longer suggested', () => {
      type('french'); key('down', 'down'); type('fries'); key('enter')

      sinon.assert.notCalled(props.onAddition)
    })

    it('clears the input when an addition is triggered', () => {
      type(query); key('ArrowDown', 'ArrowDown', 'Enter')

      const input = $('input')

      expect(input.value).toEqual('')
      expect(document.activeElement).toEqual(input)
    })

    it('can render a custom suggestion component when provided', () => {
      const CustomSuggestion = ({ item, query }) => (
        React.createElement(
          'div', { className: 'custom-suggestion' }, item.name)
      )

      createInstance({
        tags: [],
        suggestions: fixture,
        suggestionComponent: CustomSuggestion
      })

      type(query)

      expect($('ul[role="listbox"]')).toBeTruthy()

      expect($$('.custom-suggestion').length).toEqual(3)
    })

    it('updates suggestions when top-level prop changes', () => {
      createInstance({
        tags: [],
        suggestions: fixture
      })

      type('united')

      expect($$('li[role="option"]').length).toEqual(3)

      createInstance({
        suggestions: [...fixture, { id: 1000, name: 'United Union' }]
      }, false)

      expect($$('li[role="option"]').length).toEqual(4)
    })

    describe('when minQueryLength is zero', () => {
      beforeEach(() => {
        createInstance({ minQueryLength: 0, suggestions: fixture })
      })

      it('shows suggestions list when the input is focused', () => {
        TestUtils.Simulate.focus($('input'))
        expect($('ul[role="listbox"]')).toBeTruthy()
      })

      it('resets the suggestions list when an addition is triggered', () => {
        type('french')

        expect($$('li[role="option"]').length).toEqual(2)

        key('ArrowDown', 'ArrowDown', 'Enter')

        expect($$('li[role="option"]').length).toEqual(6)
      })
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

      sinon.assert.calledOnce(props.onDelete)
      sinon.assert.calledWith(props.onDelete, sinon.match(0))
    })

    it('moves focus to the input when a tag is removed', () => {
      click($('.react-tags__selected-tag'))
      expect(document.activeElement).toEqual($('input'))
    })

    it('deletes the last selected tag when backspace is pressed and query is empty', () => {
      type(''); key('Backspace')

      sinon.assert.calledOnce(props.onDelete)
      sinon.assert.calledWith(props.onDelete, sinon.match(instance.props.tags.length - 1))
    })

    it('does not delete the last selected tag when backspace is pressed and query is not empty', () => {
      type('uni'); key('Backspace')
      sinon.assert.notCalled(props.onDelete)
    })

    it('does not delete the last selected tag when allowBackspace option is false', () => {
      createInstance({
        tags: [fixture[0], fixture[1]],
        allowBackspace: false
      })

      type(''); key('Backspace')

      sinon.assert.notCalled(props.onDelete)
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

      // TODO: can we test this another way?
      expect(input.style.width).toBeFalsy()
    })
  })
})
