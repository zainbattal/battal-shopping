import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
export default function SearchProducts() {
  const [products, setProducts] = useState([]);
  const [input, setInput] = useState("");
  const [priceFilter, setPriceFilter] = useState(99999999);
  const [catFilter, setCatFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("damascus");
  const navigate = useNavigate();
  const searchStatus = useRef();
  const getProducts = async (e) => {
    try {
      if (e) {
        e.preventDefault();
      }
      searchStatus.current.innerText = "جار التحميل";
      const body = { input, cityFilter, priceFilter, catFilter };
      let response = await fetch(
        "https://battal-shopping.onrender.com/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      let jsonData = await response.json();
      console.log(jsonData);
      searchStatus.current.innerText = "إنتهت النتائج";
      setProducts(jsonData);
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

  useEffect(() => {
    checkAuthorization();
  }, []);

  useEffect(() => {
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
              السوداء
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
      <form
        onSubmit={getProducts}
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <input
          className="search-input"
          placeholder="ابحث"
          type="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <input className="search-submit" type="submit" value={"بحث"} />
      </form>

      <div className="products-list">
        {products &&
          products.length > 0 &&
          products.map((product) => (
            <div
              key={product.id}
              className="product-cont"
              onClick={() => {
                navigate(`products/${product.id}`);
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
            </div>
          ))}
        <h1 ref={searchStatus}>ابحث عن شيء</h1>
      </div>
    </>
  );
}
