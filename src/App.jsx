import React, { useState } from 'react';
import Navbar from "./components/molecules/Navbar";
import Footer from "./components/molecules/Footer";
import ApplicationPage from "./pages/ApplicationPage";
import Sidebar from "./components/molecules/Sidebar";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="flex-1">
        <ApplicationPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
