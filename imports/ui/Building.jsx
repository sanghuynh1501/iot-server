import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { createContainer } from 'react-meteor-data';
import __ from 'lodash';
import moment from 'moment';
import { Tasks } from '../api/tasks';
var request = require('request');

class Building extends React.Component {
    constructor(props) {
        super(props);
        this.state = {map: null}
    }

    componentDidMount() {
      if(!this.props.map) {
        this.props.getDefaultMap();
      }
    }

    render() {
      let map = this.props.map;

      if(map) {
        var myIcon = L.icon({
          iconUrl: 'camera.png',
          iconRetinaUrl: '/camera.png',
          iconSize: [38, 40],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76]
        });

        var marker = L.marker([12.269016881489472, 109.202015896930888], {
          title: "camera 01",
          indoorMapId: "EIM-3e83a79a-75e2-41fc-ad03-4fbb2b84e02b",
          indoorMapFloorIndex: 0,
          icon: myIcon
        }).addTo(map);
      }

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
          </div>
          <div id="map" style={{width: '100%', height: window.innerHeight - 100, paddingBottom: 19}}>
          </div>
        </div>
      )
    }
}

export default class BuildingManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buildingSource: {
        id: 'K3',
        map: ''
      }
    }
  }

  getDefaultMap() {
    let map = L.Wrld.map("map", "fd83c1cfc3b1317a0c697927fd36ef53", {
      center: [12.269016881489472, 109.202015896930888],
      zoom: 15,
      indoorsEnabled: true,
      coverageTreeManifest: 'https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-3e83a79a-75e2-41fc-ad03-4fbb2b84e02b_2017_09_28_03_40_12/webgl_manifest.bin.gz'
    });
    this.setState({buildingSource: {
      id: 'K3',
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
      coverageTreeManifest: 'https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-3e83a79a-75e2-41fc-ad03-4fbb2b84e02b_2017_09_28_03_40_12/webgl_manifest.bin.gz'
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
      coverageTreeManifest: 'https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-575e2d9a-8186-4005-9696-6a4acaac1356_2017_09_28_03_24_59/webgl_manifest.bin.gz'
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
      coverageTreeManifest: 'https://webgl-cdn1.wrld3d.com/chunk/indoor_maps/api_requests/EIM-703a10f2-e23e-4981-81bf-579497b46217_2017_09_29_02_36_39/webgl_manifest.bin.gz'
    });
    this.setState({buildingSource: {
      id: 'K5',
      map
    }});
  }


  render() {
    let { buildingSource } = this.state;
    return (
      <div>
        <div style={{position: 'fixed', top: 10, left: 10, zIndex: 99 }}>
          <button style={{backgroundColor: buildingSource.id === 'K3' ? 'blue' : 'white', color: buildingSource.id === 'K3' ? 'white' : 'black'}} onClick={this.getK3Map.bind(this)}>K3</button>
          <button style={{backgroundColor: buildingSource.id === 'K4' ? 'blue' : 'white', color: buildingSource.id === 'K4' ? 'white' : 'black'}} onClick={this.getK4Map.bind(this)}>K4</button>
          <button style={{backgroundColor: buildingSource.id === 'K5' ? 'blue' : 'white', color: buildingSource.id === 'K5' ? 'white' : 'black'}} onClick={this.getK5Map.bind(this)}>K5</button>
        </div>
        <Building map={this.state.buildingSource.map} getDefaultMap={this.getDefaultMap.bind(this)}/>
      </div>
    )
  }
}
