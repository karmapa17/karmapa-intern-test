(function() {

  var SCAN_COORDS = [
    {deltaX: -1, deltaY: -1},
    {deltaX: 0, deltaY: -1},
    {deltaX: 1, deltaY: -1},
    {deltaX: -1, deltaY: 0},
    {deltaX: 1, deltaY: 0},
    {deltaX: -1, deltaY: 1},
    {deltaX: 0, deltaY: 1},
    {deltaX: 1, deltaY: 1}
  ];

  function Mineweeper(args) {
    args = args || {};
    this.id = args.id;
    this.width = args.width || 8;
    this.height = args.width || 8;
    this.minesCount = args.minesCount || 10;
    this.cells = {};
    this.timeInSec = 0;
    this.isDisabled = false;

    this.init(this.id);
  }

  Mineweeper.prototype.createScoreBoard = function() {

    var board = document.createElement('div');
    board.className = 'score-board';

    this.flagPad = document.createElement('span');
    this.facePad = document.createElement('span');
    this.timePad = document.createElement('span');

    this.facePad.addEventListener('click', this._handleFaceClick.bind(this), false);

    this.flagPad.setAttribute('data-flag-pad', true);
    this.flagPad.className = 'flag-pad';
    this.flagPad.textContent = this.minesCount;

    this.facePad.setAttribute('data-face-pad', true);
    this.facePad.className = 'face-pad';
    this.facePad.textContent = '^_^';

    this.timePad.setAttribute('data-time-pad', true);
    this.timePad.className = 'time-pad';
    this.timePad.textContent = this.timeInSec;

    board.appendChild(this.flagPad);
    board.appendChild(this.facePad);
    board.appendChild(this.timePad);

    return board;
  };

  Mineweeper.prototype.createRows = function() {
    var rows = [];
    for (var y = 0; y < this.width; y++) {
      var row = document.createElement('tr');
      for (var x = 0; x < this.height; x++) {
        var td = document.createElement('td');
        td.setAttribute('data-cell', true);
        td.setAttribute('data-x', x);
        td.setAttribute('data-y', y);
        this.setCell(x, y, {
          x: x,
          y: y,
          flagged: false,
          isPushed: false,
          isMine: false,
          dom: td
        });
        td.className = 'cell';
        row.appendChild(td);
      }
      rows.push(row);
    }
    return rows;
  };

  Mineweeper.prototype.setRandomMines = function() {
    var count = this.minesCount;
    var size = this.width * this.height;
    var keys = Object.keys(this.cells);

    while (count > 0) {
      var index = getRandomInt(0, size - 1);
      var key = keys[index];
      if (! this.cells[key].isMine) {
        this.cells[key].isMine = true;
        count--;
      }
    }
  };

  Mineweeper.prototype.init = function(id) {

    var div = document.getElementById(id);
    div.className = 'minesweeper';

    var table = document.createElement('table');
    table.className = 'table';

    var rows = this.createRows();

    rows.forEach(function(row) {
      table.appendChild(row);
    });

    div.appendChild(this.createScoreBoard());
    div.appendChild(table);

    table.addEventListener('click', this._handleTableClick.bind(this), false);
    table.addEventListener('contextmenu', this._handleTableRightClick.bind(this), false);

    this.setRandomMines();
  };

  Mineweeper.prototype.showMines = function() {
    var cells = this.cells;
    Object.keys(cells)
      .forEach(function(key) {
        var row = cells[key];
        if (row.isMine) {
          row.dom.classList.add('is-mine');
          row.dom.classList.add('pushed');
        }
      });
  };

  Mineweeper.prototype.setCell = function(x, y, data) {
    return this.cells[x + ':' + y] = data;
  };

  Mineweeper.prototype.getCell = function(x, y) {
    return this.cells[x + ':' + y];
  };

  Mineweeper.prototype.getAreaMinesCount = function(x, y) {
    return this.getSurroundedCells(x, y)
      .filter(function(cell) {
        return cell.isMine
      }).length;
  };

  Mineweeper.prototype.stylePushed = function(x, y, areaMinesCount) {
    var target = this.getCell(x, y).dom;
    target.classList.add('pushed');
    if (areaMinesCount > 0) {
      target.classList.add('c' + areaMinesCount);
      target.textContent = areaMinesCount;
    }
  };

  Mineweeper.prototype.getSurroundedCells = function(targetX, targetY) {
    var self = this;
    return SCAN_COORDS.map(function(row) {
      var x = targetX + row.deltaX;
      var y = targetY + row.deltaY;
      return self.getCell(x, y);
    })
    .filter(function(cell) {
      return !! cell;
    })
    .filter(function(cell) {
      return ! cell.isPushed;
    });
  };
  Mineweeper.prototype.setPushed = function(x, y) {
    var cell = this.getCell(x, y);
    cell.isPushed = true;
  };

  Mineweeper.prototype.clearClickArea = function(x, y) {
    var self = this;
    var areaMinesCount = this.getAreaMinesCount(x, y);

    this.stylePushed(x, y, areaMinesCount);
    this.setPushed(x, y);

    if (0 === areaMinesCount) {
      this.getSurroundedCells(x, y)
        .forEach(function(cell) {
          self.clearClickArea(cell.x, cell.y);
        });
    }
  };

  Mineweeper.prototype._handleTableClick = function(event, isRightClick) {

    var target = event.target;
    var isCell = !! target.getAttribute('data-cell');

    if (isCell) {
      this._handleCellClick(target, isRightClick);
    }
  };

  Mineweeper.prototype.reset = function() {
    var cells = this.cells;
    Object.keys(cells)
      .forEach(function(key) {
        var cell = cells[key];
        cell.isPushed = false;
        cell.flagged = false;
        cell.isMine = false;
        var target = cell.dom;
        target.classList.remove('flagged');
        target.classList.remove('pushed');
        target.classList.remove('is-mine');
        target.classList.remove('c1');
        target.classList.remove('c2');
        target.classList.remove('c3');
        target.classList.remove('c4');
        target.classList.remove('c5');
        target.textContent = '';
      });
    this.setRandomMines();
  };

  Mineweeper.prototype._handleFaceClick = function() {
    this.facePad.textContent = '^_^';
    this.isDisabled = false;
    this.reset();
  };

  Mineweeper.prototype._handleTableRightClick = function(event) {
    event.preventDefault();
    this._handleTableClick(event, true);
    return false;
  };

  Mineweeper.prototype.markFlag = function(cell) {
    var target = cell.dom;
    if (cell.flagged) {
      target.classList.add('flagged');
    }
    else {
      target.classList.remove('flagged');
    }
  };

  Mineweeper.prototype.hasWinner = function() {
    var cells = this.cells;
    return Object.keys(cells).filter(function(key) {
      var cell = cells[key];
      return ! cell.isPushed;
    }).length === this.minesCount;
  };

  Mineweeper.prototype.win = function() {
    this.facePad.textContent = '\\ *()* /';
    this.isDisabled = true;
  };

  Mineweeper.prototype.lose = function() {
    this.facePad.textContent = 'x_x';
    this.isDisabled = true;
  };

  Mineweeper.prototype._handleCellClick = function(target, markFlag) {

    if (this.isDisabled) {
      return;
    }

    var x = parseInt(target.getAttribute('data-x'), 10);
    var y = parseInt(target.getAttribute('data-y'), 10);
    var cell = this.getCell(x, y);

    if (cell.flagged && (! markFlag)) {
      return;
    }

    if (markFlag && (! cell.isPushed)) {
      cell.flagged = ! cell.flagged;
      this.markFlag(cell);
      return;
    }

    if (cell.isMine) {
      this.showMines();
      this.lose();
    }
    else {
      this.clearClickArea(x, y);
    }
    if (this.hasWinner()) {
      this.win();
    }
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var m1 = new Mineweeper({id: 'm1'});

})();
