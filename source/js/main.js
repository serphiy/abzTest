//Get Token
var accessToken = '';

function getToken() {
  var url_base = 'http://504080.com/api/v1/account/login';
  var requestPayload = {
      'email': 'test@abz.agency',
      'password': '123456'
  };
  $.ajax({
    'url': url_base,
    'type': 'POST',
    'dataType': 'json',
    'headers': {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    'data': JSON.stringify(requestPayload),
    'success': function (result) {
      accessToken = result.data.token;
      // console.log('token: ', result.data.token);
      return result;
    },
    'error': function (XMLHttpRequest, textStatus, errorThrown) {
      console.log('Error: ' + errorThrown);
      console.log(XMLHttpRequest.status + ' ' +
          XMLHttpRequest.statusText);
      return false;
    }
  });
}

// Call Token
getToken();