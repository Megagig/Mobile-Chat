import {
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from 'react';

type AuthUserType = {
  id: string;
  fullName: string;
  email: string;
  profilePic: string;
  gender: string;
};

const AuthContext = createContext<{
  authuser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
}>({
  authuser: null,
  setAuthUser: () => {},
  isLoading: true,
});

//eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authuser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect to check if user is logged in and set the authuser state
  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const response = await fetch('/api/v1/auth/current-user');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }
        if (response.ok) {
          setAuthUser(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authuser, setAuthUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
