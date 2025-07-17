import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-md border text-sm"
    >
      {darkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

export default ThemeToggle;
