$(document).ready(function() {
  const $title = $('#story-title');
  updateTitle($title.val());

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

  $title.on('focusout', () => {
    updateTitle($title.val());
  });

  $('#save-story').on('click', function() {
    $notifications.slideUp();
    saveStory($success, $fail);
  });

  $('#publish').on('click', function() {
    $notifications.slideUp();
    saveStory($success, $fail, true);
  });

  $('#discard-story').on('click', function() {
    $notifications.slideUp();
    $.post('/story/discard/', function(result, status) {
      if (result) {
        window.location.href = "/read";
        return;
      };
      $fail.html('Something went wrong with discarding your draft. We apologize for the inconvenience.');
      $fail.slideDown();
    });
  });

});


/**
 * Updates the web page title with passed parameter, or defaults to "New Story";
 */
const updateTitle = function(title) {
  const text = title || "New Story";
  $(document).attr('title', `${text} - Open Book`);
};

/**
 * Handles the post request for saving and publishing new story
 */
const saveStory = function(success, fail, publish = false) {
  const body = $('#draft').serialize();
  $.post(`/story/save/${publish}`, body, function(data, status) {
    if (data) {
      if (publish) {
        window.location.href = "/read";
        return;
      }
      success.html(data).slideDown();
      return;
    }
    fail.html('Something went wrong with saving your new story. We apologize for the inconvenience.').slideDown();
  });
};

