var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    geojson: {},
    fields: ['Species', 'Date', 'Time', 'Weather'],
    map: null,
    dataLayer: null,
    chosenSpecies: "",
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
      this.chosenSpecies;  // Simple reference to make sure computed value react to changes
      return _.filter(this.geojson.features, (feature) => {
        if ((!this.chosenSpecies ||
             feature.properties['Species'].toLowerCase() == this.chosenSpecies) &&
            (!this.chosenWeather ||
             feature.properties['Weather'].toLowerCase() == this.chosenWeather) &&
            (!this.chosenYear ||
             moment(feature.properties['Date'], "DD/MM/YYYY").year() == this.chosenYear)
        ) {
          return feature;
        }
      });
    },
    species: function() {
      const values = _.uniq(_.map(this.geojson.features, (data) => {
        return data.properties['Species'].toLowerCase();
      })).sort();
      return _.map(values, function(value) {
        return {
          text: _.map(_.words(value, /[^, ]+/g), _.capitalize).join(' '),
          value: value
        }
      });
    },
    weathers: function() {
      const values =  _.uniq(_.map(this.geojson.features, (data) => {
        return data.properties['Weather'].toLowerCase();
      }));
      return _.map(values, function(value) {
        return {
          text: _.map(_.words(value, /[^, ]+/g), _.capitalize).join(' '),
          value: value
        }
      });
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
        .get('data/trial_herps_5.json')
        .then(response => (this.geojson = response.data))
    },
    createMap: function() {
      const map = L.map('map', {
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
      map.addLayer(layer_ESRISatellite_0);

      axios
        .get('data/streams.json')
        .then(response => {
          L.geoJson(response.data, {
            layerName: 'Streams',
            style: {
              opacity: 0.5,
              color: 'rgba(1,34,243,1.0)',
              lineCap: 'square',
              lineJoin: 'bevel',
              weight: 2.0,
              fillOpacity: 0
            },
          }).addTo(map);
        });

      axios
        .get('data/border_MLC_3.json')
        .then(response => {
          L.geoJson(response.data, {
            layerName: 'Border',
            style: {
              opacity: 1,
              color: 'rgba(0,0,0,1.0)',
              dashArray: '',
              lineCap: 'square',
              lineJoin: 'bevel',
              weight: 3.0,
              fillColor: 'green',
              fillOpacity: 0.2,
            },
          }).addTo(map);
        });

      axios
        .get('data/MLC_All_trails_2.json')
        .then(response => {
          L.geoJson(response.data, {
            layerName: 'Trails',
            style: {
              opacity: 0.6,
              color: 'gray',
              dashArray: '',
              lineCap: 'round',
              lineJoin: 'round',
              weight: 2.0
            },
          }).addTo(map);
        });

      const style = {
        radius: 6.000000000000002,
        opacity: 1,
        fillColor: '#EA9657',
        color: '#fff',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
      };
      this.dataLayer = new L.geoJson(null, {
        pointToLayer: function (feature, latlng) {
          var context = {
            feature: feature,
            variables: {}
          };
          return L.circleMarker(latlng, style);
        },
      });
      map.addLayer(this.dataLayer);
      this.map = map;
    },
    showFeatures: function(features) {
      this.dataLayer.clearLayers();
      this.dataLayer.addData(features);
    }
  }
})
