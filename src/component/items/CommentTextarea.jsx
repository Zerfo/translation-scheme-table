import React, {Component} from 'react';

import '../../style/item/CommentTextarea.css';

export default class CommentTextarea extends Component {
  handleChange = (e) => {
    this.props.getValue(e.target.value);
  };

  render() {
    return <textarea onChange = { this.handleChange }
                     className = "comment-textarea"
                     defaultValue = { this.props.defaultValue }
                     ref = { (textarea) => this.textarea = textarea }
                     placeholder = "Комментарий"
                     name = "comment"
                     maxLength = "300"
                     rows = "6"
    />
  }
}