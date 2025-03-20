import { Outlet } from "react-router";
import Nav from "./components/Nav";

function App() {
  return (
    <main>
      <Nav />
      <Outlet />
    </main>
  );
}

export default App;
