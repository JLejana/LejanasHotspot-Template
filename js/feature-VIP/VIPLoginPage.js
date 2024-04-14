const VIPAutoLogin = async () => {
  containerRemoveDashboardOrLogin("VIPDashboard", "VIPDashboard-container");
  const getToken = localStorage.getItem("UserAccessToken");
  const getUserLogin = localStorage.getItem("UserLogin");

  const tryUserLogin = (errorMessage) => {
    updateErrorMessage(errorMessage + ": Trying Stored Credential");
    try {
      if (getUserLogin && JSON.parse(getUserLogin)) {
        const options = {
          method: "POST",
          body: getUserLogin,
        };
        fetch("../../data.json")
          .then((response) => response.json())
          .then((data) => {
            isButtonLoading(true);
            login(options, data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    } catch (e) {
      updateErrorMessage(e.message);
    }
  };

  const autoLoginAPICall = async (options, data) => {
    const getSerialNumberFromConfig = data.serialNumber;
    const getAPIEndpoint = data.api_endPoint;
    const getData = await fetch(
      getAPIEndpoint + getSerialNumberFromConfig + "/autoLogin",
      options
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.errorMessage);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.errorCode) {
          throw data;
        }
        containerRemoveDashboardOrLogin("VIPLogin", "VIPLogin-container");
        containerGenerateDashboard();
        return data;
      })
      .catch((error) => {
        if (error?.message) {
          localStorage.removeItem("UserAccessToken");
          updateErrorMessage(convertErrorCodeToUserFriendly(error.message));
          tryUserLogin(error.message);
        } else {
          updateErrorMessage("Something Went Wrong");
        }
        isButtonLoading(false, "Next");
      });
    return getData;
  };

  if (getToken) {
    isButtonLoading(true);

    const bodyData = {
      token: getToken,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(bodyData),
    };

    const getData = fetch("../../data.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return autoLoginAPICall(options, data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return getData;
  }
};

function login(options, data, bodyData) {
  const getSerialNumberFromConfig = data.serialNumber;
  const getAPIEndpoint = data.api_endPoint;
  fetch(getAPIEndpoint + getSerialNumberFromConfig + "/login", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(async (data) => {
      if (data?.isLogin) {
        localStorage.setItem(
          "UserAccessToken",
          data.userData.user.stsTokenManager.accessToken
        );

        if (bodyData) {
          localStorage.setItem("UserLogin", JSON.stringify(bodyData));
        }

        const getUserData = await fetchUserDataFromDB();
        clearLoginTemplate();
        containerGenerateDashboard();

        if (getUserData) {
          updateDataOnDashboard(getUserData);
        }
      } else {
        updateErrorMessage(convertErrorCodeToUserFriendly(data.errorCode));
        isButtonLoading(false, "Login");
      }
    })
    .catch((error) => {
      localStorage.removeItem("UserLogin");
      updateErrorMessage("Please Login Again");
      isButtonLoading(false, "Login");
    });
}

const nextStepPassword = async () => {
  const userInput = document.getElementById("vip-emailInput")?.value;

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    if (!isValid) {
      updateErrorMessage("Invalid Email Address");
    }
    return isValid;
  }

  function getIfEmailIsExist(data, email) {
    const getSerialNumberFromConfig = data.serialNumber;
    const getAPIEndpoint = data.api_endPoint;
    const parameters = new URLSearchParams();
    parameters.append("email", email);

    fetch(
      getAPIEndpoint +
        getSerialNumberFromConfig +
        "/isEmailExist?" +
        parameters,
      { method: "GET" }
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.errorMessage);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.isExist) {
          var localStorageModel = {
            isExist: true,
            email_address: userInput,
          };
          localStorage.setItem("isExist", JSON.stringify(localStorageModel));
          updateTheDynamicallyGeneratedForPassword();
        }
      })
      .catch((error) => {
        const errorMessage = error.message || "Something Went Wrong";
        console.log(error);
        updateErrorMessage(convertErrorCodeToUserFriendly(errorMessage));
        isButtonLoading(false);
      });
  }

  if (isEmailExist()) {
    isButtonLoading(true);
    const getData = isEmailExist("get");
    const dataToEncrypt = {
      email: getData.email_address,
      password: userInput,
    };
    var encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      "Testing101"
    ).toString();
    const bodyData = {
      data: encryptedData,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(bodyData),
    };

    fetch("../../data.json")
      .then((response) => response.json())
      .then((data) => {
        login(options, data, bodyData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  } else if (userInput && isValidEmail(userInput)) {
    isButtonLoading(true);

    fetch("../../data.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getIfEmailIsExist(data, userInput);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
};

const fetchUserDataFromDB = async () => {
  const getToken = localStorage.getItem("UserAccessToken");

  const loginCallAPI = async (options, data) => {
    const getSerialNumberFromConfig = data.serialNumber;
    const getAPIEndpoint = data.api_endPoint;
    const getData = await fetch(
      getAPIEndpoint + getSerialNumberFromConfig + "/autoLogin",
      options
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.errorCode) {
          throw data;
        }
        return data;
      })
      .catch((error) => {
        if (error?.errorCode?.code) {
          localStorage.removeItem("UserAccessToken");
          updateErrorMessage(
            convertErrorCodeToUserFriendly(error.errorCode.code)
          );
        } else {
          updateErrorMessage("Something Went Wrong");
        }
        isButtonLoading(false, "Next");
      });
    return getData;
  };

  if (getToken) {
    const bodyData = {
      token: getToken,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(bodyData),
    };

    const getData = fetch("../../data.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return loginCallAPI(options, data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return getData;
  }
};

const dynamicallyGenerateHTMLForLogin = () => {
  const container = document.getElementById("VIPLogin");
  container.classList.add("VIPLogin-container");
  const containerLabel = document.getElementById("VIPLogin-Label-Id");

  const generateEmailInput = () => {
    const divElement = document.createElement("div");
    divElement.classList.add("wrap-input100", "validate-input", "vip-email");
    divElement.setAttribute("data-validate", "Enter Email Address");

    // create Input
    const divElementInput = document.createElement("input");
    divElementInput.id = "vip-emailInput";
    divElementInput.classList.add("input100");
    divElementInput.placeholder = "Email";
    divElementInput.name = "email";
    divElementInput.type = "text";

    divElementInput.addEventListener("keydown", function () {
      updateErrorMessage("");
    });

    // create span for animation and icon
    const divElementSpan = document.createElement("span");
    divElementSpan.classList.add("focus-input100");

    divElement.append(divElementInput);
    divElement.append(divElementSpan);

    return divElement;
  };

  if (container) {
    if (!container.contains(containerLabel)) {
      // this is for labeld Please Login Your Credential
      const label = document.createElement("div");
      label.id = "VIPLogin-Label-Id";
      label.classList.add("VIPLogin-Label");
      label.textContent = "Please Login Your Credentials";
      container.append(label);

      // error label
      const errorLabel = document.createElement("div");
      errorLabel.id = "VIPLogin-Label-error-id";
      errorLabel.classList.add(
        "VIPLogin-Label-error",
        "animate__animated",
        "animate__bounceIn"
      );

      container.append(errorLabel);

      // main loginForm container
      const loginForm = document.createElement("div");
      loginForm.classList.add("VIPLogin-Input");
      loginForm.append(generateEmailInput());

      // button for submiting
      const buttonNext = document.createElement("button");
      buttonNext.classList.add("VIPLogin-Button");
      buttonNext.id = "vip-emailButton";
      buttonNext.textContent = "Next";

      // button for submiting
      const buttonNext2 = document.createElement("button");
      buttonNext2.classList.add("VIPLogin-Button");
      buttonNext2.id = "vip-emailButton";
      buttonNext2.textContent = "Next";

      buttonNext.addEventListener("click", function () {
        nextStepPassword();
      });

      loginForm.append(buttonNext);

      container.append(loginForm);
    }
    updateTheDynamicallyGeneratedForPassword();
  }
};

const updateErrorMessage = (errorMessage) => {
  const getErrorLabel = document.getElementById("VIPLogin-Label-error-id");
  getErrorLabel.innerText = errorMessage;
};

const isEmailExist = (getData) => {
  const isExist = localStorage.getItem("isExist");
  const convertToJson = isExist ? JSON.parse(isExist) : false;

  if (getData == "get") {
    return convertToJson;
  }
  return convertToJson.isExist;
};

const isButtonLoading = (isLoading, Label) => {
  let element = document.getElementById("vip-emailButton");
  if (isLoading) {
    fetch("images/icons/loading.svg")
      .then((response) => response.text())
      .then((svgContent) => {
        element.disabled = true;
        element.innerHTML = svgContent;
      })
      .catch((error) => {
        console.error("Error fetching SVG file:", error);
      });
  } else {
    element.innerHTML = "";
    element.textContent = Label ? Label : "Next";
    element.disabled = false;
  }
};

const updateTheDynamicallyGeneratedForPassword = () => {
  isButtonLoading(false, "Login");
  updateErrorMessage("");

  if (isEmailExist()) {
    // change the input from email to password
    const inputPassword = document.getElementById("vip-emailInput");
    inputPassword.placeholder = "Password";
    inputPassword.name = "password";
    inputPassword.type = "password";
    inputPassword.value = "";

    // show the back button on modals footer
    const backButton = document.getElementById("backButtonToEmail");
    backButton.hidden = false;

    // replace the justify-content from flex-end to spacebetween
    const buttonContainer = document.getElementById(
      "VIPLogin-Button-Container-id"
    );
    buttonContainer.style = "justify-content: space-between";
  }
};

const backButtonFooterModal = (buttonState) => {
  const backButton = document.getElementById("backButtonToEmail");
  const buttonContainer = document.getElementById(
    "VIPLogin-Button-Container-id"
  );
  switch (buttonState) {
    case "PASSWORD":
      // remove key isExist on localStroage
      localStorage.removeItem("isExist");

      // change the input from to original
      const inputPassword = document.getElementById("vip-emailInput");
      inputPassword.placeholder = "Email";
      inputPassword.name = "email";
      inputPassword.type = "text";
      inputPassword.value = "";

      // show the back button on modals footer
      backButton.hidden = true;

      // replace the justify-content from flex-end to spacebetween
      buttonContainer.style = "justify-content: flex-end";
      break;
    default:
      backButton.hidden = true;
      buttonContainer.style = "justify-content: flex-end";
  }
};

const clearLoginTemplate = () => {
  isButtonLoading(false, "Successfully Login");
  localStorage.removeItem("isExist");

  backButtonFooterModal();
  containerRemoveDashboardOrLogin("VIPLogin", "VIPLogin-container");
};
