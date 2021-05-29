var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    geojson: {},
    fields: ['Common_nam', 'Date', 'Weather'],
    map: null,
    dataLayer: null,
    chosenCommonName: "",
    chosenWeather: "",
    chosenYear: ""
  },
  computed: {
    tableData: function() {
      return _.map(this.filteredData, (feature) => {
        return feature.properties;
      });
    },
    filteredData: function() {
      // FIXME filter data
      this.chosenCommonName;  // Simple reference to make sure computed value react to changes
      return _.filter(this.geojson.features, (feature) => {
        if ((!this.chosenCommonName ||
             feature.properties['Common_nam'] == this.chosenCommonName) &&
            (!this.chosenWeather ||
             feature.properties['Weather'] == this.chosenWeather)
        ) {
          return feature;
        }
      });
    },
    commonNames: function() {
      return _.uniq(_.map(this.geojson.features, (data) => {
        return data.properties['Common_nam'];
      }));
    },
    weathers: function() {
      return _.uniq(_.map(this.geojson.features, (data) => {
        return data.properties['Weather'];
      }));
    },
    years: function() {
      return _.uniq(_.map(this.geojson.features, (data) => {
        return moment(data.properties['Date'], "DD/MM/YYYY").year();
      }));
    }
  },
  watch: {
    filteredData: function(data) {
      this.showFeatures(data);
    }
  },
  mounted: function() {
    this.createMap();
    this.loadData();
  },
  methods: {
    loadData: function() {
      axios
        .get('data/mammals_4.json')
        .then(response => (this.geojson = response.data))
    },
    createMap: function() {
      this.map = L.map('map', {
          zoomControl:true,
          maxZoom:17,
          minZoom:1
      }).fitBounds([[-12.81642833642814,-71.43062286779876],[-12.776666440629437,-71.37380663078079]]);
      var layer_ESRISatellite_0 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          opacity: 1.0,
          attribution: 'ArcGisOnLine',
          minZoom: 1,
          maxZoom: 17,
          minNativeZoom: 0,
          maxNativeZoom: 20
      });
      layer_ESRISatellite_0;
      this.map.addLayer(layer_ESRISatellite_0);

      this.dataLayer = L.geoJSON();
      this.map.addLayer(this.dataLayer);
    },
    showFeatures: function(features) {
      this.dataLayer.clearLayers();
      this.dataLayer.addData(features);
    }
  }
})
