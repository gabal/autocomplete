import React from 'react';
import './AutocompleteResultItem.scss';
function AutocompleteResultItem({index, value, searchKey, onClick, onHover, onHoverOut, selected}) {
    const escapeRegExp = (text) => {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    const getHighlightedText = (text, searchKey) => {
        if(searchKey && searchKey.length>1){
            let parts = text.split(new RegExp(`(${escapeRegExp(searchKey)})`, 'gi'));
            return <span>{ 
                parts.map((part, i) => {
                    if(part.toLowerCase() === searchKey.toLowerCase()){
                        return <strong key={i}>{ part }</strong>
                    }else if(part.length>0){
                        return <span key={i}>{ part }</span>
                    }else{
                        return '';
                    }
                })
            }
            </span>;
        }else{
            return <span>{text}</span>;
        }
    }
  return (
    <li className={`${selected ? 'selected' : ''} result-item`}
        onClick={()=>onClick(index)}
        onMouseEnter={()=>onHover(index)}
        onMouseLeave={()=>onHoverOut()} >
        {getHighlightedText(value, searchKey)}
    </li>
  );
}

export default AutocompleteResultItem;


