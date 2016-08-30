(function() {

  var calculator = document.getElementById('calculator');
  var input = document.getElementById('input');
  var isShowingResult = false;


  function safeEval(str) {
    /* jshint ignore: start */
    return eval((str || '').replace(/[xX]/, '*'));
    /* jshint ignore: end */
  }

})();
