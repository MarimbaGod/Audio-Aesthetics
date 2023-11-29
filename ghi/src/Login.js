import React, { useState, useEffect} from 'react'


// Change the redirect Uri during deployment
const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=4d6c7eae97cd480fb1088393ebd8f107&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // Extract code from URL Query Params
        const getAuthorizationCode = () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('code');
        };

        const code = getAuthorizationCode();

        if (code) {
            // Send the code to backend to exchange for
            // Access Token
            fetch('/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Error fetching Spotify Token'
                        );
                    }
                    return response.json();
                })
                .then((data) => {
                    const { access_token } = data;
                    setAccessToken(access_token);
                    // More actions with that token
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);

    return (
        <div>
            {!accessToken ? (
                <a className="btn btn-success btn-lg" href={AUTH_URL}>
                    Login with Spotify
                </a>
            ) : (
                <div>
                    {/* Render Authenticated Content Here */}
                    <p>Access Token: {accessToken}</p>
                </div>
            )}
        </div>
    );
}


// const code = new URLSearchParams(window.location.search).get('code')

// function App() {
//   const [accessToken, setAccessToken] = useState(null);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");

//     if (code) {
//       fetch("/token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ code }),
//       })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Error fetching Spotify token");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const { access_token } = data;
//         setAccessToken(access_token);
//         // Handle Access Token and make authenticated requests
//       })
//       .catch((error) => {
//         console.error(error)
//       });
//     }
//   }, []);

//   return (
//     <div className="App">
//       {!accessToken ? (
//         <a className="btn btn-success btn-lg" href={AUTH_URL}>
//           Login with Spotify
//         </a>
//       ) : (
//         <div>
//           {/* Your authenticated content */}
//           <p>Access Token: {accessToken}</p>
//           {/* Display user playlists and songs */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


//   // return code ? <Dashboard code={code} /> : <Login />
