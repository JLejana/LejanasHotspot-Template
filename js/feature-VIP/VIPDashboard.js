const generateDOMOnModalVIP = async () => {
  //first generate the login form first
  dynamicallyGenerateHTMLForLogin();
  //apply the loading button then if autologin successfull change the ui to dashboard
  const getUserData = await VIPAutoLogin();

  if (getUserData) {
    updateDataOnDashboard(getUserData);
  }
};

const createUserInfoContainer = () => {
  const userInfoContainer = document.createElement("div");
  userInfoContainer.classList.add("VIPDashboard-user-info");
  userInfoContainer.id = "VIPDashboard-user-info-id";

  const userInfoDetails = document.createElement("div");
  userInfoDetails.classList.add("VIPDashboard-user-info-details");

  const userInfoDetailsImg = document.createElement("img");
  userInfoDetailsImg.classList.add("VIPDashboard-user-dp");
  userInfoDetailsImg.src = "images/icons/CircularLogo.ico";
  userInfoDetailsImg.alt = "Profile Picture";

  const userInfoDetailsNameAndStatus = document.createElement("div");

  const userInfoDetailsName = document.createElement("p");
  userInfoDetailsName.id = "VIPDashboard-userInfo-Name";
  userInfoDetailsName.innerText = "N/A";

  const userInfoDetailsStatus = document.createElement("p");
  userInfoDetailsStatus.id = "VIPDashboard-userInfo-Status-Id";
  userInfoDetailsStatus.classList.add("VIPDashboard-userInfo-Status");
  userInfoDetailsStatus.innerText = "UNKNOWN";

  userInfoDetailsNameAndStatus.append(
    userInfoDetailsName,
    userInfoDetailsStatus
  );
  userInfoDetails.append(userInfoDetailsImg);
  userInfoDetails.append(userInfoDetailsNameAndStatus);
  userInfoContainer.append(userInfoDetails);

  const userToken = document.createElement("div");
  userToken.classList.add("VIPDashboard-user-info-token");

  const userTokenImg = document.createElement("img");
  userTokenImg.classList.add("VIPDashboard-user-dp-token");
  userTokenImg.src = "images/icons/token-icon.png";
  userTokenImg.alt = "Token Image";

  const userTokenValue = document.createElement("h2");
  userTokenValue.id = "VIPDashboard-user-info-token-value";
  userTokenValue.innerText = 0;

  userToken.append(userTokenImg);
  userToken.append(userTokenValue);

  userInfoContainer.append(userToken);

  return userInfoContainer;
};

const dashCreateHeaderTable = () => {
  const tableContainer = document.createElement("div");
  tableContainer.classList.add("center-table", "VIPDashboard-table");

  const table = document.createElement("table");
  table.classList.add("styled-table");

  const tableHead = document.createElement("thead");
  const tableRow = document.createElement("tr");

  const tableHeaderDes = document.createElement("th");
  tableHeaderDes.innerText = "Description";
  const tableHeaderClaim = document.createElement("th");
  tableHeaderClaim.innerText = "Claim";

  tableRow.append(tableHeaderDes, tableHeaderClaim);
  tableHead.append(tableRow);
  table.append(tableHead);
  tableContainer.append(table);

  const tableBody = document.createElement("tbody");
  tableBody.id = "VIPDashboard-tableBodyData";

  table.append(tableBody);

  return tableContainer;
};

const containerGenerateDashboard = async (initialLogin) => {
  const dashContainter = document.getElementById("VIPDashboard");
  const dashContainterInfo = document.getElementById(
    "VIPDashboard-user-info-id"
  );
  dashContainter.classList.add("VIPDashboard-container");

  if (dashContainter) {
    if (!dashContainter.contains(dashContainterInfo)) {
      dashContainter.append(createUserInfoContainer(), dashCreateHeaderTable());
    }
  }

  if (initialLogin) {
    const getUserData = await VIPAutoLogin(true);

    if (getUserData) {
      updateDataOnDashboard(getUserData);
    }
  }
};

function containerRemoveDashboardOrLogin(element, className) {
  const loginContainer = document.getElementById(element);
  loginContainer.classList.remove(className);
  loginContainer.innerHTML = "";
  loginContainer.innerText = "";
}

const updateDataOnDashboard = (userDatas) => {
  //update Token Value
  const getTokenValueElement = document.getElementById(
    "VIPDashboard-user-info-token-value"
  );
  getTokenValueElement.innerText = userDatas.userData.avaiableToken;

  //update User Name
  const getFirstName = userDatas.userCredentials.Information.firstName;
  const getLastName = userDatas.userCredentials.Information.lastName;
  const getNameValueElement = document.getElementById(
    "VIPDashboard-userInfo-Name"
  );
  getNameValueElement.innerText = getFirstName + " " + getLastName;

  //Update Status
  const getStatusValueElement = document.getElementById(
    "VIPDashboard-userInfo-Status-Id"
  );
  getStatusValueElement.innerText = getMacAddressStatus(
    userDatas.userData.macAddress,
    getStatusValueElement
  );
};

const getMacAddressStatus = (macAddress, element) => {
  if (macAddress == "DE-DA-20-84-4F-7D") {
    element.style = "background-color: green";
    return "CONNECTED";
  }
  element.style = "background-color: darkred";
  return "DISCONNECTED";
};
