import MainContent from "./components/MainContent";
import Navbar from "./components/NavBar";
import "./style.css";

function App() {
  return (
    <div className="container">
      <Navbar />;
      <MainContent />;
    </div>
  );
}

export default App;
