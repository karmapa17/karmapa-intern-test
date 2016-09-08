(function() {

  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // https://davidwalsh.name/fetch

  var apiUrl = 'http://jsonplaceholder.typicode.com';

  fetch(apiUrl + '/posts/1')
    .then(function(res) {
      console.log('res', res);
      if (res.ok) {
        return res.json();
      }
      console.log('Network response was not ok.');
      return Promise.reject();
    })
    .then(function(json) {
      console.log('here', json);
    })
    .catch(function(err) {
      console.log('There has been a problem with your fetch operation');
    });

})();
