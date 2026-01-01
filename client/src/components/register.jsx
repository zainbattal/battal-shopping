import React from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import Turnstile from "react-turnstile";
import blueLogo from "../assets/busta logo/bustaBlue.svg";
export default function Register() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [hCaptchaToken, setHCaptchaToken] = useState("");
  const numberInp = useRef();
  const submitBtn = useRef();
  const status = useRef();
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
    submitBtn.current.value = "جار التحقق";
    if (!hCaptchaToken) {
      status.current.innerText = "يرجى التحقق من أنك لست روبوتًا";
      submitBtn.current.innerText = "إنشاء الحساب";
      return;
    }

    submitBtn.current.innerText = "جارٍ التسجيل ...";
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

    const body = { name, number, password, hCaptchaToken };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const parseRes = await response.json();

      localStorage.setItem("token", parseRes.token);
      checkAuthorization();
    } else {
      submitBtn.current.innerText = "إنشاء الحساب";
      const errorText = await response.text();
      console.error("Registration error:", errorText);
      status.current.innerText = "اسم المستخدم غير صالح";
      status.current.style.color = "red";
    }
    submitBtn.current.value = "إنشاء الحساب";
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
          <div style={{ justifyContent: "center" }}>
            <HCaptcha
              sitekey="ddc07ae2-ffb2-485c-a266-29c650e63f96"
              onVerify={(token) => setHCaptchaToken(token)}
              onExpire={() => setHCaptchaToken("")}
            />
          </div>

          {/* <Turnstile
            sitekey="0x4AAAAAAByfnMjZv6VQTT8D"
            onSuccess={(token) => setTurnstileToken(token)}
          /> */}

          <p
            className="login-error"
            style={{ textAlign: "center" }}
            ref={status}
          ></p>

          <input
            ref={submitBtn}
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
