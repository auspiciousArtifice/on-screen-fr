/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function postRequest(pictureUri: string) : void {
  let body = new FormData();
  body.append('picture', {uri: pictureUri, name: 'test.jpg', filename: 'test.jpg', type: 'image/jpeg'});
  body.append('Content-Type', 'image/jpeg');

  fetch('http://127.0.0.1:5000/search', {
  method: 'POST',
  body: body,
  headers: {
    'content-type': 'multipart/form-data'
  }
  })
  .then((response) => response)
  .then((result) => {
    console.log('Success:', result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function HomeScreen({navigation}) {
  const onPressHandler = () => {
    navigation.navigate('CameraScreen');
  }
  return (
    <SafeAreaView style={styles.home} edges={['left', 'right', 'bottom']}>
      <Text style={styles.text}>
        Welcome to On-Screen Face Recognition. Begin by taking a picture of an actor.
      </Text>
      <Button 
      title="Take Picture"
      onPress={onPressHandler}
      />
    </SafeAreaView>
  )
}

function CameraScreen({navigation}) {
  const [{ cameraRef }, { takePicture }] = useCamera(null);
  const captureHandle = async () => {
    try {
      const data = await takePicture();
      console.log(data.uri);
      postRequest(data.uri);
      navigation.replace('InfoScreen', {
        imageUri: data.uri,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={styles.preview}
      >
      </RNCamera>
      <Button 
        title="Capture"
        onPress={captureHandle}
      />
    </SafeAreaView>
  )
}

function InfoScreen({route, navigation}) {
  const imageUri: string = route.params.imageUri;
  const onPressHomeHandler = () => {
    navigation.navigate('HomeScreen');
  }
  const onPressCameraHandler = () => {
    navigation.navigate('CameraScreen');
  }
  console.log(imageUri);
  return (
    <SafeAreaView style={styles.info} edges={['left', 'right', 'bottom']}>
      <Text style={styles.text}>
        Insert name of guessed person here
      </Text>
      <Image 
        // source={require('./patrick.jpg')}
        source={{uri: route.params.imageUri}}
        style={{width: 300, height: 300}}
      />
      <Text style={styles.text}>
        Placeholder for relevant links
      </Text>
      <Button 
      title="Take Another Photo"
      onPress={onPressCameraHandler}
      />
      <Button 
      title="Return to Home"
      onPress={onPressHomeHandler}
      />
    </SafeAreaView>
  )
}

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerTitle: 'OSFR',
          }}
          />
          <Stack.Screen 
          name="CameraScreen"
          component={CameraScreen}
          options={{
            header: () => null,
          }}
          />
          <Stack.Screen
          name="InfoScreen"
          component={InfoScreen}
          options={{
            header: () => null,
          }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  info: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})

export default App;
