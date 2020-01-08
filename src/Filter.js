import React from 'react';
import Dropdown from 'react-dropdown'
import stateList from './states';
import './App.css';
import 'react-dropdown/style.css'

function Filter(selectedFilter, handleFilter) {
    let filterOptions = [
        { value: 'democrat', label: 'Democrat' }, 
        { value: 'independent', label: 'Independent' },
        { value: 'republican', label: 'Republican'}
    ];

    for (let key in stateList) {
        filterOptions.push(
          { 
            value: key, 
            label: stateList[key] 
          }
        );
    }

    return (
        <div id='find'>
        <Dropdown
            options={filterOptions}
            value={selectedFilter}
            placeholder='Filter'
            onChange={handleFilter}
        >    
            {filterOptions.map((item, index) => (
                <Dropdown.Item index={index}>
                    {item}
                </Dropdown.Item>
            ))}
        </Dropdown>
        </div>
    )
}

export default Filter;