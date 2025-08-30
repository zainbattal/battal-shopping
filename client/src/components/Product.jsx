import React from "react";

function Product(Props) {
  return (
    <div className="proCont">
      <img src="" alt="img" />
      <div>
        <h3>{Props.name}</h3>
        <h4>{Props.price}</h4>
        <h5>{Props.date}</h5>
      </div>
      <p>{props.disc}</p>
    </div>
  );
}
