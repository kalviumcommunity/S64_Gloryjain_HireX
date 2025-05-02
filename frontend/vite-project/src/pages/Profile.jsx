import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/auth/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  // const [editForm, setEditForm] = useState({
  //   fullname: '',
  //   email: '',
  //   phoneNumber: '',
  //   bio: '',
  //   skills: '',
  //   resume: null
  // });

  // useEffect(() => {
  //   const userFromStorage = localStorage.getItem('user');
  //   if (!userFromStorage) {
  //     navigate('/login');
  //     return;
  //   }
  //   const parsedUser = JSON.parse(userFromStorage);
  //   setUser(parsedUser);
  //   setEditForm({
  //     fullname: parsedUser.fullname || '',
  //     email: parsedUser.email || '',
  //     phoneNumber: parsedUser.phoneNumber || '',
  //     bio: parsedUser.bio || 'Experienced software developer',
  //     skills: parsedUser.skills || 'Nextjs14,Typescript,Prisma,developer',
  //     resume: null
  //   });
  // }, [navigate]);

  // const handleUpdateProfile = () => {
  //   // Here we'll add the API call to update the profile
  //   const updatedUser = { ...user, ...editForm };
  //   localStorage.setItem('user', JSON.stringify(updatedUser));
  //   setUser(updatedUser);
  //   setIsEditing(false);
  // };

  if (!user) return null;

  return (
    <div className="profile-page">
      <style>
        {`
          .profile-page {
            min-height: 100vh;
            background: #ffffff;
          }

          .profile-content {
            max-width: 800px;
            margin: 40px auto;
            padding: 0 20px;
          }

          .profile-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .profile-header {
            display: flex;
            align-items: center;
            padding: 24px;
            gap: 20px;
            border-bottom: 1px solid #eee;
          }

          .profile-photo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #7b2cbf;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            font-weight: 500;
            overflow: hidden;
          }

          .profile-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .profile-info {
            flex: 1;
          }

          .profile-name {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin: 0 0 4px;
          }

          .profile-role {
            font-size: 16px;
            color: #666;
            margin: 0;
          }

          .edit-button {
            padding: 8px 16px;
            background: transparent;
            border: 1px solid #7b2cbf;
            color: #7b2cbf;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
          }

          .edit-button:hover {
            background: #7b2cbf;
            color: white;
          }

          .profile-details {
            padding: 24px;
          }

          .detail-group {
            margin-bottom: 24px;
          }

          .detail-group:last-child {
            margin-bottom: 0;
          }

          .detail-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
          }

          .detail-value {
            font-size: 16px;
            color: #333;
          }

          .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .skill-tag {
            padding: 6px 12px;
            background: #f5f5f5;
            border-radius: 20px;
            font-size: 14px;
            color: #333;
          }

          .applied-jobs {
            margin-top: 40px;
          }

          .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
          }

          .empty-state {
            text-align: center;
            padding: 40px 20px;
            background: #f9f9f9;
            border-radius: 12px;
            color: #666;
          }

          .empty-state p {
            margin: 0;
            font-size: 16px;
          }

          /* Edit Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 12px;
            padding: 24px;
            width: 100%;
            max-width: 500px;
            position: relative;
          }

          .modal-header {
            margin-bottom: 24px;
          }

          .modal-title {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin: 0;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
          }

          .form-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            color: #333;
          }

          .form-input:focus {
            outline: none;
            border-color: #7b2cbf;
          }

          .update-button {
            width: 100%;
            padding: 12px;
            background: #7b2cbf;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.3s;
          }

          .update-button:hover {
            background: #6a24a6;
          }

          .file-input-wrapper {
            position: relative;
            overflow: hidden;
            display: inline-block;
            width: 100%;
          }

          .file-input-button {
            width: 100%;
            padding: 8px 12px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            color: #666;
            text-align: left;
            cursor: pointer;
          }

          .file-input {
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
            width: 100%;
            height: 100%;
          }
        `}
      </style>

      <Navbar />

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-photo">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.fullname} />
              ) : (
                <span>{user.fullname?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.fullname}</h1>
              <p className="profile-role">
                {user.role === "student" ? "Experienced software developer" : "Recruiter"}
              </p>
            </div>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <div className="detail-label">Email</div>
              <div className="detail-value">{user.email}</div>
            </div>
            <div className="detail-group">
              <div className="detail-label">Phone</div>
              <div className="detail-value">{user.phoneNumber}</div>
            </div>
            <div className="detail-group">
              <div className="detail-label">Skills</div>
              <div className="skills-list">
                {user.skills?.split(',').map((skill, index) => (
                  <span key={index} className="skill-tag">{skill.trim()}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="applied-jobs">
          <h2 className="section-title">Applied Jobs</h2>
          <div className="empty-state">
            <p>You haven't applied to any jobs yet.</p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Update Profile</h2>
            </div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={editForm.fullname}
                onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Number</label>
              <input
                type="tel"
                className="form-input"
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <input
                type="text"
                className="form-input"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Enter your bio"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Skills</label>
              <input
                type="text"
                className="form-input"
                value={editForm.skills}
                onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                placeholder="Enter your skills"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Resume</label>
              <div className="file-input-wrapper">
                <button className="file-input-button">
                  Choose File
                  {editForm.resume ? ` - ${editForm.resume.name}` : ' - No file chosen'}
                </button>
                <input
                  type="file"
                  className="file-input"
                  onChange={(e) => setEditForm({ ...editForm, resume: e.target.files[0] })}
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>
            <button className="update-button" onClick={handleUpdateProfile}>
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 