'use strict';
// Screen to display rocket launchs using data from the Launch Library.
//   https://launchlibrary.net
// 2/12/2019 David Churn created

console.log('Project Launch ready!');

// set address for screen Items
const listQtyObj = document.getElementById("list-qty");
const msnNameObj = document.getElementById("msn-name");
const startDtObj = document.getElementById("start-dt");
const endDtObj = document.getElementById("end-dt");
const msnStatusObj = document.getElementById("msn-status");
const searchBtnObj = document.getElementById("search-it");
const clearBtnObj = document.getElementById("clear-it");
const msnTableHdrObj = document.getElementById("mtable-hdr");
const msnTableObj = document.getElementById("mtable");
const msnDetailHdrObj = document.getElementById("l-header");
const msnDetailObj = document.getElementById("mdetail");
const messageObj = document.getElementById("message");
const llUrl = "https://launchlibrary.net/1.4/";

// look up mission status values to populate drop down list and display array.
let statusArr = [];
// fetch a list from launchlibrary
let statusUrl = llUrl + 'launchstatus';
fetch(statusUrl)
  .then( (response) => response.json() )
  .then(function(statusObj) {
    console.log('statusObj=', statusObj);
    if ( statusObj.count > 0 ) {
      statusArr = statusObj.types;
      for (let index in statusObj.types) {
        msnStatusObj.options[msnStatusObj.options.length] = new Option(statusObj.types[index].name, statusObj.types[index].id);
      }
      messageObj.innerHTML = "";
    }
    else {
      messageObj.innerHTML = `Launch Library says ${statusObj.msg}`;
    }
  });

// look up the launch service providers for a display array.
let lspArr = [];
// fetch a list from launchlibrary
//   limit=-1 means "all available"
let lspUrl = llUrl + 'agency?islsp=1&mode=S&limit=-1';
fetch(lspUrl)
  .then( (response) => response.json() )
  .then(function(lspObj) {
    console.log('lspObj=', lspObj);
    if ( lspObj.count > 0 ) {
      lspArr = lspObj.agencies;
      // for (let index in lspObj.types) {
      //   msnlspObj.options[msnlspObj.options.length] = new Option(lspObj.types[index].name, lspObj.types[index].id);
      // }
      messageObj.innerHTML = "";
    }
    else {
      messageObj.innerHTML = `Launch Library says ${lspObj.msg}`;
    }
  });

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
  if (msnStatusObj.value > 0) {
    searchUrl += ('status=' + msnStatusObj.value + '&')
  }
  if (listQtyObj.value > 0) {
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
        addTableHeading();
        for (let item in launchObj.launches) {
          postLaunch(launchObj.launches[item])
        }
        messageObj.innerHTML = "";
      }
      // unhide headings
      else {
        messageObj.innerHTML = `Launch Library says ${launchObj.msg}`;
      }
    });
});

function addTableHeading() {
// make subheading title visible
  msnTableHdrObj.setAttribute("class","");

// insert the table headings into the first row
  let row = msnTableObj.insertRow();
  msnTableObj.appendChild(row);

  let rowStatus = row.insertCell();
  rowStatus.outerHTML = "<th>Status</th>";

  let launchTsp = row.insertCell();
  launchTsp.outerHTML = "<th>Launch Time (UTC)</th>";

  let lspAbbrev = row.insertCell();
  lspAbbrev.outerHTML = "<th>Provider</th>";

  let launchNm = row.insertCell();
  launchNm.outerHTML = "<th>Description</th>";

  let launchID = row.insertCell();
  launchID.outerHTML = "<th class='hidden'>ID</th>";
}

// build the mission list creating event listeners as you go.
function postLaunch(listObj) {
  let row = msnTableObj.insertRow();
  msnTableObj.appendChild(row);

  row.setAttribute("class","hilite");
  row.addEventListener('click',getDetail);

  let rowStatus = row.insertCell();
  rowStatus.innerHTML = statusArr.find(obj => obj.id === listObj.status).name;
  rowStatus.setAttribute("class","center");

  let launchTsp = row.insertCell();
  launchTsp.innerHTML = listObj.windowstart;

  let lspAbbrev = row.insertCell();
  lspAbbrev.innerHTML = lspArr.find(obj => obj.id == listObj.lsp).abbrev;
  lspAbbrev.setAttribute("class","center");

  let launchNm = row.insertCell();
  launchNm.innerHTML = listObj.name;
  // split the line
  // .replace(/\|/g,"<br>");

// >> This must be the last element in the row. <<
  let launchID = row.insertCell();
  launchID.setAttribute("class","hidden");
  launchID.innerHTML = listObj.id;
};

// clear all the search fields and any results.
clearBtnObj.addEventListener('click', function() {
  msnNameObj.value = '';
  startDtObj.value = '';
  endDtObj.value = '';
  msnStatusObj.value = '';
  messageObj.value = '';
  listQtyObj.value = '10';
  clearList();
});

// clean up mission list (+event listeners) and mission detail areas
function clearList() {
  clearDetail();
  while (msnTableObj.hasChildNodes()) {
    msnTableObj.childNodes[0].removeEventListener('click',getDetail)
    msnTableObj.removeChild(msnTableObj.childNodes[0]);
  };
  msnTableHdrObj.setAttribute("class","hidden");
}

// fetch the detail from Launch Library and display the details
function getDetail(clickObj) {
  console.log('getDetail=', clickObj);
  // clear detail area
  clearDetail();
  // build mission as heading and appropriate details
  let detailUrl = llUrl + "launch?mode=verbose&id=" + clickObj.srcElement.parentNode.lastChild.textContent;
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
  msnDetailHdrObj.setAttribute("class","");

  let launchNm = document.createElement('h2');
  launchNm.innerHTML = detailObj.name;
  msnDetailObj.appendChild(launchNm);

  let lspNm = document.createElement('p');
  lspNm.innerHTML = `by ${detailObj.lsp.name}`;
  msnDetailObj.appendChild(lspNm);

  let launchDt = document.createElement('p');
  launchDt.innerHTML = `launch: ${detailObj.net}`;
  msnDetailObj.appendChild(launchDt);

  let msnStat = document.createElement('p');
  msnStat.innerHTML = `status: ${statusArr.find(obj => obj.id === detailObj.status).description}`;
  msnDetailObj.appendChild(msnStat);

  let whereNm = document.createElement('p');
  whereNm.innerHTML = `from: ${detailObj.location.name}`;
  msnDetailObj.appendChild(whereNm);

  let rocketNm = document.createElement('p');
  rocketNm.innerHTML = `on: ${detailObj.rocket.name}`;
  msnDetailObj.appendChild(rocketNm);

  if (detailObj.missions.length > 0) {
    let missionHdr = document.createElement('h3');
    missionHdr.innerHTML = `Missions`;
    msnDetailObj.appendChild(missionHdr);

    for (let mission of detailObj.missions) {
      let missionNm = document.createElement('p');
      missionNm.innerHTML = `${mission.name} - ${mission.description}`;
      msnDetailObj.appendChild(missionNm);
    }
  }
};

function clearDetail() {
  msnDetailHdrObj.setAttribute("class","hidden");

  while (msnDetailObj.hasChildNodes()) {
    msnDetailObj.removeChild(msnDetailObj.childNodes[0]);
  };
};
