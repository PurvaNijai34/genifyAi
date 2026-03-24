import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState("free");

  const fetchUserData = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCredits(data.remainingCredits); 
      }

      setPlan(user?.publicMetadata?.plan || "free");

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ credits, plan, fetchUserData }}>
      {children}
    </AppContext.Provider>
  );
};


export const useAppContext = () => useContext(AppContext);