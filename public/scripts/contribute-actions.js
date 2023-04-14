let id = null;

$(document).ready(function() {
  const $draft = $('#draft');
  const address = $draft.attr('action');
  $draft.removeAttr('action');

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
  $('textarea').keydown(function(event) {
    if (event.keyCode == 9) {
      event.preventDefault();
      return false;
    }
  });

  $(document).submit(function(event) {
    event.preventDefault();
  });

  $('#save-story').on('click', function() {
    $notifications.slideUp();
    saveContribution(address, $draft, $success, $fail, id);
  });

  $('#publish').on('click', function() {
    $notifications.slideUp();
    saveContribution(address, $draft, $success, $fail, id, true);
  });

  $('#discard-story').on('click', function() {
    $notifications.slideUp();
    if(!id){
      window.location.href = "/read";
      return;
    }
    $.post(`/contribute/discard/${id}`, function(result, status) {
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
 * Handles the post request for saving and publishing new story
 */
const saveContribution = function(address, draft, success, fail, draftID, publish = false) {
  const body = draft.serialize();
  $.post(`${address}/${draftID}/${publish}/`, body, function(data, status) {
    if (data) {
      id = data;
      if (publish) {
        window.location.href = "/read";
        return;
      }
      success.html("Draft saved").slideDown();
      return;
    }
    fail.html('Something went wrong with saving your contribution. We apologize for the inconvenience.').slideDown();
  });
};
