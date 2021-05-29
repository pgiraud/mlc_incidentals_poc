var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    geojson: {},
    fields: ['Common_nam', 'Date', 'Weather']
  },
  computed: {
    featuresData: function() {
      return _.map(this.geojson.features, (feature) => {
        return feature.properties;
      });
    }
  },
  mounted: function() {
    this.loadData();
  },
  methods: {
    loadData: function() {
      axios
        .get('data/mammals_4.json')
        .then(response => (this.geojson = response.data))
    }
  }
})
