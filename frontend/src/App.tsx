import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Portal } from "./pages/Portal";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/portal" element={<Portal />} />
    </Routes>
  );
}
