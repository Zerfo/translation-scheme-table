import React from 'react';

import '../../style/item/BtnClick.css'

function BtnClick(props) {
  return <div className="btnClick" onClick={ () => props.funcClick() }>{props.btnText}</div>
}
export default BtnClick;