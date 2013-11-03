(function () {
  var p = new PIOA('pioa.php');
  p.init();
  p.track({
    id: 12,
    type: 'node',
    action: 'view'
  });
}());
