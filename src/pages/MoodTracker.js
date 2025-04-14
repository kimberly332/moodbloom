import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { format } from 'date-fns';

// Import styles
import '../styles/MoodTracker.css';

const MoodTracker = () => {
  const { currentUser } = useAuth();
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');
  const [recentMoods, setRecentMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch recent moods
  useEffect(() => {
    const fetchRecentMoods = async () => {
      if (!currentUser) return;

      try {
        const userMoodsRef = collection(db, `users/${currentUser.uid}/moods`);
        const q = query(
          userMoodsRef,
          orderBy('timestamp', 'desc'),
          where('timestamp', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        );

        const querySnapshot = await getDocs(q);
        const moods = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        }));

        setRecentMoods(moods);
      } catch (error) {
        console.error('Error fetching moods:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load your recent mood entries.'
        });
      }
    };

    fetchRecentMoods();
  }, [currentUser]);

  // Handle mood submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const userMoodsRef = collection(db, `users/${currentUser.uid}/moods`);
      
      // Add new mood entry
      await addDoc(userMoodsRef, {
        mood: parseInt(mood),
        note: note.trim(),
        timestamp: new Date()
      });
      
      // Clear form and show success message
      setNote('');
      setMessage({
        type: 'success',
        text: 'Your mood has been recorded!'
      });
      
      // Refresh the recent moods list
      const q = query(
        userMoodsRef,
        orderBy('timestamp', 'desc'),
        where('timestamp', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      );
      
      const querySnapshot = await getDocs(q);
      const moods = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      }));
      
      setRecentMoods(moods);
    } catch (error) {
      console.error('Error recording mood:', error);
      setMessage({
        type: 'error',
        text: 'Failed to record your mood. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get mood emoji based on mood value
  const getMoodEmoji = (moodValue) => {
    const emojis = ['😭', '😔', '😐', '🙂', '😊', '😁', '🥳', '🤩', '😍', '✨'];
    const index = Math.min(Math.max(Math.floor(moodValue) - 1, 0), emojis.length - 1);
    return emojis[index];
  };

  // Format date for display
  const formatDate = (date) => {
    return format(date, 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="mood-tracker">
      <div className="mood-tracker-container">
        <h2 className="mood-tracker-title">How are you feeling today?</h2>
        
        {message.text && (
          <div className={`mood-message ${message.type}`} role="alert">
            <span>{message.text}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mood-form">
          <div className="mood-slider-container">
            <div className="mood-emoji">{getMoodEmoji(mood)}</div>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mood-slider"
              aria-label="Mood level from 1 to 10"
            />
            <div className="mood-scale">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="note" className="form-label">Add a note (optional):</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-textarea"
              placeholder="What's making you feel this way?"
              rows="3"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Recording...' : 'Record Mood'}
          </button>
        </form>
        
        <div className="recent-moods">
          <h3 className="recent-moods-title">Your Recent Moods</h3>
          
          {recentMoods.length === 0 ? (
            <p className="no-moods">No mood entries in the last 7 days. Start tracking your mood today!</p>
          ) : (
            <div className="moods-list">
              {recentMoods.map((moodEntry) => (
                <div key={moodEntry.id} className="mood-entry">
                  <div className="mood-entry-emoji">{getMoodEmoji(moodEntry.mood)}</div>
                  <div className="mood-entry-details">
                    <div className="mood-entry-timestamp">{formatDate(moodEntry.timestamp)}</div>
                    {moodEntry.note && <div className="mood-entry-note">{moodEntry.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;