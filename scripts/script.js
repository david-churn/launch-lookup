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
const mlistObj = document.getElementById("mlist");
const mdetailObj = document.getElementById("mdetail");
const messageObj = document.getElementById("message");

// look up mission status values to populate drop down list
// look up launch service provider abbreviations to populate drop down list

searchBtnObj.addEventListener('click', function() {
  resetPage();
  let searchStr = '';
  // Check the input and use valid values
  if (msnNameObj.innerText != '') {
    searchStr += ('name=' + Number(listQtyObj.innerText) + '&')
  }
  if (startDtObj.innerText != '') {
    searchStr += ('startdate=' + startDtObj.innerText + '&')
  }
  if (endDtObj.innerText != '') {
    searchStr += ('enddate=' + endDtObj.innerText + '&')
  }
  if (statusObj.innerText != '') {
    searchStr += ('status=' + statusObj.innerText + '&')
  }
  if (abbrevObj.innerText != '') {
    searchStr += ('abbrevObj=' + Number(abbrevObj.innerText) + '&')
  }
  searchStr += ('limit=' + Number(listQtyObj.innerText));
  // What was just built?!?
  console.log(searchStr);

  // fetch a list from launchlibrary

  // default call to launches
  let llurl =  "https://launchlibrary.net/1.4/launch";
  fetch(llurl)
    .then(function(response) {
      console.log(response);
      console.log(response.status);
      return response.json();
    })
    .then(function(respJson) {
      // error handling?
      return JSON.stringify(respJson);
    })
    .then(function(launchObj) {
      // Does the message look different on an error?
      console.log('object=', launchObj);
      console.log('array=', launchObj.launches);
      console.log('count=', launchObj.count);
      console.log(`array length=${launchObj.launches.length}`);
      // if ( maxQty > 0 ) {
      //   for (let x=0; x < maxQty; x++) {
      //     postLaunch(launchObj.launches[x])
      //   }
      // }
      // else {
      //   messageObj.innerHTML = `Launch Library says ${launchObj}`;
      // }
    });
    // build the mission list creating event listeners as you go.  (See trivia quiz)

});

function postLaunch(listObj) {
//! Switch to inline blocks, class="inblock"
  let listRow = document.createElement('li');

  listRow.innerHTML = `(${listObj.id})
    \t ${listObj.windowstart} UTC
    \t ${listObj.status}
    \t ${listObj.lsp}
    \t ${(listObj.name)}
    `;

  mlistObj.appendChild(listRow);
  listRow.addEventListener('click',getDetail);
};

// clear all the search fields and any results.
clearBtnObj.addEventListener('click', function() {
  resetPage();
  // reset search fields
});

// clean up mission list (+event listeners) and mission detail areas
function resetPage() {
  console.log(`resetPage`);
  listQtyObj.value = '10';
  msnNameObj.value = ' ';
  startDtObj.value = '';
  endDtObj.value = '';
  statusObj.value = '';
  abbrevObj.value = '';
  messageObj.value = '';

  // clean up mission list (while loop)
  // clear mission detail
}

function clearDetail() {
  console.log('clearDetail');
};

// fetch the detail from Launch Library and display the details
function getDetail() {
  console.log('getDetail');
  // clear detail area
  // build mission as heading and appropriate details
}
