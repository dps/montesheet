import React from "react";

function NotFoundPage(props) {
  return (
    <div
      style={{
        padding: "50px",
        width: "100%",
        textAlign: "center",
      }}
    >
      The page <code>{props.location.pathname}</code> could not be found
    </div>
  );
}

export default NotFoundPage;
