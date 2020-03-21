import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { Icon } from "galio-framework";

import GalioConfig from "assets/fonts/galioExtra";
const GalioExtra = require("assets/fonts/galioExtra.ttf");
const IconGalioExtra = createIconSetFromIcoMoon(GalioConfig, "GalioExtra");

export default function IconExtra(props) {
  const [state, setState] = useState({
    fontLoaded: false
  });

  useEffect(() => {
    async function fetchFonts() {
      await Font.loadAsync({ GalioExtra: GalioExtra });
    }
    fetchFonts().then(
      setState(prevState => ({ ...prevState, fontLoaded: true }))
    );
  }, []);

  const { name, family, ...rest } = props;

  return (
    <>
      {name && family && state.fontLoaded ? (
        family === "GalioExtra" ? (
          <IconGalioExtra name={name} family={family} {...rest} />
        ) : (
          <Icon name={name} family={family} {...rest} />
        )
      ) : null}
    </>
  );
}
