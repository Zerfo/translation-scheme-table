import React, {Component} from 'react';

export default class OriginalLangSelect extends Component {
  handleChange = (e) => {
    this.props.getValue(e.target.value);
  }

  render() {
    return <select onChange={this.handleChange} defaultValue={this.props.defaultValue} ref={(select) => this.select = select} name="originalLang" id="originalLang">
            <option value="" disabled selected>Выберите язык оригинала</option>
              { this.props.mapLang.map(item => {
                return <option key={item.id} value={item.id}>{item.name}</option>
              })}
          </select>
  }
}