import { Route, Routes } from 'react-router';
import { ExperienceProvider } from './context/Experience.jsx';
import { Sprite } from './components/Icon.jsx';
import Nav from './components/Nav.jsx';
import Cursor from './components/Cursor.jsx';
import Preloader from './components/Preloader.jsx';
import Curtain from './components/Curtain.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Story from './pages/Story.jsx';
import Gallery from './pages/Gallery.jsx';
import Visit from './pages/Visit.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <ExperienceProvider>
      <Sprite />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/story" element={<Story />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Preloader />
      <Curtain />
      <Cursor />
    </ExperienceProvider>
  );
}
