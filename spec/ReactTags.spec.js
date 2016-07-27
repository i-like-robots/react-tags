'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const keycode = require('keycode');
const sinon = require('sinon');
const fixture = require('./fixtures/countries');
const Subject = require('./compiled/ReactTags');

let props;
let instance;

function createInstance (data) {
    const defaults = {
        tags: [],
        suggestions: [],
        handleDelete: sinon.stub(),
        handleAddition: sinon.stub(),
        handleInputChange: sinon.stub()
    };

    props = Object.assign(defaults, data || {});
    instance = ReactDOM.render(React.createElement(Subject, props), document.getElementById('app'));
}

function teardownInstance () {
    ReactDOM.unmountComponentAtNode(document.getElementById('app'));
}

function $ (selector) {
    return document.querySelector(selector);
}

function $$ (selector) {
    return document.querySelectorAll(selector);
}

function type (value) {
    $('input').value = value;
    TestUtils.Simulate.change($('input'));
}

function key () {
    Array.from(arguments).forEach((value) => {
        TestUtils.Simulate.keyDown($('input'), { value, keyCode: keycode(value) });
    });
}

function click (target) {
    TestUtils.Simulate.click(target);
}

describe('React Tags', () => {

    afterEach(() => {
        teardownInstance();
    });

    describe('basic rendering', () => {
        beforeEach(() => {
            createInstance();
        });

        it('renders the basic components', () => {
            expect($('.ReactTags')).toBeTruthy();
            expect($('.ReactTags__selected')).toBeTruthy();
            expect($('.ReactTags__tagInput')).toBeTruthy();
            expect($('.ReactTags__suggestions')).toBeTruthy();
        });
    });

    describe('input', () => {
        it('assigns the given placeholder', () => {
            createInstance({ placeholder: 'Please enter a tag' });
            expect($('input').placeholder).toEqual('Please enter a tag');
        });

        it('autofocuses on the input', () => {
            createInstance({ autofocus: true });
            expect(document.activeElement).toEqual($('input'));
        });

        it('does not autofocus on the input', () => {
            createInstance({ autofocus: false });
            expect(document.activeElement).not.toEqual($('input'));
        });
    });

    describe('query', () => {
        const query = 'united';

        beforeEach(() => {
            createInstance();
        });

        it('updates the internal state', () => {
            type(query);
            expect(instance.state.query).toEqual(query);
        });

        it('filters suggestions to those that match', () => {
            type(query);

            instance.state.suggestions.forEach((suggestion) => {
                expect(suggestion).toMatch(new RegExp('^' + query, 'i'));
            });
        });

        it('triggers the change callback', () => {
            type(query);

            sinon.assert.calledOnce(props.handleInputChange);
            sinon.assert.calledWith(props.handleInputChange, query);
        });

        it('can allow new, non-suggested tags to be added', () => {
            createInstance({ allowNew: false });

            type(query), key('enter');

            sinon.assert.notCalled(props.handleAddition);

            createInstance({ allowNew: true });

            key('enter');

            sinon.assert.calledOnce(props.handleAddition);
            sinon.assert.calledWith(props.handleAddition, { name: query });
        });
    });

    describe('suggestions', () => {
        const query = 'united';

        beforeEach(() => {
            createInstance({ minQueryLength: 3, suggestions: fixture });
        });

        it('shows suggestions list when the query is long enough', () => {
            type(query.slice(0, 2));
            expect($('ul[role="listbox"]')).toBeNull();

            type(query);
            expect($('ul[role="listbox"]')).toBeTruthy();
        });

        it('shows the suggestions list when there are suggestions available', () => {
            type(query);
            expect($$('li[role="option"]').length).toEqual(3);

            type('xyz');
            expect($$('li[role="option"]').length).toEqual(0);
        });

        it('handles up/down keys and can wrap', () => {
            type(query);

            const input = $('input');
            const results = $$('li[role="option"]');

            key('down');

            expect(input.getAttribute('aria-activedescendant')).toEqual(results[0].id);
            expect(results[0].className).toMatch(/is-active/);

            key('down', 'down');

            expect(input.getAttribute('aria-activedescendant')).toEqual(results[2].id);
            expect(results[2].className).toMatch(/is-active/);

            key('down');

            expect(input.getAttribute('aria-activedescendant')).toEqual(results[0].id);
            expect(results[0].className).toMatch(/is-active/);

            key('up');

            expect(input.getAttribute('aria-activedescendant')).toEqual(results[2].id);
            expect(results[2].className).toMatch(/is-active/);
        });

        it('hides the suggestions list when the escape key is pressed', () => {
            type(query);
            expect($('ul[role="listbox"]')).toBeTruthy();

            key('escape');
            expect($('ul[role="listbox"]')).toBeNull();
        });

        it('triggers addition when a suggestion is clicked', () => {
            type(query), click($('li[role="option"]:nth-child(2)'));

            sinon.assert.calledOnce(props.handleAddition);
            sinon.assert.calledWith(props.handleAddition, { id: 196, name: 'United Kingdom' });
        });

        it('triggers addition for the selected suggestion when a delimeter is pressed', () => {
            key('enter');

            sinon.assert.notCalled(props.handleAddition);

            type(query), key('down', 'down', 'enter');

            sinon.assert.calledOnce(props.handleAddition);
            sinon.assert.calledWith(props.handleAddition, { id: 196, name: 'United Kingdom' });
        });

        it('triggers addition for an unselected, matching suggestion when a delimeter is pressed', () =>{
            type('united kingdom'), key('enter');
            sinon.assert.calledWith(props.handleAddition, { id: 196, name: 'United Kingdom' });
        })
    });

    describe('tags', () => {
        beforeEach(() => {
            createInstance({ tags: [ fixture[0], fixture[1] ] });
        });

        it('renders selected tags', () => {
            expect($$('.ReactTags__tag').length).toEqual(instance.props.tags.length);
        });

        it('triggers removal when a tag is clicked', () => {
            click($('.ReactTags__tag'));

            sinon.assert.calledOnce(props.handleDelete);
            sinon.assert.calledWith(props.handleDelete, sinon.match(0));
        });

        it('deletes the last selected tag when backspace is pressed', () => {
            type(''), key('backspace');

            sinon.assert.calledOnce(props.handleDelete);
            sinon.assert.calledWith(props.handleDelete, sinon.match(instance.props.tags.length - 1));
        });
    });

    describe('sizer', () => {
        beforeEach(() => {
            createInstance();
        });

        it('appends a sizer element', () => {
            expect($('input + div[style]')).toBeTruthy();
        });

        it('removes the sizer from the layout', () => {
            const result = Array.from($('input + div').style);

            expect(result).toContain('position');
            expect(result).toContain('visibility');
        });

        it('copies styles from the input', () => {
            const result = Array.from($('input + div').style);

            expect(result).toContain('font-family');
            expect(result).toContain('letter-spacing');
        });

        it('copies the input placeholder or value into the sizer', () => {
            const input = $('input');
            const sizer = $('input + div');

            expect(sizer.textContent).toEqual(input.placeholder);

            type('hello world');

            expect(sizer.textContent).toEqual(input.value);
        });
    });

});
