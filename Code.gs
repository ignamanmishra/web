function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({result: 'GET request received'})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = data.action;
  var sheetName = data.sheetName;
  var spreadsheet = SpreadsheetApp.openById('1wmNK0h8H2I40C-Jw0KcLljRwKOl0XRv-F8H3RHMu07w');
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  var result;
  
  if (action === 'read') {
    var rows = sheet.getDataRange().getValues();
    var headers = rows[0];
    var values = rows.slice(1);
    
    var data = values.map(function(row) {
      var obj = {};
      headers.forEach(function(header, i) {
        obj[header] = row[i];
      });
      return obj;
    });
    
    result = { success: true, data: data };
  } else if (action === 'append') {
    var rowData = data.data;
    sheet.appendRow(rowData);
    result = { success: true, message: 'Data appended successfully' };
  } else if (action === 'update') {
    var rowIndex = data.rowIndex;
    var columnIndex = data.columnIndex;
    var value = data.value;
    sheet.getRange(rowIndex, columnIndex).setValue(value);
    result = { success: true, message: 'Data updated successfully' };
  } else {
    result = { success: false, message: 'Invalid action' };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}