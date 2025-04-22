import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const InterestsModal = () => {
  const [pq1, setPq1] = useState(0);
  const [pq2, setPq2] = useState(0);
  const [pq3, setPq3] = useState(0);
  const [pq4, setPq4] = useState(0);
  const [pq5, setPq5] = useState(0);
  const [oq1, setOq1] = useState(0);
  const [oq2, setOq2] = useState(0);
  const [oq3, setOq3] = useState(0);
  const [oq4, setOq4] = useState(0);
  const [oq5, setOq5] = useState(0);
  const { username } = useParams();
  const navigate = useNavigate();

  const handleAnswers = async () => {
    try {
      const response = await fetch("http://localhost/ProjectMatchUp/API/interests.php", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          pq1, pq2, pq3, pq4, pq5,
          oq1, oq2, oq3, oq4, oq5,
          username,
          action: "none"
        })
      });
      const result = await response.json();
      if (result.success) {
        navigate(`/matches/${username}`);
      }
    } catch (error) {
      console.error("Error submitting answers", error);
    }
  };

  const renderQuestion = (text, value, setValue) => (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-sm font-medium">{text}</label>
      <select
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="p-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value={0}>Select</option>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-2xl mt-8 mb-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Traits You Want in Your Partner</h2>
      
      {renderQuestion("How intellectual should your ideal match be? (1 = casual thinker, 5 = deep/intense thinker)", pq1, setPq1)}
      {renderQuestion("How important is a good sense of humor in a partner? (1 = not important, 5 = extremely important)", pq2, setPq2)}
      {renderQuestion("What type of personality do you like? (1 = introvert, 5 = extrovert)", pq3, setPq3)}
      {renderQuestion("How adventurous should your ideal match be? (1 = prefers routine, 5 = loves trying new things)", pq4, setPq4)}
      {renderQuestion("How emotionally open should your ideal match be? (1 = reserved, 5 = very expressive)", pq5, setPq5)}

      <h2 className="text-2xl font-bold text-center mt-10 mb-6 text-blue-700">Rating Your Own Traits</h2>

      {renderQuestion("How intellectual would you rate yourself? (1 = casual thinker, 5 = deep/intense thinker)", oq1, setOq1)}
      {renderQuestion("Rate your sense of humour (1 = low, 5 = excellent)", oq2, setOq2)}
      {renderQuestion("Describe your personality (1 = introvert, 5 = extrovert)", oq3, setOq3)}
      {renderQuestion("How adventurous are you? (1 = prefers routine, 5 = loves trying new things)", oq4, setOq4)}
      {renderQuestion("How emotionally open are you? (1 = reserved, 5 = very expressive)", oq5, setOq5)}

      <button
        onClick={handleAnswers}
        className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Submit
      </button>
    </div>
  );
};

export default InterestsModal;
