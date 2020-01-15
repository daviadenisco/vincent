import React, {useState, useEffect} from 'react';
import Dropdown from 'react-dropdown'
import Grid from '@material-ui/core/Grid';
import Paginator from 'react-hooks-paginator';
import axios from 'axios';
import Member from './Member';
import stateList from './states';
import {getStateNameByStateCode} from './helpers';
import './App.css';
import 'react-dropdown/style.css'

const baseUrl = 'https://theunitedstates.io/congress-legislators/legislators-current.json';

const sortOptions = [
  { value: 'none', label: 'None' },
  { value: 'party', label: 'Party' },
  { value: 'state', label: 'State' },
  { value: 'name', label: 'Name' },
  { value: 'terms', label: 'Terms' }
];

let filterOptions = [
  { value: 'all', label: 'All'},
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
function App() {
  // for pagination
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // members list from url
  const [members, setMembers] = useState([]);
  // updated list of members based on search, sort, or filter
  const [updatedMembers, setUpdatedMembers] = useState([]);
  // the data we map over to render each congressperson's card
  const [currentData, setCurrentData] = useState([]);
  // sort, filter, and search options/terms
  const [selectedSort, setSelectedSort] = useState();
  const [selectedFilter, setSelectedFilter] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    getMembers();
  }, []);
  
  useEffect(() => {
    setCurrentData(updatedMembers.slice(offset, offset + pageLimit));
  }, [offset, updatedMembers]);
  
  useEffect(() => {
    let list = null;
    if (searchTerm || selectedSort) {
      list = updatedMembers;
    } else {
      list = members;
    }
    const filteredMembers = list.filter(member => {
      if(!selectedFilter) return true;
      
      const termsLen = member.terms ? member.terms.length : 0;
      const state = termsLen && member.terms && member.terms[member.terms.length-1] && member.terms[member.terms.length-1].state;
      
      const party = member.terms[member.terms.length-1].party.toUpperCase();
      
      if(!termsLen) return false;
      
      if ('all' === selectedFilter) {
        return 'all' === selectedFilter;
      }
      return state === selectedFilter || party === selectedFilter.toUpperCase();
    });
    setUpdatedMembers(filteredMembers);    
  },[selectedFilter, members]);
  
  useEffect(() => {
    const results = members.filter(member => {
      if (searchTerm === '') return true;
      const name = member.name.official_full.toUpperCase();

      return name.includes(searchTerm.toUpperCase());
    })
    setUpdatedMembers(results);
  }, [searchTerm, members]);
  
  // number of items to display on each page
  const pageLimit = 20;
  
  const getMembers = () => {
    axios.get(`${baseUrl}`)
    .then((response) => {
      const allMembers = response.data;
        setMembers(allMembers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function resetSearchSortFilter() {
    setSearchTerm('');
    setSelectedFilter();
    setSelectedSort();
  }

  function resetFilter() {
    setSelectedFilter('all');
  }

  const handleSort = option => {
    setSelectedSort(option.value);
    sortResults(option.value);
  }

  const handleFilter = option => {
    if (searchTerm && selectedFilter && selectedSort) {
      resetFilter();
    }

    setTimeout(() => setSelectedFilter(option.value), 500);
  }

  const handleSearch = e => {
    setSelectedSort();
    setSelectedFilter();
    setSearchTerm(e.target.value);
    if (e.target.value.length < 1) {
      getMembers();
    }
  }
  
  function sortResults(option) {
    let list = null;
    if (searchTerm || selectedFilter) {
      list = updatedMembers;
    } else {
      list = members
    }
    if (option === 'none') {
      getMembers();
    } else if (option === 'party') {
      let sortByParty = list.slice(0);
      sortByParty.sort(function(a, b) {
        a = a.terms[a.terms.length-1].party.toUpperCase();
        b = b.terms[b.terms.length-1].party.toUpperCase();
        if (a < b) {
          return -1;
        } 
        if (a > b) {
          return 1;
        }
        return 0;
      });
      // setMembers(sortByParty);
      setUpdatedMembers(sortByParty)


    } else if (option === 'state') {
      let sortByState = list.slice(0);
      sortByState.sort(function(a, b) {
        a = getStateNameByStateCode(a.terms[a.terms.length-1].state.toUpperCase()) || 'Z';
        b = getStateNameByStateCode(b.terms[b.terms.length-1].state.toUpperCase()) || 'Z';

        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
      setUpdatedMembers(sortByState)
      // setMembers(sortByState)

    } else if (option === 'name') {
      // sort by first name
      let sortByName = list.slice(0);
      sortByName.sort(function(a, b) {
        a = a.name.first.toUpperCase() || 'Z';
        b = b.name.first.toUpperCase() || 'Z';

        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
      // sort by last name
      sortByName.sort(function(a, b) {
        a = a.name.last.toUpperCase() || 'Z';
        b = b.name.last.toUpperCase() || 'Z';
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
      setUpdatedMembers(sortByName);
      // setMembers(sortByName);

    } else if (option === 'terms') {
      let sortByTerms = list.slice(0);
      sortByTerms.sort(function(a, b) {
        a = a.terms.length;
        b = b.terms.length;
        return b - a;
      });
      setUpdatedMembers(sortByTerms);
      // setMembers(sortByTerms);

    };
  };
  return (
    <div id='container'>
      <div id='sticky'>
        <div id='header' className='shadow'>
          <span id='blue'>
            United States Members of 
          </span>
          <span id='red'> Congress</span>
        </div>
        {/* <div className='paginator-div'>
        <Paginator
          totalRecords={updatedMembers.length}
          pageLimit={pageLimit}
          setOffset={setOffset}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        </div> */}
        <div id='subheader'>
          <div id='search-div'>

           <input type='text' id='search' placeholder='Enter name...' value={searchTerm} onChange={handleSearch} />
          <span className='search-label'>Search: </span>
          </div>
        <div id='find'>
          <Dropdown
            options={filterOptions}
            value={selectedFilter}
            placeholder='Select option...'
            onChange={handleFilter}
          >    
            {filterOptions.map((item, index) => (
              <Dropdown.Item index={index}>
                {item}
              </Dropdown.Item>
            ))}
          </Dropdown>
          <span className='filter-label'>Filter: </span>
          <Dropdown 
            options={sortOptions}
            value={selectedSort}
            placeholder='Select option...'
            onChange={handleSort}
          />
          <span className='sort-label'>Sort: </span>
        </div>
        </div>
      </div>
      
      
{updatedMembers.length ? 
  <div>
    <Grid container className="App" spacing={6}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={6}>
          {currentData.map((member, index) => (
            <Grid key={index} item>
              <Member key={member.id} index={index} member={member} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
    <div id='bottom-paginator'>
      <Paginator
        totalRecords={updatedMembers.length}
        pageLimit={pageLimit}
        setOffset={setOffset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  </div> 
  : 
  <div>
    <Grid container className="App" spacing={6}>
      <Grid item xs={12}>
        <div id='no-results'>
          Nothing found, please reset the search filters.
        </div>
        <button id='reset' onClick={resetSearchSortFilter}>Reset</button>
      </Grid>
    </Grid>
  </div>}
</div>);
}

export default App;