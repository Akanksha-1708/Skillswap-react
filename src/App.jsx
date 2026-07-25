// function app() : normal js function
// function App() : function treated as react component
// react draws everything inside return( " mix of js and html" )
// <> </> is react fragment, acts as an invisible box
//<Navbar/> is a way of calling Navbar component

import Chat from "@/pages/Chat/Chat";
import EditProfile from "./pages/EditProfile/EditProfile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProfileSetup from "./pages/ProfileSetup/ProfileSetup";
import BrowseSkills from "./pages/BrowseSkills/BrowseSkills";
import PublicProfile from "./pages/PublicProfile/PublicProfile";
import Requests from "@/pages/Requests/Requests";
import MyWorkspaces from "./pages/MyWorkspaces/MyWorkspaces";
import SentRequests from "@/pages/SentRequests/SentRequests";
import LearningWorkspace from "@/pages/LearningWorkspace/LearningWorkspace";
import AIMatches from "./pages/AIMatches/AIMatches";
import SettingsPage from "./pages/Settings/Settings";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
              </ProtectedRoute>
            }/>

          <Route path="/profile-setup" element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } />

          <Route path="/edit-profile" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />

          <Route path="/skills" element={
            <ProtectedRoute>
              <BrowseSkills/>
            </ProtectedRoute>
          } />

          <Route path="/profile/:userId" element={
            <ProtectedRoute>
              <PublicProfile/>
            </ProtectedRoute>
          }/>

          <Route path="/requests" element={
            <ProtectedRoute>
              <Requests/>
            </ProtectedRoute>
            }/>

          <Route path="/sent-requests"
          element={
            <ProtectedRoute>
              <SentRequests/>
            </ProtectedRoute>
          }/>

          <Route path="/chat/:userId" element={
            <ProtectedRoute>
              <Chat/>
            </ProtectedRoute>
          }/>

          <Route path="/workspace/:workspaceId"
          element={
            <ProtectedRoute>
              <LearningWorkspace/>
            </ProtectedRoute>
          }/>

          <Route 
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage/>
            </ProtectedRoute>
          }/>

        <Route
        path="/my-workspaces"
        element={
        <ProtectedRoute>
        <MyWorkspaces />
        </ProtectedRoute>
        }
        />

        <Route 
        path="/ai-matches"
        element={
          <ProtectedRoute>
            <AIMatches/>
          </ProtectedRoute>
        }/>
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;