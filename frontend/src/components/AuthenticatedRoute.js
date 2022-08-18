import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";

// This component creates a Route where its children are rendered only if the user is authenticated.
// Its properties are child Components and it returns a Route.
// We'd use this for child pages requiring auth like NewNote, Settings, etc.
export default function AuthenticatedRoute({ children }) {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    // return Redirect component, and allow return to requested page after auth
    return <Navigate to={`/login?redirect=${pathname}${search}`} />;
  }

  return children;
}