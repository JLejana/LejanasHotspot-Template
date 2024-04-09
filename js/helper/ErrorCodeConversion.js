const convertErrorCodeToUserFriendly = (errorCode) => {
    switch (errorCode.toLowerCase()) {
        case "auth/id-token-expired":
            return "Please Re-Login";
        case "auth/invalid-credential":
            return "Incorrect Password";
        case "auth/too-many-requests":
            return "Unable To Login : Please Try Again Later";
        case "auth/user-not-found":
            return "Email Address Is Not Registered";
        case "auth/argument-error":
            return "Invalid Token, Please Login Once More"
        default:
            return errorCode;
    }
};
