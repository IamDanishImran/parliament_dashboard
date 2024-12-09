// components/panel-status.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const PanelStatus = () => {
  const supabase = createClient();
  const [statusCounts, setStatusCounts] = useState({
    TOTAL: 0,
    MOHON: 0,
    LULUS: 0,
    DITOLAK: 0,
    KIV: 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        // Fetch all form data including status
        const { data, error } = await supabase
          .from('form')
          .select('form_status')
          .eq('category_type', "Program Mesra Rakyat");
  
        if (error) {
          throw new Error(error.message);
        }
  
        // Initialize the status counts
        const newStatusCounts = {
          TOTAL: 0,
          MOHON: 0,
          LULUS: 0,
          DITOLAK: 0,
          KIV: 0,
        };
  
        // Loop through the form data and count each status
        data.forEach((form) => {
          if (form.form_status === 'MOHON') newStatusCounts.MOHON++;
          if (form.form_status === 'LULUS') newStatusCounts.LULUS++;
          if (form.form_status === 'DITOLAK') newStatusCounts.DITOLAK++;
          if (form.form_status === 'KIV') newStatusCounts.KIV++;
        });
  
        console.log('Status Counts:', newStatusCounts);
  
        // Calculate DIPROSES: MOHON - (LULUS + DITOLAK + KIV)
        newStatusCounts.TOTAL = newStatusCounts.MOHON + newStatusCounts.LULUS + newStatusCounts.DITOLAK + newStatusCounts.KIV;
  
        console.log('Total submission:', newStatusCounts.TOTAL);
  
        // Update the state with the new status counts
        setStatusCounts(newStatusCounts);
      } catch (error) {
        console.error('Error fetching status counts:', error);
      }
    };
  
    fetchStatusCounts();
  }, []); // Runs only once when the component mounts

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