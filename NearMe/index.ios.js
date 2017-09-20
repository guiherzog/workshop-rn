/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  LayoutAnimation,
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  Alert,
  ScrollView,
  TouchableOpacity
} from 'react-native';

export default class NearMe extends Component {
  state = {
    photos: [],
    lat: '',
    lng: '',
  }

  componentWillMount(){
    this.getCurrentLocation();
  }

  // Caso dê certo, retorna a position.
  // Se der errado, exibe um alerta.
  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        this.setState({
          lat: pos.latitude,
          lng: pos.longitude, 
        });
      },
      () => Alert.alert('Erro no GPS'),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  getPhotosNearMe = async () => {
    const lat = this.state.lat;
    const lng = this.state.lng;
    const response = await fetch(`https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&access_token=52980424.ba4c844.3858d3cfc6dd40d4b3528e72e2deea6e&distance=5000`);
    const apiData= await response.json();

    const photos = apiData.data.map((photo) => {
      return { url: photo.images.standard_resolution.url }
    })

    this.setState({ 
      photos
    })
  }

  renderPhotos = () => {
    const photoComponents = this.state.photos.map((photo)=>{
      return (
        <Image key={photo.url} source={{uri: photo.url}} style={[styles.photo, {width: '90%', height: 300}]}/>
      )
    })
    console.log(photoComponents);
    return photoComponents;
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
        {this.renderPhotos()}
        <Text style={styles.btnText}>{`${this.state.lat} ${this.state.lng}`}</Text>
        <TouchableOpacity style={styles.button} onPress={this.getPhotosNearMe} >
          <Text style={styles.btnText}>Procurar</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#272932',
  },
  button: {
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    margin: 10,
    justifyContent: 'center',
    width: 100,
    backgroundColor: '#0F7173',
  },
  btnText: {
    color: 'white',
  },
  photo: {
    borderRadius: 10,
    marginVertical: 10,
  },
});

AppRegistry.registerComponent('NearMe', () => NearMe);
