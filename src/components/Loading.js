import React from "react";

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3 text-muted">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loading;