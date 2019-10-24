import React from 'react';
import Autocomplete from './Autocomplete';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import fruits from '../data/fruits.js';

test('renders without crashing', () => {
    const wrapper = document.createElement('div');
    ReactDOM.render(<Autocomplete />, wrapper);
    ReactDOM.unmountComponentAtNode(wrapper);
});

test('search for app', () => {
    const wrapper = document.createElement('div');
    act(() => {
        ReactDOM.render(<Autocomplete data={fruits} />, wrapper);
    });
    expect(wrapper.textContent).toBe('');
    const input = wrapper.querySelector('input');
    Simulate.change(input, {target: {value: 'app'}});
    const results = wrapper.querySelectorAll('.result-item');
    expect(results.length).toBe(5);
    expect(results[0].textContent).toBe('Apple');
    expect(results[1].textContent).toBe('Crab apples');
    expect(results[2].textContent).toBe('Pineapple');
    expect(results[3].textContent).toBe('Star apple');
    expect(results[4].textContent).toBe('Japanese plum');
    expect(wrapper.querySelectorAll('strong')[0].textContent).toBe('App');
});

test('search for olive', () => {
    const wrapper = document.createElement('div');
    act(() => {
        ReactDOM.render(<Autocomplete data={fruits} />, wrapper);
    });
    expect(wrapper.textContent).toBe('');
    const input = wrapper.querySelector('input');
    
    Simulate.change(input, {target: {value: 'olive'}});
    const results = wrapper.querySelectorAll('.result-item');
    expect(results.length).toBe(2);
    expect(results[0].textContent).toBe('Olive');
    expect(results[1].textContent).toBe('Olive');
    expect(wrapper.querySelectorAll('strong')[0].textContent).toBe('Olive');
});

test('no result for less than 2 characters', () => {
    const wrapper = document.createElement('div');
    act(() => {
        ReactDOM.render(<Autocomplete data={fruits} />, wrapper);
    });
    expect(wrapper.textContent).toBe('');
    const input = wrapper.querySelector('input');
    
    Simulate.change(input, {target: {value: 'o'}});
    const results = wrapper.querySelectorAll('.result-item');
    expect(results.length).toBe(0);
});

test('navigates result with mouse', () => {
    const wrapper = document.createElement('div');
    act(() => {
        ReactDOM.render(<Autocomplete data={fruits} />, wrapper);
    });
    expect(wrapper.textContent).toBe('');
    const input = wrapper.querySelector('input');
    
    Simulate.change(input, {target: {value: 'app'}});
    const results = wrapper.querySelectorAll('.result-item');

    Simulate.mouseEnter(results[1]);
    expect(wrapper.querySelector('.autocomplete-placeholder').textContent).toBe('Crab apples');
    expect(input.value).toBe('app');
    
    Simulate.click(results[1]);
    expect(wrapper.querySelector('.autocomplete-placeholder')).toBe(null);
    expect(input.value).toBe('Crab apples'); 
    
    const clearSearchButton = wrapper.querySelector('.clear-search'); 
    Simulate.click(clearSearchButton);
    expect(wrapper.querySelector('.autocomplete-placeholder')).toBe(null);
    expect(input.value).toBe(''); 

});

test('navigates result with arrows', () => {
    const wrapper = document.createElement('div');
    act(() => {
        ReactDOM.render(<Autocomplete data={fruits} />, wrapper);
    });
    expect(wrapper.textContent).toBe('');
    const input = wrapper.querySelector('input');
    
    Simulate.change(input, {target: {value: 'app'}});
    const results = wrapper.querySelectorAll('.result-item');
    
    for(let i=0; i<10; i++){
        Simulate.keyDown(input, {key: 'ArrowDown'});
    }
    expect(wrapper.querySelector('.autocomplete-placeholder').textContent).toBe('Japanese plum');
    expect(input.value).toBe('app');
    
    for(let i=0; i<10; i++){
        Simulate.keyDown(input, {key: 'ArrowUp'});
    }
    expect(wrapper.querySelector('.autocomplete-placeholder').textContent).toBe('Apple');
    expect(input.value).toBe('app');

    Simulate.keyDown(input, {key: 'Enter'});
    expect(wrapper.querySelector('.autocomplete-placeholder')).toBe(null);
    expect(input.value).toBe('Apple'); 
});