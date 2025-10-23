import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

export default function UuidInput() {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    setIsValid(uuidRegex.test(val));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid && value) {
      navigate(`/your-target-page/${value}`); // ← Change route as you need
    } else {
      setIsValid(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-800/60 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-700"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Enter Product UUID
        </h1>

        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            className={`rounded-xl p-3 w-full bg-gray-900 text-gray-100 placeholder-gray-500 border focus:outline-none focus:ring-2 transition ${
              isValid
                ? "border-gray-700 focus:ring-blue-500"
                : "border-red-600 focus:ring-red-500"
            }`}
          />

          {!isValid && value.length > 0 && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle size={16} />
              <p>Invalid UUID format</p>
            </div>
          )}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="mt-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition"
          >
            <Check size={18} />
            OK
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
