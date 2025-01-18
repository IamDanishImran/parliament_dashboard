'use client';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@nextui-org/react';

const PanelStatus = ({ filteredForm = [] }) => {
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    TOTAL: 0,
    APPLICATION: 0,
    APPROVED: 0,
    REJECTED: 0,
    KIV: 0,
  });

  useEffect(() => {
    try {
      const newStatusCounts = {
        TOTAL: 0,
        APPLICATION: 0,
        APPROVED: 0,
        REJECTED: 0,
        KIV: 0,
      };

      if (filteredForm.length === 0) {
        setStatusCounts(newStatusCounts);
        return;
      }

      filteredForm.forEach((form) => {
        if (form.form_status === 'IN PROGRESS') newStatusCounts.APPLICATION++;
        if (form.form_status === 'APPROVED') newStatusCounts.APPROVED++;
        if (form.form_status === 'REJECTED') newStatusCounts.REJECTED++;
        if (form.form_status === 'KIV') newStatusCounts.KIV++;
      });

      newStatusCounts.TOTAL =
        newStatusCounts.APPLICATION +
        newStatusCounts.APPROVED +
        newStatusCounts.REJECTED +
        newStatusCounts.KIV;

      setStatusCounts(newStatusCounts);
    } catch (error) {
      console.error('Error calculating status counts:', error);
    } finally {
      setLoading(false);
    }
  }, [filteredForm]);

  return (
    <Skeleton isLoaded={!loading}>
      <section
        id="status"
        className="bg-blue-200 w-full h-32 p-4 grid grid-cols-5 gap-4 rounded shadow-md"
      >
        {/* Status APPLICATION */}
        <article className="h-full rounded bg-blue-700 text-center">
          <h1 className="items-center text-center mt-2 text-lg font-semi text-slate-50">
            APPLICATION
          </h1>
          <p className="text-2xl mt-2 font-medium text-slate-50">{statusCounts.TOTAL}</p>
        </article>

        {/* Status IN PROGRESS */}
        <article className="h-full rounded bg-yellow-200 text-center">
          <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">
            IN PROGRESS
          </h1>
          <p className="text-2xl mt-2 font-medium">{statusCounts.APPLICATION}</p>
        </article>

        {/* Status APPROVED */}
        <article className="h-full rounded bg-green-400 text-center">
          <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">
            APPROVED
          </h1>
          <p className="text-2xl mt-2 font-medium">{statusCounts.APPROVED}</p>
        </article>

        {/* Status REJECTED */}
        <article className="h-full rounded bg-red-500 text-center">
          <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">
            REJECTED
          </h1>
          <p className="text-2xl mt-2 font-medium">{statusCounts.REJECTED}</p>
        </article>

        {/* Status KIV */}
        <article className="h-full rounded bg-cyan-400 text-center">
          <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">
            KIV
          </h1>
          <p className="text-2xl mt-2 font-medium">{statusCounts.KIV}</p>
        </article>
      </section>
    </Skeleton>
  );
};

export default PanelStatus;
