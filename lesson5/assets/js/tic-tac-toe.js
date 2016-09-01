(function() {

  var TYPE_NO_WINNER_YET = -1;
  var TYPE_TIE = -2;

  function nodeListToArray(nodeList) {
    var arr = [];
    for (var i = 0; i < nodeList.length; i++) {
      arr.push(nodeList[i]);
    }
    return arr;
  }

  function random(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  function inArray(arr, elem) {
    return -1 !== arr.indexOf(elem);
  }

  function findMatchedArray() {
    var args = Array.prototype.slice.call(arguments);
    var arr = args.shift();
    for (var i = 0; i < args.length; i++) {
      var otherArr = args[i];
      var isInArray = otherArr.every(function(elem) {
        return inArray(arr, elem);
      });
      if (isInArray) {
        return otherArr;
      }
    }
    return [];
  }

  function TicTacToe(args) {

    args = args || {};

    this.playerIndex = 0;
    this.turn = 0;
    this.playerRecords = [0, 0];
    this.playerSymbols = args.playerSymbols || ['O', 'X'];
    this.boardDisabled = false;
    this.winnerLinePosArr = [];
    this.finished = false;
    this.started = false;

    this.init(args.id);
  }

  TicTacToe.prototype.setPlayerSymbols = function() {
    for (var i = 0; i < this.scoreboardPieces.length; i++) {
      var symbolSpan = this.scoreboardPieces[i].getElementsByClassName('player-symbol')[0];
      symbolSpan.textContent = this.playerSymbols[i];
    }
    this.scoreboardPieces[this.playerIndex].classList.add('active');
  };

  TicTacToe.prototype.setPlayerIndex = function(index) {
    this.playerIndex = index;
  };

  TicTacToe.prototype.changeTurn = function() {
    this.turn = 1 - this.turn;
  };

  TicTacToe.prototype.setMessage = function(text) {
    this.message.textContent = text;
  };

  TicTacToe.prototype.highlightPlayerScoreboard = function() {
    for (var i = 0; i < this.scoreboardPieces.length; i++) {
      var piece = this.scoreboardPieces[i];
      piece.classList.remove('active');
    }
    this.scoreboardPieces[this.playerIndex].classList.add('active');
  };

  TicTacToe.prototype.showPlayerRecords = function() {
    for (var i = 0; i < this.scoreboardPieces.length; i++) {
      var piece = this.scoreboardPieces[i].getElementsByClassName('score')[0];
      piece.textContent = this.playerRecords[i];
    }
    this.scoreboardPieces[this.playerIndex].classList.add('active');
  };

  TicTacToe.prototype.getWinnerIndex = function() {
    var data = {};
    var markCount = 0;
    nodeListToArray(this.table.querySelectorAll('td'))
      .forEach(function(td) {
        var pos = td.getAttribute('data-pos');
        if ('' === td.textContent) {
          return true;
        }
        if (! (td.textContent in data)) {
          data[td.textContent] = [];
        }
        data[td.textContent].push(pos);
        markCount++;
      });

    var playerSymbol = this.playerSymbols[this.turn];

    var matchedArr = findMatchedArray(data[playerSymbol], ['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'],
          ['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9'],
          ['1', '5', '9'], ['3', '5', '7']);

    if (matchedArr.length > 0) {
      this.winnerLinePosArr = matchedArr;
      return this.turn;
    }

    if (9 === markCount) {
      return TYPE_TIE;
    }
    return TYPE_NO_WINNER_YET;
  };

  TicTacToe.prototype.checkWinner = function() {
    var result = this.getWinnerIndex();
    if (TYPE_TIE === result) {
      throw 'Game ties.';
    }
    if (TYPE_NO_WINNER_YET !== result) {
      this.playerRecords[result] = this.playerRecords[result] + 1;
      this.showPlayerRecords();
      throw 'Winner is ' + this.playerSymbols[result] + '.';
    }
  };

  TicTacToe.prototype.playerMove = function(target) {
    target.textContent = this.playerSymbols[this.turn];
  };

  TicTacToe.prototype.computerMove = function() {
    var tds = nodeListToArray(this.table.querySelectorAll('td'))
      .filter(function(td) {
        return '' === td.textContent;
      });
    var td = tds[random(0, tds.length - 1)];
    td.textContent = this.playerSymbols[this.turn];
  };

  TicTacToe.prototype.enableBoard = function() {
    this.boardDisabled = false;
    this.tableWrapper.classList.remove('disabled');
  };

  TicTacToe.prototype.disableBoard = function() {
    this.boardDisabled = true;
    this.tableWrapper.classList.add('disabled');
  };

  TicTacToe.prototype.decorateWinner = function() {
    var winnerLinePosArr = this.winnerLinePosArr;
    var tds = nodeListToArray(this.table.querySelectorAll('td'))
      .filter(function(td) {
        var pos = td.getAttribute('data-pos');
        if (inArray(winnerLinePosArr, pos)) {
          td.classList.add('emphasized');
        }
      });
  };

  TicTacToe.prototype.clearBoard = function() {
    nodeListToArray(this.table.querySelectorAll('td'))
      .forEach(function(td) {
        td.textContent = '';
        td.classList.remove('emphasized');
      });
  };

  TicTacToe.prototype.restart = function() {
    this.finished = false;
    this.started = false;
    this.turn = 0;
    this.clearBoard();
    this.enableBoard();
    this.winnerLinePosArr = [];

    if ('1' === this.playerIndex) {
      this.computerMove();
      this.changeTurn();
      this.started = true;
    }
    this.initMessage();
  };

  TicTacToe.prototype.init = function(id) {

    this.wrapper = document.getElementById(id);
    var wrapper = this.wrapper;
    this.message = wrapper.getElementsByClassName('message')[0];
    this.scoreboard = wrapper.getElementsByClassName('scoreboard')[0];
    this.tableWrapper = wrapper.getElementsByClassName('board-tic-tac-toe')[0];
    this.table = wrapper.getElementsByClassName('tic-tac-toe')[0];
    this.scoreboardPieces = this.scoreboard.getElementsByClassName('piece');

    this.scoreboard.addEventListener('click', function(event) {
      event.stopPropagation();
      if (this.started && (! this.finished)) {
        return;
      }
      var index = event.target.getAttribute('data-index');
      if (null !== index) {
        this.setPlayerIndex(index);
        this.highlightPlayerScoreboard();
        if ('1' === index) {
          this.computerMove();
          this.changeTurn();
          this.started = true;
        }
      }
      if (this.finished) {
        this.restart();
      }
    }.bind(this), false);

    this.highlightPlayerScoreboard();
    this.showPlayerRecords();
    this.setPlayerSymbols();

    wrapper.addEventListener('click', function(event) {
      var target = event.target;
      var pos = target.getAttribute('data-pos');
      var index = target.getAttribute('data-index');
      var text = target.textContent;

      if (this.finished) {
        return this.restart();
      }

      if (pos) {
        if ('' === text) {
          try {
            this.started = true;
            this.playerMove(target);
            this.checkWinner();
            this.changeTurn();
            this.computerMove();
            this.checkWinner();
            this.changeTurn();
          }
          catch (err) {
            if ('string' === typeof err) {
              this.setMessage(err);
              this.disableBoard();
              this.decorateWinner();
              this.finished = true;
            }
          }
        }
      }
    }.bind(this), false);
  };

  TicTacToe.prototype.initMessage = function() {
    this.setMessage('Pick a position or choose player');
  };

  TicTacToe.prototype.start = function() {
    this.initMessage();
  };

  var ttt = new TicTacToe({id: 'wrapper'});
  ttt.start();

})();
