mapboxgl.accessToken = mapToken;
let locationInput = document.getElementById('location');
let marker = null;
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [120.9738819, 23.97565],
    zoom: 6
});

// 检查 campground 是否存在
if (typeof campground !== 'undefined' && campground) {
    map.setCenter(campground.geometry.coordinates);
}
console.dir(map);
marker = new mapboxgl.Marker()
    .setLngLat(map.getCenter())
    .addTo(map);

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
// 当选择一个选项时，触发事件
geocoder.on('result', function (e) {
    // 获取选择的地点信息
    var place = e.result;
    // 在控制台显示地点信息
    console.log(place);
    // 在地图上显示一个弹出视窗，显示地点的名称和坐标
    new mapboxgl.Popup()
        .setLngLat(place.center)
        .setHTML(`<h3>${place.place_name}</h3><p>${place.center}</p>`)
        .addTo(map);
});

map.on('click', function (e) {
    // 获取点击的坐标
    var lngLat = e.lngLat;
    // 将坐标转换成字符串，并保留两位小数
    var lngLatString = lngLat.lng.toFixed(6) + ', ' + lngLat.lat.toFixed(6);
    // 将坐标字符串赋值给地点输入框
    locationInput.value = lngLatString;
    // 如果已经有 marker，则先移除它
    if (marker) {
        marker.remove();
    }
    // 在点击的位置新增一个 marker
    marker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(map);
});
