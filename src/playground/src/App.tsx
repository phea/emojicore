import { useState } from 'react';
import reactLogo from './assets/react.svg';
import Navbar from './Navbar';
import SectionHeader from './SectionHeader';
import Code from './Code';
import Footer from './Footer';

function App() {
  return (
    <>
      <Navbar />
      <SectionHeader />
      <Code />
      <Footer />
    </>
  );
}

export default App;
