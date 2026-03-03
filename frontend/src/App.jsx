import { useState } from 'react'
import Login from './components/login'

function App() {
  // 1. Create a state to control the popup
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Fitness Tracker</h1>
      
      {/* 2. Add a button to open the modal */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg"
      >
        Sign In / Sign Up
      </button>

      {/* 3. Pass the state and the closer function to the component */}
      <Login 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default App