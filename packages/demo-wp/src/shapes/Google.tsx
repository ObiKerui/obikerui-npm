// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   googleLogout,
//   useGoogleLogin,
//   hasGrantedAnyScopeGoogle,
// } from '@react-oauth/google';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import jwt_decode from 'jwt-decode';

// import { gapi } from 'gapi-script';

// // GOOGLE DRIVE ACCESS
// // https://docs.google.com/spreadsheets/d/1oxlxEsTS4sk6baNq-m_QVDDgI5qMT_-dmDXAxJcGkYY/edit#gid=0

// const API_KEY = 'AIzaSyCPItFpBrogKuMF_58mm6SXyA0rY5c9E30';
// const CLIENT_ID =
//   '506002570270-6cqvj29r485c5b38f10fbutnnmviohs5.apps.googleusercontent.com';

// // Array of API discovery doc URLs for APIs
// const DISCOVERY_DOCS = [
//   'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
// ];

// // Authorization scopes required by the API; multiple scopes can be
// // included, separated by spaces.
// const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

// const FILE_ID = '1oxlxEsTS4sk6baNq-m_QVDDgI5qMT_-dmDXAxJcGkYY';
// const SHEET_NAME = 'TestSheet';

// // PASTED
// /**
//  *  Initializes the API client library and sets up sign-in state
//  *  listeners.
//  */
// const initClient = () => {
//   // setIsLoadingGoogleDriveApi(true);
//   gapi.client
//     .init({
//       apiKey: API_KEY,
//       clientId: CLIENT_ID,
//       discoveryDocs: DISCOVERY_DOCS,
//       scope: SCOPES,
//     })
//     .then(
//       () => {
//         // Listen for sign-in state changes.
//         gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

//         // Handle the initial sign-in state.
//         updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//       },
//       (error) => {}
//     );
// };

// // PASTED

// async function getSheet(axiosInstance: any, fileId: string) {
//   const response = await axiosInstance.get(
//     `/sheets/v4/spreadsheets/${fileId}/values/Sheet1`,
//     {
//       params: {
//         // Specify the range you want to read, e.g., 'A1:D10'
//         range: 'A1:E2',
//       },
//     }
//   );
//   return response;
// }

// async function getSheetInfo(axiosInstance: any) {
//   // Step 1: Access Google Drive to locate the Google Sheet
//   return axiosInstance.get('/drive/v3/files');
// }

// // async function getSheetInfo(
// //   axiosInstance: any,
// //   googleSheetName: string,
// //   fields: string
// // ) {
// //   // Step 1: Access Google Drive to locate the Google Sheet
// //   return axiosInstance.get('/drive/v3/files', {
// //     params: {
// //       q: "name='TestSheet'",
// //       fields: 'files(id, name)',
// //     },
// //   });
// // }

// function createAxiosInstance(accessToken: string) {
//   // Set up Axios to include the access token in the request headers
//   return axios.create({
//     baseURL: 'https://www.googleapis.com',
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       Accept: 'application/json',
//     },
//   });
// }

// // // Step 1: Access Google Drive to locate the Google Sheet
// // axiosInstance.get('/drive/v3/files', {
// //   params: {
// //     q: "name='Your Google Sheet Name'",
// //     fields: 'files(id, name)',
// //   },
// // })
// // .then((driveResponse) => {
// //   // Assuming you found the file, get its ID
// //   const fileId = driveResponse.data.files[0].id;

// //   // Step 2: Access Google Sheets API to read data
// //   axiosInstance.get(`/sheets/v4/spreadsheets/${fileId}/values/Sheet1`, {
// //     params: {
// //       // Specify the range you want to read, e.g., 'A1:D10'
// //       range: 'A1:D10',
// //     },
// //   })
// //     .then((sheetsResponse) => {
// //       const values = sheetsResponse.data.values;
// //       console.log('Data from Google Sheets:', values);
// //     })
// //     .catch((sheetsError) => {
// //       console.error('Error reading Google Sheets data:', sheetsError);
// //     });
// // })
// // .catch((driveError) => {
// //   console.error('Error accessing Google Drive:', driveError);
// // });

// // GOOGLE DRIVE ACCESS

// async function getGoogleData(url: string, accessToken: string) {
//   const response = await axios.get(url, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       Accept: 'application/json',
//     },
//   });
//   return response;
// }

// function GoogleAccess() {}

// // function GoogleAccess() {
// //   const [profile, setProfile] = useState<any>(() => {
// //     const savedProfile = localStorage.getItem('profile');
// //     const parsedProfile = savedProfile ? JSON.parse(savedProfile) : null;
// //     return parsedProfile;
// //   });

// //   const [loading, setLoading] = useState<boolean>(false);

// //   const profileUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
// //   //   const userInfoUrl = 'https://www.googleapis.com/oauth2/v1/userinfo';
// //   //   const driveUrl = 'https://www.googleapis.com/drive/v3/about';

// //   const login = useGoogleLogin({
// //     onSuccess: (tokenResponse: any) => {
// //       if (tokenResponse?.access_token) {
// //         getGoogleData(profileUrl, tokenResponse.access_token).then(
// //           (response: any) => {
// //             const profileData = {
// //               ...response.data,
// //               access_token: tokenResponse.access_token,
// //             };
// //             localStorage.setItem('profile', JSON.stringify(profileData));
// //             setProfile(profileData);
// //             const hasAccess = hasGrantedAnyScopeGoogle(
// //               tokenResponse,
// //               'https://www.googleapis.com/auth/spreadsheets',
// //               'https://www.googleapis.com/auth/drive'
// //             );

// //             console.log('do we have scope access: ', hasAccess);
// //           }
// //         );
// //       }
// //       // setGoogleAccessToken(tokenResponse);
// //       setLoading(false);
// //     },
// //     onError: (errResponse: any) => {
// //       console.log('received error response logging into google: ', errResponse);
// //       setLoading(false);
// //     },
// //   });

// //   const doLogin = () => {
// //     setLoading(true);
// //     login();
// //   };

// //   const logOut = () => {
// //     googleLogout();
// //     localStorage.removeItem('profile');
// //     setProfile(null);
// //   };

// //   const getSheetData = () => {
// //     const accessToken = profile?.access_token;
// //     if (!accessToken) {
// //       return;
// //     }
// //     const axiosInst = createAxiosInstance(accessToken);
// //     // getSheetInfo(axiosInst).then((response: any) => {
// //     //   console.log('response: ', response);
// //     // });
// //     getSheet(axiosInst, FILE_ID)
// //       .then((response: any) => {
// //         console.log('response is: ', response);
// //       })
// //       .catch(console.error);
// //   };

// //   return (
// //     <div>
// //       {loading && <div>loading</div>}
// //       {profile && (
// //         <div>
// //           {JSON.stringify(profile)}{' '}
// //           <button type="button" onClick={() => logOut()}>
// //             logout
// //           </button>
// //           <button type="button" onClick={() => getSheetData()}>
// //             get sheet data
// //           </button>
// //         </div>
// //       )}
// //       {!profile && (
// //         <div>
// //           <button type="button" onClick={() => doLogin()}>
// //             do login
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// export default GoogleAccess;
