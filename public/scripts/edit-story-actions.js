$(document).ready(function() {

  const category = $('#category').attr('value');
  const genre = $('#genre').attr('value');
  const rating = $('#rating').attr('value');
  $(`option[value='${category}']`).prop('selected', true);
  $(`option[value='${genre}']`).prop('selected', true);
  $(`option[value='${rating}']`).prop('selected', true);

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
    fail.html('Something went wrong with updating story. We apologize for the inconvenience.').slideDown();
  });
};
