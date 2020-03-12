<template>
	<div>
		<div id="mapDiv" style="width:700px; height:500px;float: left;"></div>
		<div style="width:260px;padding:20px;float: right;">
			<el-input placeholder="请输入搜索地" style="float:left" v-model="findname"></el-input>
			<el-button @click="findplace()" style="float:left;width:100%;margin-top:10px" type="primary">查找</el-button>
			<el-button @click="reLoad()" style="margin:50px auto;">刷新地图</el-button>
		</div>
	</div>
</template>

<script>
	export default {
	    name: 'mapp',
		props: {
		  gotomemory: {
		    type: Function,
		    default: null
		  },
		},
		data () {
			return {
				lilong:{
					'虹口区': [
						{
							name: '瑞庆里',
							Gx: 31.2577,
							Gy: 121.48635,
						},
						{
							name: '麦加里',
							Gx: 31.25967,
							Gy: 121.48749,
						},
						{
							name: '浙兴里',
							Gx: 31.26108,
							Gy: 121.48304,
						},
						{
							name: '兴业北里',
							Gx: 31.26131,
							Gy: 121.48296,
						},
						{
							name: '德兴里',
							Gx: 31.24932,
							Gy: 121.4784,
						},
						
						{
							name: '兴业坊',
							Gx: 31.26849,
							Gy: 121.48058,
						},
						{
							name: '永安里',
							Gx: 31.26737,
							Gy: 121.47826,
						},
						{
							name: '公益坊',
							Gx: 31.25273,
							Gy: 121.47911,
						},
						{
							name: '三多里',
							Gx: 31.26076,
							Gy: 121.49935,
						},
					],
					'黄浦区': [{
						name: '瑞康里',
						Gx: 31.24098,
						Gy: 121.46962,
					}],
					'静安区': [{
						name: '同福里',
						Gx: 31.224240,
						Gy: 121.459940,
					}],
					'杨浦区': []
				}, 
				qu: {},
				clickname: '',
				findname: '',
				config : [
					{
						c:{
							needSubInfo: false,
							needAll: false,
							needPolygon: true,
							needPre: true,
							searchType: 1,
							searchWord: "虹口区",
						}
					},
					{
						c:{
							needSubInfo: false,
							needAll: false,
							needPolygon: true,
							needPre: true,
							searchType: 1,
							searchWord: "杨浦区",
						}
					},
					{
						c:{
							needSubInfo: false,
							needAll: false,
							needPolygon: true,
							needPre: true,
							searchType: 1,
							searchWord: "静安区",
						}
					},
					{
						c:{
							needSubInfo: false,
							needAll: false,
							needPolygon: true,
							needPre: true,
							searchType: 1,
							searchWord: "黄浦区",
						}
					}
				]
			}
		},
	    methods: {
		    onLoad() {
				this.map = new T.Map('mapDiv');//拉取地图
				this.geocoder = new T.Geocoder();
		  		this.map.centerAndZoom(new T.LngLat(121.47769, 31.23945), 12);//设置中心点及缩放
				this.map.setMaxBounds(new T.LngLatBounds(new T.LngLat(121.36769, 31.17945), new T.LngLat(121.60769, 31.35945)));//设置地图范围
				this.hongkou()
			},
			reLoad() {
				this.map.clearOverLays()
				this.map.centerAndZoom(new T.LngLat(121.47769, 31.23945), 12);//设置中心点及缩放
				this.map.setMaxBounds(new T.LngLatBounds(new T.LngLat(121.36769, 31.17945), new T.LngLat(121.60769, 31.35945)));//设置地图范围
				this.hongkou()
			},
		    hongkou() {
				let administrative;
				administrative = new T.AdministrativeDivision();
				for(var i = 0; i < this.config.length; i++){
					administrative.search(this.config[i].c, this.showqukuai);
				}
			},
			searchResult(result){
					if(result.getStatus() == 0){
						this.map.panTo(result.getLocationPoint(), 16);
						console.log(result.getLocationPoint())
						//创建标注对象
				        var marker = new T.Marker(result.getLocationPoint());
				        //向地图上添加标注
				        this.map.addOverLay(marker);
					}else{
						alert(result.getMsg());
					}
					
				},
			findplace(){
				this.geocoder.getPoint(this.findname, this.searchResult);
			},
			showqukuai(result){
				if(result.getStatus() == 100) 
				{
					let data = result.getData();
					this.showMsg(data);
				}
				else 
				{
					result.getMsg();
				}
			},
				
			showMsg(data){
				for(let i = 0; i < data.length; i++){
					if(data[i].points){
						//绘制行政区划
						this.polygon(data[i].points,data[i].name);
					}
				}
			},
			polygon(points,name){
				let pointsArr = [];
				for (let i = 0; i < points.length; i++) {
					let regionLngLats = [];
					let regionArr = points[i].region.split(",");
					for (let m = 0; m < regionArr.length; m++) {
						let lnglatArr = regionArr[m].split(" ");
						let lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
						regionLngLats.push(lnglat);
						pointsArr.push(lnglat);
					}

					//创建面对象
					this.qu[name] = {
						polygon:new T.Polygon(
							regionLngLats,
							{
								color: "#FF0033", 
								weight: 2, 
								lineStyle: "dashed",
								opacity: 0.9, 
								fillColor: "#FFFFFF", 
								fillOpacity: 0.3,
							}
					)}
					//向地图上添加行政区划面
					//polygon.mouseover("mouseover", this.PolygonOver)
					
					this.map.addOverLay(this.qu[name].polygon);
					
					this.addPolygonOver(name)
					this.addPolygonOut(name)
					this.addPolygonClick(name)
				}
			},
			calculate(li){
				let Gx = 0
				let Gy = 0
				let area = 0
				for(let i=1;i<=li.length;i++){
					let iLat = li[i % li.length].lat;
					let iLng = li[i % li.length].lng;
					let nextLat = li[i - 1].lat;
					let nextLng = li[i - 1].lng;
					let temp = (iLat * nextLng - iLng * nextLat) / 2.0;
					area += temp;
					Gx += temp * (iLat + nextLat) / 3.0;
					Gy += temp * (iLng + nextLng) / 3.0;
				}
				let box = []
				Gx = Gx / area;
				Gy = Gy / area;
				box.push(Gx)
				box.push(Gy)
				return box;
			},
			onClick(name){
				let lnglat = new T.LngLat(this.qu[name].Gx, this.qu[name].Gy);
				this.map.centerAndZoom(lnglat,14)
				this.clickname = name
				this.map.clearOverLays()
				var ttt = this
				// 标签类
				var definedOverlay = T.Overlay.extend({
					initialize: function (lnglat, text, text2, options, map) {
						this.lnglat = lnglat;
						this.setOptions(options);
						this._text = text;
						this._overText = text2;
						this.map = map
					},
	
					onAdd: function () {
						var div = this._div = document.createElement("div");
						div.style.position = "absolute";
						div.style.backgroundColor = "#EE5D5B";
						div.style.border = "1px solid #BC3B3A";
						div.style.color = "white";
						div.style.height = "18px";
						div.style.padding = "2px";
						div.style.lineHeight = "18px";
						div.style.whiteSpace = "nowrap";
						div.style.MozUserSelect = "none";
						div.style.fontSize = "12px";
						var span = this._span = document.createElement("span");
						div.appendChild(span);
						span.appendChild(document.createTextNode(this._text));
						var that = this;
	
						var arrow = this._arrow = document.createElement("div");
						arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
						arrow.style.position = "absolute";
						arrow.style.width = "11px";
						arrow.style.height = "10px";
						arrow.style.top = "22px";
						arrow.style.left = "10px";
						arrow.style.overflow = "hidden";
						div.appendChild(arrow);
	
						div.onmouseover = function () {
							this.style.backgroundColor = "#6BADCA";
							this.style.borderColor = "#0000ff";
							this.getElementsByTagName("span")[0].innerHTML = that._overText;
							arrow.style.backgroundPosition = "0px -20px";
						}
	
						div.onmouseout = function () {
							this.style.backgroundColor = "#EE5D5B";
							this.style.borderColor = "#BC3B3A";
							this.getElementsByTagName("span")[0].innerHTML = that._text;
							arrow.style.backgroundPosition = "0px 0px";
						}
						div.onclick = function () {
							ttt.gotomemory(that._text)
						}
						this.map.getPanes().overlayPane.appendChild(this._div);
						this.update(this.lnglat);
					},
	
					onRemove: function () {
						var parent = this._div.parentNode;
						if (parent) {
							parent.removeChild(this._div);
							this.map = null;
							this._div = null;
						}
					},
	
					setLnglat: function (lnglat) {
						this.lnglat = lnglat;
						this.update();
					},
					getLnglat: function () {
						return this.lnglat;
					},
					setPos: function (pos) {
						this.lnglat = this.map.layerPointToLngLat(pos);
						this.update();
					},
					/**
					 * 更新位置
					 */
					update: function () {
						var pos = this.map.lngLatToLayerPoint(this.lnglat);
						this._div.style.top = ( pos.y - 36) + "px";
						this._div.style.left = (pos.x - 11) + "px";
	
					}
				});
				for(let i=0;i<this.lilong[name].length;i++){
					let point = new T.LngLat(this.lilong[name][i].Gy, this.lilong[name][i].Gx);
					let pdefinedOverlay = new definedOverlay(point, this.lilong[name][i].name, this.lilong[name][i].name, {}, this.map);
					this.map.addOverLay(pdefinedOverlay);
				}
			},
			onOver(name){
				this.qu[name].polygon.setFillColor("#FF0033")
				let box = this.calculate(this.qu[name].polygon.getLngLats()[0])
				let lnglat = new T.LngLat(box[1], box[0]);
				this.qu[name].Gx = box[1]
				this.qu[name].Gy = box[0]
				// 创建信息窗口对象
				let infoWin = new T.InfoWindow();
				infoWin.setLngLat(lnglat);
				// 设置信息窗口要显示的内容
				infoWin.setContent(name);
				// 向地图上添加信息窗口
				this.map.addOverLay(infoWin);
			},
			onOut(name){
				this.qu[name].polygon.setFillColor("#FFFFFF")
				let lays = this.map.getOverlays()
				// console.log(lays)
				for(let i=0;i<lays.length;i++){
					if(lays[i].ET){
						this.map.removeOverLay(lays[i])
					}
				}
			},
			addPolygonOver(name) {
				this.removePolygonOver(name);
				this.qu[name].polygon.addEventListener("mouseover", ()=>{this.onOver(name)});
			},
			removePolygonOver(name) {
				this.qu[name].polygon.removeEventListener("mouseover", ()=>{this.onOver(pname)});
			},
			addPolygonOut(name) {
				this.removePolygonOut(name);
				this.qu[name].polygon.addEventListener("mouseout", ()=>{this.onOut(name)});
			},
			removePolygonOut(name) {
				this.qu[name].polygon.removeEventListener("mouseout", ()=>{this.onOut(name)});
			},
			addPolygonClick(name) {
				this.removePolygonClick(name);
				this.qu[name].polygon.addEventListener("click", ()=>{this.onClick(name)});
			},
			removePolygonClick(name) {
				this.qu[name].polygon.removeEventListener("click", ()=>{this.onClick(name)});
			},
	    },
	    mounted () {
	    	this.onLoad()
	    }
	}
</script>

<style>
</style>