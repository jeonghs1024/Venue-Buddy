var googleApiKey = "AIzaSyBBtqQiIllm7aIk_MiybmFbhXx-PJGR_3s";

var seatGeekApi = "MzI2Mzc1ODZ8MTY3OTc3MzI1OC40NDM5NDI1";

var locationBtn = document.querySelector("#search-btn");

var paginationEl = document.getElementById("#pagination");

// var getData = document.getElementById("#username")
//     if (values)

// get user lat/long
var searchcurrentLocation = function (e) {
  e.preventDefault();
  console.log(e);

  navigator.geolocation.getCurrentPosition(function (pos) {
    console.log(pos.coords);
    var lat = pos.coords.latitude;
    var long = pos.coords.longitude;
    console.log(lat, long);
    getLocation(lat, long);
  });
};

// user selects range and clicks button
function getLocation(lat, long) {
  // radius drop down menu
  var radius = document.getElementById("radius").value;
  console.log(radius);

  // #1 fetch user zip code using lat/long from navigator.geolocation
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${googleApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // pull down user zip code from blob
      var zipCode = data.results[0].address_components[6].long_name;
      console.log(zipCode);
      // #2 fetch seat geek venue/show information using the user zip code and radius
      fetch(
        "https://api.seatgeek.com/2/events?geoip=" +
          zipCode +
          "&range=" +
          radius +
          "mi&client_id=" +
          seatGeekApi +
          "&per_page=25"
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          // begins building the html table body and iterates through seat geek blob - set to 25 results
          document.getElementById("venue-table-body").innerHTML = "";
          for (i = 0; i < data.events.length; i++) {
            var tableRow = document.createElement("tr");

            // adjust date format to something more presentable
            var unixDate =
              new Date(data.events[i].datetime_local).getTime() / 1000;
            var date = new Date(unixDate * 1000);
            var month = date.getMonth();
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();

            // convert from military time
            if (hours > 0 && hours <= 12) {
              hours;
            } else if (hours > 12) {
              hours = hours - 12;
            } else if (hours == 0) {
              hours = 12;
            }
            console.log(typeof minutes);
            if (minutes == 0) {
              minutes = "00";
            }
            console.log(unixDate);

            // page time/date column
            var timeColumn = document.createElement("td");
            timeColumn.textContent =
              month + 1 + "/" + day + " " + hours + ":" + minutes + "pm";

            // page time/date column
            var date = new Date(data.events[i].datetime_local).getTime() / 1000;
            console.log(date);

            // venue name column
            var venueColumn = document.createElement("td");
            venueColumn.textContent = data.events[i].venue.name;

            // event name column
            var eventNameColumn = document.createElement("td");
            eventNameColumn.textContent = data.events[i].title;

            // city/state/zip column
            var locationColumn = document.createElement("td");
            locationColumn.textContent = data.events[i].venue.extended_address;

            // link to purchase tickets column
            var purchaseColumn = document.createElement("td");
            var anchorLink = document.createElement("a");
            anchorLink.setAttribute("href", data.events[i].url);
            anchorLink.textContent = "Buy Tickets!";
            purchaseColumn.appendChild(anchorLink);

            // creates rows for returned seat geek data
            tableRow.appendChild(timeColumn);
            tableRow.appendChild(venueColumn);
            tableRow.appendChild(eventNameColumn);
            tableRow.appendChild(locationColumn);
            tableRow.appendChild(purchaseColumn);
            document.getElementById("venue-table-body").appendChild(tableRow);
          }
        });
    });
}

locationBtn.addEventListener("click", searchcurrentLocation, getLocation);
