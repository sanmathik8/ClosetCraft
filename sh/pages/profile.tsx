import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, ChangeEvent } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

interface IShippingAddress {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

interface IUser {
  name?: string;
  email?: string;
  phoneNumber?: string;
  shippingAddress?: IShippingAddress;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<IUser>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (session?.user?.email) {
      axios
        .get(`/api/user?email=${session.user.email}`)
        .then((res) => {
          setFormData(res.data.user);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("shippingAddress.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    const addr = formData.shippingAddress || {};
    if (!addr.address) newErrors["shippingAddress.address"] = "Street address required";
    if (!addr.city) newErrors["shippingAddress.city"] = "City required";
    if (!addr.state) newErrors["shippingAddress.state"] = "State required";

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setMessage("");
    setErrors({});
    try {
      const res = await axios.put("/api/user", formData);
      if (res.status === 200) setMessage("Profile updated successfully!");
    } catch {
      setMessage("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-20 text-xl">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-violet-200 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-purple-800">
            Your Profile
          </h1>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-semibold text-purple-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-purple-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                disabled
                className="w-full px-4 py-2 border border-purple-300 rounded-xl bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold text-purple-700 mb-2">Phone</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              {errors.phoneNumber && <p className="text-red-500 mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Shipping Address */}
            <h2 className="text-xl font-semibold text-purple-700 mb-3">Shipping Address</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="shippingAddress.address"
                value={formData.shippingAddress?.address || ""}
                onChange={handleChange}
                placeholder="Street Address"
                className="w-full px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              {errors["shippingAddress.address"] && (
                <p className="text-red-500 mt-1">{errors["shippingAddress.address"]}</p>
              )}

              <div className="flex gap-4">
                <input
                  type="text"
                  name="shippingAddress.city"
                  value={formData.shippingAddress?.city || ""}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-1/2 px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
                <input
                  type="text"
                  name="shippingAddress.state"
                  value={formData.shippingAddress?.state || ""}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-1/2 px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              {errors["shippingAddress.city"] && <p className="text-red-500">{errors["shippingAddress.city"]}</p>}
              {errors["shippingAddress.state"] && <p className="text-red-500">{errors["shippingAddress.state"]}</p>}

              <div className="flex gap-4">
                <input
                  type="text"
                  name="shippingAddress.country"
                  value={formData.shippingAddress?.country || ""}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-1/2 px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
                <input
                  type="text"
                  name="shippingAddress.pincode"
                  value={formData.shippingAddress?.pincode || ""}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="w-1/2 px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            {message && <p className="mt-4 text-center text-purple-800">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
