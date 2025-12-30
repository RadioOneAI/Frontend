import React from "react";

export default function EditProfileModal({ user }) {
  return (
    <dialog id="edit_profile_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* 'x' button to close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 className="font-bold text-lg mb-6 text-center">Edit Profile Details</h3>
        
        <div className="space-y-4">
          
          {/* Current Profile Picture Display */}
          <div className="flex justify-center mb-4">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.avatar} alt="Current Profile" />
              </div>
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Change Profile Picture</span>
            </label>
            <input type="file" className="file-input file-input-bordered w-full" />
          </div>

          {/* Phone Number Change */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input 
              type="tel" 
              defaultValue={user.phone} 
              className="input input-bordered w-full" 
            />
          </div>

          <div className="divider text-xs uppercase opacity-50">Change Password</div>

          {/* Current Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Current Password</span>
            </label>
            <input 
              type="password" 
              placeholder="Type current password" 
              className="input input-bordered w-full" 
            />
          </div>

          {/* New Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input 
              type="password" 
              placeholder="Type new password" 
              className="input input-bordered w-full" 
            />
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input 
              type="password" 
              placeholder="Confirm new password" 
              className="input input-bordered w-full" 
            />
          </div>

          {/* Save Button */}
          <div className="modal-action">
            <form method="dialog">
              {/* If there is a button in form, it will close the modal */}
              <button className="btn btn-primary w-full">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
      {/* Backdrop to close modal when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}