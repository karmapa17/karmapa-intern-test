(function() {

  var calculator = document.getElementById('calculator');
  var input = document.getElementById('input');
  var isShowingResult = false;

  calculator.addEventListener('click', handleCalculatorClick, false);

  function handleCalculatorClick(event) {

    var type = event.target.getAttribute('data-type') || '';
    var isTypeWithoutSpace = !! type.match(/[\d\.]/);

    if (isShowingResult) {
      input.value = '';
      isShowingResult = false;
    }

    if ('' === type) {
      return;
    }

    if ('=' === type) {
      try {
        input.value = safeEval(input.value);
      }
      catch(err) {
        console.log('safeEval failed', err);
        input.value = 'error';
      }
      isShowingResult = true;
      return;
    }

    if ('ce' === type) {
      // cut the last character
      input.value = input.value.slice(0, -1);
      return;
    }
    input.value += isTypeWithoutSpace ? type : (' ' + type + ' ');
  }

  function safeEval(str) {
    /* jshint ignore: start */
    return eval((str || '').replace(/[xX]/, '*'));
    /* jshint ignore: end */
  }

})();
