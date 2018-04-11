/*global $ */

$(document).ready(function() {
  $('#openMaps').click(() => {
    let building = $('#inputBuilding').find(':selected').text();
    if (building === 'Stuart Building') {
      window.location.href = '/stuart';
    } else if (building === 'Alumini Building') {
      window.location.href = '/alumini';
    } else {
      $('#inputBuilding').addClass('is-invalid');
    }
  });
});