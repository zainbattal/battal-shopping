import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import SVGlogo from "../assets/busta logo/busta.png";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [popupSrc, setPopupSrc] = useState();
  const [popupVisible, setPopupVisible] = useState();
  const [loadedImages, setLoadedImages] = useState(new Map()); // Changed to Map for better performance
  const [simProducts, setSimProducts] = useState([]);
  const saveBtn = useRef();
  // Cache for preloaded Image objects
  const imageCache = useRef(new Map());

  const getProductsSim = async () => {
    try {
      const response = await fetch(
        "https://battal-shopping.onrender.com/searchSim",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: post.name, // ✅ must be "name", not "input"
            type: post.type,
            id: post.id,
          }),
        }
      );

      const jsonData = await response.json();
      console.log(jsonData);

      setSimProducts(Array.isArray(jsonData) ? jsonData : []);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  const handleSave = async (id) => {
    saveBtn.current.innerText = "جار الحفظ";
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
      saveBtn.current.innerText = "تم الحفظ";
      alert("تم حفظ المنتج");
    }
    console.log(response);
  };

  // Preload all images and store the actual Image objects
  useEffect(() => {
    if (post?.name && post?.type) {
      getProductsSim();
    }

    if (post && post.image) {
      post.image.forEach((_, index) => {
        const cacheKey = `${post.id}-${index}`;

        // Only preload if not already in cache
        if (!imageCache.current.has(cacheKey)) {
          const img = new Image();
          img.src = `https://battal-shopping.onrender.com/image/${post.id}/${index}`;

          img.onload = () => {
            // Store the actual Image object in cache
            imageCache.current.set(cacheKey, img);
            setLoadedImages((prev) => new Map(prev).set(index, true));
          };

          img.onerror = () => {
            console.warn(`Failed to load image ${index}`);
            setLoadedImages((prev) => new Map(prev).set(index, false));
          };
        }
      });
    }
  }, [post]);

  // Get image URL from cache - returns the actual loaded Image object's src
  const getCachedImageUrl = (index) => {
    const cacheKey = `${post.id}-${index}`;
    const cachedImg = imageCache.current.get(cacheKey);

    if (cachedImg) {
      return cachedImg.src; // Return the src from the preloaded Image object
    }

    // Fallback to direct URL if not cached yet
    return `https://battal-shopping.onrender.com/image/${post.id}/${index}`;
  };

  // Check auth
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

      if (!response.ok) {
        navigate("/register");
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
    }
  };

  const handleImageClick = () => {
    setPopupSrc(getCachedImageUrl(currentIndex));
    setPopupVisible(true);
  };

  // Fetch product
  const GetProduct = async () => {
    try {
      const res = await fetch("https://battal-shopping.onrender.com/getOne", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const jsonData = await res.json();

      if (jsonData) {
        setPost(jsonData);
        setImageCount(jsonData.image?.length || 0);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };

  useEffect(() => {
    checkAuthorization();
    GetProduct();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  // Use cached image URL
  const imageUrl = imageCount > 0 ? getCachedImageUrl(currentIndex) : "";

  return (
    <>
      <div className="fullDetails">
        {imageCount > 0 && (
          <div
            className="image-carousel"
            style={{
              gap: "100px",
              position: "relative",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <img
              src={imageUrl}
              onClick={handleImageClick}
              alt={`product ${currentIndex}`}
              style={{
                width: "100%",
                maxWidth: "100%",
                cursor: "pointer",
                // Smooth transition between images
                transition: "opacity 0.2s ease-in-out",
                opacity: loadedImages.has(currentIndex) ? 1 : 0.7,
              }}
              onError={(e) => {
                e.target.style.display = "none";
                console.warn(`Image ${currentIndex} failed to load`);
              }}
            />

            {imageCount > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    fontSize: "24px",
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  &#8592;
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    fontSize: "24px",
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  &#8594;
                </button>
              </>
            )}
          </div>
        )}
        {popupVisible && (
          <div
            onClick={() => setPopupVisible(false)}
            className="refImageDiv"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={popupSrc}
              alt="product zoom"
              style={{ maxWidth: "90%", maxHeight: "90%" }}
            />
          </div>
        )}
        <div className="detailDiv">
          <h3 className="DetailsName">{post.name}</h3>

          <span className="DetailsSpan">الوصف:</span>
          <p className="DetailsDisc">{post.discription}</p>

          <span className="DetailsSpan">اسم المستخدم:</span>
          <p className="DetailsUsername">{post.uploader}</p>

          <span className="DetailsSpan">{"رقم المستخدم (اضغط للنسخ):"}</span>
          <p
            className="DetailsNumber"
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigator.clipboard.writeText(post.uploader_number).then(() => {
                alert("تم نسخ الرقم");
              });
            }}
          >
            {post.uploader_number}
          </p>

          <span className="DetailsSpan">الفئة:</span>
          <p className="DetailsType">{post.type}</p>

          <span className="DetailsSpan">المدينة:</span>
          <p className="DetailsCity">{post.city}</p>

          <span className="DetailsSpan">السعر:</span>
          <p className="DetailsPrice">{post.price} SYP</p>

          <button
            className="BigSave"
            ref={saveBtn}
            onClick={() => {
              handleSave(post.id);
            }}
          >
            حفظ المنتج
          </button>
          <button
            className="BigSave"
            style={{
              direction: "rtl",
              height: "30px",
              backgroundColor: "orange",
            }}
            onClick={() => {
              navigator.clipboard.writeText(post.id).then(() => {
                alert("تم نسخ الكود");
              });
            }}
          >
            نسخ رمز uuid
          </button>
          <p className="DetailsDate">{post.date}</p>

          <div>
            <QRCodeSVG
              value={`https://battal-shopping.onrender.com/products/${post.id}`}
              size={300}
              level="H"
              imageSettings={{
                src: { SVGlogo },
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true, // This cuts out the pixels behind the logo
              }}
            />
          </div>
          {/* Image Carousel */}
        </div>
      </div>
      <h1 style={{ textAlign: "center" }}>المنتجات المشابهة</h1>
      {
        <div className="products-list">
          {simProducts.map((product) => (
            <div
              key={product.id}
              className="product-cont"
              onClick={() => {
                navigate(`/products/${product.id}`);
                window.location.reload();
              }}
            >
              <img
                className="product-image"
                src={`https://battal-shopping.onrender.com/image/${product.id}/0`}
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
        </div>
      }
    </>
  );
}
