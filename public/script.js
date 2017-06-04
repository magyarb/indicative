/**
 * Created by balazs on 6/3/2017.
 */
$(document).ready(function () {

  window.sumCapex = 0;
  window.sumOpex = 0;

  //init
  loadLocations();
  $('.form-group').hide();
  $('#results').hide();
  $('#serviceSelector').show();
  $('#speedSelector').show();

  //switching input fields based on service type
  $('#serviceSelectorInput').on('change', function () {
    switch (this.value) {
      case "lli":
      case "ll":
      case "ipvpn": //if internet service
        $('.form-group').hide();
        $('#serviceSelector').show();
        $('#speedSelector').show()
        $('#speedSelectorInput').focus();
        break;
      default:
        $('.form-group').hide();
        $('#serviceSelector').show();
        $('#channelSelector').show();
        $('#channelSelectorInput').focus();
        break;
    }
  });

  //button click handler
  $('#submit').click(function () {
    $.get("/capex", { service: $('#serviceSelectorInput').val(), speed: $('#speedSelectorInput').val(), channels: $('#channelSelectorInput').val() }, function (data, status) {
      drawTableE(data, "capextable");
    });
    $.get("/opex", { service: $('#serviceSelectorInput').val(), speed: $('#speedSelectorInput').val(), channels: $('#channelSelectorInput').val() }, function (data, status) {
      drawTableE(data, "opextable");
    });

    $('#results').show();
  });


});

function loadLocations() {
  $.get("/locations", function (data, status) {
    for (var location in data) {
      var row = $('<option />');
      row.attr('value', data[location].distance);
      row.html(data[location].location);
      $("#locations").append(row);
    }
  });
}

function drawTableE(data, tablename) {
  console.log(data);
  $("#" + tablename).empty();
  //header
  var header = $("<thead />");
  var row = $("<tr />");
  $("#" + tablename).append(header);
  header.append(row);
  row.append($("<th>" + "Service" + "</th>"));
  row.append($("<th>" + "Amount" + "</th>"));
  row.append($("<th>" + "Price" + "</th>"));
  row.append($("<th>" + "Sum" + "</th>"));
  //data
  var body = $("<tbody />");
  $("#" + tablename).append(body);
  for (var i = 0; i < data.length; i++) {
    drawRowE(data[i], body, tablename);
  }
}

function drawRowE(rowData, tbody, tablename) {
  var row = $("<tr />");
  tbody.append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
  row.append($("<td>" + rowData['name'] + "</td>"));
  row.append($("<td>" + rowData['amount'] + "</td>"));
  row.append($("<td>" + rowData['price'] + "</td>"));
  row.append($("<td>" + rowData['amount'] * rowData['price'] + "</td>"));
  if(tablename === "capextable")
    window.sumCapex += rowData['amount'] * rowData['price'];
  if(tablename === "opextable")
    window.sumOpex += rowData['amount'] * rowData['price'];
  $('#sumcapex').html(window.sumCapex);
  $('#sumcapex').toNumber().formatCurrency({ symbol : 'HUF ', roundToDecimalPlace: 0 });
  $('#sumopex').html(window.sumOpex);
  /*for (var key in rowData) {
    row.append($("<td>" + rowData[key] + "</td>"));
  }*/
}
