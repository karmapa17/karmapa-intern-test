(function() {

  var form = document.getElementById('form');
  var message = document.getElementById('message');
  var input = document.getElementById('input');
  var types = [
    {
      'char': 'M',
      'amount': 1000
    },
    {
      'char': 'CM',
      'amount': 900,
    },
    {
      'char': 'D',
      'amount': 500
    },
    {
      'char': 'CD',
      'amount': 400
    },
    {
      'char': 'C',
      'amount': 100
    },
    {
      'char': 'XC',
      'amount': 90
    },
    {
      'char': 'L',
      'amount': 50
    },
    {
      'char': 'XL',
      'amount': 40
    },
    {
      'char': 'X',
      'amount': 10
    },
    {
      'char': 'IX',
      'amount': 9
    },
    {
      'char': 'V',
      'amount': 5
    },
    {
      'char': 'IV',
      'amount': 4
    },
    {
      'char': 'I',
      'amount': 1
    }
  ];

  form.addEventListener('submit', handleSubmit, false);

  function showMessage(text) {
    message.textContent = text;
  }

  function handleSubmit(event) {
    event.preventDefault();

    var num = parseInt(input.value, 10);

    if (isNaN(num)) {
      return alert('This is not a number');
    }

    if (0 === num) {
      showMessage('ZERO');
      return;
    }

    var res = types.reduce(function(obj, current, index, arr) {
      var char = current.char;
      var amount = current.amount;
      var times = parseInt(obj.num / amount, 10);
      if (times > 0) {
        obj.str += char.repeat(times);
        obj.num = obj.num % amount;
      }
      return obj;
    }, {str: '', num: num});

    showMessage(res.str);
  }
})();
