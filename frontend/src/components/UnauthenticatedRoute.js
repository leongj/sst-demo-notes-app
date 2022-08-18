import React, { cloneElement } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";

function querystring(name, url = window.location.href) {
  const parsedName = name.replace(/[[]]/g, "\\$&");
  const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, "i");
  const results = regex.exec(url);
  console.log(
    "name: " + name + "\n" +
    "parsedName: " + parsedName + "\n" +
    "url: " + url + "\n" +
    "results: " + results
  );

  if (!results || !results[2]) {
    return false;
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Similar to AuthenticatedRoute, but use it for pages not requiring Auth
// e.g. Login, Signup
export default function UnauthenticatedRoute(props) {
  const { isAuthenticated } = useAppContext();
  const { children } = props;
  const redirect = querystring("redirect");

  if (isAuthenticated) {
    return <Navigate to={redirect || "/"} />;
  }

  // cloneElement ensures that passed in state is handled correctly for child components
  return cloneElement(children, props);
}