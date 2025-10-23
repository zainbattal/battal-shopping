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
      navigate(`/products/${value}`); // change to your page
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="uuid-container">
      <form onSubmit={handleSubmit} className="uuid-form">
        <h2 style={{ direction: "rtl" }}>ادخل رمز UUID</h2>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className={isValid ? "" : "invalid"}
        />
        {!isValid && value.length > 0 && (
          <p className="error" style={{ direction: "rtl" }}>
            رمز غير صحيح
          </p>
        )}
        <button type="submit">ادخال</button>
      </form>
    </div>
  );
}
