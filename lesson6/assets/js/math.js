(function() {

  var form = document.getElementById('form');
  var message = document.getElementById('message');
  var input = document.getElementById('input');
  var question;

  form.addEventListener('submit', handleSubmit, false);

  showNewQuestion();

  function showNewQuestion() {
    question = genQuestion();
    message.textContent = question + ' = ?';
  }

  function handleSubmit(event) {
    event.preventDefault();
    var inputValue = input.value.trim();
    var answer = eval(question) + '';
    if (inputValue === answer) {
      alert('Correct');
    }
    else {
      alert('Wrong ! Correct answer is ' + answer);
    }
    input.value = '';
    showNewQuestion();
  }

  function random(min, max) {
    return Math.floor((Math.random() * max) + min);
  }

  function genQuestion() {
    return random(1, 100) + ' ' + ['+', '-', '*', '/'][random(0, 3)] + ' ' + random(1, 100);
  }
})();
