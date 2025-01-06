// /components/legend-status.jsx
const LegendStatus = () => {
    return (
        <div id="status" className="flex flex-wrap gap-2 justify-center items-center text-center w-auto m-4">
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-yellow-300 w-4 h-4"></div>
            <div id="title-process">Sedang Proses</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-red-600 w-4 h-4"></div>
            <div id="title-process">Ditolak</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-green-500 w-4 h-4"></div>
            <div id="title-process">Lulus</div>
          </div>
          <div id="wrapper-process" className="flex justify-center items-center gap-x-1">
            <div id="status-process" className="rounded-lg bg-cyan-500 w-4 h-4"></div>
            <div id="title-process">KIV</div>
          </div>
        </div>
    );
}

export default LegendStatus;