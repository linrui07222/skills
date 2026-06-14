import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "@/pages/MainMenu";
import CharacterCreation from "@/pages/CharacterCreation";
import GameHub from "@/pages/GameHub";
import EndingScreen from "@/pages/EndingScreen";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/create" element={<CharacterCreation />} />
        <Route path="/game" element={<GameHub />} />
        <Route path="/ending" element={<EndingScreen />} />
      </Routes>
    </Router>
  );
}
