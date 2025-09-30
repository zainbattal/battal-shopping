import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookmarkAdd from "../assets/bookmarkAdd.svg";
import loadingGif from "../assets/loading gif.gif";

export default function GetProducts() {
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(99999999);
  const [catFilter, setCatFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("damascus");

  const [saveID, setSaveID] = useState("");
  const [saveImages, setSaveImages] = useState({});

  const navigate = useNavigate();
  const loading = useRef();
  const list = useRef();
  const saveImage = useRef();
  const getProducts = async () => {
    try {
      loading.current.style.display = "flex";
      list.current.style.display = "none";
      let response = await fetch("https://battal-shopping.onrender.com/list", {
        method: "POST",
        body: JSON.stringify({ catFilter, priceFilter, cityFilter }),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        let jsonData = await response.json();
        console.log(jsonData);
        setProducts(jsonData);
        loading.current.style.display = "none";
        list.current.style.display = "flex";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkAuthorization = async () => {
    try {
      const response = await fetch(
        "https://battal-shopping.onrender.com/auth/is-authorized",
        {
          method: "GET",
          headers: {
            token: localStorage.token,
          },
        }
      );

      if (response.ok) {
        console.log("ok"); // Fixed the if statement
      } else {
        navigate("/register");
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
    }
  };

  const handleSave = async (id) => {
    setSaveImages((prev) => ({
      ...prev,
      [id]: loadingGif,
    }));
    const response = await fetch(
      "https://battal-shopping.onrender.com/gets/saveOne",
      {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          "content-type": "application/json",
          token: localStorage.token, // send the JWT token here
        },
      }
    );
    if (response.ok) {
      alert("تم حفظ المنتج");
    } else {
      alert("تعذر حفظ المنتج");
    }
    console.log(response);
    setSaveImages((prev) => ({
      ...prev,
      [id]: bookmarkAdd,
    }));
  };

  useEffect(() => {
    checkAuthorization();

    getProducts();
  }, [catFilter, priceFilter, cityFilter]);

  return (
    <>
      <div className="filterCont">
        <div className="filter">
          <span className="filterName">المدينة</span>
          <select
            className="fileterSelect"
            onChange={(e) => {
              setCityFilter(e.target.value);
            }}
          >
            <option className="type-option" value="دمشق">
              دمشق
            </option>
            <option className="type-option" value="اللاذقية">
              اللاذقية
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
            <option className="type-option" value="السوداء">
              السويداء
            </option>
            <option className="type-option" value="الرقة">
              الرقة
            </option>
          </select>
        </div>

        <div className="filter">
          <span className="filterName">الفئة</span>
          <select
            className="fileterSelect"
            onChange={(e) => {
              setCatFilter(e.target.value);
            }}
          >
            <option value="all">الكل</option>
            <option value="الكترونيات">الكترونيات</option>
            <option value="سيارات">سيارات</option>
            <option value="الرياضة">الرياضة</option>
            <option value="المنزل">مستلزمات المنزل</option>
            <option value="قطع زينة">قطع زينة</option>
          </select>
        </div>
        <div className="filter">
          <span>السعر</span>
          <select
            className="fileterSelect"
            onChange={(e) => {
              setPriceFilter(e.target.value);
            }}
          >
            <option value="99999999">الكل</option>
            <option value="1000000">تحت 1000000</option>
            <option value="100000"> تحت 100000</option>
            <option value="50000">تحت 50000</option>
          </select>
        </div>
      </div>

      <h1
        ref={loading}
        className="loadingText"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        ...جارٍ التحميل
      </h1>

      <div ref={list} className="products-list">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-cont"
            onClick={() => {
              navigate(`products/${product.id}`);
              //alert(
              //`رقم البائع: \n +963 ${product.uploader_number}\n تاريخ التنزيل: \n ${product.date}`

              //);
            }}
          >
            <img
              className="product-image"
              src={`https://battal-shopping.onrender.com/image/${product.id}`}
              alt={product.name}
            />
            <div className="product-details">
              <span className="product-name">{product.name}</span>
              <span className="product-disc">{product.discription}</span>
              <span className="product-type">{product.type}</span>
              <span className="product-price">{product.price} SYP</span>
              <span className="product-date">{product.date}</span>
            </div>
            <button
              style={{
                display: "inline-flex",
                height: "30px",
              }}
              className="saveBtn"
              onClick={(e) => {
                e.stopPropagation(); // 🛑 prevents the parent onClick
                handleSave(product.id); // <-- Note: you were missing () here
              }}
            >
              <img
                ref={saveImage}
                className="bokkmarkAdd
              "
                src={bookmarkAdd}
                alt="bookmark"
                style={{
                  width: "30px",
                }}
              />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
