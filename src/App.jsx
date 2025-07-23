import React, { useState } from 'react';
import Lottie from 'lottie-react';
import AI from './assets/AI.json';
import axios from 'axios';

const App = () => {
  const [suggestions, setSuggestions] = useState([
    'what is react js',
    'what is javascript',
    'how to build ai chatbot',
  ]);
  const [input, setInput] = useState('');
  const [messages, setMessage] = useState([]);

  const ai_url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAj4drZwUvgvcB0m73DS1tigPgjkdWm8FI';

  const handleSubmit = async () => {
    if (!input.trim()) return;

    let usermessage = { sender: 'user', text: input };
    setMessage((prev) => [...prev, usermessage]);

    try {
      const response = await axios.post(ai_url, {
        contents: [{ parts: [{ text: input }] }],
      });

      if (response.data) {
        let ai_message = {
          sender: 'ai',
          text: response.data.candidates[0].content.parts[0].text,//by using console.log(response.data)
        };
        setMessage((prev) => [...prev, ai_message]);
        setInput('');
      }
    } catch (error) {
      let errormessage = {
        sender: 'ai',
        text: 'Sorry, I am unable to process your request at the moment.',
      };
      setMessage((prev) => [...prev, errormessage]);
    }
  };

  return (
    <div className='vh-100 bg-light d-flex flex-column'>
      <div className='container my-auto d-flex flex-column' style={{ maxHeight: '100vh' }}>
        <div className='card border-0 shadow-sm bg-white flex-grow-1 d-flex flex-column'>
          <div className='card-body overflow-auto' style={{ maxHeight: '70vh' }}>
            <div className='d-flex justify-content-center align-items-center'>
              <div className='my-4'>
                <Lottie animationData={AI} loop={true} style={{ width: '10rem' }} />
              </div>
            </div>

            {messages.length > 0 &&
              messages.map((currEle, index) => (
                <div
                  key={index}
                  className={
                    currEle.sender === 'user'
                      ? 'd-flex justify-content-end mb-2'
                      : 'd-flex justify-content-start mb-2'
                  }
                >
                  <div
                    className={`p-2 rounded ${
                      currEle.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'
                    }`}
                    style={{ maxWidth: '75%' }}
                  >
                    <p className='mb-0'>{currEle.text}</p>
                  </div>
                </div>
              ))}
          </div>

          {suggestions.length > 0 && (
            <div className='p-3'>
              <div className='d-flex flex-wrap gap-2'>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className='btn btn-outline-secondary btn-sm'
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='card-footer'>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                value={input}
                placeholder='Type your query here...'
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button className='btn btn-primary' onClick={handleSubmit}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
