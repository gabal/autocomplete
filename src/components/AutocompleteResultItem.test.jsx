import React from 'react';
import AutocompleteResultItem from './AutocompleteResultItem';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

test('search for ana in Banana', () => {
    const wrapper = document.createElement('div');
    act(() => {
        ReactDOM.render(<AutocompleteResultItem value={'Banana'} searchKey={'ana'} />, wrapper);
    });
    expect(wrapper.querySelector('li').innerHTML).toBe('<span><span>B</span><strong>ana</strong><span>na</span></span>');
});

test('search for banana in Banana', () => {
    const wrapper = document.createElement('div');
    act(() => {
        ReactDOM.render(<AutocompleteResultItem value={'Banana'} searchKey={'banana'} />, wrapper);
    });
    expect(wrapper.querySelector('li').innerHTML).toBe('<span><strong>Banana</strong></span>');
});

test('search for empty in Banana', () => {
    const wrapper = document.createElement('div');
    act(() => {
        ReactDOM.render(<AutocompleteResultItem value={'Banana'} searchKey={''} />, wrapper);
    });
    expect(wrapper.querySelector('li').innerHTML).toBe('<span>Banana</span>');
});
