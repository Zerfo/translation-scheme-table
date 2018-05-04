import React, {Component} from 'react';

import '../../style/item/LangSelect.css';

export default class LangSelect extends Component {
  handleChange = (e) => {
    this.props.getValue(e.target.value);
  };

  render() {
    return <select onChange = { this.handleChange }
                   defaultValue = { this.props.defaultValue }
                   ref = { (select) => this.select = select }
                   name = "selectLang"
                   className = "lang-select">
      <option value = "" disabled selected>{ this.props.textType }</option>
      { this.props.mapLang.map(item => {
        return <option key = { item.id } value = { item.id }>{ item.name }</option>
      }) }
    </select>
  }
}