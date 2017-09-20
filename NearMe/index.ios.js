/**
  Código-exemplo do Workshop de RN UFRJ
**/
// Imports dos elementos utilizados.
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity
} from 'react-native';

export default class NearMe extends Component {
  // Inicializa as variaveis de estado.
  state = {
    photos: [],
    lat: '',
    lng: '',
  }
  // Este método é chamado toda vez que o componente vai ser exibido na tela.
  componentWillMount(){
    this.getCurrentLocation();
  }
  /* 
    Pega a posição do usuário usando o GPS
    Caso dê certo, retorna a position.
    Se der errado, exibe um alerta.
  */
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

  // Método que acessa a API do instagram e pega as fotos recentes próximas de um local.
  getPhotosNearMe = async () => {
    const lat = this.state.lat;
    const lng = this.state.lng;

    // Linha que acessa a API.
    const response = await fetch(`https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&access_token=52980424.ba4c844.3858d3cfc6dd40d4b3528e72e2deea6e&distance=5000`);
    const apiData= await response.json();

    // Limpa o array recebido para usar apenas a URL.
    const photos = apiData.data.map((photo) => {
      return { url: photo.images.standard_resolution.url }
    })

    // Altera o estado com as fotos recebidas.
    this.setState({ 
      photos
    })
  }

  // Método responsável por converter o array de fotos em um array de componentes React.
  renderPhotos = () => {
    const photoComponents = this.state.photos.map((photo)=>{
      return (
        <Image key={photo.url} source={{uri: photo.url}} style={[styles.photo, {width: '90%', height: 300}]}/>
      )
    })
    return photoComponents;
  }

  // Este método é chamado toda vez que uma variável de estado é modificada.
  render() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
        <Text style={styles.text}>{`Lat=${this.state.lat} Lng=${this.state.lng}`}</Text>
        <TouchableOpacity style={styles.button} onPress={this.getPhotosNearMe}>
          <Text style={styles.text}>Procurar</Text>
        </TouchableOpacity>
        {this.renderPhotos()}
      </ScrollView>
    );
  }
}

// Variável responsável por lidar com os estilos dos components acima.
const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#272932',
  },
  button: {
    height: 40,
    width: 100,
    margin: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F7173',
  },
  text: {
    color: 'white',
  },
  photo: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#666',
  },
});

// Esta linha define qual é a tela inicial do aplicativo.
AppRegistry.registerComponent('NearMe', () => NearMe);
