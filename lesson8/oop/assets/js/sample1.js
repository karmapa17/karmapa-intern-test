(function() {
  // define the Person Class
  function Person() {}

  Person.prototype.walk = function() {
    console.log ('I am walking!');
  };

  Person.prototype.sayHello = function() {
    console.log ('hello');
  };

  // define the Student class
  function Student() {
    // Call the parent constructor
    Person.call(this);
  }

  // inherit Person
  Student.prototype = new Person();

  // correct the constructor pointer because it points to Person
  // NOTE: you cannot change a constructor by reassigning to prototype.constructor
  // http://stackoverflow.com/questions/9267157/why-is-it-impossible-to-change-constructor-function-from-prototype
  Student.prototype.constructor = Student;

  // replace the sayHello method
  Student.prototype.sayHello = function() {
    console.log('hi, I am a student');
  };

  // add sayGoodBye method
  Student.prototype.sayGoodBye = function() {
    console.log('goodBye');
  };

  var student1 = new Student();
  student1.sayHello();
  student1.walk();
  student1.sayGoodBye();

  // check inheritance
  console.log('student1 instanceof Person ? %s', student1 instanceof Person); // true
  console.log('student1 instanceof Student ? %s', student1 instanceof Student); // true
  console.log(student1);
})();
