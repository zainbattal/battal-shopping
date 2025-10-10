import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./register";
import logo from "../assets/soow.png";
import blueLogo from "../assets/soowblue.png";
export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const status = useRef();
  const navigate = useNavigate();
  const submitBtn = useRef();
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
        console.log("couldn't login");
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    try {
      submitBtn.current.value = "جار التحقق";
      status.current.innerText = "";
      e.preventDefault();
      const body = { name, password };
      //fetch register api
      const response = await fetch(
        "https://battal-shopping.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      console.log(response.ok);
      if (response.ok) {
        //checkAuthorization();
        const parseRes = await response.json();

        localStorage.setItem("token", parseRes.token);
        localStorage.setItem("sooqUsername", name);
        checkAuthorization();
      } else {
        status.current.innerText = "اسم المستخدم او كلمة مرور خاطئة";
        status.current.style.color = "red";
      }
    } catch (error) {
      console.error(error);
    }
    submitBtn.current.value = "تسجيل الدخول";
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

      <div className="up-div">
        <div className="login-div">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1 style={{ textAlign: "center", color: "rgb(21, 101, 192)" }}>
              تسجيل الدخول
            </h1>
            <p>اسم المستخدم</p>
            <input
              className="login-name"
              type="text"
              placeholder="اسم المستخدم"
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <p>كلمة المرور</p>
            <input
              className="login-password"
              type="password"
              placeholder="كلمة المرور"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <br />
            <p className="login-error" ref={status}></p>
            <div className="submit-div">
              <input
                ref={submitBtn}
                className="login-submit"
                type="submit"
                value={"تسجيل الدخول"}
              />
            </div>
          </form>
          <button
            onClick={() => {
              navigate("/Register");
            }}
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    </>
  );
}
