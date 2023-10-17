import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'

const baseUrl = "https://dardan-api.onrender.com"
// const baseUrl = "https://localhost:5000"

export const downloadCSV = async (token, y, m, type) => {
  try {
    const res = await fetch(`${baseUrl}/orders/export?year=${y}&month=${m}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    
    if (!res.ok) {
      throw new Error("Network res didn't work!")
    }
    
    const data = await res.json();
    
    let file;
    if (type == "eh") {
      file = data.eh
    } else if (type == "orson") {
      file = data.orson
    } else if (type == "garsan") {
      file = data.garsan
    } else if (type == "ets") {
      file = data.ets
    }

    const fileName = `${y}-${m}-${type}`;
    const utf8 = new TextEncoder().encode(file)
    const blob = new Blob([utf8], { type: 'text/csv;charset=UTF-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log(error)
  }
}

const OrdersExport = () => {
  const token = useSelector(selectCurrentToken);
  const year = 2023, month = 7

  return (
    <>
      <h1>Export Page</h1>
      <button onClick={() => downloadCSV(token, year, month, "eh", "test1")}>Eh</button>
      <button onClick={() => downloadCSV(token, year, month, "orson", "test2")}>Orson</button>
      <button onClick={() => downloadCSV(token, year, month, "garsan", "test3")}>Garsan</button>
      <button onClick={() => downloadCSV(token, year, month, "ets", "test4")}>Ets</button>
    </>
  )
}

export default OrdersExport