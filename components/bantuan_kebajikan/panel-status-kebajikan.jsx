// components/panel-status-kebajikan.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const PanelStatus = ({ filteredForm }) => {
  const [statusCounts, setStatusCounts] = useState({
    TOTAL: 0,
    MOHON: 0,
    LULUS: 0,
    DITOLAK: 0,
    KIV: 0,
  });

  useEffect(() => {
    const calculateStatusCounts = () => {
      const newStatusCounts = {
        TOTAL: 0,
        MOHON: 0,
        LULUS: 0,
        DITOLAK: 0,
        KIV: 0,
      };

      // Check if filteredForm is empty and directly set all counts to 0
      if (filteredForm.length === 0) {
        setStatusCounts(newStatusCounts);
        return;
      }

      // Loop through filteredForm data and count each status
      filteredForm.forEach((form) => {
        const status = form.form_status.toUpperCase();
        if (status === 'MOHON') newStatusCounts.MOHON++;
        if (status === 'LULUS') newStatusCounts.LULUS++;
        if (status === 'DITOLAK') newStatusCounts.DITOLAK++;
        if (status === 'KIV') newStatusCounts.KIV++;
      });

      newStatusCounts.TOTAL = newStatusCounts.MOHON + newStatusCounts.LULUS + newStatusCounts.DITOLAK + newStatusCounts.KIV;

      // Update the state with the new status counts
      setStatusCounts(newStatusCounts);
    };

    calculateStatusCounts();

  }, [filteredForm]);

    return (
        <section id="status" className="bg-blue-200 w-full h-32 mt-4 p-4 grid grid-cols-5 gap-4">
          <div className="h-full rounded bg-blue-700 text-center hover:shadow-md ease-out">
            <h1 className="items-center text-center mt-2 text-lg font-semi text-slate-50">PERMOHONAN</h1>
            <p className="text-2xl mt-2 font-medium text-slate-50">{statusCounts.TOTAL}</p>
          </div>
          <div className="h-full rounded bg-amber-200 text-center">
            <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">SEDANG DIPROSES</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts.MOHON}</p>
          </div>
          <div className="h-full rounded bg-green-400 text-center">
            <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">DILULUSKAN</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts.LULUS}</p>
          </div>
          <div className="h-full rounded bg-red-500 text-center">
            <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">DITOLAK</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts.DITOLAK}</p>
          </div>
          <div className="h-full rounded bg-cyan-400 text-center">
            <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">KIV</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts.KIV}</p>
          </div>
        </section>
    );
}

export default PanelStatus;