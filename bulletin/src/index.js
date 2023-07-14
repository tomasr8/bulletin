import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "explore",
//       },
//       {
//         path: 'covers',
//         element: <Look />
//       },
//       {
//         path
//       }
//     ],
//   },
//   {
//     path: ["/", "/explore"],
//     element: <App />,
//   },
//   {
//     path: "/history",
//     element: <Look />,
//   },
//   {
//     path: "/articles",
//     element: <Article />,
//   },
// ]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* <RouterProvider router={router} /> */}
  </React.StrictMode>
);
