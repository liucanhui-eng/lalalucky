import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { getUserInfo, isIIAuthenticated, clearCachedUserInfo, getCachedUserInfo } from '../../common/ic-client';

const UserContext = createContext(null);

function userUserValue() {
  const [userInfo, setUserInfo] = useState({});

  const updateUserInfo = async () => {
    const isAuthenticated = await isIIAuthenticated();
    let _userInfo;
    if (!isAuthenticated) {
      _userInfo = await getCachedUserInfo();
    } else {
      _userInfo = await getUserInfo();
    }
    setUserInfo(_userInfo);
  };

  useEffect(() => {
    isIIAuthenticated()
      .then((isAuthenticated) => {
        if (isAuthenticated) {
          getUserInfo(true)
            .then((userInfo) => {
              setUserInfo(userInfo);
            });
        }
      });
  }, [])


  return useMemo(() => ({
    ...userInfo,
    isLogin: () => isIIAuthenticated(),
    update: async () => {
      return updateUserInfo();
    },
    updateFromCache: async () => {
      const _userInfo = await getCachedUserInfo();
      setUserInfo(_userInfo);
    },
    clear: async () => {
      await clearCachedUserInfo();
      setUserInfo({});
    }
  }), [userInfo]);
}

export const UserProvider = ({ children }) => {
  const user = userUserValue();


  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};