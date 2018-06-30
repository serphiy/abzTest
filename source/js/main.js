function showModal(title, info, desc) {
  var modal = document.createElement('div');
  $(modal).addClass('modal');

  var modalBox = document.createElement('div');
  $(modalBox).addClass('modal__box')
             .appendTo($(modal));

  var modalHeader = document.createElement('header');
  $(modalHeader).addClass('modal__header')
                .appendTo($(modalBox));

  var modalTitle = document.createElement('h2');
  $(modalTitle).addClass('modal__title')
               .text(title)
               .appendTo($(modalHeader));

  var modalClose = document.createElement('button');
  $(modalClose).addClass('modal__close')
               .text('\u00D7')
               .appendTo($(modalHeader));

  var modalContent = document.createElement('div');
  $(modalContent).addClass('modal__content')
                 .appendTo($(modalBox));

  var modalInfo = document.createElement('h3');
  $(modalInfo).addClass('modal__info')
              .text(info)
              .appendTo($(modalContent));

  var modalDesc = document.createElement('p');
  $(modalDesc).addClass('modal__desc')
              .text(desc)
              .appendTo($(modalContent));

  var modalFooter = document.createElement('footer');
  $(modalFooter).addClass('modal__footer')
                .appendTo($(modalBox));

  var modalOk = document.createElement('button');
  $(modalOk).addClass('modal__ok')
            .text('OK')
            .appendTo($(modalFooter));

  $(modal).appendTo($('body'));

  $(modalClose).click(function() {
    $(modal).remove();
    $(document).off('click.outsideModal');
    $(document).off('keydown.escModal');
  });

  $(modalOk).click(function() {
    $(modal).remove();
    $(document).off('click.outsideModal');
    $(document).off('keydown.escModal');
  });

  $(document).on('click.outsideModal', function(event) {
    if(!$(event.target).closest(modalBox).length) {
        event.preventDefault();
        event.stopPropagation();
        $(modal).remove();
        $(document).off('click.outsideModal');
        $(document).off('keydown.escModal');
    }
  });

  $(document).on('keydown.escModal', function(event) {
    if (event.keyCode == 27) {
      event.preventDefault();
      event.stopPropagation();
      $(modal).remove();
      $(document).off('click.outsideModal');
      $(document).off('keydown.escModal');
    }
  });
}

function handleConnectionError(error) {
  var errorMessage = 'No connection';
  if (error.status > 0) {
    errorMessage = error.status + ': ' + error.statusText;
    if (error.responseJSON && error.responseJSON.error.description) {
      errorMessage = error.responseJSON.error.description;
    }
  }
  showModal('Oops...', 'Connection error', errorMessage);
}

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
    .fail(handleConnectionError);
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
    .fail(handleConnectionError);
}

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

function renderServices(servicesArray) {
  var servicesElements = [];
  for (var i = 0; i < servicesArray.length; i++) {
    servicesElements.push(createServiceCard(servicesArray[i].icon, servicesArray[i].title));
  }

  $('#services__content').append(servicesElements);
}

function addServices() {
  getToken().then(getServices).then(renderServices);
}