mapboxgl.accessToken = mapToken;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [121.5654, 25.0330],
    zoom: 12
});
// 建立一個 geocoder 物件
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken, // 使用 access token
    mapboxgl: mapboxgl, // 使用 mapboxgl 物件
    placeholder: '輸入地點', // 設定提示文字
    marker: false, // 不顯示標記
    limit: 5, // 限制返回的選項數量
    types: 'country,region,place,postcode,locality,neighborhood,address' // 限制返回的地點類型
});

// 將 geocoder 物件添加到地點輸入欄
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// 當選擇一個選項時，觸發事件
geocoder.on('result', function (e) {
    // 取得選擇的地點資訊
    var place = e.result;
    // 在控制台顯示地點資訊
    console.log(place);
    // 在地圖上顯示一個彈出視窗，顯示地點的名稱和座標
    new mapboxgl.Popup()
        .setLngLat(place.center)
        .setHTML(`<h3>${place.place_name}</h3><p>${place.center}</p>`)
        .addTo(map);
});
let locationInput = document.getElementById('location');
let marker = null;

map.on('click', function (e) {
    // 獲取點擊的座標
    var lngLat = e.lngLat;
    // 將座標轉換成字串，並保留兩位小數
    var lngLatString = lngLat.lng.toFixed(6) + ', ' + lngLat.lat.toFixed(6);
    // 將座標字串賦值給地點輸入框
    locationInput.value = lngLatString;
    // 如果已經有 marker，則先移除它
    if (marker) {
        marker.remove();
    }
    // 在點擊的位置新增一個 marker
    marker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(map);
});