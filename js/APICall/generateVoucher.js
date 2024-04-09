const APICall_generateVoucher = async (voucherId) => {
    fetch('../../data.json').then(response => response.json()).then(async data => {
        const getSerialNumberFromConfig = data.serialNumber;
        const getAPIEndpoint = data.api_endPoint;
        const getToken = localStorage.getItem("UserAccessToken");

        const bodyData = {
            token: getToken,
            voucherId: voucherId
        };

        const options = {
            method: "POST",
            body: JSON.stringify(bodyData)
        };

        const getData = await fetch(getAPIEndpoint + getSerialNumberFromConfig + "/job/generateVoucher", options).then(async (response) => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.errorMessage);
                });
            }
            return response.json();
        }).then((data) => {
            console.log(data);

            if (data.errorCode) {
                throw data;
            }
            return data;
        }).catch((error) => {
            vt.error(error.errorMessage, {
                duration: 3000,
                closable: true,
                focusable: true
            });
            isButtonLoadingDashboard(error.voucherData.id, false, error.voucherData.data.tokenPrice)
            console.log(error, "asdasdadadsas");
        });
        return getData;
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}
