import React, { useEffect } from 'react'
import { useGetOrdersByDateQuery } from './ordersApiSlice'

export const downloadCSV = (data, type, fileName) => {
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

  console.log("data: ", data)

  const utf8 = new TextEncoder().encode(file)
  const blob = new Blob([utf8], { type: 'text/csv;charset=UTF-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

export const handleClick = (data, year, month, type) => {
  if (data) {
    downloadCSV(data, type, `dardan-${type}-${year}-${month}.csv`);
  }
}

const OrdersExport = () => {
  const year = 2023;
  const month = 7
  const type = "eh"
  const { data } = useGetOrdersByDateQuery({ year, month });

  // console.log(data.eh)


  return (
    <>
      <h1>Export Page</h1>
      <button onClick={() => handleClick(data, year, month, "eh")}>Ehnii uldegdel</button>
      <button onClick={() => handleClick(data, year, month, "orson")}>Orson</button>
      <button onClick={() => handleClick(data, year, month, "garsan")}>Garsan</button>
      <button onClick={() => handleClick(data, year, month, "ets")}>Etssiin uldegdel</button>
    </>
  )
}

export default OrdersExport