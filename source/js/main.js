//Get Token
var accessToken = '';

function getToken() {
  var url_base = 'http://504080.com/api/v1/account/login';
  var requestPayload = {
      'email': 'test@abz.agency',
      'password': '123456'
  };
  return $.ajax({
    url: url_base,
    type: 'POST',
    dataType: 'json',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: JSON.stringify(requestPayload)
  })
    .then(function (result) {
      accessToken = result.data.token;
      return result.data.token;
    })
    .fail(function (error) {
      console.log('Getting token error: ' + error.status + ' - ' + error.statusText);
    });
}

function getServices(token) {
  var url_base = 'http://504080.com/api/v1/services/categories';
  return $.ajax({
    url: url_base,
    type: 'GET',
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    headers: {
      'Authorization': token
    }
  })
    .then(function (result) {
      return result.data;
    })
    .fail(function (error) {
      console.log('Getting services error: ' + error.status + ' - ' + error.statusText);
    });
}

// Call
var request = getToken().then(getServices).then(function (data) {
  console.log(data);
});