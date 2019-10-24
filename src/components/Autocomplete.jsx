import React, { useState, useRef } from 'react';
import AutocompleteResultItem from './AutocompleteResultItem';
import './Autocomplete.scss';
function Autocomplete({data, name, id, weightAlgorithm='INDEX'}) {
    const [searchKey, setSearchKey] = useState({value: '', isSearching: false});
    const [searchResults, setSearchResults] = useState([]);
    const [placeholder, setPlaceholder] = useState('');
    const [listIndex, setListIndex] = useState(-1);
    const inputEl = useRef(null);
    const minNumberOfCharacters = 2;

    const handleKeyDown = (event) => {
        switch(event.key){
            case 'Enter':
                selectItemBasedOnIndex();
                break;
            case 'ArrowUp':
                prevResult();
                event.preventDefault();
                break;
            case 'ArrowDown':
                nextResult();
                event.preventDefault();
                break;
            default:
                removePreSelect();
                break;
        }
    }
    const selectItemBasedOnIndex = () => {
        if(listIndex > -1){
            selectItem(listIndex);
        }else{
            setSearchKey({value: searchKey.value, isSearching: false });
        }
    }
    const nextResult = () => {
        const nextIndex = listIndex+1;
        if(searchKey.isSearching && nextIndex < searchResults.length){
            preSelect(nextIndex);
        }
    }
    const prevResult = () => {
        if(searchKey.isSearching && listIndex >0){
            preSelect(listIndex-1);
        }
    }
    const lowercaseAndRemoveSpaces = (str) => {
        return str.split(' ').join('').toLowerCase()
    }
    const currentWeightAlgorithm = (str, key) => {
        if(weightAlgorithm === 'INDEX'){
            let result = lowercaseAndRemoveSpaces(str).indexOf(key);
            return result < 0 ? str.length * 1000 : result;
        }else{
            return levenshtein(str, key);
        }
    }
    const filteredData = (key) => {
        if(!key || key.length < minNumberOfCharacters){
            return [];
        }else{
            const filterRE = new RegExp('.*' + key.split('').join('.*') + '.*','i');
            const noSpacesKey = lowercaseAndRemoveSpaces(key);
            return data.filter(item => fuzzyMatch(filterRE, item))
                        .sort((a,b) => {
                            const levA = currentWeightAlgorithm(a, noSpacesKey);
                            const levB = currentWeightAlgorithm(b, noSpacesKey);
                            if(levA>levB){
                                return 1;
                            }else if(levA<levB){
                                return -1;
                            }else { 
                                return 0;
                            }
                        });
        }
    }
    const fuzzyMatch = (re, str) => {
        return re.test(str);
    }

    const levenshtein = (a, b) => {
        let t = [], u, i, j, m = a.length, n = b.length;
        if (!m) {
            return n;
        }
        if (!n) {
            return m;
        }
        for (j = 0; j <= n; j++) {
            t[j] = j;
        }
        for (i = 1; i <= m; i++) {
            for (u = [i], j = 1; j <= n; j++) {
                u[j] = a[i - 1] === b[j - 1] ? t[j - 1] : Math.min(t[j - 1], t[j], u[j - 1]) + 1;
            }
            t = u;
        }
        return u[n];
    }

    const selectItem = (index) => {
        setSearchKey({value: searchResults[index], isSearching: false});
        setPlaceholder('');
        setListIndex(-1);
        inputEl.current.focus();
    }
    const onChange = (event) => {
        const newSearch = event.target.value;
        setSearchKey({value: newSearch, isSearching: newSearch.length>=minNumberOfCharacters });
        setSearchResults(filteredData(newSearch));
        setPlaceholder('');
        setListIndex(-1);
    }
    const preSelect = (index) => {
        setPlaceholder(searchResults[index]);
        setListIndex(index);
    }
    const removePreSelect = () => {
        setPlaceholder('');
    }

    const clearSearch = (event) => {
        setSearchKey({value: '', isSearching: false });
        inputEl.current.focus();
    }

    return (
        <div className="autocomplete">
            <div className="autocomplete-input-container">
                <input  name={name} 
                        id={id}
                        onChange={onChange}
                        value={searchKey.value}
                        onKeyDown={handleKeyDown}
                        ref={inputEl}
                        autofocus="true"
                />
                {placeholder && <div className="autocomplete-placeholder">{placeholder}</div>}
                <button onClick={clearSearch} className={`clear-search ${searchKey.value ? 'active' : ''}`}></button>
            </div>
            {
                (searchKey.isSearching && searchResults.length > 0) &&
                <ul>
                    {searchResults.map((item, index) => (
                        <AutocompleteResultItem key={index} index={index} selected={listIndex === index} onClick={selectItem} onHover={preSelect} onHoverOut={removePreSelect} value={item} searchKey={searchKey.value} />
                    ))}
                </ul>
            }
        </div>
    );
}

export default Autocomplete;
