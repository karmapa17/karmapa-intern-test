(function() {

  function Scooter(name) {
    this.name = name;
    this.brand = 'YAMAHA';
    this.color = 'black';
    this.hornVolume = 80;
    this.hp = 12;
  }

  Scooter.prototype.accelerate = function() {
    console.log('加速中...( 馬力: ' + this.hp + ' )');
    return this;
  };

  Scooter.prototype.brakeFrontBrake = function() {
    console.log('按下前煞車');
    return this;
  };

  Scooter.prototype.brakeRearBrake = function() {
    console.log('按下後煞車');
    return this;
  };

  Scooter.prototype.horn = function() {
    console.log('按喇叭 ( 分貝: ' + this.hornVolume + ' )');
    return this;
  };

  Scooter.prototype.toString = function() {
    return this.name;
  };

  function SoupedUpScooter(name) {
    Scooter.call(this, name);
    this.stereoOn = false;
    this.hornVolume = 90;
    this.hp = 15;
  }

  SoupedUpScooter.prototype = new Scooter();
  SoupedUpScooter.prototype.constructor = SoupedUpScooter;

  SoupedUpScooter.prototype.toggleStereo = function() {
    this.stereoOn = ! this.stereoOn;
    var action = this.stereoOn ? '打開' : '關閉';
    console.log('把音響' + action);
    return this;
  };

  var s1 = new SoupedUpScooter('屁孩的機車');

  console.log('車:', s1);

  s1.accelerate()
    .brakeFrontBrake()
    .brakeRearBrake()
    .horn()
    .toggleStereo();

  var s2 = new Scooter('老人家的車');

  console.log('\n\n');
  console.log('車:', s2);

  s2.accelerate()
    .brakeFrontBrake()
    .brakeRearBrake()
    .horn();
})();
