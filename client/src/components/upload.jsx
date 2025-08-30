import React from "react";
import { useState } from "react";
import { useRef } from "react";
export default function Uploud(params) {
  const [name, setName] = useState("");
  const [discription, setDiscription] = useState("");
  const [type, setType] = useState("notSet");
  const [price, setPrice] = useState(1000);
  const [image, setImage] = useState();
  const [status, setStatus] = useState("");
  const [badstatus, setBadstatus] = useState("");
  const stat = useRef();
  const submitBtn = useRef();
  const priceInp = useRef();
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
      formData.append("image", image);
      const response = await fetch("http://localhost:3000/post", {
        method: "POST",
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
    setImage(e.target.files[0]);
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <p className="sell">بِع منتجك!</p>
        </div>

        <p className="discribe">أوصف منتجك</p>
        <input
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
          placeholder="اشرح منتجك"
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
            <option className="type-option" value="notSet">
              غير محدد
            </option>
            <option className="type-option" value="electronics">
              الكترونيات
            </option>
            <option className="type-option" value="cars">
              سيارات
            </option>
            <option className="type-option" value="sports">
              الرياضة
            </option>
            <option className="type-option" value="houseProducts">
              مستلزمات المنزل
            </option>
            <option className="type-option" value="decoration">
              قطع زينة
            </option>
          </select>
          <p className="type">صورة المنتج</p>
          <input
            className="image-input"
            required
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleImage}
          />
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
