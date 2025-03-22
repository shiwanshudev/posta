import { Outlet } from "react-router";
import Nav from "./components/Nav";

function App() {
  return (
    <main className="font-poppins">
      <Nav />
      <Outlet />
    </main>
  );
}

export default App;
