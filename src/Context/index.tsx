import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
interface User {
  data: {
    id: string;
    email: string;
    customerStripeId: string;
  } | null;
  error: string | null;
  loading: boolean;
}

const UserContext = createContext<
  [User, React.Dispatch<React.SetStateAction<User>>]
>([
  {
    data: null,
    loading: true,
    error: null,
  },
  () => {},
]);

// use for provider
const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>({
    data: null,
    loading: true,
    error: null,
  });
  const token = localStorage.getItem("token");
  //add this token to every single axios request that we do
  // it kind of add all of our request header to this
  if (token) {
    axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
  }

  const fetchUser = async () => {
    //use me identify and check token in session
    const { data: response } = await axios.get("http://localhost:8088/auth/me");
    console.log(response, "response");
    if (response.data.user && response.data) {
      setUser({
        data: {
          id: response.data.user.id,
          email: response.data.user.email,
          customerStripeId: response.data.user.customerStripeId,
        },
        loading: false,
        error: null,
      });
    } else if (response.data && response.data.errors.length) {
      setUser({
        data: null,
        loading: false,
        error: response.errors[0].msg,
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
