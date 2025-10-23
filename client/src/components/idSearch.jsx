import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      // ✅ Navigate to your target page here
      // Replace "/your-target-page" with your actual route
      navigate(`/products/${value}`);
    } else {
      setIsValid(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2 max-w-md">
      <label className="text-sm font-medium">Enter Product UUID</label>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
        className={`border rounded p-2 w-full ${
          isValid ? "border-gray-300" : "border-red-500"
        }`}
      />

      {!isValid && value.length > 0 && (
        <p className="text-red-500 text-sm">رمز غير صحيح</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
      >
        OK
      </button>
    </form>
  );
}
