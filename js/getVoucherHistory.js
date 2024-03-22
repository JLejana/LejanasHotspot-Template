var mac = document.getElementById("macaddress").innerHTML;
var domain = document.getElementById("hostdomain").innerHTML;

window.addEventListener("load", (event) => {
  fetchData(true);
});

document
  .getElementById("modal-button-event")
  .addEventListener("click", function () {
    //clear the error whenever they click the close button on modal
    document.getElementById("showError").style.display = "none";
  });

document.getElementById("loadsavevoucher").onclick = function SelectAllData() {
  document.getElementById("modal-loader").style.display = "block";
  document.getElementById("tablelist").style.visibility = "hidden";

  fetchData();
};

function AddItemsToTable(user) {
  let username = user.username;
  let statDate = formatDate(user.end_date);
  let isExpired = user.isexpired;

  var tbody = document.getElementById("tbody1");
  var trow = document.createElement("tr");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");

  td2.className = "tr-td-right";
  td3.className = "tr-td-left";

  td2.innerHTML =
    "<h1 class='tbl-username'>" +
    username +
    "</h1><p class='tbl-timeanddate'>" +
    statDate +
    "</p>";

  if (!isExpired) {
    td3.innerHTML =
      "<a href=http://" +
      domain +
      "/login?username=" +
      username +
      "&password=" +
      username +
      " class='button-like-link-active '>USE IT NOW!</a>";
  } else {
    td3.innerHTML = "<p class='button-like-link-expired'>EXPIRED</p>";
  }

  trow.appendChild(td2);
  trow.appendChild(td3);
  tbody.appendChild(trow);
}

// Function to fetch data with timeout
function fetchDataWithTimeout(url, timeout, options) {
  const fetchDataPromise = fetch(url, options);

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out"));
    }, timeout);
  });

  return Promise.race([fetchDataPromise, timeoutPromise]);
}

function formatDate(dateString) {
  // Create a Date object from the given string
  var date = new Date(dateString);

  // Define months array
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month, day, year, hour, and minute from the date object
  var month = months[date.getUTCMonth()];
  var day = date.getUTCDate();
  var year = date.getUTCFullYear();
  var hour = date.getUTCHours();
  var minute = date.getUTCMinutes();

  // Convert hour to 12-hour format and determine AM/PM
  var period = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  hour = hour ? hour : 12; // Handle midnight

  // Add leading zero if minute is less than 10
  minute = minute < 10 ? "0" + minute : minute;

  // Form the final date string
  var formattedDate =
    month + " " + day + ", " + year + " " + hour + ":" + minute + " " + period;

  return formattedDate;
}

const showErrorConnection = (isShown) => {
  const element = document.getElementById("showError");
  const elementSavedButton = document.getElementById("loadsavevoucher");

  if (isShown) {
    document.getElementById("modal-loader").style.display = "none";
    fetch("images/icons/alert-error.svg")
      .then((response) => response.text())
      .then((svgContent) => {
        element.innerHTML = svgContent;

        // Center the SVG within the element (optional, depending on your CSS)
        element.style.marginTop = "100px";
        element.style.display = "flex";
        element.style.justifyContent = "center";
        element.style.alignItems = "center";

        elementSavedButton.innerHTML = svgContent + "  MY SAVED VOUCHERS ";
        elementSavedButton.disabled = true;

        elementSavedButton.querySelector("svg").setAttribute("width", "30px");
        elementSavedButton.querySelector("svg").setAttribute("height", "30px");

        elementSavedButton.style.display = "flex";
        elementSavedButton.style.justifyContent = "center";
        elementSavedButton.style.alignItems = "center";
        elementSavedButton.classList.add("disabledButton");
      })
      .catch((error) => {
        console.error("Error fetching SVG file:", error);
      });
  } else {
    element.style.visibility = "hidden";
  }
};

const fetchData = (getStatus) => {
  const bodyData = {
    mac_address: "11:22:33:44:55:22",
    userSerialNum: "cc220dfe5dc7test",
  };

  const options = {
    method: "POST",
    body: JSON.stringify(bodyData),
  };

  fetchDataWithTimeout(
    "http://mikrotik-hotspot-api.vercel.app/api/getHistory",
    5000,
    options
  )
    .then((response) => {
      if (!response.ok) {
        showErrorConnection(true);
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (!getStatus) {
        data.sort((a, b) => {
          if (a.isexpired === b.isexpired) {
            return new Date(a.end_date) - new Date(b.end_date);
          } else {
            return a.isexpired ? 1 : -1;
          }
        });
        data.forEach((user) => {
          AddItemsToTable(user);
        });
        document.getElementById("modal-loader").style.display = "none";
        document.getElementById("tablelist").style.visibility = "visible";
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
