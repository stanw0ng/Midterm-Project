$(document).ready(function() {

 const storyID = $('#plus-card').attr('name');
 console.log(storyID);

  $('.plus').click(function() {
    window.location.href = `/contribute/${storyID}`;
  });

  $('.entry').click(function(event) {
    if ($(this).hasClass('stop')) {
      event.preventDefault();
    } else {
      const contributionID = $(this).attr('data-contribution-id');
      window.location.href = `/contribution/${contributionID}`;
    }
  });

  const $button = $('.upvote-btn');
  $button.click(function() {
    event.stopPropagation();
    //Make a reference to the button we push
    const $thisButton = $(this);
    const upvoteID = $thisButton.attr('data-contribution-id');

    $.post(`/read/upvote/`, { upvoteID }, function(upvotes, status) {
      if (upvotes !== undefined) {
        const tail = upvotes === 1 ? 'Upvote' : 'Upvotes';

        //Get button's HTML
        const label = $thisButton.html();
        $thisButton.html(label === "Upvote" ? "Upvoted" : "Upvote");

        $(`#${upvoteID}`).html(`${upvotes} ${tail}`);
      }
    });
  });

});
