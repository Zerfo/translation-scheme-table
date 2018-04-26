import React, {Component} from 'react';


export default class Name extends Component {
  handleChange = (e) => {
    this.props.getValue(e.target.value);
  };

  render() {
    return <input onChange={this.handleChange} defaultValue={this.props.defaultValue} ref={(input) => this.input = input} id="nameTask" className="nameInp" placeholder="Название " type="text"/>
  }
}