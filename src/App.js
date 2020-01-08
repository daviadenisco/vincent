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
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [selectedSort, setSelectedSort] = useState();
  const [selectedFilter, setSelectedFilter] = useState();
  
  useEffect(() => {
    getMembers();
  }, []);
  
  useEffect(() => {
    setCurrentData(filteredMembers.slice(offset, offset + pageLimit));
  }, [offset, filteredMembers]);

  useEffect(()=>{
    const filteredMembers = members.filter(member => {
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
    setFilteredMembers(filteredMembers);

  },[selectedFilter, members])

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

  const handleSort = option => {
    setSelectedSort(option.value);
    sortResults(option.value);
  }

  const handleFilter = option => {
    setSelectedFilter(option.value);
  }

  // function manageSort(a, b) {
  //   let sortResults = members.slice(0);
  //   sortResults.sort(function(a, b) {
  //     if (a < b) {
  //       return -1;
  //     };
  //     if (a > b) {
  //       return 1;
  //     };
  //     return 0;
  //   })
  // }
  
  function sortResults(option) {
    if (option === 'none') {
      getMembers();
    } else if (option === 'party') {
      // let a = members.terms[members.terms.length-1].party.toUpperCase();
      // let b = members.terms[members.terms.length-1].party.toUpperCase();
      // let sortByParty = manageSort(a, b);
      let sortByParty = members.slice(0);
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
      setMembers(sortByParty);

    } else if (option === 'state') {
      let sortByState = members.slice(0);
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
      setMembers(sortByState)
    } else if (option === 'name') {
      // sort by first name
      let sortByName = members.slice(0);
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
      setMembers(sortByName);
    } else if (option === 'terms') {
      let sortByTerms = members.slice(0);
      sortByTerms.sort(function(a, b) {
        a = a.terms.length;
        b = b.terms.length;
        return b - a;
      });
      setMembers(sortByTerms);
    };
  };
    
  return (
    <div id='container'>
      <div id='header'>
        United States Members of Congress
      </div>
      <div id='find'>
        <Paginator
          totalRecords={members.length}
          pageLimit={pageLimit}
          setOffset={setOffset}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
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
        <span className='find-label'>Filter: </span>
        <Dropdown 
          options={sortOptions}
          value={selectedSort}
          placeholder='Select option...'
          onChange={handleSort}
        />
        <span className='find-label'>Sort: </span>
      </div>
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
      <Paginator
        totalRecords={members.length}
        pageLimit={pageLimit}
        setOffset={setOffset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default App;