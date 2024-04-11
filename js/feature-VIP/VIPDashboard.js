const generateDOMOnModalVIP = async () => {
  // first generate the login form first
  dynamicallyGenerateHTMLForLogin();
  // apply the loading button then if autologin successfull change the ui to dashboard
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
  // update Token Value
  const getTokenValueElement = document.getElementById(
    "VIPDashboard-user-info-token-value"
  );
  getTokenValueElement.innerText = userDatas.userData.availableToken;

  // update User Name
  const getFirstName = userDatas.userCredentials.Information.firstName;
  const getLastName = userDatas.userCredentials.Information.lastName;
  const getNameValueElement = document.getElementById(
    "VIPDashboard-userInfo-Name"
  );
  getNameValueElement.innerText = getFirstName + " " + getLastName;

  // Update Status
  const getStatusValueElement = document.getElementById(
    "VIPDashboard-userInfo-Status-Id"
  );
  getStatusValueElement.innerText = getMacAddressStatus(
    userDatas.userData.macAddress,
    getStatusValueElement
  );

  // Update Table
  updateDashboardTable(userDatas.activeVouchers);
};

const getMacAddressStatus = (macAddress, element) => {
  if (macAddress == "DE-DA-20-84-4F-7D") {
    element.style = "background-color: green";
    return "CONNECTED";
  }
  element.style = "background-color: darkred";
  return "DISCONNECTED";
};

const isButtonLoadingDashboard = async (voucherId, isLoading, Label) => {
  let element = document.getElementById(voucherId);

  function generateButtonProgressLabel() {
    const newParagraph = document.createElement("p");
    newParagraph.id = voucherId + "_statusLabel";
    newParagraph.innerText = "Connecting...";
    newParagraph.classList.add("ButtonProgressLabel");
    return newParagraph;
  }

  if (isLoading) {
    const isSuccess = await fetch("images/icons/loading.svg")
      .then((response) => response.text())
      .then((svgContent) => {
        const progressLabel = generateButtonProgressLabel();
        const loadingAniAndPercent = document.createElement("div");
        loadingAniAndPercent.id = voucherId + "_loadingAnimation";
        loadingAniAndPercent.classList.add(
          "Dashboard_LoadingAnimationWithPercentage_Table"
        );

        loadingAniAndPercent.innerHTML = `${svgContent}`;

        // loadingAniAndPercent.innerHTML = `${svgContent}${
        //     dashboardProgressLabelPercentage().outerHTML
        // }`;

        element.innerHTML = "";
        element.append(loadingAniAndPercent);
        element.append(progressLabel);

        element.disabled = true;
        return true;
      })
      .catch((error) => {
        console.error("Error fetching SVG file:", error);
        return false;
      });
    return isSuccess;
  } else {
    element.innerHTML = "";
    element.textContent = Label ? Label : "Next";
    element.disabled = false;
  }
  return false;
};

const generateVoucherFromJob = (voucherID) => {
  const getVoucherButton = document.getElementById(voucherID);
  getVoucherButton.disabled = true;
  console.log("testing");
  if (isButtonLoadingDashboard(voucherID, true, "ERROR!")) {
    APICall_generateVoucher(voucherID);
  }
};

const updateDashboardTable = (activeVouchers) => {
  const getTableId = document.getElementById("VIPDashboard-tableBodyData");
  const listOfVoucherIds = [];

  activeVouchers.sort((a, b) => {
    // Check if both objects have the required keys
    const hasKeysA =
      a.hasOwnProperty("username") &&
      a.hasOwnProperty("password") &&
      a.hasOwnProperty("tokenPrice") &&
      a.hasOwnProperty("isProcessing");
    const hasKeysB =
      b.hasOwnProperty("username") &&
      b.hasOwnProperty("password") &&
      b.hasOwnProperty("tokenPrice") &&
      b.hasOwnProperty("isProcessing");

    // Sort based on whether they have the required keys
    if (hasKeysA && !hasKeysB) {
      return -1; // a should come before b
    } else if (!hasKeysA && hasKeysB) {
      return 1; // b should come before a
    } else {
      return 0; // maintain the original order
    }
  });

  activeVouchers.forEach((voucher) => {
    const newTableData = document.createElement("tr");

    const TableDataRowCol1 = document.createElement("td");
    TableDataRowCol1.innerText = voucher.description
      ? voucher.description
      : voucher.id;

    const TableDataRowCol2 = document.createElement("td");
    const createButton = document.createElement("button");
    createButton.id = voucher.id;

    if (typeof voucher.tokenPrice != "undefined") {
      createButton.innerText = voucher.tokenPrice;
      createButton.classList.add("VIPDashboard-button-like-link-active");
    } else {
      createButton.disabled = true;
      createButton.innerText = "Not Available";
      createButton.classList.add("VIPDashboard-button-like-link-notActive");
    }
    createButton.onclick = function () {
      generateVoucherFromJob(voucher.id);
    };

    TableDataRowCol2.append(createButton);

    newTableData.append(TableDataRowCol1, TableDataRowCol2);
    getTableId.append(newTableData);

    if (voucher?.isProcessing) {
      isButtonLoadingDashboard(voucher.id, true);
    }
    listOfVoucherIds.push(voucher.id);
  });
  localStorage.setItem("WebTaskRunnerRunningData", listOfVoucherIds);
};

const dashboardProgressLabelPercentage = (
  elementID,
  jobTaskId,
  percentage,
  currentLevel
) => {
  const progressLabelElement = document.createElement("p");
  progressLabelElement.id = elementID + "_statusPercent";
  progressLabelElement.setAttribute("data-jobTaskId", jobTaskId);
  progressLabelElement.setAttribute("data-currentLevel", percentage);
  progressLabelElement.innerText = currentLevel + "%";
  progressLabelElement.classList.add(
    "Dashboard_LoadingAnimation_PercentageLabel_Table"
  );
  return progressLabelElement;
};

const updateDashboardProgressLabelPercentage = (elementID, percentage) => {
  const getPercentage = document.getElementById(elementID + "_statusPercent");
  getPercentage.setAttribute("data-currentLevel", percentage);
};

const updateDashboardProgressLabelPercentageAnimated = (oldValue) => {
  const counters = document.querySelectorAll(
    ".Dashboard_LoadingAnimation_PercentageLabel_Table"
  );
  const speed = 1000;

  const min = 5;
  const max = 20;
  const speedCounter = Math.floor(Math.random() * (max - min + 1)) + min;

  counters.forEach((counter) => {
    function animate() {
      const value = +counter.getAttribute("data-currentLevel");
      const data = +counter.innerText.replace(/%/g, "");

      const time = value / speed;
      if (data < value) {
        counter.innerText = Math.ceil(data + time) + "%";
        setTimeout(animate, speedCounter);
      } else {
        counter.innerText = value + "%";
      }
    }

    animate();
  });
};
