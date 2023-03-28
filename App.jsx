import React, { useState, memo, useMemo } from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GDrive,
  MimeTypes
} from "@robinbobin/react-native-google-drive-api-wrapper";
import data from './data';
import baseData from './baseData'

const App = () => {

  const [userInfo, setUserInfo] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState(null)

  const GoogleLogin = async () => {
    GoogleSignin.configure({
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/drive'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '1080007918159-h5nlv53r79vgb2h6mputv0ucgj46s768.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true,
    });
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo)
      setIsLoggedIn(true)
      const { idToken } = userInfo
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential); 
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
  };

  const onGoogleDrive = async () => {
    const gdrive = new GDrive();
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;

    console.log('Parjanya1');
const id = (await gdrive.files.newMultipartUploader()
  .setData('Hello @Housing', MimeTypes.TEXT)
  .setRequestBody({
    name: "RN-Drive-AppTxtV11"
  })
  .execute()
).id;

console.log('Parjanya2', id);
await gdrive.files.getText(`${id}`).then((val) => {
  console.log('Parjanya2', val)
},
(error) => console.log('ParjanyaError', error)
);
  }

  const onSignOut = async () => {
    try {
      await GoogleSignin.signOut()
      setUserInfo(null)
      setIsLoggedIn(false)
    } catch (error) {
      console.error(error);
    }

  }

  const renderUserDetails = useMemo(() => {
    if (!isLoggedIn) 
    return null
    return (
<View style={{ alignItems:'center', justifyContent: 'center', marginBottom: 40 }} >
          <Image source={{uri: userInfo?.user?.photo}}  style={{ height: 80, width: 80 }}  />
          <Text style={{ paddingBottom: 8, fontSize: 22, color: 'blue' }}>
          {`${userInfo?.user?.name}`}
        </Text><Text style={{ paddingBottom: 30, fontSize: 22, color: 'white' }}>
            {`${userInfo?.user?.email}`}
          </Text>
        </View>
    )

  }, [isLoggedIn])

  return (
    <SafeAreaView style={{ alignItems:'center', justifyContent: 'center', flex: 1, backgroundColor: 'pink' }} >
      {renderUserDetails}
      <TouchableOpacity onPress={GoogleLogin} >
        <Text>
          {'Sign In With Google'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onGoogleDrive} >
        <Text>
          {'Google Drive'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSignOut} >
        <Text>
          {'Sign Out'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default memo(App);