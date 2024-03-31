import Login from './pages/Login.jsx'; // Import the Login component
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route components from react-router-dom
import Signup from './pages/Signup.jsx'; // Import the Signup component
import Homepage from './pages/Homepage.jsx'; // Import the Homepage component
import MyProfile from './pages/MyProfile.jsx'; // Import the MyProfile component
import TweetPage from './pages/TweetPage.jsx'; // Import the TweetPage component

import { ToastContainer } from 'react-toastify'; // Import ToastContainer component from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import UsersProfile from './pages/UsersProfile.jsx'; // Import the UsersProfile component
import './index.css'; // Import custom CSS file
import AuthLayout from './layout/AuthLayout.jsx'; // Import the AuthLayout component

function App() {
  return (
    <>
      {/* Define the routes for the application */}
      <Routes>
        {/* Wrap routes in AuthLayout component */}
        <Route element={<AuthLayout />}>
          {/* Route for Login component */}
          <Route exact path='/' element={<Login />} />
          {/* Route for Signup component */}
          <Route exact path='/signup' element={<Signup />} />
        </Route>
        {/* Route for Homepage component */}
        <Route exact path='/home' element={<Homepage />} />
        {/* Route for MyProfile component */}
        <Route exact path='/my-profile' element={<MyProfile />} />
        {/* Route for UsersProfile component with dynamic user ID */}
        <Route exact path='/user-profile/:id' element={<UsersProfile />} />
        {/* Route for TweetPage component with dynamic tweet ID */}
        <Route exact path='/tweet/:id' element={<TweetPage />} />
      </Routes>
      {/* Display toast notifications */}
      <ToastContainer autoClose={600} />
    </>
  );
}

export default App; // Export the App component as the default export
