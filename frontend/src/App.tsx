import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { useAuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const { authuser, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={authuser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authuser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authuser ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
