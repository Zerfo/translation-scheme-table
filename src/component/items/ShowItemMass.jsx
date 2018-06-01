import React from 'react';

import '../../style/item/ShowItemMass.css'

function ShowItemMass(props) {
  return (
    <div className = "selectedLang">
      { props.mass.length > 0 && props.mass.map( (item, index) => {
        return <div key = { index } className = "lang" onClick = { () => props.deleteLang(item) }>{ item }</div>
      }) }
    </div>
  );
}
export default ShowItemMass;