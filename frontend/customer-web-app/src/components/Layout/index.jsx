import React from "react";
import Header from "components/Layout/components/Header/Header";
import HeaderLinks from "./components/Header/HeaderLinks";
import FooterSection from "components/Layout/components/Footer";
import Banner from "components/Layout/components/Banner";

export default function Layout(props) {
  return (
    <div>
      <Header color="dark" fixed brand="Bsos" links={<HeaderLinks />} />
      <Banner />
      {props.children}
      <FooterSection />
    </div>
  );
}
