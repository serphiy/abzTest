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

// Contact us

function getEnquiryTypes() {
  var url_base = 'http://504080.com/api/v1/directories/enquiry-types';
  return $.ajax({
    url: url_base,
    type: 'GET',
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json'
  })
    .then(function (result) {
      return result.data;
    })
    .fail(handleConnectionError);
}

function createEnquiryTypesOption(value) {
  var option = document.createElement('option');
  return $(option).attr('value', value)
                  .text(value);
}

function renderEnquiryTypes(enquiryTypesArray) {
  var enquiryTypesElements = [];
  var other = false;
  for (var i = 0; i < enquiryTypesArray.length; i++) {
    enquiryTypesElements.push(createEnquiryTypesOption(enquiryTypesArray[i].name));
    if ((enquiryTypesArray[i].name == 'Other') && (!other)) {
      other = true;
      $(enquiryTypesElements.slice(-1)[0]).attr('selected', 'selected');
    }
  }
  if (!other) {
    enquiryTypesElements.push(createEnquiryTypesOption('Other'));
    $(enquiryTypesElements.slice(-1)[0]).attr('selected', 'selected');
  }

  $('#enquiry-type-select').append(enquiryTypesElements)
                           .change(function(event) {
                              if (event.target.value=='Other') {
                                $('#enquiry-type-other').show();
                              } else {
                                $('#enquiry-type-other').hide();
                              }
                           });
}

function addEnquiryTypes() {
  getEnquiryTypes().then(renderEnquiryTypes);
}

function validateContactForm(formSelector) {
  var form = $(formSelector);
  form.attr('novalidate', 'novalidate');

  var formElements = {enquiryTypeSelect: {selector: 'select[name="enquiry-type-select"]',
                                          errMessage: 'Select enquiry type'},
                      name:     {selector:   'input[name="name"]',
                                 errMessage: 'Please enter a valid name!'},
                      email:    {selector:   'input[name="email"]',
                                 errMessage: 'Please enter a valid email address!'},
                      subject:  {selector:   'input[name="subject"]',
                                 errMessage: 'Please enter a subject!'},
                      desc:     {selector:   'textarea[name="description"]',
                                 errMessage: 'Please enter a description!'}
                      };

  for (var key in formElements) {
    if (formElements.hasOwnProperty(key)) {
      formElements[key].element = form.find(formElements[key].selector);
      formElements[key].element.on('input', function(event) {
        if (event.target.validity.valid) {
          $(event.target).next('.input-error').text('');
        }
      });
    }
  }

  form.submit(function(event) {
    for (var key in formElements) {
      if (formElements.hasOwnProperty(key) && (!formElements[key].element[0].validity.valid)) {
        formElements[key].element.next('.input-error').text(formElements[key].errMessage);
        event.preventDefault();
      }
    }
  });
}

function showImgError() {
  var imgErrMessage = 'The photo does not meet the requirements';
  $('#contact-form__img-field').find('.input-error')
                               .css('position', 'static')
                               .text(imgErrMessage);
}

function removeImgError() {
  $('#contact-form__img-field').find('.input-error')
                               .text('');
}

function validateFile(files) {
  var maxFileSize = 5 * 1024 * 1024;
  var fileTypes = 'jpeg|png';

  if (files[0].size > maxFileSize) {return false;}
  if (!(files[0].type.match(RegExp(fileTypes,'i')))) {return false;}

  return true;
}

function validateImage(image) {
  var maxImgDimensions = {
    width:  300,
    height: 300
  };

  if ((image.width <= maxImgDimensions.width) && (image.height <= maxImgDimensions.height)) {
    return true;
  } else {
    return false;
  }
}

function updateImgPreview(event) {
  var imgAddField = $('#contact-form__img-field');
  var files = event.target.files;
  removeImgError();

  if(files.length === 0) {
    imgAddField.show();
  } else {
    if (validateFile(files)) {
      var imgFile = window.URL.createObjectURL(files[0]);
      var img = new Image();
      img.onload = function() {
        URL.revokeObjectURL(this.src);
        if (validateImage(this)) {
          var preview = document.createElement('div');
          $(preview).addClass('preview');

          $(this).addClass('preview__img')
                .attr('alt', 'Uploaded image')
                .appendTo($(preview));

          var imgClose = document.createElement('button');
          $(imgClose).addClass('preview__close')
                     .attr('type', 'button')
                     .text('\u00D7')
                     .appendTo($(preview));

          $(imgClose).click(function() {
            $(preview).remove();
            $(files).val('');
            imgAddField.show();
          });

          $(preview).appendTo(imgAddField.parent());
          imgAddField.hide();
        } else {
          $(this).remove();
          $(files).val('');
          showImgError();
        }
      };
      img.src = imgFile;
    } else {
      $(files).val('');
      showImgError();
    }
  }
}

function listenImgInput(imgInputSelector) {
  $(imgInputSelector).change(updateImgPreview);
}

function addTextCounter(textSelector) {
  var text = $(textSelector);
  var max = 1000;
  if (text[0].hasAttribute('maxlength')) {
    max = text[0].maxLength;
  } else {
    text.attr('maxlength', max);
  }

  var counter = document.createElement('span');
  $(counter).addClass('contact-form__counter')
            .text(`(0/${max})`)
            .insertBefore(text);

  text.on('input', function(event) {
    var len = $(this).val().length;
    $(counter).text(`(${len}/${max})`);
  });
}
