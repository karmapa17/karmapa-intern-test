(function() {

  var TYPE_ALL = 'all';
  var TYPE_ACTIVE = 'active';
  var TYPE_COMPLETED = 'completed';

  function Todo(args) {
    args = args || {};

    this.id = args.id;
    this.todos = [];
    this.filter = TYPE_ALL;

    this.init(this.id);
  }

  Todo.prototype.init = function(id) {
    this.form = document.getElementById('form');
    this.form.addEventListener('submit', this._handleFormSubmit.bind(this), false);
    this.input = form.querySelector('[data-input]');
    this.box = form.querySelector('[data-box]');

    this.buttonAll = form.querySelector('[data-button-all]');
    this.buttonActive = form.querySelector('[data-button-active]');
    this.buttonCompleted = form.querySelector('[data-button-completed]');
    this.buttonClearCompleted = form.querySelector('[data-button-clear-completed]');

    this.buttonAll.addEventListener('click', this._handleButtonAllClick.bind(this), false);
    this.buttonActive.addEventListener('click', this._handleButtonActiveClick.bind(this), false);
    this.buttonCompleted.addEventListener('click', this._handleButtonCompletedClick.bind(this), false);
    this.buttonClearCompleted.addEventListener('click', this._handleButtonClearCompletedClick.bind(this), false);
  };

  Todo.prototype.addTodo = function(text) {
    this.todos.unshift({
      id: getRandomInt(1, 999999),
      text: text,
      completed: false
    });
  };

  Todo.prototype.createTodoDiv = function(row) {

    var div = document.createElement('div');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = row.completed;

    checkbox.addEventListener('click', this._handleCheckboxClick.bind(this, row.id, checkbox), false);

    var span = document.createElement('span');
    span.textContent = row.text;

    var button = document.createElement('a');
    button.textContent = '✖';
    button.href = '';

    div.appendChild(checkbox);
    div.appendChild(span);
    div.appendChild(button);

    button.addEventListener('click', this._handleDeleteButtonClick.bind(this, row.id, div), false);

    return div;
  };

  Todo.prototype.clearRows = function() {
    var box = this.box;
    while (box.firstChild) {
      box.removeChild(box.firstChild);
    }
  };

  Todo.prototype.renderRows = function() {
    var self = this;
    self.clearRows();

    this.todos.forEach(function(todo) {

      function appendDiv() {
        var todoDiv = self.createTodoDiv(todo);
        self.box.appendChild(todoDiv);
      }

      if (TYPE_ALL == self.filter) {
        appendDiv();
      }
      else if ((TYPE_ACTIVE === self.filter) && (! todo.completed)) {
        appendDiv();
      }
      else if ((TYPE_COMPLETED === self.filter) && todo.completed) {
        appendDiv();
      }

    });
  };

  Todo.prototype._handleFormSubmit = function(event) {
    event.preventDefault();

    var input = this.input;
    var value = input.value;

    if (! value) {
      return false;
    }

    this.addTodo(value);
    this.renderRows();
    input.value = '';
  };

  Todo.prototype.deleteRowById = function(id) {
    this.todos = this.todos.filter(function(todo) {
      return todo.id !== id;
    });
  };

  Todo.prototype._handleDeleteButtonClick = function(id, div, event) {
    event.preventDefault();
    this.deleteRowById(id);
    this.renderRows();
  };

  Todo.prototype.setDataById = function(id, data) {
    var todo = this.todos.find(function(todo) {
      return todo.id === id;
    });
    Object.assign(todo, data);
  };

  Todo.prototype._handleCheckboxClick = function(id, checkbox, event) {
    this.setDataById(id, {completed: checkbox.checked});
  };

  Todo.prototype._handleButtonAllClick = function(event) {
    this.filter = TYPE_ALL;
    this.renderRows();
  };

  Todo.prototype._handleButtonActiveClick = function(event) {
    this.filter = TYPE_ACTIVE;
    this.renderRows();
  };

  Todo.prototype._handleButtonCompletedClick = function(event) {
    this.filter = TYPE_COMPLETED;
    this.renderRows();
  };

  Todo.prototype._handleButtonClearCompletedClick = function(event) {
    this.todos = this.todos.filter(function(todo) {
      return ! todo.completed;
    });
    this.renderRows();
  };

  var t = new Todo({id: 'form'});

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

})();
