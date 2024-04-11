const APICall_generateVoucher = async (voucherId) => {
  fetch("../../data.json")
    .then((response) => response.json())
    .then(async (data) => {
      const getSerialNumberFromConfig = data.serialNumber;
      const getAPIEndpoint = data.api_endPoint;
      const getToken = localStorage.getItem("UserAccessToken");

      const bodyData = {
        token: getToken,
        voucherId: voucherId,
      };
      const options = {
        method: "POST",
        body: JSON.stringify(bodyData),
      };

      const getData = await fetch(
        getAPIEndpoint + getSerialNumberFromConfig + "/job/generateVoucher",
        options
      )
        .then(async (response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(
                errorData.errorMessage ? errorData.errorMessage : errorData
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);

          if (data.errorCode) {
            throw data;
          }
          return data;
        })
        .catch((error) => {
          //Internal Error
          if (error.message) {
            const logout = () => {
              let closeTheModalElement =
                document.getElementById("modal-closeButton");

              function delayedClick() {
                closeTheModalElement.click();
              }
              setTimeout(delayedClick, 3000);
            };

            vt.error(convertErrorCodeToUserFriendly(error.message), {
              duration: 5000,
              closable: true,
              callback: logout(),
            });
          } else {
            vt.error(error.errorMessage, {
              duration: 3000,
              closable: true,
            });

            isButtonLoadingDashboard(
              error.voucherData.id,
              false,
              error.voucherData.data.tokenPrice
            );
          }
        });
      return getData;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
