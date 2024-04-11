function doLogin() {
  document.sendin.username.value = document.login.username.value;
  document.sendin.password.value = hexMD5(
    "$(chap-id)" + document.login.password.value + "$(chap-challenge)"
  );
  document.sendin.submit();
  return false;
}

// $(if advert-pending == 'yes')
//     var popup = '';
//     function focusAdvert() {
// 	if (window.focus) popup.focus();
//     }
//     function openAdvert() {
// 	popup = open('$(link-advert)', 'hotspot_advert', '');
// 	setTimeout("focusAdvert()", 1000);
//     }
// $(endif)
//     function openLogout() {
// 	if (window.name != 'hotspot_status') return true;
//         open('$(link-logout)', 'hotspot_logout', 'toolbar=0,location=0,directories=0,status=0,menubars=0,resizable=1,width=280,height=250');
// 	window.close();
// 	return false;
//     }
