import { useGameStore } from '@/store/gameStore';
import MainMenu from '@/pages/MainMenu';
import CharacterCreation from '@/pages/CharacterCreation';
import GameHub from '@/pages/GameHub';
import EndingScreen from '@/pages/EndingScreen';

export default function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);

  switch (gamePhase) {
    case 'menu':
      return <MainMenu />;
    case 'creating':
      return <CharacterCreation />;
    case 'playing':
    case 'event':
    case 'exam':
      return <GameHub />;
    case 'ending':
      return <EndingScreen />;
    default:
      return <MainMenu />;
  }
}
