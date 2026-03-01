import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const UserLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default UserLayout;
