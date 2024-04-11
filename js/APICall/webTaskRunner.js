const APICall_WebTaskRunner = async () => {
  // Your asynchronous task code here
  const voucherIds = localStorage.getItem("WebTaskRunnerRunningData");
  if (voucherIds) {
    try {
      const result = await taskRunner_FetchData(voucherIds);
      console.log("Task executed at: " + new Date() + ", Result: " + result);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }
};

// Example asynchronous function
function taskRunner_FetchData(voucherIds) {
  return new Promise((resolve, reject) => {
    fetch("../../data.json")
      .then((response) => response.json())
      .then(async (data) => {
        const getSerialNumberFromConfig = data.serialNumber;
        const getAPIEndpoint = data.api_endPoint;
        const getToken = localStorage.getItem("UserAccessToken");

        const bodyData = {
          token: getToken,
          voucherIds: voucherIds.split(","),
        };

        const options = {
          method: "POST",
          body: JSON.stringify(bodyData),
        };

        const getData = await fetch(
          getAPIEndpoint + getSerialNumberFromConfig + "/job/WebTaskRunner",
          options
        )
          .then(async (response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error(errorData.errorMessage);
              });
            }
            return response.json();
          })
          .then((data) => {
            updateVoucherStateOnDashboard(data);
            updateDashboardProgressLabelPercentageAnimated(4);
            if (data.errorCode) {
              throw data;
            }
            return data;
          })
          .catch((error) => {
            vt.error(error.errorMessage, {
              position: CONSTANT_TOASTPOSITION.BottomLeft,
              duration: 2000,
              closable: true,
              focusable: true,
              callback: undefined,
            });
          });
        return getData;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        localStorage.removeItem("WebTaskRunnerRunningData");
      });
    setTimeout(() => {
      resolve("Data fetched successfully");
    }, 3000); // Simulating a delay of 2 seconds
  });
}

const updateVoucherStateOnDashboard = (voucherIds) => {
  voucherIds.forEach((voucher) => {
    const getProgressLabel = document.getElementById(
      voucher.voucherId + "_statusLabel"
    );
    getProgressLabel.innerHTML = voucher.jobMessage.short;

    const getLoadingElement = document.getElementById(
      voucher.voucherId + "_loadingAnimation"
    );
    // getLoadingElement.innerHTML = "MAMAO";

    const getParentElementOfStatusPercent = document.getElementById(
      voucher.voucherId + "_loadingAnimation"
    );
    const getCurrentElementOfStatusPercent = document.getElementById(
      voucher.voucherId + "_statusPercent"
    );

    if (
      !getParentElementOfStatusPercent.contains(
        getCurrentElementOfStatusPercent
      )
    ) {
      getLoadingElement.innerHTML = `${
        dashboardProgressLabelPercentage(
          voucher.voucherId,
          voucher.jobId,
          voucher.jobMessage.loadingPercentage,
          0
        ).outerHTML
      }`;
    } else {
      updateDashboardProgressLabelPercentage(
        voucher.voucherId,
        voucher.jobMessage.loadingPercentage
      );
    }
  });
};

setInterval(APICall_WebTaskRunner, 3000);
