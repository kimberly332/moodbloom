import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  doc, 
  updateDoc, 
  getDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  updateEmail, 
  updatePassword, 
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import { db } from '../firebase/config';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

const Profile = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State for user profile data
  const [userData, setUserData] = useState({
    nickname: '',
    email: '',
    username: '',
    avatarUrl: ''
  });
  
  // State for form data
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for UI
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            
            // Set userData with the avatar URL
            const userDataObj = {
              nickname: currentUser.displayName || '',
              email: currentUser.email || '',
              username: data.username || '',
              avatarUrl: data.avatarUrl || ''
            };
            
            setUserData(userDataObj);
            
            // Log for debugging
            console.log("Fetched user data:", userDataObj);
            
            setFormData({
              nickname: currentUser.displayName || '',
              email: currentUser.email || '',
              username: data.username || '',
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load profile data');
        }
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }
    
    try {
      setIsUploading(true);
      setError('');
      setSuccess('');
      
      // Get reference to storage
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${currentUser.uid}`);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Failed to upload avatar');
          setIsUploading(false);
        },
        async () => {
          // Upload completed successfully
          try {
            // Get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Update Firestore document
            await updateDoc(doc(db, "users", currentUser.uid), {
              avatarUrl: downloadURL,
              updatedAt: new Date().toISOString()
            });
            
            // Update local state
            setUserData(prevState => ({
              ...prevState,
              avatarUrl: downloadURL
            }));
            
            console.log("Avatar updated successfully:", downloadURL);
            
            setSuccess('Avatar uploaded successfully');
            setIsUploading(false);
            setUploadProgress(0);
          } catch (error) {
            console.error('Error getting download URL:', error);
            setError('Failed to update profile with new avatar');
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Avatar upload error:', error);
      setError('Failed to upload avatar');
      setIsUploading(false);
    }
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Only update if something has changed
    if (
      formData.nickname === userData.nickname &&
      formData.email === userData.email &&
      formData.username === userData.username
    ) {
      setError('No changes made to update');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Update nickname if changed
      if (formData.nickname !== userData.nickname) {
        await updateUserProfile(formData.nickname);
      }
      
      // Update email if changed
      if (formData.email !== userData.email && formData.currentPassword) {
        // Re-authenticate user first
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          formData.currentPassword
        );
        
        await reauthenticateWithCredential(currentUser, credential);
        await updateEmail(currentUser, formData.email);
        
        // Update email in Firestore
        await updateDoc(doc(db, "users", currentUser.uid), {
          email: formData.email,
          updatedAt: new Date().toISOString()
        });
      } else if (formData.email !== userData.email && !formData.currentPassword) {
        throw new Error('Current password is required to update email');
      }
      
      // Update username if changed
      if (formData.username !== userData.username) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          username: formData.username,
          updatedAt: new Date().toISOString()
        });
      }
      
      // Update local state
      setUserData({
        ...userData,
        nickname: formData.nickname,
        email: formData.email,
        username: formData.username
      });
      
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        setError('Please re-enter your current password to update your email');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use by another account');
      } else if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else {
        setError(error.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (formData.newPassword.length < 6) {
      setError('New password should be at least 6 characters');
      return;
    }
    
    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        formData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, formData.newPassword);
      
      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Password updated successfully');
    } catch (error) {
      console.error('Password change error:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        setError('Please re-enter your current password to update your password');
      } else if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else {
        setError('Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!formData.currentPassword) {
      setError('Please enter your current password to delete your account');
      return;
    }
    
    try {
      setIsDeleting(true);
      setError('');
      
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        formData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Delete avatar from storage if exists
      if (userData.avatarUrl) {
        try {
          const storage = getStorage();
          const avatarRef = ref(storage, `avatars/${currentUser.uid}`);
          await deleteObject(avatarRef);
        } catch (storageError) {
          console.error('Error deleting avatar:', storageError);
          // Continue with account deletion even if avatar deletion fails
        }
      }
      
      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", currentUser.uid));
      
      // Delete the user account
      await deleteUser(currentUser);
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Account deletion error:', error);
      
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else {
        setError('Failed to delete account');
      }
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  return (
    <div>
      <h2>Your Profile</h2>
      
      {error && (
        <div role="alert" style={{
          padding: '10px',
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          margin: '10px 0',
          borderRadius: '4px'
        }}>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div role="alert" style={{
          padding: '10px',
          backgroundColor: '#dcfce7',
          color: '#166534',
          margin: '10px 0',
          borderRadius: '4px'
        }}>
          <span>{success}</span>
        </div>
      )}
      
      {/* Avatar Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px 0'
      }}>
        <div 
          onClick={handleAvatarClick}
          style={{ 
            cursor: 'pointer',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#f3f4f6',
            position: 'relative',
            border: '2px solid #e5e7eb'
          }}
        >
          {userData.avatarUrl ? (
            <img 
              src={userData.avatarUrl} 
              alt="User avatar" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '2rem'
            }}>
              {userData.nickname ? userData.nickname.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          
          {isUploading && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              background: 'rgba(0,0,0,0.7)',
              padding: '4px'
            }}>
              <progress value={uploadProgress} max="100" style={{width: '80%'}}></progress>
              <span style={{color: 'white', fontSize: '0.8rem'}}>{uploadProgress}%</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleAvatarClick}
          type="button"
          style={{
            margin: '10px 0',
            padding: '5px 10px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {userData.avatarUrl ? 'Change Avatar' : 'Upload Avatar'}
        </button>
        
        {userData.avatarUrl && (
          <p style={{fontSize: '0.9rem', color: '#6b7280'}}>
            Your avatar has been uploaded successfully.
          </p>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/jpeg, image/png, image/gif"
        />
      </div>
      
      {/* Profile Info Form */}
      <form onSubmit={handleProfileUpdate}>
        <h3>Profile Information</h3>
        
        <div style={{marginBottom: '10px'}}>
          <label htmlFor="nickname">Nickname</label>
          <div>
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Nickname"
            />
          </div>
        </div>
        
        <div style={{marginBottom: '10px'}}>
          <label htmlFor="username">Username</label>
          <div>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
          </div>
        </div>
        
        <div style={{marginBottom: '10px'}}>
          <label htmlFor="email">Email</label>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
        </div>
        
        {(formData.email !== userData.email) && (
          <div style={{marginBottom: '10px'}}>
            <label htmlFor="currentPassword">Current Password (required to change email)</label>
            <div>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
            </div>
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
      
      {/* Password Change Form */}
      <form onSubmit={handlePasswordChange}>
        <h3>Change Password</h3>
        
        <div style={{marginBottom: '10px'}}>
          <label htmlFor="currentPasswordForPw">Current Password</label>
          <div>
            <input
              id="currentPasswordForPw"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
          </div>
        </div>
        
        <div style={{marginBottom: '10px'}}>
          <label htmlFor="newPassword">New Password</label>
          <div>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
        </div>
        
        <div style={{marginBottom: '10px'}}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>
      
      {/* Delete Account Section */}
      <div style={{margin: '20px 0', padding: '10px', border: '1px solid #fee2e2'}}>
        <h3>Delete Account</h3>
        <p style={{color: 'red'}}>
          Warning: This action cannot be undone. All your data will be permanently deleted.
        </p>
        
        {!showDeleteConfirm ? (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            type="button"
          >
            Delete My Account
          </button>
        ) : (
          <div>
            <p>Please enter your password to confirm:</p>
            
            <div style={{marginBottom: '10px'}}>
              <input
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>
            
            <div>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                type="button"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Back to Dashboard */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          type="button"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Profile;