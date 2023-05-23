import React from 'react'
import { useNavigate } from 'react-router-dom'

const ReportHeader = () => {
  const navigate = useNavigate();

  return (
    <div className='flex-row space-evenly'>
      <button className='button' onClick={() => navigate("/dash/report/daily")}>Өдрийн</button>
      <button className='button' onClick={() => navigate("/dash/report/monthly")}>Сарын</button>
      <button className='button' onClick={() => navigate("/dash/report/annual")}>Жилийн</button>
    </div>
  )
}

export default ReportHeader