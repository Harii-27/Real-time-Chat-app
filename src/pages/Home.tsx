import React from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

// Define the type for the props (with ws as WebSocket or null)
interface HomeProps {
  ws: WebSocket | null;
}

const Home: React.FC<HomeProps> = ({ ws }) => {
  return (
    <div className="home">
      <div className="container">
        {/* Pass ws to Sidebar and Chat components */}
        <Sidebar ws={ws} />
        <Chat ws={ws} />
      </div>
    </div>
  );
};

export default Home;
