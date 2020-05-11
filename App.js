/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
} from 'react-native';
import { Card, CardItem, Body, Icon, Item, Picker } from 'native-base';
import { PieChart } from 'react-native-svg-charts';
import MapView, { Marker } from 'react-native-maps';
import AnimatedLoader from "react-native-animated-loader";
import Apimanager from './app/data/api';

class App extends Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.markerRef = null;
    this.state = {
      isloading: true,
      source: 'jhu',
      countryid: "ID",
      country: "Indonesia",
      infected: { confirmed: 0, sick: 0, deaths: 0, recovered: 0 },
      piecolor: ['#ff8040', '#ff0000', '#00df00'],
      marker: [],
      countrylist: []
    }
  }

  componentDidMount = async () => {
    await this.getAllCountry()
  }

  getData = async (countryid) => {
    this.setState({ isloading: true })

    let collection = {}
    collection.source = this.state.source
    if (countryid != "GLOBAL") {
      collection.country_code = countryid
    }
    await Apimanager.getLocations(collection)
      .then(response => {
        if (response.status == 'success') {
          this.parseData(response.value, countryid);
        } else {
          this.setState({ isloading: false });
          alert(response.value);
        }
      });
  }

  getAllCountry = async () => {
    await Apimanager.getLocations({ "source": this.state.source })
      .then(response => {
        if (response.status == 'success') {
          let result = response.value.json();

          let countrylist = [];
          let cidtemp = "";
          result.locations.map(value => {
            if (value.country_code != cidtemp) {
              countrylist.push({
                countrycode: value.country_code,
                country: value.country
              })
              cidtemp = value.country_code
            }
          });

          this.setState({
            countrylist: countrylist,
          });

          this.getData(this.state.countryid);
        } else {
          this.setState({ isloading: false });
          alert(response.value);
        }
      });
  }

  parseData = (response, countryid) => {
    let result = response.json()
    let infected = {
      confirmed: result.latest.confirmed,
      sick: result.latest.confirmed - (result.latest.deaths + result.latest.recovered),
      deaths: result.latest.deaths,
      recovered: result.latest.recovered
    }

    let countryname = result.locations[0].country
    let marker = []

    if (countryid != 'GLOBAL') {
      result.locations.map(value => {
        marker.push({
          countrycode: value.country_code,
          latlng: value.coordinates,
          latest: value.latest,
          province: value.province,
          country: value.country
        })
      });
    } else {
      countryname = 'GLOBAL'
      this.setState({ isloading: false })
    }

    this.setState({
      infected: infected,
      marker: marker,
      countryid: countryid,
      country: countryname,
    });
  }

  renderCallout() {
    this.markerRef.showCallout();
    this.setState({ isloading: false });
  }

  render() {
    const numbeformat = require('./app/helper/number');
    const data = [this.state.infected.sick, this.state.infected.deaths, this.state.infected.recovered];
    const pieData = data.map((value, index) => ({
      value,
      svg: {
        fill: this.state.piecolor[index]
      },
      key: index
    }));
    return (
      <>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View style={styles.container}>
          <AnimatedLoader
            visible={this.state.isloading}
            overlayColor="rgba(0,0,0,0.8)"
            source={require("./assets/json/greencovid.json")}
            animationStyle={{ width: 100, height: 100 }}
            speed={1}
          />
          <Card style={styles.regionpicker}>
            <Text style={{ alignSelf: 'flex-start', margin: 5 }}>Select Region</Text>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                selectedValue={this.state.countryid}
                onValueChange={(value) => this.getData(value)}
              >
                <Picker.Item key={"GLOBAL"} label="Global" value="GLOBAL" />
                {this.state.countrylist
                  .map(item => (
                    <Picker.Item key={item.countrycode} label={item.country} value={item.countrycode} />
                  ))}
              </Picker>
            </Item>
          </Card>
          <Card style={styles.highlight}>
            <CardItem header>
              <Text style={styles.countrytext}>{this.state.country}</Text>
              <Text style={styles.confirmedtext}> {numbeformat(this.state.infected.confirmed)} confirmed</Text>
            </CardItem>
            <CardItem>
              <Body>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.piechart}>
                    <PieChart style={{ height: 100 }} data={pieData} />
                  </View>
                  <View style={styles.legendchart}>
                    <View style={styles.legenditem}>
                      <View style={{ backgroundColor: this.state.piecolor[0], width: 10, height: 10, marginRight: 5 }} />
                      <Text>Infected: {numbeformat(this.state.infected.sick)}</Text>
                    </View>
                    <View style={styles.legenditem}>
                      <View style={{ backgroundColor: this.state.piecolor[1], width: 10, height: 10, marginRight: 5 }} />
                      <Text>Death: {numbeformat(this.state.infected.deaths)}</Text>
                    </View>
                    <View style={styles.legenditem}>
                      <View style={{ backgroundColor: this.state.piecolor[2], width: 10, height: 10, marginRight: 5 }} />
                      <Text>Recovered: {numbeformat(this.state.infected.recovered)}</Text>
                    </View>
                  </View>
                </View>
              </Body>
            </CardItem>
          </Card>
          {this.state.marker.length > 0 ?
            <MapView
              style={{ flex: 1 }}
              ref={(ref) => { this.mapRef = ref }}
              customMapStyle={require('./assets/json/mapstyle.json')}
              moveOnMarkerPress={false}
              region={{
                latitude: parseFloat(this.state.marker[0].latlng.latitude),
                longitude: parseFloat(this.state.marker[0].latlng.longitude),
                latitudeDelta: 30.0000,
                longitudeDelta: 30.0000,
              }}
              onRegionChangeComplete={() => this.renderCallout()}>
              {this.state.marker.map((item, index) => (
                <Marker
                  key={index}
                  ref={(ref) => { this.markerRef = ref }}
                  coordinate={{
                    latitude: parseFloat(item.latlng.latitude),
                    longitude: parseFloat(item.latlng.longitude),
                  }}
                  title={item.province + " " + item.country}
                  description={"Confirmed: " + numbeformat(item.latest.confirmed)}>
                  <Image source={require('./assets/images/pin.png')} style={{ width: 30, height: 30 }} />
                </Marker>
              ))}
            </MapView>
            :
            <MapView
              style={{ flex: 1 }}
              ref={(ref) => { this.mapRef = ref }}
              customMapStyle={require('./assets/json/mapstyle.json')}
              moveOnMarkerPress={false}
            />
          }
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  regionpicker: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 25,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    padding: 10
  },
  highlight: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 25,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  countrytext: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  confirmedtext: {
    fontSize: 18
  },
  piechart: {
    flex: 1
  },
  legendchart: {
    flex: 1.5,
    marginLeft: 5
  },
  legenditem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5
  }
});

export default App;