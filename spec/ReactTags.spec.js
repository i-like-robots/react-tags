'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const sinon = require('sinon');
const fixture = require('./fixtures/countries')();
const Subject = require('../dist/ReactTags');

const sandbox = sinon.sandbox.create();

let props;
let instance;

const defaults = {
    tags: [],
    suggestions: [],
    handleDelete: sinon.stub(),
    handleAddition: sinon.stub(),
    handleInputChange: sinon.stub()
};

function createInstance (data) {
    props = Object.assign(defaults, data || {});
    instance = ReactDOM.render(React.createElement(Subject, props), document.getElementById('app'));
}

function teardownInstance () {
    sandbox.restore();
    ReactDOM.unmountComponentAtNode(document.getElementById('app'));
}

describe('React Tags', () => {

    afterEach(() => {
        teardownInstance();
    });

    describe('rendering', () => {

        beforeEach(() => {
            createInstance({ tags: [ fixture[0], fixture[1] ] });
        });

        it('renders the basic components', () => {
            expect(() => TestUtils.findRenderedDOMComponentWithClass(instance, 'ReactTags')).not.toThrow();

            expect(() => TestUtils.findRenderedDOMComponentWithClass(instance, 'ReactTags__selected')).not.toThrow();

            expect(() => TestUtils.findRenderedDOMComponentWithClass(instance, 'ReactTags__tagInput')).not.toThrow();
        });

        it('renders any preselected tags', () => {
            const result = TestUtils.scryRenderedDOMComponentsWithClass(instance, 'ReactTags__tag');
            expect(result.length).toEqual(props.tags.length);
        });

    });

    describe('autofocus', () => {

        it('autofocuses on the input', () => {
            createInstance({ autofocus: true });
            expect(document.activeElement).toEqual(TestUtils.findRenderedDOMComponentWithTag(instance, 'input'));
        });

        it('does not autofocus on the input', () => {
            createInstance({ autofocus: false });
            expect(document.activeElement).not.toEqual(TestUtils.findRenderedDOMComponentWithTag(instance, 'input'));
        });

    });

});
