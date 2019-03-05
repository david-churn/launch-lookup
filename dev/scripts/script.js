'use strict';
// Screen to display rocket launch data from the Launch Library.
//   https://launchlibrary.net
// 2/12/2019 David Churn created

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
// the base URL for all requests.
const llUrl = "https://launchlibrary.net/1.4/";

// Look up mission status values to populate a drop down list and a display array.
let statusArr = [];
let statusUrl = llUrl + 'launchstatus';
fetch(statusUrl)
  .then( (response) => response.json() )
  .then(function(statusObj) {
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

// Look up the launch service providers for a display array.
//   Note: In the URL "limit=-1" means "all available"
//                    "mode=S" supposedly means "less information" but seems to be ignored.
let lspArr = [];
let lspUrl = llUrl + 'agency?islsp=1&mode=S&limit=-1';
fetch(lspUrl)
  .then( (response) => response.json() )
  .then(function(lspObj) {
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

// Display the mission list when the user clicks the search button
//   using the parameters they entered (or ignored).
searchBtnObj.addEventListener('click', function() {
  clearList();
  let searchUrl = llUrl + "launch?";

  // Check the input and add the valid values to the request
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

  fetch(searchUrl)
    .then( (response) => response.json() )
    .then(function(launchObj) {
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

// Reveal the subsection heading and build the table headings.
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

// Build the launch list creating event listeners as you go.
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

// This is an acceptable use of the <br>.
//   The replace takes out all the bars '|' and put a line break in.
  let launchNm = row.insertCell();
  launchNm.innerHTML = listObj.name.replace(/\|/g,"<br>");

// >> Important! This must be the last element in the row for the Launch Detail. <<
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

// clean up launch list (+event listeners) and launch detail areas
function clearList() {
  clearDetail();
  while (msnTableObj.hasChildNodes()) {
    msnTableObj.childNodes[0].removeEventListener('click',getDetail)
    msnTableObj.removeChild(msnTableObj.childNodes[0]);
  };
  msnTableHdrObj.setAttribute("class","hidden");
}

// Fetch the detail for one launch and display them.
function getDetail(clickObj) {
  clearDetail();
  // build mission as heading and appropriate details from the hidden ID in the launch list.
  let detailUrl = llUrl + "launch?mode=verbose&id=" + clickObj.srcElement.parentNode.lastChild.textContent;

  fetch(detailUrl)
    .then( (response) => response.json() )
    .then(function(launchObj) {
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

// Display some of the details found.
function postDetail(detailObj) {
  msnDetailHdrObj.setAttribute("class","");

  let launchNm = document.createElement('h2');
  launchNm.innerHTML = detailObj.name.replace(/\|/g,"<br>");
  msnDetailObj.appendChild(launchNm);

  let lspNm = document.createElement('p');
  lspNm.innerHTML = `by ${detailObj.lsp.name}`;
  msnDetailObj.appendChild(lspNm);

  let msnStat = document.createElement('p');
  msnStat.innerHTML = `status: ${statusArr.find(obj => obj.id === detailObj.status).description}`;
  msnDetailObj.appendChild(msnStat);

  let launchDt = document.createElement('p');
  launchDt.innerHTML = `launch date: ${detailObj.net}`;
  msnDetailObj.appendChild(launchDt);

  let whereNm = document.createElement('p');
  whereNm.innerHTML = `launch site: ${detailObj.location.name}`;
  msnDetailObj.appendChild(whereNm);

  let rocketNm = document.createElement('p');
  rocketNm.innerHTML = `rocket: ${detailObj.rocket.name}`;
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
