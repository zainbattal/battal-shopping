import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookmarkAdd from "../assets/bookmarkAdd.svg";
import loadingGif from "../assets/loadingGif.gif";
import soldSVG from "../assets/verified.svg";

export default function GetProducts() {
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(99999999);
  const [catFilter, setCatFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("دمشق");

  const [saveID, setSaveID] = useState("");
  const [saveImages, setSaveImages] = useState({});
  const filters = useRef();
  const navigate = useNavigate();
  const loading = useRef();
  const list = useRef();
  const saveBtn = useRef();
  const getProducts = async () => {
    try {
      filters.current.style.display = "none";
      loading.current.style.display = "flex";
      list.current.style.display = "none";
      let response = await fetch(`${import.meta.env.VITE_API_URL}/list`, {
        method: "POST",
        body: JSON.stringify({ catFilter, priceFilter, cityFilter }),
        headers: { "content-type": "application/json" },
      });
      filters.current.style.display = "flex";
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
        `${import.meta.env.VITE_API_URL}/auth/is-authorized`,
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
    saveBtn.current.classList.add("clicked");
    setSaveImages((prev) => ({
      ...prev,
      [id]: loadingGif,
    }));
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/gets/saveOne`,
      {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          "content-type": "application/json",
          token: localStorage.token, // send the JWT token here
        },
      }
    );
    saveBtn.current.classList.remove("clicked");
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
  }, []); // Only run once on mount

  // Add this separate useEffect for filter changes
  useEffect(() => {
    // Skip the first run (initial mount is handled by the useEffect above)
    getProducts();
  }, [catFilter, priceFilter, cityFilter]);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "2000px",
            width: "100%",
          }}
        >
          <div className="filterCont" ref={filters}>
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
          <div
            className="centerList"
            style={{ display: "flex", justifyContent: "center" }}
          >
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
                    src={`${import.meta.env.VITE_API_URL}/image/${
                      product.id
                    }/0`}
                    alt={product.name}
                  />
                  <div className="product-details">
                    <span className="product-name">{product.name}</span>
                    <span className="product-disc">{product.discription}</span>
                    <span className="product-type">{product.type}</span>
                    <span className="product-price">{product.price} SYP</span>
                    <span className="product-date">{product.date}</span>
                    {product.state == "sold" && (
                      <div className="soldState">
                        <p>تم البيع</p>
                        <img src={soldSVG} alt="sold" />
                      </div>
                    )}
                  </div>
                  <button
                    ref={saveBtn}
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
                      className="bokkmarkAdd
              "
                      src={saveImages[product.id] || bookmarkAdd}
                      alt="bookmark"
                      style={{
                        width: "30px",
                      }}
                    />
                  </button>
                  <span>{product.saves}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
