'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Skeleton } from '@nextui-org/react';

const PanelStatus = () => {
  const supabase = createClient();
  const [statusCounts, setStatusCounts] = useState({
    TOTAL: 0, IN_PROGRESS: 0, APPROVED: 0, REJECTED: 0, KIV: 0,
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch the status counts from the Supabase database
  const fetchStatusCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('form')
        .select('form_status');
      if (error) {
        throw new Error(error.message);
      }
      const newStatusCounts = {
        "TOTAL": 0, 
        "IN PROGRESS": 0, 
        "APPROVED": 0, 
        "REJECTED": 0, 
        "KIV": 0,
      };

      // Loop through the form data and count each status
      data.forEach((form) => {
        if (form.form_status === 'IN PROGRESS') newStatusCounts["IN PROGRESS"]++;
        if (form.form_status === 'APPROVED') newStatusCounts["APPROVED"]++;
        if (form.form_status === 'REJECTED') newStatusCounts["REJECTED"]++;
        if (form.form_status === 'KIV') newStatusCounts["KIV"]++;
      });

      newStatusCounts["TOTAL"] = newStatusCounts["IN PROGRESS"] + newStatusCounts["APPROVED"] + newStatusCounts["REJECTED"] + newStatusCounts["KIV"];
      setStatusCounts(newStatusCounts);
    } catch (error) {
      console.error('Error fetching status counts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  return (
    <>
      <Skeleton isLoaded={!loading}>
        <section id="status" className="bg-blue-200 w-full h-auto p-2 grid gap-4 rounded shadow-md 
             sm:w-full sm:h-32 sm:p-4 sm:grid sm:grid-cols-5 sm:gap-4">
          {/* Status PerIN PROGRESSan */}
          <article className="py-4 sm:py-0 h-full rounded bg-blue-700 text-center">
            <h1 className="items-center text-center sm:mt-2 text-xl font-semi text-slate-50">APPLICATION</h1>
            <p className="text-2xl sm:mt-2 font-medium text-slate-50">{statusCounts["TOTAL"]}</p>
          </article>
          {/* Status Sedang Diproses */}
          <article className="py-4 sm:py-0 h-full rounded bg-yellow-200 text-center">
            <h1 className="items-center text-center sm:mt-2 text-xl font-semi text-slate-900">IN PROGRESS</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts["IN PROGRESS"]}</p>
          </article>
          {/* Status DiAPPROVEDkan */}
          <article className="py-4 sm:py-0 h-full rounded bg-green-400 text-center">
            <h1 className="items-center text-center sm:mt-2 text-xl font-semi text-slate-900">APPROVED</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts["APPROVED"]}</p>
          </article>
          {/* Status REJECTED */}
          <article className="py-4 sm:py-0 h-full rounded bg-red-500 text-center">
            <h1 className="items-center text-center sm:mt-2 text-xl font-semi text-slate-900">REJECTED</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts["REJECTED"]}</p>
          </article>
          {/* Status KIV */}
          <article className="py-4 sm:py-0 h-full rounded bg-cyan-400 text-center">
            <h1 className="items-center text-center sm:mt-2 text-xl font-semi text-slate-900">KIV</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts["KIV"]}</p>
          </article>
        </section>
      </Skeleton>
    </>
  );
};

export default PanelStatus;
