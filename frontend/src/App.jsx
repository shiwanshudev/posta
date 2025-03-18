import { Outlet } from "react-router";
import Nav from "./components/Nav";
import Home from "./components/Home";

function App() {
  return (
    <main>
      <Nav />
      <Outlet />
    </main>
  );
}

export default App;
