import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Import styles
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // User data state
  const [userData, setUserData] = useState({
    nickname: '',
    username: '',
    email: '',
    bio: '',
    profileImage: null
  });

  // Form state
  const [formData, setFormData] = useState({
    nickname: '',
    bio: ''
  });

  // Image file state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            nickname: data.nickname || currentUser.displayName || '',
            username: data.username || '',
            email: data.email || currentUser.email || '',
            bio: data.bio || '',
            profileImage: data.profileImage || null
          });
          
          setFormData({
            nickname: data.nickname || currentUser.displayName || '',
            bio: data.bio || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load your profile information.'
        });
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  // Handle profile update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      
      // Update object to be sent to Firestore
      const updates = {
        nickname: formData.nickname,
        bio: formData.bio,
        updatedAt: new Date().toISOString()
      };
      
      // If there's a new profile image, upload it
      if (imageFile) {
        const storage = getStorage();
        const fileRef = ref(storage, `profileImages/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
        
        // Upload image
        await uploadBytes(fileRef, imageFile);
        
        // Get download URL
        const downloadURL = await getDownloadURL(fileRef);
        
        // Add to updates
        updates.profileImage = downloadURL;
      }
      
      // Update Firestore document
      await updateDoc(userDocRef, updates);
      
      // Update display name in auth
      if (formData.nickname !== userData.nickname) {
        await updateUserProfile(formData.nickname);
      }
      
      // Update local userData state
      setUserData(prev => ({
        ...prev,
        nickname: formData.nickname,
        bio: formData.bio,
        profileImage: imageFile ? URL.createObjectURL(imageFile) : prev.profileImage
      }));
      
      // Clear image file state
      setImageFile(null);
      setImagePreview(null);
      
      // Show success message
      setMessage({
        type: 'success',
        text: 'Your profile has been updated successfully!'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update your profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-title">Your Profile</h2>
        
        {message.text && (
          <div className={`profile-message ${message.type}`}>
            <span>{message.text}</span>
          </div>
        )}
        
        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-image-container">
              {userData.profileImage || imagePreview ? (
                <img 
                  src={imagePreview || userData.profileImage} 
                  alt={userData.nickname || 'User'}
                  className="profile-image" 
                />
              ) : (
                <div className="profile-image-placeholder">
                  {userData.nickname ? userData.nickname.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            
            <div className="profile-details">
              <h3 className="profile-name">{userData.nickname || 'User'}</h3>
              <p className="profile-username">@{userData.username}</p>
              <p className="profile-email">{userData.email}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="profileImage" className="form-label">Profile Picture</label>
              <div className="profile-image-upload">
                <label className="image-upload-button">
                  <span>Choose Image</span>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                  />
                </label>
                {imageFile && (
                  <span className="selected-filename">{imageFile.name}</span>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="nickname" className="form-label">Display Name</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="form-input"
                placeholder="Your display name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Tell us about yourself..."
                rows="4"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="update-button" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;