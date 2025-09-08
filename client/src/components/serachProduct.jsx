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
        <div>
          <span className="filterName">المدينة</span>
          <select
            className="fileterSelect"
            onChange={(e) => {
              setCityFilter(e.target.value);
            }}
          >
            <option className="type-option" value="damascus">
              دمشق
            </option>
            <option className="type-option" value="latakia">
              اللاذقية
            </option>
            <option className="type-option" value="idlib">
              ادلب
            </option>
            <option className="type-option" value="tartous">
              طرطوس
            </option>
            <option className="type-option" value="hama">
              حماة
            </option>
            <option className="type-option" value="daraa">
              درعا
            </option>
            <option className="type-option" value="homs">
              حمص
            </option>
            <option className="type-option" value="aleppo">
              حلب
            </option>
            <option className="type-option" value="reef damascus">
              ريف دمشق
            </option>
            <option className="type-option" value="hasaka">
              الحسكة
            </option>
            <option className="type-option" value="qunaitra">
              القنيطرة
            </option>
            <option className="type-option" value="der azzor">
              دير الزور
            </option>
            <option className="type-option" value="swedaa">
              السوداء
            </option>
            <option className="type-option" value="raqa">
              الرقة
            </option>
          </select>
        </div>

        <div>
          <span className="filterName">الفئة</span>
          <select
            className="fileterSelect"
            onChange={(e) => {
              setCatFilter(e.target.value);
            }}
          >
            <option value="all">الكل</option>
            <option value="electronics">الكترونيات</option>
            <option value="cars">سيارات</option>
            <option value="sports">الرياضة</option>
            <option value="houseProducts">مستلزمات المنزل</option>
            <option value="decoration">قطع زينة</option>
          </select>
        </div>
        <div>
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
                alert(
                  `رقم البائع: \n +963 ${product.uploader_number}\n تاريخ التنزيل: \n ${product.date}`
                );
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
