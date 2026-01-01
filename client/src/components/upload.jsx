import React from "react";
import { use } from "react";
import { useState } from "react";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Uploud(params) {
  const [name, setName] = useState("");
  const [discription, setDiscription] = useState("");
  const [type, setType] = useState("notSet");
  const [price, setPrice] = useState(1000);
  const [images, setImages] = useState();
  const [city, setCity] = useState("اللاذقية");
  const [status, setStatus] = useState("");
  const [badstatus, setBadstatus] = useState("");
  const stat = useRef();
  const submitBtn = useRef();
  const priceInp = useRef();
  const navigate = useNavigate();
  const checkAuthorization = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/is-authorized`,
        {
          method: "GET",
          headers: {
            token: localStorage.token,
          },
        }
      );

      if (response.ok) {
        console.log("");
      } else {
        navigate("/register");
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (price > 99999999) {
        setStatus("السعر عالي جداً");
        stat.current.style.display = "block";
        stat.current.style.color = "RED";
        submitBtn.current.value = "نشر";
        return;
      }

      submitBtn.current.value = "جارٍ النشر";
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("discription", discription.trim());
      formData.append("type", type);
      formData.append("price", price);
      images.forEach((img) => {
        formData.append("images", img); // Same name as in multer: "images"
      });
      formData.append("city", city);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/post`, {
        method: "POST",
        headers: { token: localStorage.token },
        body: formData,
      });
      if (response.ok) {
        setStatus("تم نشر المنتج بنجاح");
        stat.current.style.color = "GREEN";
        stat.current.style.display = "block";
        submitBtn.current.value = "نشر";
      } else {
        setStatus("عذراَ، حدث خطأ");
        stat.current.style.color = "RED";
        submitBtn.current.value = "نشر";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImage = (e) => {
    setImages([...e.target.files]);
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <p className="sell">بِع منتجك!</p>
        </div>

        <p className="discribe">أوصف منتجك</p>
        <input
          maxLength={50}
          className="name-input"
          type="text"
          placeholder="اسم المنتج"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          className="disc-inp"
          type="text"
          value={discription}
          maxLength={50}
          placeholder="وصف المنتج"
          onChange={(e) => {
            setDiscription(e.target.value);
          }}
        />
        <div className="random-div">
          <p className="type">الصنف</p>
          <select
            className="type-select"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <option className="type-option" value="غير محدد">
              غير محدد
            </option>
            <option className="type-option" value="electronics">
              الكترونيات
            </option>
            <option className="type-option" value="سيارات">
              سيارات
            </option>
            <option className="type-option" value="الرياضة">
              الرياضة
            </option>
            <option className="type-option" value="مستلزمات المنزل">
              مستلزمات المنزل
            </option>
            <option className="type-option" value="قطع زينة">
              قطع زينة
            </option>
            <option className="type-option" value="عقارات">
              عقارات
            </option>
          </select>
          <p className="type">صورة المنتج</p>
          <input
            className="image-input"
            required
            multiple
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleImage}
          />
          <p className="price">المدينة</p>
          <select
            className="type-select"
            required
            onChange={(e) => {
              setCity(e.target.value);
            }}
          >
            <option className="type-option" value="اللاذقية">
              اللاذقية
            </option>
            <option className="type-option" value="دمشق">
              دمشق
            </option>
            <option className="type-option" value="ادلب">
              ادلب
            </option>
            <option className="type-option" value="طرطوس">
              طرطوس
            </option>
            <option className="type-option" value="حماة">
              حماة
            </option>
            <option className="type-option" value="درعا">
              درعا
            </option>
            <option className="type-option" value="حمص">
              حمص
            </option>
            <option className="type-option" value="حلب">
              حلب
            </option>
            <option className="type-option" value="ريف دمشق">
              ريف دمشق
            </option>
            <option className="type-option" value="الحسكة">
              الحسكة
            </option>
            <option className="type-option" value="القنيطرة">
              القنيطرة
            </option>
            <option className="type-option" value="دير الزور">
              دير الزور
            </option>
            <option className="type-option" value="السويداء">
              السوداء
            </option>
            <option className="type-option" value="الرقة">
              الرقة
            </option>
          </select>
          <p className="price">السعر</p>
          <input
            ref={priceInp}
            className="price-input"
            type="number"
            min={1000}
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
        </div>
        <p className="status" ref={stat}>
          {status}
        </p>

        <input className="submit" type="submit" value={"نشر"} ref={submitBtn} />
      </form>
    </>
  );
}
