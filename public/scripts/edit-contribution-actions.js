$(document).ready(function() {

  const $notifications = $('.notification');
  $notifications.hide();
  $notifications.removeClass('hidden');

  const $success = $('#success');
  const $fail = $('#fail');

  $('input').keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  $(document).submit(function() {
    event.preventDefault();
  });

  $('#update-story').on('click', function() {
    $notifications.slideUp();
    updateStory($success, $fail);
  });

  $('#discard-changes').on('click', function() {
    window.location.href = `/read`;
  });

});

const updateTitle = function(title) {
  const text = title || "New Story";
  $(document).attr('title', `${text} - Open Book`);
};

/**
* Handles the post request for saving and publishing new story
*/
const updateStory = function(success, fail) {
  const $draft = $('#draft');
  const body = $draft.serialize();
  const address = $draft.attr('action');
  $.post(address, body, function(data, status) {
    if (data) {
      window.location.href = `/read`;
      return;
    }
    fail.html('Something went wrong with updating contribution. We apologize for the inconvenience.').slideDown();
  });
};
