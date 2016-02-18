// Set up test data
const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
      ,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
      ,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
      ,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
      ,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
      ,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
      ,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
      ,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
      ,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
      ,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
      ,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
      ,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
      ,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
      ,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)"
      ,"Yemen","Zambia","Zimbabwe"];

const React = require('react');
const ReactDom = require('react-dom');
const Tags = require('../lib/ReactTags');

const App = React.createClass({

    getInitialState() {
        return {
            tags: [ { id: 184, name: "Thailand" }, { id: 86, name: "India" } ],
            suggestions: countries.map((item, i) => { return { id: i, name: item } }),
            busy: false
        }
    },

    handleDelete(i) {
        var tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({ tags: tags });
    },

    handleAddition(tag) {
        var tags = this.state.tags;
        tags.push(tag);
        this.setState({ tags: tags });
    },

    handleToggle() {
      this.setState({
        busy: !this.state.busy
      });
    },

    render() {
        const tags = this.state.tags;
        const suggestions = this.state.suggestions;

        return (
            <div>
                <Tags
                    tags={tags}
                    suggestions={suggestions}
                    busy={this.state.busy}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition} />
                <br />
                <label>
                  <input type="checkbox" ref="busy" onClick={this.handleToggle} />
                  <span>&nbsp;Toggle busy state</span>
                </label>
                <hr />
                <pre>
                    <code>{JSON.stringify(tags, null, 2)}</code>
                </pre>
            </div>
        )
    }

});

ReactDom.render(<App />, document.getElementById('app'));
