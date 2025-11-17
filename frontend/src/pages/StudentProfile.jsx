import React, { useState } from 'react'

const StudentProfile = () => {
  const [profile] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@iiitb.ac.in',
    rollNumber: 'IMT2021001'
  })

  const [phoneNumbers, setPhoneNumbers] = useState([]) // Start empty

  const [newPhone, setNewPhone] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddPhone = () => {
    if (newPhone.length === 10 && phoneNumbers.length < 5) {
      setPhoneNumbers([...phoneNumbers, newPhone])
      setNewPhone('')
      setShowAddForm(false)
    }
  }

  const handleRemovePhone = (index) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        My Profile
      </h2>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/30">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{profile.name}</h3>
            <p className="text-blue-100 text-sm">{profile.rollNumber}</p>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              📧
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
            </div>
          </div>

          {/* Roll Number */}
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
              🎓
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Roll Number</p>
              <p className="text-sm font-semibold text-gray-900">{profile.rollNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Numbers */}
      <div className="bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            📱 <h3 className="font-bold">Phone Numbers</h3>
          </div>
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold text-white">
            {phoneNumbers.length}/5
          </span>
        </div>

        <div className="p-4 space-y-2">

          {/* If no phone numbers */}
          {phoneNumbers.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-2">
              No phone numbers added yet.
            </p>
          )}

          {/* Phone Number List */}
          {phoneNumbers.map((phone, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-purple-300 transition-all"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                📞
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{phone}</p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleRemovePhone(index)}
                className="w-7 h-7 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add Phone */}
          {showAddForm ? (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
              
              <input
                type="tel"
                maxLength="10"
                value={newPhone}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "")
                  if (v.length <= 10) setNewPhone(v)
                }}
                placeholder="Enter 10-digit phone number"
                className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-blue-200"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleAddPhone}
                  disabled={newPhone.length !== 10}
                  className="flex-1 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  Add
                </button>

                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewPhone('')
                  }}
                  className="px-3 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              disabled={phoneNumbers.length >= 5}
              className="w-full py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 font-semibold hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50"
            >
              + Add Phone Number
            </button>
          )}

        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-bold hover:scale-105 transition-all">
          Save Changes
        </button>
      </div>

    </div>
  )
}

export default StudentProfile
