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

function renderServices(servicesArray) {
  function createServiceCard(icon, title) {
    if (!(icon) || !(title)) {return;}

    var card = document.createElement('a');
    $(card).addClass('service-card')
           .attr('href','#');

    var cardImgWrapper = document.createElement('div');
    $(cardImgWrapper).addClass('service-card__img-wrapper')
                 .appendTo($(card));

    var cardImg = document.createElement('img');
    $(cardImg).addClass('service-card__img')
              .attr('src', icon)
              .attr('alt', title)
              .appendTo($(cardImgWrapper));

    var cardDesc = document.createElement('div');
    $(cardDesc).addClass('service-card__desc')
                 .text(title)
                 .appendTo($(card));
    return $(card);
  }

  var servicesElements = [];
  for (var i = 0; i < servicesArray.length; i++) {
    servicesElements.push(createServiceCard(servicesArray[i].icon, servicesArray[i].title));
  }

  $('#services__content').append(servicesElements);
}

// Call
getToken().then(getServices).then(renderServices).catch(function (error) {
  console.log(error);
});