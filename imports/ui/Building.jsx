import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'react-meteor-data';
import __ from 'lodash';
import moment from 'moment';
import { WifiRouters } from '../api/router';
// import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min.js'
var request = require('request');

class Building extends React.Component {
    constructor(props) {
        super(props);
        this.state = {map: null},
        this.count = 1;
        this.routerMarker = {};
    }

    componentDidMount() {
      if(!this.props.map) {
        this.props.getDefaultMap();
      }
    }

    componentDidUpdate() {
      let map = this.props.map;
      let routers = this.props.wifiRouters;
      let that = this;
      if(map) {
        map.indoors.on("indoormapenter", function(e) {
          map.indoors.setFloor(6);
          that.setState({indoorMapId: e.indoorMap.getIndoorMapId()});
        });

        var wifiIcon = L.icon({
          iconUrl: '/wifi.png',
          iconSize:     [50, 50]
        });

        // var c = new L.LatLng(22.36721, 114.14486);
        // var rectangle = L.circle(c, 4000);

        // L.rectangle( <LatLngBounds> bounds, <Path options> options? )

        __.forEach(routers, item => {
          if(!this.routerMarker[item._id]) {
            this.routerMarker[item._id] = L.marker(item.position, {
              elevation: 4,
              draggable: true,
              id: item._id,
              title: item.title,
              indoorMapId: item.indoorMapId,
              indoorMapFloorIndex: item.indoorMapFloorIndex
            }).addTo(map)
            this.routerMarker[item._id].on('move', (ev) => {
              let lat = ev.latlng.lat;
              let lng = ev.latlng.lng;
              WifiRouters.update({_id: item._id}, {$set: {
               position: [lat, lng]
              }});
            })
            this.routerMarker[item._id].on('dblclick', () => {
              let remove = confirm('Bạn có thực sự muốn xóa');
              if(remove) {
                WifiRouters.remove({_id: item._id});
                map.removeLayer(this.routerMarker[item._id]);
              }
            });
          }
        });
      }
    }

    addRouter() {
      let map = this.props.map;
      let router = {
        title: 'Router',
        position: [12.268973320538016, 109.2011849878606],
        indoorMapId: this.state.indoorMapId,
        indoorMapFloorIndex: map.indoors.getFloor().getFloorIndex(),
      }
      WifiRouters.insert(router);
    }

    render() {
      let map = this.props.map;
      return (
        <div>
          <div style={{position: 'fixed', top: 50, left: 10, zIndex: 99}}>
            <button onClick={() => map.indoors.exit()}>
              Thoát
            </button>
            <button onClick={() => map.indoors.setFloor(0)}>
              1
            </button>
            <button onClick={() => map.indoors.setFloor(1)}>
              2
            </button>
            <button onClick={() => map.indoors.setFloor(2)}>
              3
            </button>
            <button onClick={() => map.indoors.setFloor(3)}>
              4
            </button>
            <button onClick={() => map.indoors.moveUp(1)}>
              up
            </button>
            <button onClick={() => map.indoors.moveDown(1)}>
              down
            </button> 
            <button onClick={() => this.addRouter()}>
              add router
            </button>
          </div>
          <div id="map" style={{width: '100%', height: window.innerHeight - 100, paddingBottom: 19}}>
          </div>
        </div>
      )
    }
}

const BuildingData = createContainer(() => {
  Meteor.subscribe('routers');
  return {
    wifiRouters: WifiRouters.find({}).fetch()
  };
}, Building);

export default class BuildingManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buildingSource: {
        id: 'All',
        map: ''
      }
    }
  }

  getDefaultMap() {
    let map = L.Wrld.map("map", "fd83c1cfc3b1317a0c697927fd36ef53", {
      center: [12.269016881489472, 109.202015896930888],
      zoom: 17,
      indoorsEnabled: true,
      coverageTreeManifest: "https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-fc35f0d0-320a-41a4-a431-13467c75fade_2017_10_13_02_10_40/webgl_manifest.bin.gz"
    });
    this.setState({buildingSource: {
      id: 'All',
      map
    }});
  }

  getAllMap() {
    var select = document.getElementById('map');
    select.removeChild(select.lastChild);
    let map = L.Wrld.map("map", "fd83c1cfc3b1317a0c697927fd36ef53", {
      center: [12.269016881489472, 109.202015896930888],
      zoom: 17,
      indoorsEnabled: true,
      coverageTreeManifest: "https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-fc35f0d0-320a-41a4-a431-13467c75fade_2017_10_13_02_10_40/webgl_manifest.bin.gz"
    });
    this.setState({buildingSource: {
      id: 'All',
      map
    }});
  }

  getK3Map() {
    var select = document.getElementById('map');
    select.removeChild(select.lastChild);
    let map = L.Wrld.map("map", "fd83c1cfc3b1317a0c697927fd36ef53", {
      center: [12.269016881489472, 109.202015896930888],
      zoom: 15,
      indoorsEnabled: true,
      coverageTreeManifest: "https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-3e83a79a-75e2-41fc-ad03-4fbb2b84e02b_2017_10_10_02_19_02/webgl_manifest.bin.gz"
    });
    this.setState({buildingSource: {
      id: 'K3',
      map
    }});
  }

  getK4Map() {
    var select = document.getElementById('map');
    select.removeChild(select.lastChild);
    let map = L.Wrld.map("map", "fd83c1cfc3b1317a0c697927fd36ef53", {
      center: [12.269016881489472, 109.202015896930888],
      zoom: 15,
      indoorsEnabled: true,
      coverageTreeManifest: "https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-575e2d9a-8186-4005-9696-6a4acaac1356_2017_10_10_01_59_54/webgl_manifest.bin.gz"
    });
    this.setState({buildingSource: {
      id: 'K4',
      map
    }});
  }

  getK5Map() {
    var select = document.getElementById('map');
    select.removeChild(select.lastChild);
    let map = L.Wrld.map("map", "fd83c1cfc3b1317a0c697927fd36ef53", {
      center: [12.269016881489472, 109.202015896930888],
      zoom: 15,
      indoorsEnabled: true,
      coverageTreeManifest: "https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-703a10f2-e23e-4981-81bf-579497b46217_2017_10_07_07_44_42/webgl_manifest.bin.gz"
    });
    this.setState({buildingSource: {
      id: 'K5',
      map
    }});
  }

  componentDidMount() {
    //RENDERER
  }

  getK8Map() {
    var select = document.getElementById('map');
    select.removeChild(select.lastChild);
    let map = L.Wrld.map("map", "fd83c1cfc3b1317a0c697927fd36ef53", {
      center: [12.269016881489472, 109.202015896930888],
      zoom: 17,
      indoorsEnabled: true,
      coverageTreeManifest: "https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-fc35f0d0-320a-41a4-a431-13467c75fade_2017_10_07_07_56_21/webgl_manifest.bin.gz"
    });
    this.setState({buildingSource: {
      id: 'K8',
      map
    }});
  }


  render() {
    let { buildingSource } = this.state;
    return (
      <div>
        <div style={{position: 'fixed', top: 10, left: 10, zIndex: 99 }}>
          <button style={{backgroundColor: buildingSource.id === 'All' ? 'blue' : 'white', color: buildingSource.id === 'All' ? 'white' : 'black'}} onClick={this.getAllMap.bind(this)}>All</button>
          <button style={{backgroundColor: buildingSource.id === 'K3' ? 'blue' : 'white', color: buildingSource.id === 'K3' ? 'white' : 'black'}} onClick={this.getK3Map.bind(this)}>K3</button>
          <button style={{backgroundColor: buildingSource.id === 'K4' ? 'blue' : 'white', color: buildingSource.id === 'K4' ? 'white' : 'black'}} onClick={this.getK4Map.bind(this)}>K4</button>
          <button style={{backgroundColor: buildingSource.id === 'K5' ? 'blue' : 'white', color: buildingSource.id === 'K5' ? 'white' : 'black'}} onClick={this.getK5Map.bind(this)}>K5</button>
          <button style={{backgroundColor: buildingSource.id === 'K8' ? 'blue' : 'white', color: buildingSource.id === 'K8' ? 'white' : 'black'}} onClick={this.getK8Map.bind(this)}>K8</button>
        </div>
        <BuildingData map={this.state.buildingSource.map} getDefaultMap={this.getDefaultMap.bind(this)}/>
      </div>
    )
  }
}
