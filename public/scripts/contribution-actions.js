$(document).ready(function() {
  const entry_id = $('.story-info').attr('id');
  $('#approve-button').click(function() {
    $.post(`/contribution/approve/`, { entry_id }, function(data, status) {
      if (data) {
        window.location.href = "/read";
        return;
      }
    });
  });

  $('#delete-button').click(function() {
    $.post(`/contribution/delete/`, { entry_id }, function(data, status) {
      if (data) {
        window.location.href = "/read";
        return;
      }
    });
  });

  $('#upvote-button').click(function() {
    const $thisButton = $(this);
    $.post(`/read/upvote/`, { upvoteID: entry_id }, function(upvotes, status) {
      if (upvotes !== undefined) {
        //Get button's HTML
        const label = $thisButton.html();
        $thisButton.html(label === "👍 Upvote" ? "👍 Upvoted" : "👍 Upvote");

        $(`#upvote-count`).html(upvotes);
      }
    });
  });

});
