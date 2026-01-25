// ===========================
// TokenDials.jsx (Main Component)
// ===========================
const METRIC_MATH = {
  water: 0.05,  // 1 token = 0.05ml
  co2: 0.02,    // 1 token = 0.02g
  energy: 0.8   // 1 token = 0.8 Joules
};

const MAX_VALUES = {
  water: 100,   // ml
  co2: 100,     // grams
  energy: 100   // Joules
};

const TokenDials = () => {
  const [status, setStatus] = useState('idle');
  const [tokenCount, setTokenCount] = useState(0);
  const [dialValues, setDialValues] = useState({
    water: 0,
    co2: 0,
    energy: 0
  });

  const intervalRef = useRef(null);

  // Handle "thinking" mode with jittering needles
  useEffect(() => {
    if (status === 'thinking') {
      intervalRef.current = setInterval(() => {
        setDialValues({
          water: Math.random() * 60 + 20,
          co2: Math.random() * 60 + 20,
          energy: Math.random() * 60 + 20,
        });
      }, 300);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  // Handle "done" mode - calculate final values
  useEffect(() => {
    if (status === 'done') {
      const finalValues = {
        water: tokenCount * METRIC_MATH.water,
        co2: tokenCount * METRIC_MATH.co2,
        energy: tokenCount * METRIC_MATH.energy
      };
      setDialValues(finalValues);
    }
  }, [status, tokenCount]);

  // REPLACE WITH YOUR BACKEND CALL
  const handleSimulate = async () => {
    setStatus('thinking');
    setTokenCount(0);

    // Example backend integration:
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: userInput })
    // });
    // const data = await response.json();
    // setTokenCount(data.tokenCount);
    // setStatus('done');

    setTimeout(() => {
      const tokensFromBackend = Math.floor(Math.random() * 1000) + 50;
      setTokenCount(tokensFromBackend);
      setStatus('done');
    }, 3000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        <div className="dials-wrapper">
          <Dial 
            title="Water Usage" 
            value={dialValues.water} 
            unit="ml" 
            color="#00d2ff"
            maxValue={MAX_VALUES.water}
          />
          <Dial 
            title="Carbon (CO₂)" 
            value={dialValues.co2} 
            unit="g" 
            color="#9b59b6"
            maxValue={MAX_VALUES.co2}
          />
          <Dial 
            title="Energy" 
            value={dialValues.energy} 
            unit="J" 
            color="#f1c40f"
            maxValue={MAX_VALUES.energy}
          />
        </div>

        <div className="controls">
          <button 
            className="sim-btn" 
            onClick={handleSimulate} 
            disabled={status === 'thinking'}
          >
            {status === 'thinking' ? 'Processing...' : 'Simulate User Input'}
          </button>
          
          <div className="status-text">
            {status === 'idle' && "Waiting for input..."}
            {status === 'thinking' && "AI is thinking (calculating tokens)..."}
            {status === 'done' && `Finished! Consumed ${tokenCount} tokens.`}
          </div>
        </div>
      </div>
    </>
  );
};