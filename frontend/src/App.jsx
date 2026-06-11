import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EditTicket from "./pages/EditTicket";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/edit/:id" element={<EditTicket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;