'use strict'
// Screen to display rocket launchs using data from the Launch Library.
//   https://launchlibrary.net
// 2/12/2019 David Churn created

console.log('Project Launch ready!');

// set address for screen Items
const listQtyObj = document.getElementById("list-qty");
const msnNameObj = document.getElementById("msn-name");
const startDtObj = document.getElementById("start-dt");
const endDtObj = document.getElementById("end-dt");
const statusObj = document.getElementById("msn-status");
const abbrevObj = document.getElementById("lsp-abbrev");
const searchBtnObj = document.getElementById("search-it");
const clearBtnObj = document.getElementById("clear-it");
const msnListObj = document.getElementById("mlist");
const mdetailObj = document.getElementById("mdetail");
const messageObj = document.getElementById("message");
const llUrl = "https://launchlibrary.net/1.4/";

// look up mission status values to populate drop down list
// look up launch service provider abbreviations to populate drop down list

searchBtnObj.addEventListener('click', function() {
  clearList();
  let searchUrl = llUrl + "launch?";

  // Check the input and use valid values
  if (msnNameObj.value != '') {
    searchUrl += ('name=' + msnNameObj.value + '&')
  }
  if (startDtObj.value != '') {
    searchUrl += ('startdate=' + startDtObj.value + '&')
  }
  if (endDtObj.value != '') {
    searchUrl += ('enddate=' + endDtObj.value + '&')
  }
  if (statusObj.value != '') {
    searchUrl += ('status=' + statusObj.value + '&')
  }
// needs abbreviation -> lsp translation
  if (abbrevObj.value != '') {
    searchUrl += ('lsp=' + abbrevObj.value + '&')
  }
  if (listQtyObj.value >= 0) {
    searchUrl += ('limit=' + Number(listQtyObj.value) );
  }
  else {
    searchUrl += 'limit=10';
  }

  // What was just built?!?
  console.log(`searchUrl=${searchUrl}`);
  // fetch a list from launchlibrary
  fetch(searchUrl)
    .then( (response) => response.json() )
    .then(function(launchObj) {
      console.log('launchObj=', launchObj);
      if ( launchObj.count > 0 ) {
        for (let item in launchObj.launches) {
          postLaunch(launchObj.launches[item])
        }
        messageObj.innerHTML = "";
      }
      else {
        messageObj.innerHTML = `Launch Library says ${launchObj.msg}`;
      }
    });
});

// build the mission list creating event listeners as you go.  (See trivia quiz)
function postLaunch(listObj) {
//! Switch to inline blocks, class="inblock"
  let listRow = document.createElement('li');

  listRow.innerHTML = `(${listObj.id})
     ${listObj.windowstart} UTC
     ${listObj.status}
     ${listObj.lsp}
     ${(listObj.name)}
    `;

  msnListObj.appendChild(listRow);
  listRow.addEventListener('click',getDetail)
};

// clear all the search fields and any results.
// clean up mission list (+event listeners) and mission detail areas
clearBtnObj.addEventListener('click', function() {
  msnNameObj.value = '';
  startDtObj.value = '';
  endDtObj.value = '';
  statusObj.value = '';
  abbrevObj.value = '';
  messageObj.value = '';
  listQtyObj.value = '10';
// clean up mission list and detail
  clearList();
});

// Clear the list Items
function clearList() {
  clearDetail();
  while (msnListObj.hasChildNodes()) {
    msnListObj.childNodes[0].removeEventListener('click',getDetail)
    msnListObj.removeChild(msnListObj.childNodes[0]);
  };
}

// fetch the detail from Launch Library and display the details
function getDetail(clickObj) {
  console.log('getDetail=', clickObj);
  // clear detail area
  clearDetail();
  // build mission as heading and appropriate details
  let detailUrl = llUrl + "launch?mode=verbose&id=" ;
  // What was just built?!?
  console.log(`detailUrl=${detailUrl}`);
  fetch(detailUrl)
    .then( (response) => response.json() )
    .then(function(launchObj) {
      console.log('launchObj=', launchObj);
      if ( launchObj.count > 0 ) {
        for (let item in launchObj.launches) {
          postDetail(launchObj.launches[item])
        }
        messageObj.innerHTML = "";
      }
      else {
        messageObj.innerHTML = `Launch Library says ${launchObj.msg}`;
      };
    })
}

function postDetail(detailObj) {
  console.log('postDetail=', detailObj);
  // let listRow = document.createElement('li');
  //
  // listRow.innerHTML = `(${listObj.id})
  //    ${listObj.windowstart} UTC
  //    ${listObj.status}
  //    ${listObj.lsp}
  //    ${(listObj.name)}
  //   `;
  //
  // msnListObj.appendChild(listRow);
  // listRow.addEventListener('click',getDetail)
};

function clearDetail() {
  console.log('clearDetail');
};
