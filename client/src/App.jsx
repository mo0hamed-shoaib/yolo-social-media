import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          <a href="#" target="_blank">
            <img 
              src="/yolo-logo.svg"
              className="h-24 w-24 transition-all duration-300 hover:scale-110" 
              alt="Yolo logo" 
            />
          </a>
        </div>
        <h1 className="text-4xl font-bold text-center mt-8 text-gray-800">
          Welcome to Yolo Social Media Platform
        </h1>
        <p className="text-center mt-4 text-gray-600">
          This is the Client Side
        </p>
      </div>
    </div>
  )
}

export default App
