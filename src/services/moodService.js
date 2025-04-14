import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    getDocs, 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc,
    Timestamp
  } from 'firebase/firestore';
  import { db } from '../firebase/config';
  
  // Create a new mood entry
  export const addMoodEntry = async (userId, moodData) => {
    try {
      const userMoodsRef = collection(db, `users/${userId}/moods`);
      
      // Ensure timestamp is a Firebase Timestamp
      const entry = {
        ...moodData,
        timestamp: moodData.timestamp || Timestamp.now()
      };
      
      const docRef = await addDoc(userMoodsRef, entry);
      return { id: docRef.id, ...entry };
    } catch (error) {
      console.error('Error adding mood entry:', error);
      throw error;
    }
  };
  
  // Get mood entries within a date range
  export const getMoodsByDateRange = async (userId, startDate, endDate) => {
    try {
      const userMoodsRef = collection(db, `users/${userId}/moods`);
      
      const q = query(
        userMoodsRef,
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      }));
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      throw error;
    }
  };
  
  // Get recent mood entries
  export const getRecentMoods = async (userId, limit = 7) => {
    try {
      const userMoodsRef = collection(db, `users/${userId}/moods`);
      
      // Get entries from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const q = query(
        userMoodsRef,
        where('timestamp', '>=', Timestamp.fromDate(sevenDaysAgo)),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      }));
    } catch (error) {
      console.error('Error fetching recent mood entries:', error);
      throw error;
    }
  };
  
  // Get a specific mood entry
  export const getMoodById = async (userId, moodId) => {
    try {
      const moodDocRef = doc(db, `users/${userId}/moods/${moodId}`);
      const moodDoc = await getDoc(moodDocRef);
      
      if (moodDoc.exists()) {
        const data = moodDoc.data();
        return {
          id: moodDoc.id,
          ...data,
          timestamp: data.timestamp.toDate()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching mood entry:', error);
      throw error;
    }
  };
  
  // Update a mood entry
  export const updateMoodEntry = async (userId, moodId, updates) => {
    try {
      const moodDocRef = doc(db, `users/${userId}/moods/${moodId}`);
      await updateDoc(moodDocRef, updates);
      
      // Get the updated document
      const updatedDoc = await getDoc(moodDocRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        timestamp: data.timestamp.toDate()
      };
    } catch (error) {
      console.error('Error updating mood entry:', error);
      throw error;
    }
  };
  
  // Delete a mood entry
  export const deleteMoodEntry = async (userId, moodId) => {
    try {
      const moodDocRef = doc(db, `users/${userId}/moods/${moodId}`);
      await deleteDoc(moodDocRef);
      return true;
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      throw error;
    }
  };
  
  // Calculate mood statistics
  export const getMoodStatistics = async (userId, startDate, endDate) => {
    try {
      const moods = await getMoodsByDateRange(userId, Timestamp.fromDate(startDate), Timestamp.fromDate(endDate));
      
      if (moods.length === 0) {
        return {
          averageMood: 0,
          highestMood: 0,
          lowestMood: 0,
          moodCount: 0,
          moodDistribution: []
        };
      }
      
      // Calculate average mood
      const moodSum = moods.reduce((sum, entry) => sum + entry.mood, 0);
      const averageMood = moodSum / moods.length;
      
      // Find highest and lowest moods
      const moodValues = moods.map(entry => entry.mood);
      const highestMood = Math.max(...moodValues);
      const lowestMood = Math.min(...moodValues);
      
      // Calculate mood distribution (1-10)
      const moodDistribution = Array(10).fill(0);
      moods.forEach(entry => {
        const index = entry.mood - 1;
        moodDistribution[index]++;
      });
      
      return {
        averageMood,
        highestMood,
        lowestMood,
        moodCount: moods.length,
        moodDistribution
      };
    } catch (error) {
      console.error('Error calculating mood statistics:', error);
      throw error;
    }
  };
  
  export default {
    addMoodEntry,
    getMoodsByDateRange,
    getRecentMoods,
    getMoodById,
    updateMoodEntry,
    deleteMoodEntry,
    getMoodStatistics
  };