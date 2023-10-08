import React, { useEffect } from 'react'
import { useGetOrdersByDateQuery } from './ordersApiSlice'

const OrdersExport = () => {
  const year = 2023;
  const month = 7
  const { data } = useGetOrdersByDateQuery({ year, month});

  function downloadCSV(data, fileName) {
    const utf8 = new TextEncoder().encode(data)
    // const utf8 = encodeURI(data)
    const blob = new Blob([utf8], { type: 'text/csv;charset=UTF-8' });
    // const blob = new Blob([utf8], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }


  const handleClick = (year, month) => {
    if (data) {
      console.log("export orders: ", data.order)
      console.log("export csv: ", data.csv)
      downloadCSV(data.csv, `orders-${year}-${month}.csv`);
    }
  }

  return (
    <>
      <h1>Export Page</h1>
      <button onClick={() => handleClick(year, month)}>Click</button>
    </>
  )
}

export default OrdersExport