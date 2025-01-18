// /components/legend-category.jsx
const LegendCategory = () => {
    return (
        <div id="status" className="flex flex-wrap gap-2 justify-center items-center text-center w-auto m-4">
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-amber-500 w-4 h-4"></div>
            <div id="title-process">Public Well-Being</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-rose-500 w-4 h-4"></div>
            <div id="title-process">Education</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-fuchsia-500 w-4 h-4"></div>
            <div id="title-process">NGO/Organization</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-purple-500 w-4 h-4"></div>
            <div id="title-process">Disaster</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-blue-700 w-4 h-4"></div>
            <div id="title-process">Religious</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-sky-500 w-4 h-4"></div>
            <div id="title-process">Service Center</div>
          </div>
        </div>
    );
}

export default LegendCategory;