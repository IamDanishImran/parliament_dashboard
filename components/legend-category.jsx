// /components/legend-category.jsx
const LegendCategory = () => {
    return (
        <div id="status" className="flex flex-wrap gap-2 justify-center items-center text-center w-auto m-4">
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-amber-500 w-4 h-4"></div>
            <div id="title-process">Kesejahteraan Rakyat</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-rose-500 w-4 h-4"></div>
            <div id="title-process">Pendidikan</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-fuchsia-500 w-4 h-4"></div>
            <div id="title-process">NGO/Pertubuhan</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-purple-500 w-4 h-4"></div>
            <div id="title-process">Bencana</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-blue-700 w-4 h-4"></div>
            <div id="title-process">Keagamaan</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-sky-500 w-4 h-4"></div>
            <div id="title-process">Pusat Khidmat</div>
          </div>
        </div>
    );
}

export default LegendCategory;