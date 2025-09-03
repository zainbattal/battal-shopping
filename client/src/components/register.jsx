import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import Turnstile from "react-turnstile";
import blueLogo from "../assets/soowblue.png";
export default function Register() {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const numberInp = useRef();
  const status = useRef();
  const navigate = useNavigate();

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
        navigate("/");
      } else {
        navigate("/register");
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    status.current.innerText = "";

    // Your number validation here
    if (
      numberInp.current.value.length !== 9 ||
      numberInp.current.value < 0 ||
      Number(numberInp.current.value.toString()[0]) !== 9 // fixed parentheses
    ) {
      status.current.innerText = "الرجاء ادخال رقم سوري صحيح";
      return;
    }

    if (!turnstileToken) {
      status.current.innerText = "يرجى التحقق من CAPTCHA";
      return;
    }

    // Verify turnstile token first
    const res = await fetch(
      "https://battal-shopping.onrender.com/verify-turnstile",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      }
    );
    const data = await res.json();

    if (!res.ok || !data.success) {
      status.current.innerText = "فشل التحقق من CAPTCHA، حاول مرة أخرى";
      return;
    }

    // Now call register only if CAPTCHA verified
    const body = { name, number, password };

    const response = await fetch(
      "https://battal-shopping.onrender.com/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const parseRes = await response.json();

      localStorage.setItem("token", parseRes.token);
      localStorage.setItem("sooqUsername", name);
      checkAuthorization();
    } else {
      status.current.innerText = "اسم المستخدم غير صالح أو الرقم موجود مسبقاً";
      status.current.style.color = "red";
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={blueLogo}
          alt="logo"
          style={{
            width: "180px",
          }}
        />
      </div>

      <div className="register-div">
        <form className="register-form" onSubmit={handleSubmit}>
          <h1
            style={{
              textAlign: "center",
              color: "rgb(21, 101, 192)",
            }}
          >
            انشاء حساب
          </h1>
          <p>اسم المستخدم</p>
          <input
            className="login-name"
            type="text"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <p className="number-text">رقم الهاتف</p>
          <div>
            <span className="syrian-num">+963</span>

            <input
              ref={numberInp}
              className="number-input"
              required
              maxLength={9}
              type="number"
              placeholder="000 000 000"
              onChange={(e) => {
                setNumber(e.target.value);
              }}
            />
          </div>
          <p>كلمة المرور</p>
          <input
            className="login-password"
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Turnstile
            sitekey="0x4AAAAAAByfnMjZv6VQTT8D"
            onSuccess={(token) => setTurnstileToken(token)}
          />

          <p
            className="login-error"
            style={{ textAlign: "center" }}
            ref={status}
          ></p>

          <input
            className="login-submit"
            type="submit"
            value={"إنشاء الحساب"}
          />
        </form>
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          تسجيل الدخول في حساب موجود
        </button>
      </div>
    </>
  );
}
