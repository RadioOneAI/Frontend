import React from "react";

export default function TablePagination() {
  return (
    <div className="flex justify-between items-center mt-4 px-2">
      <span className="text-sm opacity-50">Showing 1-10 of 50 entries</span>
      
      <div className="join">
        <button className="join-item btn btn-sm">«</button>
        <button className="join-item btn btn-sm btn-active">1</button>
        <button className="join-item btn btn-sm">2</button>
        <button className="join-item btn btn-sm">3</button>
        <button className="join-item btn btn-sm">»</button>
      </div>
    </div>
  );
}