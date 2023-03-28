var googleApiKey = "AIzaSyBBtqQiIllm7aIk_MiybmFbhXx-PJGR_3s";

var seatGeekApi = "MzI2Mzc1ODZ8MTY3OTc3MzI1OC40NDM5NDI1";

var locationBtn = document.querySelector("#search-btn");

var paginationEl = document.getElementById("pagination");

const resultsPerPage = 20;
var currentPage = 1;
var lat, long;

// user selects range and clicks button
function getLocation(lat, long, page) {
  var radius = document.getElementById("radius").value;
  console.log(radius);

  fetchZipCode(lat, long)
    .then((zipCode) => fetchSeatGeekData(zipCode, radius, page))
    .then((data) => buildTable(data));
}

function fetchZipCode(lat, long) {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${googleApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data.results[0].address_components[6].long_name;
    });
}

function fetchSeatGeekData(zipCode, radius, page) {
  return fetch(
    `https://api.seatgeek.com/2/events?geoip=${zipCode}&range=${radius}mi&client_id=${seatGeekApi}&per_page=20&page=${page}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}

function buildTable(data) {
  const totalPages = Math.ceil(data.meta.total / resultsPerPage);
  document.querySelector(".current-page").textContent = currentPage;
  document.querySelector(".total-pages").textContent = totalPages;
  document.getElementById("venue-table-body").innerHTML = "";
  for (i = 0; i < data.events.length; i++) {
    var tableRow = document.createElement("tr");
    tableRow.appendChild(
      buildTableCell(getFormattedDate(data.events[i].datetime_local))
    );
    tableRow.appendChild(buildTableCell(data.events[i].venue.name));
    tableRow.appendChild(buildTableCell(data.events[i].title));
    tableRow.appendChild(
      buildTableCell(
        `${data.events[i].venue.address} ${data.events[i].venue.extended_address}`
      )
    );
    tableRow.appendChild(buildPurchaseCell(data.events[i].url));
    document.getElementById("venue-table-body").appendChild(tableRow);
  }
}

function buildTableCell(value) {
  var cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function buildPurchaseCell(url) {
  var cell = document.createElement("td");
  var anchorLink = document.createElement("a");
  anchorLink.setAttribute("href", url);
  anchorLink.textContent = "Buy Tickets!";
  anchorLink.setAttribute("target", "_blank");
  anchorLink.classList.add("buy-tickets-btn");
  cell.appendChild(anchorLink);
  return cell;
}

function getFormattedDate(dateString) {
  var unixDate = new Date(dateString).getTime() / 1000;
  var date = new Date(unixDate * 1000);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if (hours > 0 && hours <= 12) {
    hours;
  } else if (hours > 12) {
    hours = hours - 12;
  } else if (hours == 0) {
    hours = 12;
  }
  if (minutes == 0) {
    minutes = "00";
  }
  return `${month}/${day} ${hours}:${minutes}pm`;
}

function init() {
  document.getElementById("venue-table-body").innerHTML = "";
  currentPage = 1;

  navigator.geolocation.getCurrentPosition(function (pos) {
    console.log(pos.coords);
    lat = pos.coords.latitude;
    long = pos.coords.longitude;
    getLocation(lat, long, currentPage);
  });
  // Set up event listeners for pagination buttons
  document.querySelector(".prev-btn").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      getLocation(lat, long, currentPage);
      document.querySelector(".current-page").textContent = currentPage;
    }
  });

  document.querySelector(".next-btn").addEventListener("click", function () {
    currentPage++;
    getLocation(lat, long, currentPage);
    document.querySelector(".current-page").textContent = currentPage;
  });
}

locationBtn.addEventListener("click", init, getLocation);
