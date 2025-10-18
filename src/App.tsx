import { useState } from 'react';
import { UserPlus, Trash2, Loader2, Download } from 'lucide-react';
import { generateRegistrationPDF } from './utils/pdfGenerator';

interface Member {
  name: string;
  member_type: 'adult' | 'child';
  age: string;
}

interface FormData {
  name: string;
  mobile_number: string;
  email: string;
  members: Member[];
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobile_number: '',
    email: '',
    members: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: '', member_type: 'adult', age: '' }]
    });
  };

  const removeMember = (index: number) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index)
    });
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const updatedMembers = formData.members.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      name: formData.name,
      mobile_number: formData.mobile_number,
      email: formData.email,
      created_by: 'admin',
      members: formData.members.map(member => ({
        name: member.name,
        member_type: member.member_type,
        age: parseInt(member.age),
        created_by: 'admin'
      }))
    };

    try {
      const response = await fetch('https://sportims-other-api.justvy.com/create-registration-with-members/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const pdfData = {
          name: formData.name,
          mobile_number: formData.mobile_number,
          email: formData.email,
          members: formData.members.map(member => ({
            name: member.name,
            member_type: member.member_type,
            age: parseInt(member.age)
          }))
        };

        generateRegistrationPDF(pdfData);

        setMessage({ type: 'success', text: 'Registration submitted successfully! PDF downloaded.' });
        setFormData({
          name: '',
          mobile_number: '',
          email: '',
          members: []
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to submit registration. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 text-center">Rotary International District 3233</h1>
          <p className="mt-2 text-sm text-gray-600 text-center">Please complete the form below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Primary Contact
            </h2>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                required
                value={formData.mobile_number}
                onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors"
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h2 className="text-lg font-medium text-gray-900">Members</h2>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <UserPlus size={16} />
                Add Member
              </button>
            </div>

            {formData.members.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No members added yet. Click "Add Member" to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.members.map((member, index) => (
                  <div key={index} className="border border-gray-200 p-4 space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Member {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors"
                        placeholder="Enter member name"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          required
                          value={member.member_type}
                          onChange={(e) => updateMember(index, 'member_type', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors bg-white"
                        >
                          <option value="adult">Adult</option>
                          <option value="child">Child</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          value={member.age}
                          onChange={(e) => updateMember(index, 'age', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors"
                          placeholder="Age"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {message && (
            <div
              className={`p-4 border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-3 px-6 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
