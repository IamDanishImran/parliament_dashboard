'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Skeleton } from '@nextui-org/react';

const PanelAnalysis = () => {
  const supabase = createClient();
  const [categoryOneForms, setCategoryOneForms] = useState([]);
  const [categoryTwoForms, setCategoryTwoForms] = useState([]);
  const [categoryOneTotalPrice, setCategoryOneTotalPrice] = useState(0);
  const [categoryTwoTotalPrice, setCategoryTwoTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch forms and calculate total price for each category
  const fetchFormsAndPrices = async () => {
    try {
      // Calculate PMR
      const { data: categoryOne, error: errorOne } = await supabase
        .from('form')
        .select('price', 'help_type')
        .eq('category', "Community Outreach Program")
        // .eq('form_status', "LULUS");
      if (errorOne) throw errorOne;

      const categoryOnePrice = categoryOne.reduce(
        (acc, row) => acc + parseFloat(row.price || 0),
        0
      );
      setCategoryOneForms(categoryOne);
      setCategoryOneTotalPrice(categoryOnePrice);

      // Calculate Welfare Assistance Program
      const { data: categoryTwo, error: errorTwo } = await supabase
        .from('form')
        .select('price, help_type')
        .eq('category', "Welfare Assistance Program")
        // .eq('form_status', "LULUS");
      if (errorTwo) throw errorTwo;

      const categoryTwoPrice = categoryTwo.reduce(
        (acc, row) => acc + parseFloat(row.price || 0),
        0
      );
      setCategoryTwoForms(categoryTwo);
      setCategoryTwoTotalPrice(categoryTwoPrice);
    } catch (error) {
      console.log('Failed to fetch status counts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormsAndPrices();
  }, []);

  return (
    <>
      <Skeleton isLoaded={!loading}>
        <section id="analysis" className="flex-col w-full h-full py-4 grid gap-4 sm:w-full sm:h-56 sm:py-4 sm:grid sm:grid-cols-4 sm:gap-4">
          {/* Total Expenses PMR */}
          <article className="py-4 bg-slate-50 h-full rounded sm:py-0 px-4 border-2 border-slate-300 shadow">
            <div className="inline-flex items-center justify-center p-2 sm:mt-4 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-slate-700 text-sm font-medium mb-2">Total Expenditure COP</h1>
            <div className="flex flex-wrap">
              <h1 className="text-slate-900 font-semibold text-xl">RM&nbsp;</h1>
              <h1 className="text-slate-900 font-semibold text-3xl mt-2">{categoryOneTotalPrice.toFixed(2)}</h1>
            </div>
          </article>

          {/* Total Welfare PMR */}
          <article className="py-4 bg-slate-50 h-full rounded sm:py-0 px-4 border-2 border-slate-300 shadow">
            <div className="inline-flex items-center justify-center p-2 sm:mt-4 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-slate-700 text-sm font-medium mb-2">Total Assistance for COP</h1>
            <div className="flex flex-wrap">
              <h1 className="text-slate-900 font-semibold text-3xl mt-2">{categoryOneForms.length}</h1>
            </div>
          </article>

          {/* Total Expenses Kebajikan */}
          <article className="py-4 bg-slate-50 h-full rounded sm:py-0 px-4 border-2 border-slate-300 shadow">
            <div className="inline-flex items-center justify-center p-2 sm:mt-4 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-slate-700 text-sm font-medium mb-2">Total Expenditure Welfare Assistance</h1>
            <div className="flex flex-wrap">
              <h1 className="text-slate-900 font-semibold text-xl">RM&nbsp;</h1>
              <h1 className="text-slate-900 font-semibold text-3xl mt-2">{categoryTwoTotalPrice.toFixed(2)}</h1>
            </div>
          </article>

          {/* Total Welfare Kebajikan */}
          <article className="py-4 bg-slate-50 h-full rounded sm:py-0 px-4 border-2 border-slate-300 shadow">
            <div className="inline-flex items-center justify-center p-2 sm:mt-4 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-slate-700 text-sm font-medium mb-2">Total Welfare Assistance</h1>
            <div className="flex flex-wrap">
              <h1 className="text-slate-900 font-semibold text-3xl mt-2">{categoryTwoForms.length}</h1>
            </div>
          </article>
        </section>
      </Skeleton>
    </>
  );
};

export default PanelAnalysis;
