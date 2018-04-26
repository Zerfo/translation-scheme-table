import React, {Component} from 'react';


export default class Name extends Component {
  handleChange = (e) => {
    this.props.getValue(e.target.value);
  }

  render() {
    return <textarea onChange={this.handleChange} defaultValue={this.props.defaultValue} ref={(textarea) => this.textarea = textarea} placeholder="Комментарий" id="comment" name="comment" maxlength="200" rows="6"/>
  }
}