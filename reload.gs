function doGet() {
  var sheetId = '';
  var sheetName = '';

  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(sheetName);
  
  var keys = ['name', 'area', 'pref', 'addr', 'count', 'latlng'];
  var keys_ja = ['店舗名', '地方', '都道府県', '住所', '台数', '緯度経度'];
  
  //列名を設定
  for(i = 0; i < keys.length; i++) {
      sheet.getRange(1, i + 1).setValue(keys_ja[i]);  
  }
  
  var count = 0;
  
  for(pref_i = 1;  pref_i <= 47; pref_i++){
    
    var json = UrlFetchApp.fetch('http://groovecoaster.jp/cache/pref' + pref_i + '.json').getContentText();
    
    var jsonData = JSON.parse(json);
    
    for(i = 0; i < jsonData.DATA.length; i++) {
      var value = arrangeData(jsonData.DATA[i]);
      for(j = 0; j < keys.length; j++) {
        sheet.getRange(count + 2, j + 1).setValue(value[keys[j]]);  
      }
      count++;
    }
    Utilities.sleep(1000);
  }
  
  return HtmlService.createTemplateFromFile('index.html').evaluate();
}


function arrangeData(data) {
  var area = ['', '北海道', '東北', '関東', '甲信越', '北陸', '東海', '関西', '中国', '四国', '九州', '沖縄']
  var retdata = {};
  retdata.name = data.TNAME;
  retdata.addr = data.ADDR;
  retdata.pref = data.PREF;
  retdata.latlng = data.LAT + ", " + data.LNG;
  retdata.count = data.CNT;
  retdata.area = area[data.AREA];
  return retdata;
}
