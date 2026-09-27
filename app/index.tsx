import React from "react";

import HomeScreenView from "../components/HomeScreenView";
import { useHomeScreen } from "../hooks/useHomeScreen";
export default function HomeScreen() {
  const {
    bgColor,
    email,
    online,
    setEmail,
    changeColor,
    login,
    offine,
  } = useHomeScreen();

  return (
    <HomeScreenView
      bgColor={bgColor}
      email={email}
      online={online}
      setEmail={setEmail}
      changeColor={changeColor}
      login={login}
      offine={offine}
    />
  );
}