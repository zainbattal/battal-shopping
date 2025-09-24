import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookmarkAdd from "../assets/bookmarkAdd.svg";

export default function GetProducts() {
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(99999999);
  const [catFilter, setCatFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("damascus");

  const [saveID, setSaveID] = useState("");

  const navigate = useNavigate();
  const loading = useRef();
  const list = useRef();
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
    const response = await fetch(
      "https://battal-shopping.onrender.com/gets/saveOne",
      {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: { "content-type": "application/json" },
      }
    );
    console.log(response);
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

        <div className="filter">
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

      <p ref={loading} className="loadingText" style={{ textAlign: "center" }}>
        ...جارٍ التحميل
      </p>

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
