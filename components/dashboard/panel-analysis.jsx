'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      const { data: categoryOne, error: errorOne } = await supabase
        .from('form')
        .select('price')
        .eq('category', "Bantuan Kebajikan");
      if (errorOne) throw errorOne;

      const categoryOnePrice = categoryOne.reduce(
        (acc, row) => acc + parseFloat(row.price || 0),
        0
      );
      setCategoryOneForms(categoryOne);
      setCategoryOneTotalPrice(categoryOnePrice);

      const { data: categoryTwo, error: errorTwo } = await supabase
        .from('form')
        .select('price')
        .eq('category', "Program Mesra Rakyat");
      if (errorTwo) throw errorTwo;

      const categoryTwoPrice = categoryTwo.reduce(
        (acc, row) => acc + parseFloat(row.price || 0),
        0
      );
      setCategoryTwoForms(categoryTwo);
      setCategoryTwoTotalPrice(categoryTwoPrice);
    } catch (error) {
      toast.error('Failed to fetch status counts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormsAndPrices();

    // Subscribe to real-time changes on the 'form' table
    const subscription = supabase
      .channel('form-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'form' },
        (payload) => {
          console.log('Real-time data change detected:', payload);
          toast.info('Data has changed!');
          fetchFormsAndPrices();
        }
      )
      .subscribe();

    // Cleanup the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <Skeleton isLoaded={!loading}>
        <section id="analysis" className="w-full h-56 py-4 grid grid-cols-4 gap-4">
          {/* Total Expenses PMR */}
          <article className="bg-slate-50 h-full rounded px-4 border-2 border-slate-300 shadow">
            <div className="inline-flex items-center justify-center p-2 mt-4 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-slate-700 text-sm font-medium mb-2">Jumlah Perbelanjaan PMR</h1>
            <div className="flex flex-wrap">
              <h1 className="text-slate-900 font-semibold text-xl">RM&nbsp;</h1>
              <h1 className="text-slate-900 font-semibold text-3xl mt-2">{categoryTwoTotalPrice.toFixed(2)}</h1>
            </div>
          </article>

          {/* Total Wellfare PMR */}
          <article className="bg-slate-50 h-full rounded px-4 border-2 border-slate-300 shadow">
            <div className="inline-flex items-center justify-center p-2 mt-4 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-slate-700 text-sm font-medium mb-2">Jumlah Bantuan PMR</h1>
            <div className="flex flex-wrap">
              <h1 className="text-slate-900 font-semibold text-3xl mt-2">{categoryOneForms.length}</h1>
            </div>
          </article>

          {/* Total Expenses Kebajikan */}
          <article className="bg-slate-50 h-full rounded px-4 border-2 border-slate-300 shadow">
            <div className="inline-flex items-center justify-center p-2 mt-4 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-slate-700 text-sm font-medium mb-2">Jumlah Perbelanjaan Kebajikan</h1>
            <div className="flex flex-wrap">
              <h1 className="text-slate-900 font-semibold text-xl">RM&nbsp;</h1>
              <h1 className="text-slate-900 font-semibold text-3xl mt-2">{categoryOneTotalPrice.toFixed(2)}</h1>
            </div>
          </article>

          {/* Total Wellfare Kebajikan */}
          <article className="bg-slate-50 h-full rounded px-4 border-2 border-slate-300 shadow">
            <div className="inline-flex items-center justify-center p-2 mt-4 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-slate-700 text-sm font-medium mb-2">Jumlah Bantuan Kebajikan</h1>
            <div className="flex flex-wrap">
              <h1 className="text-slate-900 font-semibold text-3xl mt-2">{categoryTwoForms.length}</h1>
            </div>
          </article>
        </section>
      </Skeleton>
    </>
  );
}

export default PanelAnalysis;