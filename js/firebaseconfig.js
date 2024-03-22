var firebaseConfig = {
  apiKey: "AIzaSyB042qzvbV-7aW_QS-PNdbXJgaNgVr6Ga0",
  authDomain: "lejana-s-hotspot.firebaseapp.com",
  databaseURL:
    "https://lejana-s-hotspot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lejana-s-hotspot",
  storageBucket: "lejana-s-hotspot.appspot.com",
  messagingSenderId: "370039203000",
  appId: "1:370039203000:web:54a7d40acfaca0c535404d",
};
firebase.initializeApp(firebaseConfig);

var mac = document.getElementById("macaddress").innerHTML;
var domain = document.getElementById("hostdomain").innerHTML;
var Uname;

//  Run When Webpage is Up
window.onload = function () {
  for (i = 0; i < 5; i++) {
    mac = mac.replace(":", "");
  }
  console.log(mac);
  document.getElementById("macaddress").style.display = "none";
  document.getElementById("hostdomain").style.display = "none";
};

function macremovecolon() {
  for (i = 0; i < 5; i++) {
    mac = mac.replace(":", "");
  }
  console.log(mac);
  return mac;
}

//-------------------------
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function getdate() {
  const d = new Date();
  const months = [
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
  buwan = months[d.getMonth()];
  taon = d.getUTCFullYear();
  araw = d.getDate();

  let panahon = buwan + " " + araw + " " + taon;
  return panahon;
}

function checkinfo() {
  Uname = document.getElementById("voucheruser").innerHTML;
  console.log(Uname);
}

document.getElementById("loadsavevoucher").onclick = function SelectAllData() {
  document.getElementById("tablelist").style.visibility = "hidden";

  var query = firebase
    .database()
    .ref("LH-Vouchers/" + mac)
    .orderByChild("DateAndTime")
    .limitToLast(3);
  query.once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var DataUsername = childSnapshot.val().Username;
      var DataLoginTime = childSnapshot.val().DateAndTime;
      if (snapshot.child(DataUsername).exists() == true) {
        AddItemsToTable(DataUsername, DataLoginTime);
      }
    });
    document.getElementById("modal-loader").style.display = "none";
    document.getElementById("tablelist").style.visibility = "visible";
  });
};

function AddItemsToTable(Username, TimeLogin) {
  var tbody = document.getElementById("tbody1");
  var trow = document.createElement("tr");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");

  td2.className = "tr-td-right";
  td3.className = "tr-td-left";

  td2.innerHTML =
    "<h1 class='tbl-username'>" +
    Username +
    "</h1><p class='tbl-timeanddate'>" +
    TimeLogin +
    "</p>";
  td3.innerHTML =
    "<a href=http://" +
    domain +
    "/login?username=" +
    Username +
    "&password=" +
    Username +
    " id='btn-useitnow'>USE IT NOW!</a>";

  trow.appendChild(td2);
  trow.appendChild(td3);
  tbody.appendChild(trow);
}

function saveuser() {
  checkinfo();
  console.log("MAC ADDRESS:" + mac);

  if (Uname != "") {
    firebase
      .database()
      .ref("LH-Vouchers/" + macremovecolon() + "/" + Uname)
      .set({
        Username: Uname,
        DateAndTime: getdate() + " " + formatAMPM(new Date()),
      });
    console.log("Data Sent!");
  }
}
