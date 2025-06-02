import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { NotLoggedIn } from "./NotLoggedIn";
import { LoggedIn } from "./LoggedIn";

export const Main = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);
  return (
    <>
    {
      loggedIn ? <LoggedIn /> : <NotLoggedIn />
    }
    </>
  );
}