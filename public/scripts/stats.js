$(document).ready(function() {
  $letterCounter = $('#letter-counter');
  $wordCounter = $('#word-counter');
  $textLocation = $('#text-editor');

  $letterCounter.html(countLetters($textLocation.val()));
  $wordCounter.html(countWords($textLocation.val()));

  $textLocation.on('input', function() {
    $letterCounter.html(countLetters($(this).val()));
    $wordCounter.html(countWords($(this).val()));
  });

});

const countLetters = function(string) {
  return string.length;
}
const countWords = function(string) {
  const buffer = string.split(' ');
  console.log(buffer);
  return buffer.length - (buffer[0] === "");
}
