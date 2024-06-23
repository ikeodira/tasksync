// import { AuthBindings } from "@refinedev/core";

// import { API_URL, dataProvider } from "./data";

// // For demo purposes and to make it easier to test the app, you can use the following credentials
// export const authCredentials = {
//   email: "michael.scott@dundermifflin.com",
// //   email: "ike.odiratech.com",
//   password: "demodemo",
// };

// export const authProvider: AuthBindings = {
//   login: async ({ email }) => {
//     try {
//       // call the login mutation
//       // dataProvider.custom is used to make a custom request to the GraphQL API
//       // this will call dataProvider which will go through the fetchWrapper function
//       const { data } = await dataProvider.custom({
//         url: API_URL,
//         method: "post",
//         headers: {},
//         meta: {
//           variables: { email },
//           // pass the email to see if the user exists and if so, return the accessToken
//           rawQuery: `
//             mutation Login($email: String!) {
//               login(loginInput: { email: $email }) {
//                 accessToken
//               }
//             }
//           `,
//         },
//       });

//       // save the accessToken in localStorage
//       localStorage.setItem("access_token", data.login.accessToken);

//       return {
//         success: true,
//         redirectTo: "/",
//       };
//     } catch (e) {
//       const error = e as Error;

//       return {
//         success: false,
//         error: {
//           message: "message" in error ? error.message : "Login failed",
//           name: "name" in error ? error.name : "Invalid email or password",
//         },
//       };
//     }
//   },

//   // simply remove the accessToken from localStorage for the logout
//   logout: async () => {
//     localStorage.removeItem("access_token");

//     return {
//       success: true,
//       redirectTo: "/login",
//     };
//   },

//   onError: async (error) => {
//     // a check to see if the error is an authentication error
//     // if so, set logout to true
//     if (error.statusCode === "UNAUTHENTICATED") {
//       return {
//         logout: true,
//         ...error,
//       };
//     }

//     return { error };
//   },

//   check: async () => {
//     try {
//       //  get the identity of the user
//       // this is to know if the user is authenticated or not
//       await dataProvider.custom({
//         url: API_URL,
//         method: "post",
//         headers: {},
//         meta: {
//           rawQuery: `
//             query Me {
//               me {
//                 name
//               }
//             }
//           `,
//         },
//       });

//       // if the user is authenticated, redirect to the home page
//       return {
//         authenticated: true,
//         redirectTo: "/",
//       };
//     } catch (error) {
//       // for any other error, redirect to the login page
//       return {
//         authenticated: false,
//         redirectTo: "/login",
//       };
//     }
//   },

//   // get the user information
//   getIdentity: async () => {
//     const accessToken = localStorage.getItem("access_token");

//     try {
//       // call the GraphQL API to get the user information
//       // we're using me:any because the GraphQL API doesn't have a type for the me query yet.
//       // we'll add some queries and mutations later and change this to User which will be generated by codegen.
//       const { data } = await dataProvider.custom<{ me: any }>({
//         url: API_URL,
//         method: "post",
//         headers: accessToken
//           ? {
//               // send the accessToken in the Authorization header
//               Authorization: `Bearer ${accessToken}`,
//             }
//           : {},
//         meta: {
//           // get the user information such as name, email, etc.
//           rawQuery: `
//             query Me {
//               me {
//                 id
//                 name
//                 email
//                 phone
//                 jobTitle
//                 timezone
//                 avatarUrl
//               }
//             }
//           `,
//         },
//       });

//       return data.me;
//     } catch (error) {
//       return undefined;
//     }
//   },
// };


import { AuthBindings } from "@refinedev/core";
import { API_URL, dataProvider } from "./data";

export const authCredentials = {
  email: "michael.scott@dundermifflin.com",
  password: "demodemo",
};

export const authProvider: AuthBindings = {
  login: async ({ email }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);
      console.log("Login successful, token saved:", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;
      console.error("Login error:", error);

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem("access_token");
    console.log("Logged out, token removed");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      console.log("Unauthenticated error:", error);
      return {
        logout: true,
        ...error,
      };
    }

    console.error("Error:", error);
    return { error };
  },

  check: async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.log("No access token found, redirecting to login");
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        meta: {
          rawQuery: `
            query Me {
              me {
                name
              }
            }
          `,
        },
      });

      console.log("User authenticated");
      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Authentication check error:", error);
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.log("No access token for getIdentity");
      return undefined;
    }

    try {
      const { data } = await dataProvider.custom<{ me: any }>({
        url: API_URL,
        method: "post",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        meta: {
          rawQuery: `
            query Me {
              me {
                id
                name
                email
                phone
                jobTitle
                timezone
                avatarUrl
              }
            }
          `,
        },
      });

      console.log("User identity retrieved:", data.me);
      return data.me;
    } catch (error) {
      console.error("Get identity error:", error);
      return undefined;
    }
  },
};