
import React, { createRef, Component } from 'react'
import {Redirect } from 'react-router-dom';
import { Button} from 'reactstrap';
import {Map, TileLayer,Popup,FeatureGroup,LayersControl,LayerGroup,Marker, GeoJSON } from 'react-leaflet'
import L from 'leaflet';

import "./App.css";
import "leaflet/dist/leaflet.css";

const { BaseLayer, Overlay } = LayersControl
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default class County extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      statetoshow:"Alabama",
      redirectTo:false,
      lat: 0,
      lng: 0,
      county:""
    };
    this.onEachFeature = this.onEachFeature.bind(this);
    this.mapRef = createRef();
    this.groupRef = createRef();
  }

  componentDidMount() {
    this.fetchData();
   }
   onClickButtonRedirectForm(){
    this.setState({
      redirectTo:true,
     });
   }
 
   fetchData() {
     let request = fetch("./us20m.json");
 
     request
       .then(r => r.json())
       .then(json => {  
         // eslint-disable-next-line
         if(this.props.location.state== undefined){
          this.setState({
            redirectTo:true,
           });
         }else{

           this.setState({
             data: json.features,
             statetoshow:this.props.location.state
            },()=>{
              const map = this.mapRef.current.leafletElement;
              const group = this.groupRef.current.leafletElement;
              map.fitBounds(group.getBounds());
            });
         }      
       }, (error) => {
         console.error(error);
       });
   }

   myStyle = () => {
    return {
      color: "red",
      weight: 3,
      opacity: 0.4,
      fillColor: "red",
      dashArray: '8 5'
    }
  }

  onEachFeature(e) {
    this.setState({
      county:e.layer.feature.properties.NAME,
      lat: e.latlng.lat,
      lng: e.latlng.lng

    });

  }
  render() {
    if (this.state.redirectTo) {
      return(
          <Redirect to={'/'}/>
      )
  }
    return (
      <>

      <Map  
      ref={this.mapRef}
          >
        <LayersControl position="topright">

          <BaseLayer checked name="Map">
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>
          
          <Overlay checked name="Counties">
          <LayerGroup> {
            this.state.lat && <Marker position={[this.state.lat,this.state.lng]}>
                  <Popup  >
                      <div className="popup-content">                                  
                          <strong>State :</strong> {this.state.statetoshow} 
                          <br/>
                          <strong>County :</strong> {this.state.county}
                          <br/>
                          <br/>
                          <br/>
                      <Button onClick={()=>this.onClickButtonRedirectForm()} block color="danger">BACK</Button>
                      <Button onClick={()=>this.onClickButtonRedirectForm()} block color="success">LINK</Button>
                      </div>
                      
                  </Popup>
              </Marker>
              } </LayerGroup>
              </Overlay>

              <FeatureGroup 
              ref={this.groupRef}>
              
            {// eslint-disable-next-line
             this.state.data.map(f => {
            // eslint-disable-next-line
              if(f.properties.STATE_NAME==this.state.statetoshow){

                return <GeoJSON key={f.properties.GEO_ID} data={f} style={this.myStyle} onClick={this.onEachFeature}/>
              }
            })}
          </FeatureGroup>

          </LayersControl>
          </Map>
        
      </>
    )
  }
}
